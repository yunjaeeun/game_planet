import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, User, UserX } from 'lucide-react';

const ReportDetail = () => {
  const navigate = useNavigate();
  const { reportId } = useParams();

  // 더미 데이터 (실제로는 API 응답으로 대체)
  const [report, setReport] = useState({
    reportId: 1,
    reportTime: "2024-02-12T14:30:00",
    reportReason: "CHAT",
    reportTitle: "부적절한 채팅 신고",
    reportContent: "게임 중에 부적절한 언어를 사용했습니다.",
    user: {
      userId: 1,
      nickname: "BadUser",
      email: "bad@example.com"
    },
    reporter: {
      userId: 2,
      nickname: "Reporter",
      email: "reporter@example.com"
    }
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const getReasonText = (reason) => {
    const reasonMap = {
      'CHAT': '채팅',
      'GAME': '게임',
      'VOICE': '음성',
      'VIDEO': '비디오',
      'ETC': '기타'
    };
    return reasonMap[reason] || reason;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // 실제 구현시에는 useEffect로 API 호출
  useEffect(() => {
    // API 호출 로직
    console.log('Fetching report details for ID:', reportId);
  }, [reportId]);

  return (
    <div className="bg-slate-800 rounded-lg p-6 max-w-4xl w-full mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleGoBack}
          className="text-gray-300 hover:text-white flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          돌아가기
        </button>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          <span className="text-gray-300">{formatDate(report.reportTime)}</span>
        </div>
      </div>

      {/* 신고 기본 정보 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{report.reportTitle}</h2>
        <div className="flex gap-3">
          <span className="px-3 py-1 bg-gray-500 text-white text-sm rounded-full">
            {getReasonText(report.reportReason)}
          </span>
        </div>
      </div>

      {/* 신고자/피신고자 정보 */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <User size={20} className="text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">신고자 정보</h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-300">닉네임: {report.reporter.nickname}</p>
            <p className="text-gray-300">이메일: {report.reporter.email}</p>
          </div>
        </div>
        
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <UserX size={20} className="text-red-400" />
            <h3 className="text-lg font-semibold text-white">신고 대상자 정보</h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-300">닉네임: {report.user.nickname}</p>
            <p className="text-gray-300">이메일: {report.user.email}</p>
          </div>
        </div>
      </div>

      {/* 신고 내용 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-3">신고 내용</h3>
        <div className="bg-slate-700 p-4 rounded-lg">
          <p className="text-gray-300">{report.reportContent}</p>
        </div>
      </div>

      {/* 처리 양식 */}
      <div className="bg-slate-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">신고 처리</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">처리 방식</label>
            <select
              className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              <option value="">선택해주세요</option>
              <option value="warning">경고</option>
              <option value="restriction">제재</option>
              <option value="dismiss">처리 불필요</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">처리 메모</label>
            <textarea
              className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 h-32 resize-none"
              placeholder="처리 사유나 메모를 입력해주세요..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
            >
              취소
            </button>
            <button
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              처리 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;