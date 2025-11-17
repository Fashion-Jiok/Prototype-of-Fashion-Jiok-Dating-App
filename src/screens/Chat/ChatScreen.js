// D:\fashion-jiok\fashion-jiok\src\screens\Chat\ChatScreen.js

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, Image,
  KeyboardAvoidingView, Platform, ActivityIndicator, Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Send, Sparkles, Image as ImageIcon, Smile, X } from 'lucide-react-native';

import { getAiSuggestions } from '../../services/api';

export default function ChatScreen({ navigation, route }) {
  const matchData = route?.params?.matchData || {
    userId: "opponentUserId_Test",
    name: "지우",
    age: 26,
    image: "https://images.unsplash.com/photo-1696435552024-5fc45acf98c4",
    styleScore: 92
  };

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false); // 모달 표시 여부

  // ⭐️ 처음 화면 로드 시 자동 추천 (선택사항)
  useEffect(() => {
    fetchOpeningSuggestions();
  }, []);

  const fetchOpeningSuggestions = async () => {
    setIsLoadingSuggestions(true);

    const context = {
      otherUserId: matchData.userId,
      chatHistory: messages.length === 0 ? [] : messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        text: msg.text
      }))
    };

    const suggestions = await getAiSuggestions(context);

    setAiSuggestions(suggestions);
    setIsLoadingSuggestions(false);
  };

  // ⭐️ AI 추천 버튼을 누를 때 호출
  const handleRequestSuggestions = async () => {
    setShowSuggestionsModal(true);
    await fetchOpeningSuggestions();
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
    setShowSuggestionsModal(false); // 메시지 보내면 모달 닫기
  };

  const renderMessage = ({ item }) => (
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
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            className="rounded-2xl px-4 py-3"
          >
            <Text className="text-white text-sm">{item.text}</Text>
          </LinearGradient>
        )}
        <Text className={`text-white text-xs mt-1 ${item.sender === 'user' ? 'text-right' : 'text-left'}`}>
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  // ⭐️ 첫 화면에 표시되는 AI 제안 (메시지가 없을 때만)
  const renderInitialSuggestions = () => {
    if (messages.length > 0) return null; // 메시지가 있으면 표시 안 함

    if (isLoadingSuggestions) {
      return (
        <LinearGradient
          colors={['#a855f7', '#ec4899']}
          className="rounded-2xl p-4 mt-4 items-center justify-center h-24"
        >
          <ActivityIndicator color="#ffffff" />
          <Text className="text-white mt-2 text-sm">AI가 대화를 제안 중입니다...</Text>
        </LinearGradient>
      );
    }

    if (aiSuggestions.length === 0) {
      return null;
    }

    return (
      <LinearGradient
        colors={['#a855f7', '#ec4899']}
        className="rounded-2xl p-4 mt-4"
      >
        <View className="flex-row items-center gap-2 mb-3">
          <Sparkles color="#ffffff" size={16} />
          <Text className="text-white text-sm font-semibold">AI 대화 제안</Text>
        </View>
        {aiSuggestions.map((suggestion, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handleSend(suggestion)}
            className="bg-white/20 backdrop-blur rounded-lg px-3 py-2 mb-2"
            activeOpacity={0.7}
          >
            <Text className="text-white text-sm">{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </LinearGradient>
    );
  };

  // ⭐️ 모달로 표시되는 AI 추천
  const renderSuggestionsModal = () => (
    <Modal
      visible={showSuggestionsModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowSuggestionsModal(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <LinearGradient
          colors={['#a855f7', '#ec4899']}
          className="rounded-t-3xl p-6 min-h-[300px]"
        >
          {/* 헤더 */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2">
              <Sparkles color="#ffffff" size={20} />
              <Text className="text-white text-lg font-bold">AI 대화 추천</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setShowSuggestionsModal(false)}
              className="bg-white/20 rounded-full p-2"
            >
              <X color="#ffffff" size={20} />
            </TouchableOpacity>
          </View>

          {/* 로딩 또는 추천 목록 */}
          {isLoadingSuggestions ? (
            <View className="flex-1 items-center justify-center py-8">
              <ActivityIndicator color="#ffffff" size="large" />
              <Text className="text-white mt-4 text-sm">
                현재 대화 맥락을 분석 중입니다...
              </Text>
            </View>
          ) : aiSuggestions.length > 0 ? (
            <View className="gap-3">
              <Text className="text-white/80 text-sm mb-2">
                상황에 맞는 메시지를 선택하세요
              </Text>
              {aiSuggestions.map((suggestion, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleSend(suggestion)}
                  className="bg-white rounded-xl px-4 py-4"
                  activeOpacity={0.8}
                >
                  <Text className="text-gray-900 text-base">{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-white text-sm">
                추천을 생성할 수 없습니다
              </Text>
            </View>
          )}

          {/* 새로고침 버튼 */}
          {!isLoadingSuggestions && aiSuggestions.length > 0 && (
            <TouchableOpacity
              onPress={handleRequestSuggestions}
              className="mt-4 bg-white/20 rounded-xl py-3 items-center"
              activeOpacity={0.7}
            >
              <Text className="text-white font-semibold">🔄 다시 추천받기</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gradient-to-b from-purple-50 to-pink-50"
    >
      {/* Header */}
      <LinearGradient
        colors={['#ec4899', '#9333ea']}
        className="border-b border-white/20 p-4 pt-12"
      >
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="#ffffff" size={24} />
          </TouchableOpacity>
          <Image
            source={{ uri: matchData.image }}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <View className="flex-1">
            <Text className="text-white font-semibold text-base">
              {matchData.name}, {matchData.age}
            </Text>
            <View className="flex-row items-center gap-1">
              <Sparkles color="#ffffff" size={12} />
              <Text className="text-white/90 text-xs">
                {matchData.styleScore}% 스타일 매칭
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        className="flex-1 bg-gradient-to-b from-gray-900 to-gray-800 px-4"
        contentContainerStyle={{ paddingVertical: 16 }}
        ListFooterComponent={renderInitialSuggestions}
      />

      {/* Input */}
      <View className="bg-gray-900 border-t border-gray-700 p-4">
        <View className="flex-row items-center gap-2">
          {/* ⭐️ AI 추천 버튼 (Sparkles 아이콘) */}
          <TouchableOpacity 
            onPress={handleRequestSuggestions}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2"
            activeOpacity={0.8}
          >
            <Sparkles color="#ffffff" size={20} />
          </TouchableOpacity>

          <View className="flex-1 bg-gray-800 border border-gray-700 rounded-full flex-row items-center px-4">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="메시지를 입력하세요..."
              placeholderTextColor="#9ca3af"
              className="flex-1 py-2 text-white"
            />
            <TouchableOpacity>
              <Smile color="#ffffff" size={20} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => handleSend()}
            disabled={!inputText.trim()}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={inputText.trim() ? ['#ec4899', '#9333ea'] : ['#4b5563', '#4b5563']}
              className="w-10 h-10 rounded-full items-center justify-center"
            >
              <Send color="white" size={20} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* ⭐️ AI 추천 모달 */}
      {renderSuggestionsModal()}
    </KeyboardAvoidingView>
  );
}