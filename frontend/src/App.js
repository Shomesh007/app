import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChatProvider } from './contexts/ChatContext';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { ChatArea } from './components/chat/ChatArea';
import { Toaster } from './components/ui/sonner';
import '@/App.css';

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('channels');

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <ChatArea />
      </main>
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

function App() {
  return (
    <ChatProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainApp />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            className: 'glass-effect border-white/10',
          }}
        />
      </div>
    </ChatProvider>
  );
}

export default App;