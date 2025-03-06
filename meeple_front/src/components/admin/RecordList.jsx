import React, { useState } from 'react';
import { Search, Play, Pause } from 'lucide-react';
import Pagination from './Pagination';

const RecordList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [playing, setPlaying] = useState(null);
  const itemsPerPage = 10;

  // 더미 데이터
  const [records] = useState(Array.from({ length: 25 }, (_, index) => ({
    id: index + 1,
    nickname: `Player${index + 1}`,
    text: `부적절한 언어 사용 ${index + 1}...`,
    recordUrl: `record${index + 1}.mp3`,
    timestamp: new Date(2024, 1, 1 + index).toLocaleString()
  })));

  // 검색 필터링
  const filteredRecords = records.filter(record => {
    if (!searchTerm) return true;
    return record.nickname.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRecords.slice(startIndex, endIndex);
  };

  // 검색 시 페이지 리셋
  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handlePlayRecord = (recordId) => {
    if (playing === recordId) {
      setPlaying(null);
      // 음성 재생 중지 로직
    } else {
      setPlaying(recordId);
      // 음성 재생 로직
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="닉네임 검색..."
            className="px-4 py-2 bg-slate-700 text-white placeholder-gray-400 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 w-80"
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
                시간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                닉네임
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                텍스트 변환
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                녹음 파일
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-600">
            {getCurrentPageData().map((record) => (
              <tr key={record.id} className="hover:bg-slate-600 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {record.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {record.nickname}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {record.text}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button 
                    onClick={() => handlePlayRecord(record.id)}
                    className="px-3 py-2 bg-slate-800 text-cyan-400 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
                  >
                    {playing === record.id ? (
                      <>
                        <Pause size={16} />
                        일시정지
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        재생
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={filteredRecords.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default RecordList;