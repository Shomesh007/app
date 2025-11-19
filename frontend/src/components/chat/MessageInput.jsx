import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Smile, Mic, Image as ImageIcon, File } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';

const EMOJI_LIST = ['😊', '👍', '❤️', '😂', '🎉', '🔥', '👏', '🎬', '🎥', '🎨', '🎵', '💡'];

export const MessageInput = () => {
  const { sendMessage, currentUser, setTypingUsers } = useChat();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }

    // Simulate typing indicator
    setTypingUsers([currentUser]);
    setTimeout(() => setTypingUsers([]), 2000);
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
    textareaRef.current?.focus();
  };

  const handleFileUpload = () => {
    // Mock file upload
    const mockFile = {
      type: 'file',
      url: '#',
      name: 'project_assets.zip',
      size: '8.3 MB',
      icon: '📦',
    };
    sendMessage('', [mockFile]);
  };

  return (
    <motion.div
      initial={{ y: 60 }}
      animate={{ y: 0 }}
      className="glass-effect border-t border-white/10 p-4 shrink-0"
      style={{
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
      data-testid="message-input-container"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-2">
          {/* Attachment button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 hover:bg-white/5 h-10 w-10"
                data-testid="attachment-button"
              >
                <Paperclip className="w-5 h-5 text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="start"
              className="w-48 glass-effect border-white/10 p-2"
            >
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={handleFileUpload}
                  className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors text-left"
                  data-testid="upload-file-button"
                >
                  <File className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">Upload File</span>
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors text-left"
                  data-testid="upload-image-button"
                >
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">Upload Image</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Input field */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 pr-20 glass-effect border border-white/10 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all scrollbar-hide"
              style={{ maxHeight: '120px' }}
              data-testid="message-input"
            />

            {/* Inline actions */}
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <motion.button
                    type="button"
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    data-testid="emoji-button"
                  >
                    <Smile className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="end"
                  className="w-64 glass-effect border-white/10 p-3"
                >
                  <div className="grid grid-cols-6 gap-2">
                    {EMOJI_LIST.map((emoji) => (
                      <motion.button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiSelect(emoji)}
                        className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-white/10 rounded-lg transition-colors"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        data-testid={`emoji-${emoji}`}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {message.trim() && (
                <motion.button
                  type="submit"
                  className="p-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  data-testid="send-button"
                >
                  <Send className="w-5 h-5 text-white" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Voice record button */}
          {!message.trim() && (
            <motion.button
              type="button"
              onClick={() => setIsRecording(!isRecording)}
              className={cn(
                'shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-all',
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-lg hover:shadow-cyan-500/50'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              data-testid="voice-record-button"
            >
              <Mic className="w-5 h-5 text-white" />
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
};