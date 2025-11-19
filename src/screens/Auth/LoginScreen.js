import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('phone');

  const handleSendCode = () => {
    if (phone.length >= 10) {
      setStep('code');
    }
  };

  const handleVerifyCode = () => {
    if (code.length === 6) {
      // 인증 완료 -> Main 화면으로 바로 이동
      navigation.replace('Main');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#09090b', '#18181b', '#000000']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo & Title */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#ec4899', '#9333ea']}
                style={styles.logo}
              >
                <Text style={styles.logoEmoji}>💞</Text>
              </LinearGradient>
            </View>
            
            <Text style={styles.title}>Fashion Jiok</Text>
            <Text style={styles.subtitle}>
              패션과 라이프스타일로 만나는{'\n'}새로운 인연
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {step === 'phone' ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>전화번호</Text>
                  <TextInput
                    placeholder="010-0000-0000"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    style={styles.input}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleSendCode}
                  disabled={phone.length < 10}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={phone.length >= 10 ? ['#ec4899', '#9333ea'] : ['#3f3f46', '#3f3f46']}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>인증번호 받기</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>인증번호</Text>
                  <TextInput
                    placeholder="6자리 인증번호"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={code}
                    onChangeText={setCode}
                    style={[styles.input, styles.codeInput]}
                  />
                  <Text style={styles.hint}>
                    {phone}로 인증번호를 전송했습니다
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleVerifyCode}
                  disabled={code.length !== 6}
                  activeOpacity={0.8}
                  style={styles.buttonMargin}
                >
                  <LinearGradient
                    colors={code.length === 6 ? ['#ec4899', '#9333ea'] : ['#3f3f46', '#3f3f46']}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>확인</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setStep('phone')}
                  style={styles.backButton}
                  activeOpacity={0.6}
                >
                  <Text style={styles.backButtonText}>번호 다시 입력</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Terms */}
          <View style={styles.terms}>
            <Text style={styles.termsText}>
              가입하면 Fashion Jiok의{'\n'}이용약관 및 개인정보 처리방침에 동의하게 됩니다
            </Text>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 32,
  },
  title: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    height: 48,
  },
  codeInput: {
    textAlign: 'center',
    letterSpacing: 4,
  },
  hint: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginTop: 8,
  },
  button: {
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonMargin: {
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 12,
  },
  backButtonText: {
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  terms: {
    marginTop: 48,
  },
  termsText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textAlign: 'center',
  },
});