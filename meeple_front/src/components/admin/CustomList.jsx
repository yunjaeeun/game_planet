import React, { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';

const CustomList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState('nickname');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // 더미 데이터
  const [customGames] = useState(Array.from({ length: 28 }, (_, index) => ({
    id: index + 1,
    nickname: `Player${index + 1}`,
    gameName: `커스텀 게임 ${index + 1}`,
    submitDate: new Date(2024, 1, 1 + index).toLocaleDateString(),
    status: index % 3 === 0 ? '신청완료' : index % 3 === 1 ? '심사진행중' : '심사완료'
  })));

  // 검색 및 상태 필터링
  const filteredGames = customGames.filter(game => {
    const matchesSearch = !searchTerm || (
      searchType === 'nickname' 
        ? game.nickname.toLowerCase().includes(searchTerm.toLowerCase())
        : game.gameName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus = statusFilter === '전체' || game.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredGames.slice(startIndex, endIndex);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '신청완료':
        return 'bg-yellow-500';
      case '심사진행중':
        return 'bg-blue-500';
      case '심사완료':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusCount = (status) => {
    if (status === '전체') return customGames.length;
    return customGames.filter(game => game.status === status).length;
  };

  return (
    <div>
      
      <div className="flex justify-between items-center mb-6">
        {/* 상태 필터 버튼들 */}
        <div className="flex gap-2">
          {['전체', '신청완료', '심사진행중', '심사완료'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                handleFilterChange();
              }}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm
                ${statusFilter === status 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
            >
              {status}
              <span className="bg-slate-800 px-2 py-0.5 rounded-full text-xs">
                {getStatusCount(status)}
              </span>
            </button>
          ))}
        </div>

        {/* 검색 영역 */}
        <div className="flex gap-2">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            <option value="nickname">닉네임</option>
            <option value="gameName">게임 이름</option>
          </select>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleFilterChange();
            }}
            placeholder={searchType === 'nickname' ? '닉네임 검색...' : '게임 이름 검색...'}
            className="px-4 py-2 bg-slate-700 text-white placeholder-gray-400 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 w-64"
          />
          <button 
            onClick={handleFilterChange}
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
                닉네임
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                게임 이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                제출일자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                진행상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                상세조회
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-600">
            {getCurrentPageData().map((game) => (
              <tr key={game.id} className="hover:bg-slate-600 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {game.nickname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {game.gameName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {game.submitDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(game.status)}`}>
                    {game.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button 
                    // onClick={} 
                    className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                  >
                    <Eye size={16} />
                    상세보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={filteredGames.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default CustomList;