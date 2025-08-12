const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let rooms = {};
let userRoles = {}; // Track user roles (farmer/expert)

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Video call events
  socket.on('join-room', (data) => {
    const { roomId, userType = 'farmer' } = data;
    socket.join(roomId);
    
    if (!rooms[roomId]) rooms[roomId] = [];
    
    console.log(`${userType} ${socket.id} joining room ${roomId}`);
    
    // Store user role
    userRoles[socket.id] = { roomId, userType };
    
    // Notify existing users about new connection
    socket.to(roomId).emit('user-connected', { socketId: socket.id, userType });
    
    // Add user to room
    rooms[roomId].push({ socketId: socket.id, userType });
    
    console.log(`Room ${roomId} now has ${rooms[roomId].length} users`);
    
    // Handle different scenarios based on user type and room state
    if (userType === 'expert') {
      // Expert joined - notify farmer and start call
      socket.to(roomId).emit('expert-joined');
      io.to(roomId).emit('call-ready');
      
      // Give a moment for both clients to be ready, then start the call
      setTimeout(() => {
        // Find the farmer in the room and tell them to start the call
        const farmer = rooms[roomId].find(user => user.userType === 'farmer');
        if (farmer) {
          io.to(farmer.socketId).emit('start-call');
        }
      }, 1000);
    } else if (userType === 'farmer') {
      // Farmer joined - check if expert is already there
      const hasExpert = rooms[roomId].some(user => user.userType === 'expert');
      if (hasExpert) {
        io.to(roomId).emit('call-ready');
        // Start the call immediately if expert is already there
        setTimeout(() => {
          socket.emit('start-call');
        }, 1000);
      } else {
        socket.emit('waiting-for-expert');
      }
    }
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
  
  socket.on('video-toggle', (data) => {
    console.log(`User ${socket.id} toggled video in room ${data.roomId}: ${data.videoOff}`);
    socket.to(data.roomId).emit('remote-video-toggle', data);
  });
  
  socket.on('audio-toggle', (data) => {
    console.log(`User ${socket.id} toggled audio in room ${data.roomId}: ${data.muted}`);
    socket.to(data.roomId).emit('remote-audio-toggle', data);
  });

  // Chat events
  socket.on('join-chat-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined chat room ${roomId}`);
  });

  socket.on('chat-message', (data) => {
    console.log('Chat message:', data);
    socket.to(data.roomId).emit('chat-message', data);
  });

  socket.on('end-call', (roomId) => {
    console.log(`User ${socket.id} ending call in room ${roomId}`);
    
    // Notify all users in the room that call ended
    io.to(roomId).emit('call-ended', { endedBy: socket.id });
    
    // Remove all users from the room and clean up
    if (rooms[roomId]) {
      rooms[roomId].forEach(user => {
        const userSocket = io.sockets.sockets.get(user.socketId);
        if (userSocket) {
          userSocket.leave(roomId);
        }
        delete userRoles[user.socketId];
      });
      delete rooms[roomId];
    }
    
    console.log(`Room ${roomId} cleaned up`);
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
      if (rooms[roomId]) {
        rooms[roomId] = rooms[roomId].filter(user => user.socketId !== socket.id);
        if (rooms[roomId].length === 0) {
          delete rooms[roomId];
        }
      }
      
      delete userRoles[socket.id];
    }
  });
});

server.listen(5008, () => {
  console.log('Video signaling server running on port 5008');
  console.log('WebRTC and Chat server ready');
});