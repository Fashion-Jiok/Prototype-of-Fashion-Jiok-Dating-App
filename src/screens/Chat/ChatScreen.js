// src/screens/Chat/ChatScreen.js

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, Image,
  KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Send, Sparkles, Image as ImageIcon, Smile } from 'lucide-react-native';

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
  const [showAISuggestions, setShowAISuggestions] = useState(true);

  // 처음 화면 로드 시 자동 추천
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
    <View style={{ 
      flexDirection: 'row', 
      marginBottom: 16, 
      justifyContent: item.sender === 'user' ? 'flex-end' : 'flex-start' 
    }}>
      <View style={{ 
        maxWidth: '75%', 
        alignItems: item.sender === 'user' ? 'flex-end' : 'flex-start' 
      }}>
        {item.sender === 'user' ? (
          <LinearGradient
            colors={['#ec4899', '#9333ea']}
            style={{ borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 }}
          >
            <Text style={{ color: '#ffffff', fontSize: 14 }}>{item.text}</Text>
          </LinearGradient>
        ) : (
          <View style={{ 
            backgroundColor: '#ffffff', 
            borderWidth: 1, 
            borderColor: '#e5e7eb', 
            borderRadius: 16, 
            paddingHorizontal: 16, 
            paddingVertical: 12 
          }}>
            <Text style={{ color: '#111827', fontSize: 14 }}>{item.text}</Text>
          </View>
        )}
        <Text style={{ 
          color: '#9ca3af', 
          fontSize: 12, 
          marginTop: 4, 
          textAlign: item.sender === 'user' ? 'right' : 'left' 
        }}>
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  const renderAISuggestions = () => {
    if (!showAISuggestions) return null;
    if (messages.length > 0) return null; // 메시지가 있으면 표시 안 함

    if (isLoadingSuggestions) {
      return (
        <View style={{ 
          backgroundColor: '#faf5ff', 
          borderWidth: 1, 
          borderColor: '#e9d5ff', 
          borderRadius: 16, 
          padding: 16, 
          marginTop: 16,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 100
        }}>
          <ActivityIndicator color="#a855f7" />
          <Text style={{ color: '#7c3aed', fontSize: 14, marginTop: 8 }}>
            AI가 대화를 제안 중입니다...
          </Text>
        </View>
      );
    }

    if (aiSuggestions.length === 0) {
      return null;
    }

    return (
      <View style={{ 
        backgroundColor: '#faf5ff', 
        borderWidth: 1, 
        borderColor: '#e9d5ff', 
        borderRadius: 16, 
        padding: 16, 
        marginTop: 16 
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Sparkles color="#a855f7" size={16} />
          <Text style={{ color: '#6b21a8', fontSize: 14 }}>AI 대화 제안</Text>
        </View>
        {aiSuggestions.map((suggestion, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handleSend(suggestion)}
            style={{ 
              backgroundColor: '#ffffff', 
              borderWidth: 1, 
              borderColor: '#e9d5ff', 
              borderRadius: 8, 
              paddingHorizontal: 12, 
              paddingVertical: 8, 
              marginBottom: 8 
            }}
            activeOpacity={0.7}
          >
            <Text style={{ color: '#374151', fontSize: 14 }}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={fetchOpeningSuggestions}
          style={{ marginTop: 4, alignSelf: 'center' }}
          activeOpacity={0.7}
        >
          <Text style={{ color: '#a855f7', fontSize: 12 }}>🔄 다시 추천받기</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#ffffff' }}
    >
      {/* Header */}
      <View style={{ 
        backgroundColor: '#ffffff', 
        borderBottomWidth: 1, 
        borderBottomColor: '#e5e7eb', 
        padding: 16, 
        paddingTop: 48 
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="#000000" size={24} />
          </TouchableOpacity>
          
          <Image
            source={{ uri: matchData.image }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
          
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#111827', fontWeight: '500', fontSize: 16 }}>
              {matchData.name}, {matchData.age}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Sparkles color="#a855f7" size={12} />
              <Text style={{ color: '#a855f7', fontSize: 12 }}>
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
        style={{ flex: 1, backgroundColor: '#f9fafb' }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
        ListFooterComponent={renderAISuggestions}
      />

      {/* Input */}
      <View style={{ 
        backgroundColor: '#ffffff', 
        borderTopWidth: 1, 
        borderTopColor: '#e5e7eb', 
        padding: 16 
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity>
            <ImageIcon color="#9ca3af" size={24} />
          </TouchableOpacity>
          
          <View style={{ 
            flex: 1, 
            backgroundColor: '#f3f4f6', 
            borderWidth: 1, 
            borderColor: '#e5e7eb', 
            borderRadius: 20, 
            flexDirection: 'row', 
            alignItems: 'center', 
            paddingHorizontal: 16 
          }}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="메시지를 입력하세요..."
              placeholderTextColor="#9ca3af"
              style={{ flex: 1, paddingVertical: 8, color: '#111827' }}
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
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20, 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <Send color="white" size={20} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {!showAISuggestions && messages.length > 0 && (
          <TouchableOpacity
            onPress={() => setShowAISuggestions(true)}
            style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}
          >
            <Sparkles color="#a855f7" size={12} />
            <Text style={{ color: '#a855f7', fontSize: 12 }}>AI 대화 제안 보기</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
