import React, { useState } from 'react';
import UserList from './UserList';
import CustomList from './CustomList';
import ReportList from './ReportList';
import RecordList from './RecordList';

import { Outlet } from 'react-router-dom';

const Management = () => {
  const [activeTab, setActiveTab] = useState('users');

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserList />;
      case 'customs':
        return <CustomList />;
      case 'reports':
        return <ReportList />;
      case 'records':
        return <RecordList />;
      default:
        return <UserList />;
    }
  };

  const TabButton = ({ id, title }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors ${
        activeTab === id
          ? 'bg-cyan-500 text-white'
          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
      }`}
    >
      {title}
    </button>
  );

  return (
    <div className="min-h-screen p-8 bg-slate-900 opacity-95">
      <div className="max-w-7xl mx-auto bg-slate-800/90 rounded-lg shadow-xl backdrop-blur-sm">
        <div className="p-6">
          <h1 className="text-4xl font-bold text-cyan-400 mb-8 text-center tracking-wide">관리자 페이지</h1>
          
          <div className="flex gap-3 mb-6">
            <TabButton id="users" title="회원 관리" />
            <TabButton id="customs" title="커스텀 게임 관리" />
            <TabButton id="reports" title="신고 관리" />
            <TabButton id="records" title="욕설 기록" />
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Management;