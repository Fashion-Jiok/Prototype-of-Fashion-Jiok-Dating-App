// D:\fashion-jiok\fashion-jiok\src\services\api.js

// ⚠️ 'localhost'는 시뮬레이터에서만 작동합니다.
// ⚠️ 실제 폰에서 테스트하려면 PC의 내부 IP 주소로 변경해야 합니다.
const SERVER_URL = 'http://172.30.1.89:3000/api/recommendation';

// =========================================================
// 🌟 [START] MOCK 데이터 정의 (테스트를 위해 임시로 추가됨)
// =========================================================
const MOCK_PROFILE = { 
    userId: 'guest_test', 
    name: 'MockUser',
    // 서버가 요구하는 필수 프로필 필드를 여기에 추가할 수 있습니다.
};

const MOCK_HISTORY = [
    { role: 'user', text: '재킷을 추천해 줄 수 있니?' },
    { role: 'model', text: '네, 고객님의 취향에 맞는 스타일로 찾아보겠습니다.' }
];
// =========================================================
// 🌟 [END] MOCK 데이터 정의
// =========================================================


/**
 * 🤖 Node.js 서버에 채팅 컨텍스트를 보내고 AI 추천 답변(배열)을 받아오는 함수
 * @param {object} chatContext - { otherUserId, chatHistory, userProfile } 등을 포함할 수 있음
 * @returns {Promise<Array<string>>} GPT가 생성한 추천 문구 배열
 */
export async function getAiSuggestions(chatContext = {}) {
    // ⭐️ Mock 데이터 적용 로직: chatContext에 필수 데이터가 없을 경우 Mock 데이터로 대체
    const contextToSend = { ...chatContext };

    // 1. userProfile이 없으면 Mock Profile 사용 (원래 오류의 원인)
    if (!contextToSend.userProfile) {
        console.warn("[MOCK] 'userProfile'이 누락되어 Mock 데이터를 사용합니다.");
        contextToSend.userProfile = MOCK_PROFILE;
    }

    // 2. chatHistory가 없거나 비어 있으면 Mock History 사용 (원래 오류의 원인)
    if (!contextToSend.chatHistory || contextToSend.chatHistory.length === 0) {
        console.warn("[MOCK] 'chatHistory'가 누락되어 Mock 데이터를 사용합니다.");
        contextToSend.chatHistory = MOCK_HISTORY;
    }
    
    // -------------------------------------------------------------
    
    console.log('[API] Sending context to server:', contextToSend);

    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contextToSend), // ⭐️ 수정된 contextToSend 사용
        });

        if (!response.ok) {
            // 서버에서 4xx, 5xx 응답을 보냈을 때
            const errorData = await response.json();
            throw new Error(errorData.error || `Server responded with status: ${response.status}`);
        }

        const data = await response.json();

        // ⭐️ 서버가 이제 { suggestions: [...] } 형태로 응답합니다.
        console.log('[API] Received suggestions:', data.suggestions);
        return data.suggestions || []; // suggestions 배열 반환, 없으면 빈 배열

    } catch (error) {
        console.error('Error calling recommendation API:', error);
        // ⭐️ 네트워크 오류나 JSON 파싱 오류 시
        return [`[API 호출 오류] ${error.message}`]; // 오류 발생 시 메시지 반환
    }
}
// ⭐️ 실제 구현이 완료되면 MOCK_PROFILE, MOCK_HISTORY 정의와
//    Mock 데이터 대체 로직을 반드시 제거하거나 주석 처리해야 합니다!