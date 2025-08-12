const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let activeChats = {};
let userRoles = {}; // Track user roles (farmer/expert)

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-chat', (data) => {
    const { roomId, userType = 'farmer', userName = 'User' } = data;
    socket.join(roomId);
    
    if (!activeChats[roomId]) {
      activeChats[roomId] = { users: [], messages: [] };
    }
    
    console.log(`${userType} ${socket.id} (${userName}) joining chat room ${roomId}`);
    
    // Store user role
    userRoles[socket.id] = { roomId, userType, userName };
    
    // Notify existing users about new connection
    socket.to(roomId).emit('user-connected', { socketId: socket.id, userType, userName });
    
    // Add user to room
    activeChats[roomId].users.push({ socketId: socket.id, userType, userName });
    
    console.log(`Chat room ${roomId} now has ${activeChats[roomId].users.length} users`);
    
    // Handle different scenarios based on user type and room state
    if (userType === 'expert') {
      // Expert joined - notify farmer and activate chat immediately
      socket.to(roomId).emit('expert-joined');
      io.to(roomId).emit('chat-ready');
    } else if (userType === 'farmer') {
      // Farmer joined - check if expert is already there
      const hasExpert = activeChats[roomId].users.some(user => user.userType === 'expert');
      if (hasExpert) {
        io.to(roomId).emit('chat-ready');
      } else {
        socket.emit('waiting-for-expert');
      }
    }
  });

  socket.on('send-message', (data) => {
    const { roomId, message, sender, userType } = data;
    const messageData = {
      id: Date.now(),
      text: message,
      sender: sender,
      userType: userType,
      timestamp: new Date()
    };
    
    if (activeChats[roomId]) {
      activeChats[roomId].messages.push(messageData);
    }
    
    socket.to(roomId).emit('receive-message', messageData);
    console.log(`Message sent in room ${roomId} by ${sender}:`, messageData);
  });
  
  socket.on('offer', (data) => {
    console.log(`Relaying offer from ${socket.id} to room ${data.roomId}`);
    socket.to(data.roomId).emit('offer', data);
  });

  socket.on('answer', (data) => {
    console.log(`Relaying answer from ${socket.id} to room ${data.roomId}`);
    socket.to(data.roomId).emit('answer', data);
  });

  socket.on('ice-candidate', (data) => {
    console.log(`Relaying ICE candidate from ${socket.id} to room ${data.roomId}`);
    socket.to(data.roomId).emit('ice-candidate', data);
  });

  socket.on('end-chat', (roomId) => {
    console.log(`User ${socket.id} ending chat in room ${roomId}`);
    
    // Notify all users in the room that chat ended
    io.to(roomId).emit('chat-ended', { endedBy: socket.id });
    
    // Remove all users from the room and clean up
    if (activeChats[roomId]) {
      activeChats[roomId].users.forEach(user => {
        const userSocket = io.sockets.sockets.get(user.socketId);
        if (userSocket) {
          userSocket.leave(roomId);
        }
        delete userRoles[user.socketId];
      });
      delete activeChats[roomId];
    }
    
    console.log(`Chat room ${roomId} cleaned up`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Find and clean up user's room
    const userRole = userRoles[socket.id];
    if (userRole) {
      const { roomId } = userRole;
      
      // Notify others in room about disconnection
      socket.to(roomId).emit('user-disconnected', socket.id);
      
      // Remove user from room
      if (activeChats[roomId]) {
        activeChats[roomId].users = activeChats[roomId].users.filter(user => user.socketId !== socket.id);
        if (activeChats[roomId].users.length === 0) {
          delete activeChats[roomId];
        }
      }
      
      delete userRoles[socket.id];
    }
  });
});

server.listen(5006, () => {
  console.log('Chat server running on port 5006');
});