// server.js (MySQL 연동 테스트 코드 추가 버전)

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import mysql from 'mysql2/promise'; // ⭐️ 1. MySQL 모듈 추가

dotenv.config();

// ⭐️ 2. MySQL 접속 정보 설정 (실제 DB 정보로 변경하세요!)
const dbConfig = {
    host: 'localhost', // MySQL 서버 주소
    user: 'root', // 실제 사용자명으로 변경
    password: '0000', // 실제 비밀번호로 변경
    database: 'fashionjiok_db' // 실제 DB 이름으로 변경
};

// ⭐️ 3. DB 연결 테스트 함수
async function testDbConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ MySQL: 데이터베이스 연결 성공!');
        await connection.end(); // 테스트 후 연결 종료
    } catch (error) {
        console.error('❌ MySQL: 데이터베이스 연결 실패:', error.message);
        // DB 연결 실패 시에도 서버는 계속 구동되도록 throw하지 않습니다.
    }
}

// ⭐️ 4. 서버 실행 전에 DB 연결 테스트 실행
testDbConnection();


const app = express();
const port = 3000;

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());

// OpenAI 인스턴스 초기화
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/recommendation', async (req, res) => {
    // ⭐️ [디버그 코드] 요청 데이터 확인
    console.log('--- Received Request Body ---');
    console.log(req.body);
    console.log('-----------------------------');

    const { userProfile, chatHistory } = req.body; 

    if (!userProfile || !chatHistory) {
        console.error('Error: Missing userProfile or chatHistory in request.'); 
        return res.status(400).json({ error: 'User profile and chat history are required.' });
    }

    try {
        // 1. GPT에게 전달할 시스템 및 사용자 프롬프트 구성
        const profileInfo = JSON.stringify(userProfile);
        const historyText = chatHistory
            .map(msg => `${msg.sender || 'user'}: ${msg.text}`) 
            .join('\n');

        const systemPrompt = `당신은 사용자의 쇼핑몰 채팅 상담을 돕는 친절하고 전문적인 AI 어시스턴트입니다. 
                              사용자 프로필과 최근 채팅 이력을 참고하여, 사용자의 다음 행동에 대한 최적의 응답을 '짧고' 자연스러운 문장 하나로 추천해주세요.
                              사용자 프로필: ${profileInfo}
                              채팅 이력: ${historyText}`;
        
        // 2. OpenAI API 호출
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: "현재 상황을 고려했을 때, 내가 사용자에게 해줄 수 있는 가장 좋은 추천 답변은 무엇인가요?" }
            ],
            temperature: 0.7, 
            max_tokens: 100,
        });

        // 3. 응답 추출
        const recommendedReply = response.choices[0].message.content.trim();

        console.log(`[GPT RESULT] Recommended Reply: ${recommendedReply}`);
        res.json({ reply: recommendedReply });

    } catch (error) {
        console.error('Error processing recommendation request (GPT Call Failed):', error.message);
        res.status(500).json({ error: 'Failed to get recommendation from AI service.' });
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`✅ Backend server listening at http://localhost:${port}`);
    console.log(`API Endpoint: http://localhost:${port}/api/recommendation`);
});