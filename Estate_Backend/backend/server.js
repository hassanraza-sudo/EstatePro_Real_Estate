require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// HTTP Routes
app.use("/api", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// ─── Socket.IO ──────────────────────────────────────────────────────
// Map: userId (string) → socketId (string)
const onlineUsers = new Map();

const getSocketId = (userId) => onlineUsers.get(String(userId));

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // Register user as online
  socket.on("user_online", (userId) => {
    const uid = String(userId);
    onlineUsers.set(uid, socket.id);
    // Broadcast updated online list to all clients
    io.emit("online_users", Array.from(onlineUsers.keys()));
    console.log(`✅ User online: ${uid} (socket ${socket.id})`);
  });

  // Real-time message delivery
  socket.on("send_message", (data) => {
    // data: { senderId, senderName, receiverId, text, messageId, createdAt }
    const receiverSocketId = getSocketId(data.receiverId);
    console.log(`📨 Message from ${data.senderId} to ${data.receiverId} | receiver socket: ${receiverSocketId}`);

    if (receiverSocketId) {
      // Deliver message to receiver
      io.to(receiverSocketId).emit("receive_message", {
        _id: data.messageId || Date.now(),
        text: data.text,
        sender: { _id: String(data.senderId), name: data.senderName },
        receiver: { _id: String(data.receiverId) },
        createdAt: data.createdAt || new Date().toISOString(),
      });

      // Push notification to receiver
      io.to(receiverSocketId).emit("new_notification", {
        type: "message",
        title: `💬 ${data.senderName}`,
        body: data.text.length > 60 ? data.text.substring(0, 60) + "…" : data.text,
        link: "/dashboard/messages",
      });
    }
  });

  // Typing indicators
  socket.on("typing", ({ senderId, receiverId }) => {
    const receiverSocketId = getSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("user_typing", { senderId: String(senderId) });
    }
  });

  socket.on("stop_typing", ({ senderId, receiverId }) => {
    const receiverSocketId = getSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("user_stop_typing", { senderId: String(senderId) });
    }
  });

  // Appointment notification push
  socket.on("appointment_booked", ({ ownerId, appointmentDate, bookerName }) => {
    const ownerSocketId = getSocketId(ownerId);
    if (ownerSocketId) {
      io.to(ownerSocketId).emit("new_notification", {
        type: "appointment",
        title: "📅 New Viewing Request",
        body: `${bookerName} wants to view on ${appointmentDate}`,
        link: "/dashboard/appointments",
      });
    }
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    for (const [userId, sid] of onlineUsers.entries()) {
      if (sid === socket.id) {
        onlineUsers.delete(userId);
        console.log(`❌ User offline: ${userId}`);
        break;
      }
    }
    io.emit("online_users", Array.from(onlineUsers.keys()));
  });
});

// Expose io to routes (for future use)
app.set("io", io);
app.set("onlineUsers", onlineUsers);

// ─── Start ──────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () =>
      console.log(`🚀 Server + Socket.IO running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB error:", err));
