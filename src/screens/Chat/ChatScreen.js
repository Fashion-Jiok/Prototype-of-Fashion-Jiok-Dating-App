// D:\fashion-jiok\fashion-jiok\src\screens\Chat\ChatScreen.js

import React, { useState, useEffect } from 'react'; // ⭐️ useEffect 추가
import {
  View, Text, TextInput, TouchableOpacity, FlatList, Image,
  KeyboardAvoidingView, Platform, ActivityIndicator // ⭐️ ActivityIndicator 추가
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Send, Sparkles, Image as ImageIcon, Smile } from 'lucide-react-native';

// ⭐️ 1. 우리가 만든 API 함수를 import 합니다.
import { getAiSuggestions } from '../../services/api'; // ⚠️ 경로 확인! (src/services/api.js)

export default function ChatScreen({ navigation, route }) {
  const matchData = route?.params?.matchData || {
    // ⭐️ 2. 중요: 'otherUserId'가 필요합니다.
    // 이 ID는 상대방의 Firebase ID이며, MySQL DB의 StyleProfile 'userId'와 일치해야 합니다.
    // 지금은 테스트용 ID를 넣습니다.
    userId: "opponentUserId_Test", // 👈 (임시 테스트 ID, 실제 ID로 교체 필요)
    name: "지우",
    age: 26,
    image: "https://images.unsplash.com/photo-1696435552024-5fc45acf98c4",
    styleScore: 92
  };

  const [messages, setMessages] = useState([
    // ⭐️ 첫 대화 제안 기능을 테스트하기 위해, 초기 메시지를 비워둡니다.
  ]);

  const [inputText, setInputText] = useState('');

  // ⭐️ 3. AI 제안을 '상태'로 관리합니다.
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true); // 로딩 상태

  // ⭐️ 4. 화면이 처음 로드될 때 '첫 대화' 제안을 1회 요청합니다.
  useEffect(() => {
    fetchOpeningSuggestions();
  }, []); // 빈 배열: 컴포넌트 마운트 시 1회 실행

  const fetchOpeningSuggestions = async () => {
    setIsLoadingSuggestions(true);

    // ⭐️ 5. 백엔드 서버에 '상대방 ID'와 '빈 채팅 이력'을 보냅니다.
    const context = {
      otherUserId: matchData.userId, // 상대방 ID
      chatHistory: [] // 첫 대화이므로 빈 배열
    };

    const suggestions = await getAiSuggestions(context);

    setAiSuggestions(suggestions);
    setIsLoadingSuggestions(false);
  };

  const handleSend = (text) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const renderMessage = ({ item }) => (
    // ... (메시지 렌더링 UI는 기존과 동일) ...
    <View className={`flex-row mb-4 ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <View className={`max-w-[75%] ${item.sender === 'user' ? 'items-end' : 'items-start'}`}>
        {item.sender === 'user' ? (
          <LinearGradient
            colors={['#ec4899', '#9333ea']}
            className="rounded-2xl px-4 py-3"
          >
            <Text className="text-white text-sm">{item.text}</Text>
          </LinearGradient>
        ) : (
          <View className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
            <Text className="text-gray-900 text-sm">{item.text}</Text>
          </View>
        )}
        <Text className={`text-gray-400 text-xs mt-1 ${item.sender === 'user' ? 'text-right' : 'text-left'}`}>
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  // ⭐️ 6. AI 제안 블록 렌더링 로직 (로딩/성공 분기 처리)
  const renderAiSuggestions = () => {
    if (isLoadingSuggestions) {
      return (
        <View className="bg-purple-50 border border-purple-200 rounded-2xl p-4 mt-4 items-center justify-center h-24">
          <ActivityIndicator color="#a855f7" />
          <Text className="text-purple-700 mt-2 text-sm">AI가 대화를 제안 중입니다...</Text>
        </View>
      );
    }

    if (aiSuggestions.length === 0) {
      return null; // 제안이 없으면 표시 안 함
    }

    return (
      <View className="bg-purple-50 border border-purple-200 rounded-2xl p-4 mt-4">
        <View className="flex-row items-center gap-2 mb-3">
          <Sparkles color="#a855f7" size={16} />
          <Text className="text-purple-900 text-sm">AI 대화 제안</Text>
        </View>
        {aiSuggestions.map((suggestion, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handleSend(suggestion)}
            className="bg-white border border-purple-200 rounded-lg px-3 py-2 mb-2"
            activeOpacity={0.7}
          >
            <Text className="text-gray-700 text-sm">{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      {/* Header */}
      {/* ... (헤더 UI는 기존과 동일) ... */}
      <View className="bg-white border-b border-gray-200 p-4 pt-12">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>
          <Image
            source={{ uri: matchData.image }}
            className="w-10 h-10 rounded-full"
          />
          <View className="flex-1">
            <Text className="text-gray-900 font-medium">
              {matchData.name}, {matchData.age}
            </Text>
            <View className="flex-row items-center gap-1">
              <Sparkles color="#a855f7" size={12} />
              <Text className="text-purple-500 text-xs">
                {matchData.styleScore}% 스타일 매칭
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        className="flex-1 bg-gray-50 px-4"
        contentContainerStyle={{ paddingVertical: 16 }}
        ListFooterComponent={() => (
          // ⭐️ 7. 첫 대화일 때만(메시지가 없을 때) AI 제안을 렌더링합니다.
          messages.length === 0 ? renderAiSuggestions() : null
        )}
      />

      {/* Input */}
      <View className="bg-white border-t border-gray-200 p-4">
        {/* ... (기존 Input UI는 동일) ... */}
        <View className="flex-row items-center gap-2">
          <TouchableOpacity>
            <ImageIcon color="#9ca3af" size={24} />
          </TouchableOpacity>
          <View className="flex-1 bg-gray-100 border border-gray-200 rounded-full flex-row items-center px-4">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="메시지를 입력하세요..."
              placeholderTextColor="#9ca3af"
              className="flex-1 py-2 text-gray-900"
            />
            <TouchableOpacity>
              <Smile color="#9ca3af" size={20} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => handleSend()}
            disabled={!inputText.trim()}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={inputText.trim() ? ['#ec4899', '#9333ea'] : ['#e5e7eb', '#e5e7eb']}
              className="w-10 h-10 rounded-full items-center justify-center"
            >
              <Send color="white" size={20} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ⭐️ 8. 기능 2: "다음 대화 추천" (나중에 이 버튼에 fetchNextTopicSuggestions 함수를 연결합니다) */}
        {messages.length > 0 && (
          <TouchableOpacity
            // onPress={fetchNextTopicSuggestions} // 👈 나중에 이 함수를 구현
            className="mt-2 flex-row items-center gap-1"
          >
            <Sparkles color="#a855f7" size={12} />
            <Text className="text-purple-500 text-xs">AI 다음 대화 제안 보기</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}