import React, {
  createContext, useContext, useEffect,
  useRef, useState, useCallback
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const listenersRef = useRef({}); // eventName -> Set of callbacks
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Subscribe to any socket event
  const subscribe = useCallback((event, callback) => {
    if (!listenersRef.current[event]) {
      listenersRef.current[event] = new Set();
    }
    listenersRef.current[event].add(callback);
    return () => {
      listenersRef.current[event]?.delete(callback);
    };
  }, []);

  // Internal dispatcher — calls all registered JS listeners for an event
  const dispatch = useCallback((event, data) => {
    listenersRef.current[event]?.forEach(fn => fn(data));
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !currentUser?._id) return;

    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("user_online", String(currentUser._id));
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("reconnect", () => {
      socket.emit("user_online", String(currentUser._id));
    });

    socket.on("disconnect", (reason) => {
      setConnected(false);
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("online_users", (users) => {
      setOnlineUsers(users.map(String));
    });

    // Forward all real-time events to JS subscribers
    socket.on("receive_message", (data) => dispatch("receive_message", data));
    socket.on("user_typing", (data) => dispatch("user_typing", data));
    socket.on("user_stop_typing", (data) => dispatch("user_stop_typing", data));

    socket.on("new_notification", (notif) => {
      const newNotif = {
        ...notif,
        _id: `${Date.now()}-${Math.random()}`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [newNotif, ...prev]);
      setUnreadCount(c => c + 1);
      dispatch("new_notification", newNotif);
    });

    // Load existing notifications from API
    fetch("http://localhost:5000/api/notifications", {
      headers: { Authorization: `Bearer ${currentUser.token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.read).length);
        }
      })
      .catch(console.error);

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [isAuthenticated, currentUser?._id, dispatch]);

  // Safe emit — works even if called before socket connects
  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn(`⚠️ Socket not connected, cannot emit: ${event}`);
    }
  }, []);

  const isOnline = useCallback((userId) => {
    return onlineUsers.includes(String(userId));
  }, [onlineUsers]);

  const markAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    await fetch("http://localhost:5000/api/notifications/mark-all-read", {
      method: "PUT",
      headers: { Authorization: `Bearer ${currentUser?.token}` },
    }).catch(console.error);
  }, [currentUser]);

  const removeNotification = useCallback(async (id) => {
    setNotifications(prev => prev.filter(n => n._id !== id));
    await fetch(`http://localhost:5000/api/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${currentUser?.token}` },
    }).catch(console.error);
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{
      emit,
      subscribe,
      connected,
      isOnline,
      onlineUsers,
      notifications,
      unreadCount,
      markAllRead,
      removeNotification,
    }}>
      {children}
    </SocketContext.Provider>
  );
};
