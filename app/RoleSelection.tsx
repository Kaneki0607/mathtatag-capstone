import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function RoleSelection() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/images/bg.jpg')}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.13 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login as</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/TeacherLogin' as any)}
        >
          <Text style={styles.buttonText}>Teacher</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/ParentLogin' as any)}
        >
          <Text style={styles.buttonText}>Parent</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 15,
    color: '#222',
    textAlign: 'center',
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
  },
  button: {
    backgroundColor: '#2ecc40',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 60,
    marginVertical: 14,
    width: width * 0.75,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 