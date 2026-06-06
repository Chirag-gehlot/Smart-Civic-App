import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const ChatbotLayout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* App Header */}
      <Header />

      {/* Chatbot takes ALL remaining height */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatbotLayout;
