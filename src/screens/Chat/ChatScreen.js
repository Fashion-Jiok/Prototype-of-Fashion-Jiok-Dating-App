import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Send, Sparkles, Image as ImageIcon, Smile } from 'lucide-react-native';

export default function ChatScreen({ navigation, route }) {
  const matchData = route?.params?.matchData || {
    name: "지우",
    age: 26,
    image: "https://images.unsplash.com/photo-1696435552024-5fc45acf98c4",
    styleScore: 92
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "안녕하세요! 매칭되어서 반가워요 😊",
      sender: 'other',
      timestamp: "10:32"
    },
    {
      id: 2,
      text: "안녕하세요! 프로필 보니까 스타일이 정말 마음에 드네요",
      sender: 'user',
      timestamp: "10:35"
    },
    {
      id: 3,
      text: "감사합니다! 패션에 관심이 많으시군요?",
      sender: 'other',
      timestamp: "10:36"
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [showAISuggestions, setShowAISuggestions] = useState(true);

  const aiSuggestions = [
    "그 사진 스타일 너무 좋네요!",
    "어떤 브랜드를 주로 좋아하세요?",
    "최근에 간 전시회 추천해주실 수 있나요?",
  ];

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
    setShowAISuggestions(false);
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

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      {/* Header */}
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
          showAISuggestions ? (
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
          ) : null
        )}
      />

      {/* Input */}
      <View className="bg-white border-t border-gray-200 p-4">
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

        {!showAISuggestions && (
          <TouchableOpacity
            onPress={() => setShowAISuggestions(true)}
            className="mt-2 flex-row items-center gap-1"
          >
            <Sparkles color="#a855f7" size={12} />
            <Text className="text-purple-500 text-xs">AI 대화 제안 보기</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}