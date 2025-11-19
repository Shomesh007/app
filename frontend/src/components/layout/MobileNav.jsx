import React from 'react';
import { motion } from 'framer-motion';
import { Hash, MessageSquare, Search, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'channels', icon: Hash, label: 'Channels' },
  { id: 'dms', icon: MessageSquare, label: 'DMs' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export const MobileNav = ({ activeTab = 'channels', onTabChange }) => {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 glass-effect border-t border-white/10 z-30 pb-safe"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)',
      }}
      data-testid="mobile-nav"
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors',
                isActive ? 'text-cyan-400' : 'text-gray-400'
              )}
              whileTap={{ scale: 0.9 }}
              data-testid={`mobile-nav-${tab.id}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Icon className={cn('w-5 h-5', isActive && 'drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]')} />
              </motion.div>
              <span className={cn('text-[10px] font-medium', isActive && 'font-semibold')}>{tab.label}</span>
              {tab.id === 'notifications' && (
                <span className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0a0a0b]" />
              )}
              {tab.id === 'dms' && (
                <span className="absolute top-2 right-1/4 px-1 min-w-[16px] h-4 flex items-center justify-center text-[9px] font-bold bg-red-500 rounded-full ring-2 ring-[#0a0a0b]">
                  2
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};