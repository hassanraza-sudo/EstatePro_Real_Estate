import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import { Send, Search, MessageCircle, Users, Wifi, WifiOff } from "lucide-react";
import toast from "react-hot-toast";

const Message = () => {
  const { currentUser } = useAuth();
  const { emit, subscribe, connected, isOnline } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [search, setSearch] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);
  // Ref so socket callbacks always read the latest selectedUser without stale closure
  const selectedUserRef = useRef(null);

  const headers = { Authorization: `Bearer ${currentUser?.token}` };

  useEffect(() => { selectedUserRef.current = selectedUser; }, [selectedUser]);

  // ── Socket subscriptions ─────────────────────────────────────────
  useEffect(() => {
    // Incoming message
    const unsubMsg = subscribe("receive_message", (data) => {
      const openChat = selectedUserRef.current;
      if (!openChat) return;
      const fromSelected = String(data.sender?._id) === String(openChat._id);
      const toSelected   = String(data.receiver?._id) === String(openChat._id);
      if (fromSelected || toSelected) {
        setMessages(prev => {
          // deduplicate by _id
          if (prev.some(m => String(m._id) === String(data._id))) return prev;
          return [...prev, data];
        });
      }
      refreshConversations();
    });

    // Typing
    const unsubTyping = subscribe("user_typing", ({ senderId }) => {
      if (String(senderId) === String(selectedUserRef.current?._id)) setIsTyping(true);
    });
    const unsubStop = subscribe("user_stop_typing", ({ senderId }) => {
      if (String(senderId) === String(selectedUserRef.current?._id)) setIsTyping(false);
    });

    return () => { unsubMsg(); unsubTyping(); unsubStop(); };
  }, [subscribe]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    refreshConversations();
    fetchAllUsers();
  }, []);

  const refreshConversations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/messages/conversations", { headers });
      setConversations(res.data);
    } catch (err) { /* silent */ }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/messages/users/all", { headers });
      setAllUsers(res.data);
    } catch (err) { /* silent */ }
  };

  const openChat = async (user) => {
    setSelectedUser(user);
    setShowNewChat(false);
    setMessages([]);
    setLoadingMsgs(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${user._id}`, { headers });
      setMessages(res.data);
      refreshConversations();
    } catch {
      toast.error("Could not load messages");
    } finally {
      setLoadingMsgs(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !selectedUser) return;
    setText("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/messages",
        { receiverId: selectedUser._id, text: trimmed },
        { headers }
      );
      const saved = res.data;

      // Add to own view immediately
      setMessages(prev => {
        if (prev.some(m => String(m._id) === String(saved._id))) return prev;
        return [...prev, saved];
      });

      // Real-time delivery to receiver
      emit("send_message", {
        messageId: String(saved._id),
        senderId:  String(currentUser._id),
        senderName: currentUser.name,
        receiverId: String(selectedUser._id),
        text: trimmed,
        createdAt: saved.createdAt,
        // Pass receiver info so receiver can render it properly
        sender:   { _id: String(currentUser._id), name: currentUser.name },
        receiver: { _id: String(selectedUser._id) },
      });

      emit("stop_typing", {
        senderId:   String(currentUser._id),
        receiverId: String(selectedUser._id),
      });

      refreshConversations();
    } catch {
      toast.error("Failed to send. Please try again.");
      setText(trimmed);
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    if (!selectedUser) return;
    emit("typing", {
      senderId:   String(currentUser._id),
      receiverId: String(selectedUser._id),
    });
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      emit("stop_typing", {
        senderId:   String(currentUser._id),
        receiverId: String(selectedUser._id),
      });
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(e); }
  };

  const fmt = (d) => new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const fmtDate = (d) => {
    const dt = new Date(d), now = new Date();
    if (dt.toDateString() === now.toDateString()) return "Today";
    const y = new Date(now); y.setDate(now.getDate() - 1);
    if (dt.toDateString() === y.toDateString()) return "Yesterday";
    return dt.toLocaleDateString();
  };

  const filteredConvs  = conversations.filter(c => c.user?.name?.toLowerCase().includes(search.toLowerCase()));
  const filteredUsers  = allUsers.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()));

  // ── Avatar helper ───────────────────────────────────────────────
  const Avatar = ({ name, userId, size = "w-10 h-10" }) => (
    <div className="relative shrink-0">
      <div className={`${size} rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-sm`}>
        {name?.charAt(0).toUpperCase()}
      </div>
      {isOnline(userId) && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
      )}
    </div>
  );

  return (
    <div className="h-[calc(100vh-90px)] flex bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

      {/* ── Sidebar ── */}
      <div className="w-72 border-r border-gray-100 flex flex-col bg-gray-50 shrink-0">
        {/* Top bar */}
        <div className="p-4 bg-white border-b border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-800">Messages</h2>
              <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${connected ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {connected ? "Live" : "Offline"}
              </span>
            </div>
            <button onClick={() => setShowNewChat(v => !v)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${showNewChat ? "bg-gray-200 text-gray-700" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
              {showNewChat ? "← Back" : "+ New"}
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={showNewChat ? "Search users…" : "Search chats…"}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white" />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {showNewChat ? (
            <div>
              <p className="text-xs text-gray-400 px-4 py-2 font-semibold uppercase tracking-wide">All Users</p>
              {filteredUsers.length === 0
                ? <p className="text-center text-sm text-gray-400 py-8">No users found</p>
                : filteredUsers.map(u => (
                  <button key={u._id} onClick={() => openChat(u)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white transition text-left border-b border-gray-50">
                    <Avatar name={u.name} userId={u._id} size="w-9 h-9" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{u.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{u.role}</p>
                    </div>
                    {isOnline(u._id) && <span className="ml-auto text-xs text-green-500 shrink-0">● Online</span>}
                  </button>
                ))
              }
            </div>
          ) : filteredConvs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-gray-400">
              <Users className="w-10 h-10 mb-3 text-gray-200" />
              <p className="text-sm font-medium">No conversations yet</p>
              <button onClick={() => setShowNewChat(true)} className="mt-3 text-xs text-blue-600 hover:underline">
                Start your first chat →
              </button>
            </div>
          ) : (
            filteredConvs.map(c => (
              <button key={c.user._id} onClick={() => openChat(c.user)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition text-left border-b border-gray-50 ${selectedUser?._id === c.user._id ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-white"}`}>
                <Avatar name={c.user.name} userId={c.user._id} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className={`text-sm truncate ${c.unread > 0 ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}>{c.user.name}</p>
                    <span className="text-xs text-gray-400 shrink-0 ml-1">{fmt(c.lastMessage?.createdAt)}</span>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${c.unread > 0 ? "text-gray-700 font-medium" : "text-gray-400"}`}>{c.lastMessage?.text}</p>
                </div>
                {c.unread > 0 && (
                  <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shrink-0">{c.unread}</span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Chat Area ── */}
      {selectedUser ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-100 shadow-sm">
            <Avatar name={selectedUser.name} userId={selectedUser._id} />
            <div>
              <p className="font-semibold text-gray-900">{selectedUser.name}</p>
              <p className="text-xs text-gray-500">
                {isOnline(selectedUser._id)
                  ? <span className="text-green-500">● Online</span>
                  : <span className="text-gray-400">○ Offline</span>}
                {" · "}<span className="capitalize">{selectedUser.role}</span>
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 bg-gray-50 space-y-1">
            {loadingMsgs ? (
              <div className="flex justify-center items-center h-full">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageCircle className="w-14 h-14 mb-3 text-gray-200" />
                <p className="font-medium">Say hi to {selectedUser.name}!</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const senderId = msg.sender?._id ?? msg.sender;
                const isMine = String(senderId) === String(currentUser._id);
                const showDate = i === 0 || fmtDate(msg.createdAt) !== fmtDate(messages[i - 1].createdAt);
                return (
                  <React.Fragment key={String(msg._id)}>
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <span className="text-xs bg-white text-gray-400 px-4 py-1 rounded-full shadow-sm border border-gray-100">
                          {fmtDate(msg.createdAt)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1`}>
                      {!isMine && <Avatar name={selectedUser.name} userId={selectedUser._id} size="w-7 h-7" />}
                      <div className={`ml-2 max-w-xs lg:max-w-md flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${isMine ? "bg-blue-600 text-white rounded-br-md" : "bg-white text-gray-800 rounded-bl-md border border-gray-100"}`}>
                          {msg.text}
                        </div>
                        <span className="text-xs text-gray-400 mt-0.5">{fmt(msg.createdAt)}</span>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            )}

            {/* Typing dots */}
            {isTyping && (
              <div className="flex items-center gap-2 mt-2">
                <Avatar name={selectedUser.name} userId={selectedUser._id} size="w-7 h-7" />
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex gap-1">
                    {[0, 150, 300].map(delay => (
                      <span key={delay} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-100 px-4 py-3">
            <form onSubmit={sendMessage} className="flex items-center gap-2">
              <input
                value={text}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${selectedUser.name}…`}
                className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white transition"
              />
              <button type="submit" disabled={!text.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-2.5 rounded-full transition shadow-sm shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-xs text-gray-400 text-center mt-1">
              Enter to send · {connected ? "🟢 Live" : "🔴 Reconnecting…"}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <MessageCircle className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-lg font-semibold text-gray-600">Your Messages</p>
          <p className="text-sm mt-1">Select a conversation or start a new one</p>
          <button onClick={() => setShowNewChat(true)}
            className="mt-4 bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
            Start New Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default Message;
