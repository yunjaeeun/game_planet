import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../../sources/store/slices/ProfileSlice";
import { Eye, EyeOff } from "lucide-react";

const PasswordChangePage = ({ userId, onClose }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.profile);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // password: 영문, 숫자, 특수문자 포함 9-16자
  const REGEX = {
    password:
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{9,16}$/,
  };

  const [validations, setValidations] = useState({
    validNewPassword: true,
    passwordMatch: true,
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [formError, setFormError] = useState("");

  // 입력값 변경 시 유효성 검사
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 새 비밀번호 입력 시 유효성 검사
    if (name === "newPassword") {
      setValidations((prev) => ({
        ...prev,
        validNewPassword: REGEX.password.test(value),
        passwordMatch: value === formData.confirmNewPassword,
      }));
    }

    // 비밀번호 확인 입력 시 일치 여부 검사
    if (name === "confirmNewPassword") {
      setValidations((prev) => ({
        ...prev,
        passwordMatch: value === formData.newPassword,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!REGEX.password.test(formData.newPassword)) {
      setFormData(
        "새 비밀번호는 영문, 숫자, 특수문자를 포함한 9-16자여야 합니다."
      );
    }

    // 새 비밀번호 확인
    if (formData.newPassword !== formData.confirmNewPassword) {
      setFormError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await dispatch(
        updatePassword({
          userId,
          data: formData,
        })
      ).unwrap();

      onClose();
      alert("비밀번호가 성공적으로 변경되었습니다.");
    } catch (error) {
      setFormError(error.message || "비밀번호 변경에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-zinc-800 rounded-xl p-8 max-w-md w-full shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">비밀번호 변경</h2>

        {(formError || error) && (
          <p className="text-rose-500 mb-6 bg-rose-500/10 p-3 rounded-lg">
            {formError || error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 현재 비밀번호 */}
          <div>
            <label className="block text-zinc-300 text-lg mb-2">
              현재 비밀번호
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full p-3 bg-zinc-900 border-2 border-zinc-700 rounded-lg text-white
                  focus:border-cyan-500 focus:outline-none transition-colors"
                required
                placeholder="현재 비밀번호를 입력해주세요"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* 새 비밀번호 */}
          <div>
            <label className="block text-zinc-300 text-lg mb-2">
              새 비밀번호
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full p-3 bg-zinc-900 border-2 rounded-lg text-white transition-colors focus:outline-none
                  ${
                    formData.newPassword && !validations.validNewPassword
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-zinc-700 focus:border-cyan-500"
                  }`}
                required
                placeholder="영문, 숫자, 특수문자 포함 9-16자"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.newPassword && !validations.validNewPassword && (
              <p className="text-rose-500 mt-2 text-sm">
                비밀번호는 영문, 숫자, 특수문자를 포함한 9-16자여야 합니다.
              </p>
            )}
          </div>

          {/* 새 비밀번호 확인 */}
          <div>
            <label className="block text-zinc-300 text-lg mb-2">
              새 비밀번호 확인
            </label>
            <div className="relative">
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className={`w-full p-3 bg-zinc-900 border-2 rounded-lg text-white transition-colors focus:outline-none
                  ${
                    !validations.passwordMatch && formData.confirmNewPassword
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-zinc-700 focus:border-cyan-500"
                  }`}
                required
                placeholder="새 비밀번호를 한번 더 입력해주세요"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmNewPassword(!showConfirmNewPassword)
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                {showConfirmNewPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
            {formData.confirmNewPassword && !validations.passwordMatch && (
              <p className="text-rose-500 mt-2 text-sm">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
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
                  isLoading ||
                  !validations.validNewPassword ||
                  !validations.passwordMatch
                    ? "bg-zinc-600 text-zinc-400 cursor-not-allowed"
                    : "bg-cyan-500 text-white hover:bg-cyan-600"
                }`}
              disabled={
                isLoading ||
                !validations.validNewPassword ||
                !validations.passwordMatch
              }
            >
              {isLoading ? "변경 중..." : "변경하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangePage;
