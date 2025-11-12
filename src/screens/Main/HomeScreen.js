import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1483985988355-763728e1935b' }}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,1)']}
          style={styles.gradient}
        >
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              
              {/* Header */}
              <View>
                <Text style={styles.title}>Fashion Jiok</Text>
                <View style={styles.divider} />
              </View>

              {/* Content */}
              <View style={styles.mainContent}>
                <Text style={styles.heading}>
                  AI 패션 · 라이프스타일 기반{'\n'}매칭 소개팅 앱
                </Text>
                
                <Text style={styles.description}>
                  사용자의 패션 스타일과 라이프스타일 특성을 AI로 정밀하게 분석하여 
                  개인의 취향과 조화를 이루는 이성을 매칭합니다.
                </Text>

                {/* Features */}
                <View style={styles.features}>
                  <FeatureCard icon="✨" title="AI 스타일 분석" />
                  <FeatureCard icon="💕" title="패션 기반 매칭" />
                  <FeatureCard icon="💬" title="자연스러운 대화 시작" />
                </View>

                {/* CTA Buttons */}
                <View style={styles.buttons}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Chat')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.primaryButton}>
                      <Text style={styles.primaryButtonText}>시작하기</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {}}
                    activeOpacity={0.8}
                  >
                    <View style={styles.secondaryButton}>
                      <Text style={styles.secondaryButtonText}>내 프로필</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

function FeatureCard({ icon, title }) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    maxWidth: 448,
  },
  mainContent: {
    maxWidth: 672,
  },
  heading: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 20,
    marginBottom: 16,
  },
  description: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 32,
    maxWidth: 448,
  },
  features: {
    gap: 16,
    marginBottom: 48,
  },
  featureCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  buttons: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});