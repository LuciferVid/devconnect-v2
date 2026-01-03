import Message from '../models/Message.js';

const users = new Map(); // Store socket.id -> userId mapping

export const setupChatHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User joins
    socket.on('user:join', (userId) => {
      users.set(socket.id, userId);
      console.log(`User ${userId} joined with socket ${socket.id}`);

      // Notify others that user is online
      socket.broadcast.emit('user:online', userId);
    });

    // Send message
    socket.on('message:send', async (data) => {
      try {
        const { senderId, receiverId, content } = data;

        // Save message to database
        const message = await Message.create({
          sender: senderId,
          receiver: receiverId,
          content
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name username avatar')
          .populate('receiver', 'name username avatar');

        // Find receiver's socket
        const receiverSocketId = Array.from(users.entries())
          .find(([_, userId]) => userId === receiverId)?.[0];

        if (receiverSocketId) {
          // Send to receiver if online
          io.to(receiverSocketId).emit('message:receive', populatedMessage);
        }

        // Send confirmation to sender
        socket.emit('message:sent', populatedMessage);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('message:error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing:start', (data) => {
      const { receiverId, senderId } = data;

      const receiverSocketId = Array.from(users.entries())
        .find(([_, userId]) => userId === receiverId)?.[0];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing:show', { userId: senderId });
      }
    });

    socket.on('typing:stop', (data) => {
      const { receiverId, senderId } = data;

      const receiverSocketId = Array.from(users.entries())
        .find(([_, userId]) => userId === receiverId)?.[0];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing:hide', { userId: senderId });
      }
    });

    // User disconnects
    socket.on('disconnect', () => {
      const userId = users.get(socket.id);
      if (userId) {
        users.delete(socket.id);
        socket.broadcast.emit('user:offline', userId);
        console.log(`User ${userId} disconnected`);
      }
    });
  });
};
