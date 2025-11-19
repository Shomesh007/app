import React from 'react';
import { motion } from 'framer-motion';
import { Hash, Lock, Menu, MoreVertical, Users, Star, Pin } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export const ChatHeader = () => {
  const { activeChannel, setIsSidebarOpen } = useChat();

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="glass-effect border-b border-white/10 px-4 lg:px-6 h-14 lg:h-16 flex items-center justify-between shrink-0"
      data-testid="chat-header"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
          data-testid="mobile-menu-button"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Channel info */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
            {activeChannel?.isPrivate ? (
              <Lock className="w-4 h-4 text-cyan-400" />
            ) : (
              <Hash className="w-4 h-4 text-cyan-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-bold text-base lg:text-lg truncate" data-testid="channel-name">
              #{activeChannel?.name}
            </h1>
            <p className="text-xs text-gray-400 truncate hidden md:block">
              {activeChannel?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 lg:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex hover:bg-white/5"
          data-testid="starred-button"
        >
          <Star className="w-5 h-5 text-gray-400 hover:text-yellow-400 transition-colors" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex hover:bg-white/5"
          data-testid="pinned-button"
        >
          <Pin className="w-5 h-5 text-gray-400 hover:text-cyan-400 transition-colors" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex hover:bg-white/5"
          data-testid="members-button"
        >
          <Users className="w-5 h-5 text-gray-400" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/5"
              data-testid="channel-menu-button"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-effect border-white/10">
            <DropdownMenuItem data-testid="channel-details-menu-item">
              <Users className="w-4 h-4 mr-2" />
              Channel Details
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="mute-channel-menu-item">
              Mute Channel
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="notification-settings-menu-item">
              Notification Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-400" data-testid="leave-channel-menu-item">
              Leave Channel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};