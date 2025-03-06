import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  setDeleteModalOpen,
  resetDeleteSuccess,
} from "../../sources/store/slices/ProfileSlice";
import { logout } from "../../sources/store/slices/UserSlice";
import { Eye, EyeOff } from "lucide-react";

const UserDeletePage = ({ userId, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, deleteSuccess } = useSelector(
    (state) => state.profile
  );

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleDeleteRequest = (e) => {
    e.preventDefault();
    if (!password) {
      return;
    }
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await dispatch(
        deleteUser({ userId, password })
      ).unwrap();

      if (response) {
        dispatch(logout());
        localStorage.removeItem("token");

        setShowConfirmModal(false);
        onClose();

        navigate("/");
        alert("회원 탈퇴가 완료되었습니다.");
      }
    } catch (error) {
      // console.log("회원 탈퇴 실패 : ", error);
      alert(error.message || "회원 탈퇴에 실패했습니다.");
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-zinc-800 rounded-xl p-8 max-w-[460px] w-full shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">회원 탈퇴</h2>

        <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-rose-400 mb-4">
            회원 탈퇴 전 꼭 확인해주세요!
          </h3>
          <ul className="text-zinc-300 space-y-3">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
              탈퇴 후에는 계정을 복구할 수 없습니다.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
              작성한 게시글과 댓글은 삭제되지 않습니다.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
              동일한 이메일로 재가입이 불가능합니다.
            </li>
          </ul>
        </div>

        <form onSubmit={handleDeleteRequest} className="space-y-6">
          <div>
            <label className="block text-zinc-300 text-lg mb-2">
              비밀번호 확인
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                className="w-full p-3 bg-zinc-900 border-2 border-zinc-700 rounded-lg text-white
                  focus:border-cyan-500 focus:outline-none transition-colors"
                placeholder="현재 비밀번호를 입력해주세요"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-zinc-700 text-zinc-200 rounded-lg hover:bg-zinc-600 transition-colors"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className={`px-6 py-3 rounded-lg transition-colors
                ${
                  isLoading || !password
                    ? "bg-zinc-600 text-zinc-400 cursor-not-allowed"
                    : "bg-rose-500 text-white hover:bg-rose-600"
                }`}
              disabled={isLoading || !password}
            >
              회원 탈퇴
            </button>
          </div>
        </form>

        {showConfirmModal && (
          <div className="fixed inset-0 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-800 rounded-xl p-8 max-w-sm w-full shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-4">
                정말 탈퇴하시겠습니까?
              </h3>
              <p className="text-zinc-300 mb-8">
                탈퇴 후에는 계정을 복구할 수 없으며, 동일한 이메일로 재가입이
                불가능합니다.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-6 py-3 bg-zinc-700 text-zinc-200 rounded-lg hover:bg-zinc-600 transition-colors"
                  disabled={isLoading}
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className={`px-6 py-3 rounded-lg transition-colors
                    ${
                      isLoading
                        ? "bg-zinc-600 text-zinc-400 cursor-not-allowed"
                        : "bg-rose-500 text-white hover:bg-rose-600"
                    }`}
                  disabled={isLoading}
                >
                  {isLoading ? "처리중..." : "탈퇴하기"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDeletePage;
