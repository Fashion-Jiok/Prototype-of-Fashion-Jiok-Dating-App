// src/screens/Auth/OnboardingScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'shirt-outline',
    title: '패션으로\n시작하는 인연',
    description: '당신의 스타일이 말해주는\n특별한 첫인상',
  },
  {
    id: '2',
    icon: 'sparkles-outline',
    title: 'AI가 찾아주는\n완벽한 매칭',
    description: '라이프스타일과 취향을 분석해\n딱 맞는 사람을 추천해드려요',
  },
  {
    id: '3',
    icon: 'chatbubbles-outline',
    title: '자연스러운\n대화 시작',
    description: 'AI가 공통 관심사를 기반으로\n첫 대화를 도와드려요',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex });
      setCurrentIndex(nextIndex);
    } else {
      // 마지막 페이지에서 Login 화면으로 이동
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    // Skip 시에도 Login 화면으로 이동
    navigation.replace('Login');
  };

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={80} color="#000000" />
      </View>
      
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {currentIndex < SLIDES.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === SLIDES.length - 1 ? '시작하기' : '다음'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '400',
  },
  slide: {
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    fontWeight: '300',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 60,
    gap: 32,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e5e5e5',
  },
  dotActive: {
    backgroundColor: '#000000',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#000000',
    paddingVertical: 18,
    borderRadius: 2,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
});