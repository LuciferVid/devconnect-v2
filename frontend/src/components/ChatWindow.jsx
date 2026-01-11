import { useState, useEffect, useRef } from 'react';
import { X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import Card from './Card';
import Button from './Button';

const ChatWindow = ({ recipient, onClose }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isMinimized]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      if (message.sender._id === recipient._id || message.receiver._id === recipient._id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleSentMessage = (message) => {
      if (message.receiver === recipient._id || message.sender === recipient._id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on('message:receive', handleReceiveMessage);
    socket.on('message:sent', handleSentMessage);

    return () => {
      socket.off('message:receive', handleReceiveMessage);
      socket.off('message:sent', handleSentMessage);
    };
  }, [socket, recipient]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('message:send', {
      senderId: user.id,
      receiverId: recipient._id,
      content: newMessage
    });

    setNewMessage('');
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="primary"
          onClick={() => setIsMinimized(false)}
          className="shadow-lg flex items-center gap-2"
        >
          <span>Chat with {recipient.name}</span>
          <Maximize2 size={16} />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 z-50">
      <Card className="flex flex-col h-[500px] p-0 overflow-hidden shadow-2xl border-white/5 bg-black/60 backdrop-blur-2xl">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-primary-900/80 to-primary-800/80 backdrop-blur-md text-white flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center font-bold text-primary-300 border border-primary-500/30">
              {recipient.name[0]}
            </div>
            <div>
              <h3 className="font-bold text-sm">{recipient.name}</h3>
              <span className="text-xs text-primary-400/80">@{recipient.username}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsMinimized(true)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
              <Minimize2 size={16} />
            </button>
            <button onClick={onClose} className="hover:bg-red-500/20 hover:text-red-400 p-1.5 rounded-lg transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-transparent custom-scrollbar">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-10 text-sm italic font-light">
              Start a encrypted conversation with {recipient.name}
            </div>
          )}
          {messages.map((msg, idx) => {
            const isMe = msg.sender._id === user.id || msg.sender === user.id;
            return (
              <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`
                    max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed
                    ${isMe
                      ? 'bg-primary-600/90 text-white rounded-br-none shadow-[0_4px_12px_rgba(14,165,233,0.3)]'
                      : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none backdrop-blur-sm'}
                  `}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 bg-white/[0.02] border-t border-white/5 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Secure message..."
            className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all text-white placeholder-gray-500"
          />
          <Button type="submit" variant="primary" className="p-2 h-auto rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.2)]">
            <Send size={18} />
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ChatWindow;
