// server.js (수정된 버전 - 올바른 Gemini API 사용)

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai'; // ⭐️ 올바른 패키지명
import mysql from 'mysql2/promise'; 

dotenv.config();

// ⭐️ 1. MySQL 접속 정보 설정
const dbConfig = {
    host: 'localhost', 
    user: 'root',
    password: '0000',
    database: 'fashionjiok_db'
};

// ⭐️ 2. DB 연결 테스트 함수
async function testDbConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ MySQL: 데이터베이스 연결 성공!');
        await connection.end();
    } catch (error) {
        console.error('❌ MySQL: 데이터베이스 연결 실패:', error.message);
    }
}

testDbConnection();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// ⭐️ 3. API 키 확인
const apiKey = process.env.GEMINI_API_KEY;
console.log('--- API Key Status ---');
console.log('Loaded API Key:', apiKey ? 'Yes - Key Found' : '❌ No - Key Missing');
if (apiKey) {
    console.log('Key Snippet:', apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 4));
}
console.log('------------------------');

// ⭐️ 4. Gemini AI 인스턴스 초기화 (올바른 방식)
let genAI;
if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
} else {
    console.error('CRITICAL: GEMINI_API_KEY is missing. AI functionality disabled.');
}

const MODEL_NAME = "gemini-2.0-flash-exp"; // 또는 "gemini-1.5-flash"

app.post('/api/recommendation', async (req, res) => {
    console.log('--- Received Request Body ---');
    console.log(req.body);
    console.log('-----------------------------');

    const { userProfile, chatHistory } = req.body; 

    if (!userProfile || !chatHistory) {
        console.error('Error: Missing userProfile or chatHistory in request.'); 
        return res.status(400).json({ error: 'User profile and chat history are required.' });
    }

    try {
        // 1. 프롬프트 구성
        const profileInfo = JSON.stringify(userProfile);
        const historyText = chatHistory
            .map(msg => `${msg.role || 'user'}: ${msg.text}`) 
            .join('\n');

        const systemInstruction = `당신은 사용자의 쇼핑몰 채팅 상담을 돕는 친절하고 전문적인 AI 어시스턴트입니다. 
사용자 프로필과 최근 채팅 이력을 참고하여, 사용자의 다음 행동에 대한 최적의 응답을 '짧고' 자연스러운 문장 하나로 추천해주세요.

사용자 프로필: ${profileInfo}
채팅 이력:
${historyText}

위 정보를 바탕으로 사용자에게 해줄 수 있는 가장 좋은 추천 답변을 한 문장으로 작성해주세요.`;
        
        // 2. ⭐️ 올바른 Gemini API 호출 방식
        const model = genAI.getGenerativeModel({ 
            model: MODEL_NAME,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 100,
            }
        });

        console.log('[GEMINI] Sending request to Gemini API...');
        
        const result = await model.generateContent(systemInstruction);
        const response = result.response;
        
        // 3. ⭐️ 올바른 응답 추출 방식
        let recommendedReply;
        
        // response.text()는 함수입니다!
        const textContent = response.text();
        
        if (textContent && typeof textContent === 'string') {
            recommendedReply = textContent.trim();
            console.log('[GEMINI RESULT] Recommended Reply:', recommendedReply);
        } else {
            console.error('[GEMINI ERROR] Invalid response structure:', response);
            throw new Error("Gemini API에서 유효한 텍스트 응답을 받지 못했습니다.");
        }
        
        res.json({ reply: recommendedReply });

    } catch (error) {
        console.error('Error processing recommendation request:', error.message);
        console.error('Full error:', error);
        res.status(500).json({ 
            error: 'Failed to get recommendation from AI service.',
            details: error.message 
        });
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`✅ Backend server listening at http://localhost:${port}`);
    console.log(`API Endpoint: http://localhost:${port}/api/recommendation`);
});