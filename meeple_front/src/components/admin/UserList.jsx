import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Pagination from './Pagination';

const UserList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState('name'); // 'name' or 'nickname'
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  // 더미 데이터
  const [users] = useState(Array.from({ length: 35 }, (_, index) => ({
    id: index + 1,
    name: `사용자${index + 1}`,
    nickname: `User${index + 1}`,
    email: `user${index + 1}@example.com`,
  })));

  // 검색 필터링
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    
    if (searchType === 'name') {
      return user.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return user.nickname.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  // 현재 페이지의 데이터
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  // 검색 시 페이지 리셋
  const handleSearch = () => {
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <div className="flex gap-3">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            <option value="name">이름</option>
            <option value="nickname">닉네임</option>
          </select>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchType === 'name' ? '이름 검색...' : '닉네임 검색...'}
            className="px-4 py-2 bg-slate-700 text-white placeholder-gray-400 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
          />
          <button 
            onClick={handleSearch}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
          >
            <Search size={20} />
            검색
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-slate-700 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-slate-600">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                닉네임
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                이메일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-600">
            {getCurrentPageData().map((user) => (
              <tr key={user.id} className="hover:bg-slate-600 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.nickname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    프로필 수정
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default UserList;