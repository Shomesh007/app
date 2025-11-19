import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../contexts/ChatContext';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { ChatHeader } from './ChatHeader';
import { Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export const ChatArea = () => {
  const { messages, typingUsers } = useChat();
  const messagesEndRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { ref: topRef, inView } = useInView();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate loading more messages when scrolling to top
  useEffect(() => {
    if (inView && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setIsLoadingMore(false);
      }, 1000);
    }
  }, [inView]);

  return (
    <div className="flex flex-col h-full" data-testid="chat-area">
      <ChatHeader />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Load more indicator */}
        <div ref={topRef} className="py-4 flex justify-center">
          {isLoadingMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-gray-400"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading messages...
            </motion.div>
          )}
        </div>

        {/* Messages */}
        <div className="pb-4">
          <AnimatePresence>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="px-4 lg:px-6 py-2 flex items-center gap-2 text-sm text-gray-400"
              data-testid="typing-indicator"
            >
              <div className="flex gap-1">
                <motion.span
                  className="w-2 h-2 bg-cyan-500 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.span
                  className="w-2 h-2 bg-cyan-500 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.span
                  className="w-2 h-2 bg-cyan-500 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
              <span>Someone is typing...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <MessageInput />
    </div>
  );
};