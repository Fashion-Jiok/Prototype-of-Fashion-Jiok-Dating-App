// server.js (수정된 버전 - suggestions 배열 반환)

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
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

// ⭐️ 4. Gemini AI 인스턴스 초기화
let genAI;
if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
} else {
    console.error('CRITICAL: GEMINI_API_KEY is missing. AI functionality disabled.');
}

const MODEL_NAME = "gemini-2.0-flash-exp";

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

        // ⭐️ 수정: 3개의 추천 문장을 요청하도록 프롬프트 변경
        const systemInstruction = `당신은 소개팅 어플을 사용하는 사용자의 전문적인 AI 어시스턴트입니다. 
사용자 프로필과 최근 채팅 이력을 참고하여, 사용자가 상대방에게 보낼 수 있는 3가지 자연스러운 대화 제안을 만들어주세요.

사용자 프로필: ${profileInfo}
채팅 이력:
${historyText}

위 정보를 바탕으로 사용자에게 추천할 3개의 짧은 메시지를 각 줄마다 하나씩 작성해주세요.
각 메시지는 한 문장으로 작성하고, 줄바꿈으로 구분해주세요.`;
        
        // 2. Gemini API 호출
        const model = genAI.getGenerativeModel({ 
            model: MODEL_NAME,
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 200,
            }
        });

        console.log('[GEMINI] Sending request to Gemini API...');
        
        const result = await model.generateContent(systemInstruction);
        const response = result.response;
        
        // 3. 응답 추출 및 배열로 변환
        const textContent = response.text();
        
        if (textContent && typeof textContent === 'string') {
            // ⭐️ 텍스트를 줄바꿈으로 분리하여 배열로 만듦
            const suggestions = textContent
                .trim()
                .split('\n')
                .filter(line => line.trim().length > 0) // 빈 줄 제거
                .map(line => line.replace(/^[-*\d.]\s*/, '').trim()) // 번호/불릿 제거
                .slice(0, 3); // 최대 3개만
            
            console.log('[GEMINI RESULT] Suggestions:', suggestions);
            
            // ⭐️ suggestions 배열로 응답 (api.js와 호환)
            res.json({ suggestions });
        } else {
            console.error('[GEMINI ERROR] Invalid response structure:', response);
            throw new Error("Gemini API에서 유효한 텍스트 응답을 받지 못했습니다.");
        }

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