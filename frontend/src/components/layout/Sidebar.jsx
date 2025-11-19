import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Lock, ChevronDown, Plus, X } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const { channels, activeChannel, setActiveChannel, currentUser, isSidebarOpen, setIsSidebarOpen } = useChat();

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="hidden lg:flex flex-col w-[280px] glass-effect border-r border-white/10 h-full"
        data-testid="desktop-sidebar"
      >
        <SidebarContent
          channels={channels}
          activeChannel={activeChannel}
          setActiveChannel={setActiveChannel}
          currentUser={currentUser}
          onClose={() => {}}
        />
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              data-testid="sidebar-backdrop"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[300px] glass-effect z-50 lg:hidden"
              data-testid="mobile-sidebar"
            >
              <SidebarContent
                channels={channels}
                activeChannel={activeChannel}
                setActiveChannel={setActiveChannel}
                currentUser={currentUser}
                onClose={() => setIsSidebarOpen(false)}
                isMobile
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const SidebarContent = ({ channels, activeChannel, setActiveChannel, currentUser, onClose, isMobile }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Workspace Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <button className="flex items-center gap-2 flex-1 p-2 rounded-lg hover:bg-white/5 transition-colors"
            data-testid="workspace-button">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-sm">
              MP
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm">Media Production</div>
              <div className="text-xs text-gray-400">Workspace</div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              data-testid="close-sidebar-button"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Channels */}
      <ScrollArea className="flex-1 px-3">
        <div className="py-4">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Channels</span>
            <button
              className="p-1 hover:bg-white/5 rounded transition-colors"
              data-testid="add-channel-button"
            >
              <Plus className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="space-y-1">
            {channels.map((channel) => (
              <motion.button
                key={channel.id}
                onClick={() => {
                  setActiveChannel(channel);
                  if (isMobile) onClose();
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative',
                  activeChannel?.id === channel.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white'
                    : 'hover:bg-white/5 text-gray-300'
                )}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                data-testid={`channel-${channel.name}`}
              >
                {channel.isPrivate ? (
                  <Lock className="w-4 h-4 text-gray-400" />
                ) : (
                  <Hash className="w-4 h-4 text-gray-400" />
                )}
                <span className="flex-1 text-left text-sm font-medium">#{channel.name}</span>
                {channel.unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 min-w-[20px] text-xs font-bold bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full">
                    {channel.unreadCount}
                  </span>
                )}
                {activeChannel?.id === channel.id && (
                  <motion.div
                    layoutId="activeChannel"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-r-full"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer"
          data-testid="user-profile-button">
          <div className="relative">
            <Avatar className="w-9 h-9 ring-2 ring-cyan-500/50">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#13131a] rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{currentUser.name}</div>
            <div className="text-xs text-gray-400 truncate">{currentUser.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};