import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

export default function ParentLogin() {
  const router = useRouter();
  const [lrn, setLrn] = useState('');
  const [password, setPassword] = useState('');
  const [fontsLoaded] = useFonts({
    'LeagueSpartan-Bold': require('../assets/fonts/LeagueSpartan-Bold.ttf'),
  });

  const handleLogin = () => {
    // TODO: Implement authentication logic
    // For now, just navigate to the main app
    router.replace('/ParentDashboard');
  };

  if (!fontsLoaded) return null;

  return (
    <ImageBackground
      source={require('../assets/images/bg.jpg')}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.13 }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.logoBox}>
          <Text style={[styles.logoMath, { fontFamily: 'LeagueSpartan-Bold' }]}>MATH</Text>
          <Text style={[styles.logoTatag, { fontFamily: 'LeagueSpartan-Bold' }]}>TATAG</Text>
        </View>
        <Text style={styles.title}>Login as Parent</Text>
        <TextInput
          style={styles.input}
          placeholder="LRN"
          placeholderTextColor="#444"
          value={lrn}
          onChangeText={setLrn}
          autoCapitalize="none"
          keyboardType="number-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#444"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const LOGO_WIDTH = width * 0.55;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  logoBox: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logoMath: {
    fontSize: LOGO_WIDTH / 7,
    fontWeight: '900',
    color: '#2ecc40',
    letterSpacing: 2,
    width: LOGO_WIDTH,
    textAlign: 'center',
    textShadowColor: 'rgba(40,40,40,0.32)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    marginBottom: -8,
  },
  logoTatag: {
    fontSize: LOGO_WIDTH / 8,
    fontWeight: '900',
    color: '#111',
    letterSpacing: 2,
    width: LOGO_WIDTH,
    textAlign: 'center',
    textShadowColor: 'rgba(40,40,40,0.32)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    marginTop: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: width * 0.8,
    height: 48,
    borderColor: '#888',
    borderWidth: 2,
    borderRadius: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.85)',
    fontSize: 17,
    color: '#222',
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: '#2ecc40',
    borderRadius: 30,
    paddingVertical: 16,
    width: width * 0.8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 