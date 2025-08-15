import React, { useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import { userAPI } from '../../utils/api';
import { fakeApi } from '../../utils/fakeApi';

interface NicknameChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNickname?: string;
}

const NicknameChangeModal: React.FC<NicknameChangeModalProps> = ({
  isOpen,
  onClose,
  currentNickname = '',
}) => {
  const [newNickname, setNewNickname] = useState(currentNickname || '사용자');
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useAuth();

  // 모달이 열릴 때마다 현재 닉네임으로 초기화
  React.useEffect(() => {
    if (isOpen) {
      setNewNickname(currentNickname || '사용자');
    }
  }, [isOpen, currentNickname]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newNickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (newNickname.trim() === currentNickname) {
      alert('현재 닉네임과 동일합니다.');
      return;
    }

    // 닉네임 길이 체크
    if (newNickname.trim().length < 2) {
      alert('닉네임은 최소 2자 이상 입력해주세요.');
      return;
    }

    if (newNickname.trim().length > 20) {
      alert('닉네임은 최대 20자까지 입력 가능합니다.');
      return;
    }

    // 특수문자 체크 (한글, 영문, 숫자만 허용)
    const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;
    if (!nicknameRegex.test(newNickname.trim())) {
      alert('닉네임은 한글, 영문, 숫자만 사용 가능합니다.');
      return;
    }

    setIsLoading(true);

    try {
      // 로그인 방식에 따라 API 선택
      const isTestLogin = localStorage.getItem('isTestLogin') === 'true';

      let response;
      if (isTestLogin) {
        // 테스트 로그인인 경우 fakeApi 사용
        fakeApi.setTestMode(true);
        const result = await fakeApi.updateNickname({
          nickname: newNickname.trim(),
        });
        response = { message: result };
      } else {
        // 실제 구글 로그인인 경우 백엔드 API 사용
        response = await userAPI.updateNickname({
          nickname: newNickname.trim(),
        });
      }

      console.log('API 응답:', response);
      console.log('응답 타입:', typeof response.data, response.data);

      if (response.data || response.message) {
        // AuthContext 업데이트
        updateUser({ nickname: newNickname.trim() });

        // 성공 메시지 표시
        let successMessage = '닉네임이 성공적으로 변경되었습니다!';

        if (response.message) {
          successMessage = response.message;
          console.log('fakeApi 응답 사용:', successMessage);
        } else if (response.data && typeof response.data === 'string') {
          // API 명세서에 따른 문자열 응답 처리
          successMessage = response.data;
          console.log('백엔드 API 응답 사용:', successMessage);
        } else if (response.data) {
          // 기타 데이터 타입 처리
          successMessage = String(response.data);
          console.log('기타 데이터 타입 처리:', successMessage);
        }

        console.log('최종 성공 메시지:', successMessage);
        alert(successMessage);
        onClose();
      } else if (response.error) {
        // API 에러 응답 처리
        console.error('API 에러:', response.error);
        throw new Error(response.error);
      } else {
        console.error('응답 구조:', response);
        throw new Error('닉네임 변경에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('닉네임 변경 에러:', error);

      // 백엔드에서 중복 에러를 보내는 경우
      if (error.response?.status === 409) {
        alert('이미 사용 중인 닉네임입니다. 다른 닉네임을 선택해주세요.');
      } else if (error.response?.status === 400) {
        // 백엔드에서 유효성 검사 실패 시
        const errorMessage =
          error.response?.data?.message || '닉네임 형식이 올바르지 않습니다.';
        alert(errorMessage);
      } else if (error.response?.status === 401) {
        alert('로그인이 필요합니다. 다시 로그인해주세요.');
      } else {
        alert('닉네임 변경에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNewNickname(currentNickname);
    onClose();
  };

  // 실시간 유효성 체크 함수
  const getValidationStatus = () => {
    const trimmed = newNickname.trim();
    if (!trimmed) return { isValid: false, message: '' };

    const lengthValid = trimmed.length >= 2 && trimmed.length <= 20;
    const formatValid = /^[가-힣a-zA-Z0-9]+$/.test(trimmed);
    const isDuplicate = trimmed === currentNickname;

    return {
      isValid: lengthValid && formatValid && !isDuplicate,
      lengthValid,
      formatValid,
      isDuplicate,
    };
  };

  const validation = getValidationStatus();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl w-[90%] max-w-[387px] p-6">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">닉네임 변경</h2>
          <p className="text-sm text-gray-600 mt-2">
            새로운 닉네임을 입력해주세요
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 현재 닉네임 표시 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 닉네임
            </label>
            <p className="text-gray-900 font-medium">
              {currentNickname || '사용자'}
            </p>
          </div>

          {/* 새 닉네임 입력 */}
          <div>
            <label
              htmlFor="newNickname"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              새 닉네임
            </label>
            <input
              type="text"
              id="newNickname"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              placeholder="새로운 닉네임을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              maxLength={20}
              disabled={isLoading}
            />
          </div>

          {/* 버튼 그룹 */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading || !validation.isValid}
              className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  변경 중...
                </div>
              ) : (
                '변경하기'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NicknameChangeModal;
