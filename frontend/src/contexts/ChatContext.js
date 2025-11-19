import React, { createContext, useContext, useState, useCallback } from 'react';
import { channels, messages, directMessages, users, currentUser } from '../data/mockData';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [activeChannel, setActiveChannel] = useState(channels[1]);
  const [channelsList] = useState(channels);
  const [messagesList, setMessagesList] = useState(messages);
  const [dmList] = useState(directMessages);
  const [usersList] = useState(users);
  const [user] = useState(currentUser);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isThreadPanelOpen, setIsThreadPanelOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);

  const getChannelMessages = useCallback((channelId) => {
    return messagesList.filter(msg => msg.channelId === channelId);
  }, [messagesList]);

  const sendMessage = useCallback((content, attachments = [], voiceNote = null) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      channelId: activeChannel.id,
      userId: user.id,
      content,
      timestamp: new Date(),
      reactions: [],
      isEdited: false,
      attachments,
      voiceNote,
    };
    setMessagesList(prev => [...prev, newMessage]);
  }, [activeChannel, user]);

  const addReaction = useCallback((messageId, emoji) => {
    setMessagesList(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          if (existingReaction.users.includes(user.id)) {
            return {
              ...msg,
              reactions: msg.reactions.map(r => 
                r.emoji === emoji
                  ? { ...r, users: r.users.filter(id => id !== user.id) }
                  : r
              ).filter(r => r.users.length > 0),
            };
          } else {
            return {
              ...msg,
              reactions: msg.reactions.map(r =>
                r.emoji === emoji
                  ? { ...r, users: [...r.users, user.id] }
                  : r
              ),
            };
          }
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, users: [user.id] }],
          };
        }
      }
      return msg;
    }));
  }, [user]);

  const deleteMessage = useCallback((messageId) => {
    setMessagesList(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  const openThread = useCallback((message) => {
    setSelectedMessage(message);
    setIsThreadPanelOpen(true);
  }, []);

  const value = {
    activeChannel,
    setActiveChannel,
    channels: channelsList,
    messages: getChannelMessages(activeChannel?.id),
    directMessages: dmList,
    users: usersList,
    currentUser: user,
    sendMessage,
    addReaction,
    deleteMessage,
    isSidebarOpen,
    setIsSidebarOpen,
    isThreadPanelOpen,
    setIsThreadPanelOpen,
    selectedMessage,
    openThread,
    typingUsers,
    setTypingUsers,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};