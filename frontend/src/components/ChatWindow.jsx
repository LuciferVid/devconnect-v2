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
      <Card className="flex flex-col h-[500px] p-0 overflow-hidden shadow-2xl border-primary-200 dark:border-primary-900">
        {/* Header */}
        <div className="p-4 bg-primary-600 dark:bg-primary-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
              {recipient.name[0]}
            </div>
            <div>
              <h3 className="font-bold text-sm">{recipient.name}</h3>
              <span className="text-xs text-primary-100">@{recipient.username}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsMinimized(true)} className="hover:bg-white/20 p-1 rounded">
              <Minimize2 size={16} />
            </button>
            <button onClick={onClose} className="hover:bg-white/20 p-1 rounded">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-10 text-sm">
              Start a conversation with {recipient.name}
            </div>
          )}
          {messages.map((msg, idx) => {
            const isMe = msg.sender._id === user.id || msg.sender === user.id;
            return (
              <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`
                    max-w-[80%] p-3 rounded-lg text-sm
                    ${isMe
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}
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
        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow bg-gray-100 dark:bg-slate-900 border-none rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary-500 dark:text-white"
          />
          <Button type="submit" variant="primary" className="p-2 h-auto rounded-lg">
            <Send size={18} />
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ChatWindow;
