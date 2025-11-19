import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Reply, Smile, Copy, Pin, Trash, Edit, Download, Play, Pause } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

const REACTION_EMOJIS = ['👍', '❤️', '😂', '🎉', '🔥', '👏'];

export const MessageBubble = ({ message }) => {
  const { users, currentUser, addReaction, deleteMessage, openThread } = useChat();
  const [showReactions, setShowReactions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const sender = users.find(u => u.id === message.userId);
  const isOwnMessage = message.userId === currentUser.id;

  const handleLongPress = () => {
    setShowReactions(true);
  };

  const handleReaction = (emoji) => {
    addReaction(message.id, emoji);
    setShowReactions(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group px-4 lg:px-6 py-2 hover:bg-white/[0.02] transition-colors relative"
      onContextMenu={(e) => {
        e.preventDefault();
        handleLongPress();
      }}
      data-testid={`message-${message.id}`}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <Avatar className="w-9 h-9 ring-1 ring-white/10">
            <AvatarImage src={sender?.avatar} />
            <AvatarFallback>{sender?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          {sender?.status === 'online' && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0a0a0b] rounded-full" />
          )}
        </div>

        {/* Message content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm" data-testid="sender-name">{sender?.name}</span>
            <span className="text-xs text-gray-500">{sender?.role}</span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </span>
            {message.isEdited && (
              <span className="text-xs text-gray-500">(edited)</span>
            )}
          </div>

          {/* Text content */}
          {message.content && (
            <p className="text-sm text-gray-200 mb-2 whitespace-pre-wrap break-words" data-testid="message-content">
              {message.content}
            </p>
          )}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="space-y-2 mb-2">
              {message.attachments.map((attachment, idx) => (
                <AttachmentPreview key={idx} attachment={attachment} />
              ))}
            </div>
          )}

          {/* Voice note */}
          {message.voiceNote && (
            <VoiceNotePlayer
              voiceNote={message.voiceNote}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
            />
          )}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.reactions.map((reaction, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => addReaction(message.id, reaction.emoji)}
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all',
                    reaction.users.includes(currentUser.id)
                      ? 'bg-cyan-500/20 ring-1 ring-cyan-500/50'
                      : 'bg-white/5 hover:bg-white/10'
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid={`reaction-${reaction.emoji}`}
                >
                  <span>{reaction.emoji}</span>
                  <span className="font-medium">{reaction.users.length}</span>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-1">
          <motion.button
            onClick={() => setShowReactions(!showReactions)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            data-testid="add-reaction-button"
          >
            <Smile className="w-4 h-4 text-gray-400" />
          </motion.button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                data-testid="message-actions-button"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-effect border-white/10">
              <DropdownMenuItem onClick={() => openThread(message)} data-testid="reply-thread-menu-item">
                <Reply className="w-4 h-4 mr-2" />
                Reply in thread
              </DropdownMenuItem>
              <DropdownMenuItem data-testid="copy-message-menu-item">
                <Copy className="w-4 h-4 mr-2" />
                Copy message
              </DropdownMenuItem>
              <DropdownMenuItem data-testid="pin-message-menu-item">
                <Pin className="w-4 h-4 mr-2" />
                Pin message
              </DropdownMenuItem>
              {isOwnMessage && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem data-testid="edit-message-menu-item">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit message
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteMessage(message.id)}
                    className="text-red-400"
                    data-testid="delete-message-menu-item"
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete message
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick reactions popup */}
      {showReactions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute bottom-full right-4 mb-2 glass-effect border border-white/10 rounded-xl p-2 flex gap-1 shadow-2xl z-10"
          data-testid="reaction-picker"
        >
          {REACTION_EMOJIS.map((emoji) => (
            <motion.button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className="w-10 h-10 flex items-center justify-center text-xl hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              data-testid={`quick-reaction-${emoji}`}
            >
              {emoji}
            </motion.button>
          ))}
          <motion.button
            onClick={() => setShowReactions(false)}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            data-testid="close-reaction-picker"
          >
            ✕
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

const AttachmentPreview = ({ attachment }) => {
  if (attachment.type === 'image') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative rounded-xl overflow-hidden max-w-md cursor-pointer group"
        data-testid="image-attachment"
      >
        <img
          src={attachment.url}
          alt={attachment.name}
          className="w-full h-auto"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <div className="text-sm text-white">
            <p className="font-medium">{attachment.name}</p>
            <p className="text-xs text-gray-300">{attachment.size}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (attachment.type === 'video') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative rounded-xl overflow-hidden max-w-md cursor-pointer group"
        data-testid="video-attachment"
      >
        <img
          src={attachment.thumbnail}
          alt={attachment.name}
          className="w-full h-auto"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-sm font-medium text-white">{attachment.name}</p>
          <p className="text-xs text-gray-300">{attachment.size}</p>
        </div>
      </motion.div>
    );
  }

  if (attachment.type === 'file') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center gap-3 p-4 glass-effect border border-white/10 rounded-xl max-w-md cursor-pointer group"
        data-testid="file-attachment"
      >
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-2xl">
          {attachment.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.name}</p>
          <p className="text-xs text-gray-400">{attachment.size}</p>
        </div>
        <Download className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
      </motion.div>
    );
  }

  return null;
};

const VoiceNotePlayer = ({ voiceNote, isPlaying, onTogglePlay }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-3 p-3 glass-effect border border-white/10 rounded-xl max-w-md"
      data-testid="voice-note"
    >
      <button
        onClick={onTogglePlay}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
        data-testid="voice-note-play-button"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white" />
        ) : (
          <Play className="w-5 h-5 text-white ml-0.5" />
        )}
      </button>

      {/* Waveform */}
      <div className="flex-1 flex items-center gap-0.5 h-8">
        {voiceNote.waveform.map((height, idx) => (
          <motion.div
            key={idx}
            className="flex-1 rounded-full bg-gradient-to-t from-cyan-500 to-purple-500"
            style={{ height: `${height * 100}%` }}
            animate={{
              height: isPlaying ? [`${height * 100}%`, `${height * 80}%`, `${height * 100}%`] : `${height * 100}%`,
            }}
            transition={{
              duration: 0.5,
              repeat: isPlaying ? Infinity : 0,
              delay: idx * 0.05,
            }}
          />
        ))}
      </div>

      <div className="text-xs text-gray-400 font-medium">
        {Math.floor(voiceNote.duration / 60)}:{(voiceNote.duration % 60).toString().padStart(2, '0')}
      </div>
    </motion.div>
  );
};