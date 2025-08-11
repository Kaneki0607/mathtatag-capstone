import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useDynamicAssessment } from '../hooks/useDynamicAssessment';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Boy positioning and size (bigger, centered, slightly up)
const boyImage = require('../assets/ElementsGame1/boy.png');
const BOY_WIDTH = 280;
const BOY_HEIGHT = 400;
const boyX = SCREEN_WIDTH / 2 - BOY_WIDTH / 2;
const boyY = SCREEN_HEIGHT - BOY_HEIGHT - 80;
// Hand anchor: visually at the right hand grip
const handAnchor = { x: SCREEN_WIDTH / 2 + 62, y: boyY + 160 };

// Balloon images (b1-b10.png)
const balloonPNGs = [
  require('../assets/ElementsGame1/b1.png'),
  require('../assets/ElementsGame1/b2.png'),
  require('../assets/ElementsGame1/b3.png'),
  require('../assets/ElementsGame1/b4.png'),
  require('../assets/ElementsGame1/b5.png'),
  require('../assets/ElementsGame1/b6.png'),
  require('../assets/ElementsGame1/b7.png'),
  require('../assets/ElementsGame1/b8.png'),
  require('../assets/ElementsGame1/b9.png'),
  require('../assets/ElementsGame1/b10.png'),
];

// Balloons: bigger and cluster above hand
const BALLOON_SIZE = 160;

// Cluster directly above boy's head, tightly grouped, clearly held
const balloonClusterPositions = [
  { x: 0, y: -210, scale: 1.18, z: 6 },
  { x: -38, y: -210, scale: 1.18, z: 5 },
  { x: 38, y: -210, scale: 1.18, z: 5 },
  { x: -60, y: -170, scale: 1.18, z: 4 },
  { x: 60, y: -170, scale: 1.18, z: 4 },
  { x: -30, y: -140, scale: 1.10, z: 4 },
  { x: 30, y: -140, scale: 1.18, z: 4 },
  { x: -38, y: -100, scale: 1.10, z: 3 },
  { x: 38, y: -100, scale: 1.18, z: 3 },
  { x: 0, y: -170, scale: 1.18, z: 7 },
];

interface Game1Props {
  onComplete: (result: { correct: boolean }) => void;
}

export default function Game1({ onComplete }: Game1Props) {
  // Use dynamic assessment hook
  const { currentQuestion, loading: assessmentLoading, error: assessmentError } = useDynamicAssessment('Game1');
  
  const [poppedBalloons, setPoppedBalloons] = useState<number[]>([]);
  const [showQuestion, setShowQuestion] = useState(false);
  const [flashColor, setFlashColor] = useState<null | 'red' | 'green'>(null);
  const [boyFlying, setBoyFlying] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isWrong, setIsWrong] = useState(false);

  // Get dynamic values from current question
  const totalBalloons = currentQuestion?.totalItems || 10;
  const balloonsToPop = currentQuestion?.itemsToRemove || 5;

  // Animations
  const balloonAnims = useRef(Array.from({ length: totalBalloons }, () => new Animated.Value(1))).current;
  const floatAnims = useRef(Array.from({ length: totalBalloons }, () => new Animated.Value(0))).current;
  const boyAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef(Array.from({ length: totalBalloons }, () => new Animated.Value(1))).current;

  // Start floating animations
  useEffect(() => {
    floatAnims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000 + i * 150,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 2000 + i * 150,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [totalBalloons]);

  // Handle balloon pop
  const handleBalloonPop = (balloonIndex: number) => {
    if (poppedBalloons.includes(balloonIndex) || boyFlying) return;

    // Animate balloon pop
    Animated.timing(balloonAnims[balloonIndex], {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Add to popped balloons
    const newPoppedBalloons = [...poppedBalloons, balloonIndex];
    setPoppedBalloons(newPoppedBalloons);

    // Check if all balloons are popped
    if (newPoppedBalloons.length >= balloonsToPop) {
      setTimeout(() => {
        setShowQuestion(true);
      }, 800);
    }
  };

  // Handle answer selection
  const handleAnswer = (selectedAnswer: number) => {
    if (!currentQuestion) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setScore(isCorrect ? 1 : 0);
    setIsWrong(!isCorrect);
    setFlashColor(isCorrect ? 'green' : 'red');
    
    setTimeout(() => {
      setFlashColor(null);
      if (isCorrect) {
        makeBoyFlyAway();
      } else {
        setGameCompleted(true);
      }
    }, 1000);
  };

  // Make boy fly away on correct answer
  const makeBoyFlyAway = () => {
    setBoyFlying(true);
    Animated.timing(boyAnim, {
      toValue: -SCREEN_HEIGHT * 0.6,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      setGameCompleted(true);
    });
  };

  // Render balloons
  const renderBalloons = () => (
    <View style={{ position: 'absolute', left: handAnchor.x, top: handAnchor.y, zIndex: 10 }}>
      {Array.from({ length: totalBalloons }, (_, i) => {
        if (poppedBalloons.includes(i)) return null;
        
        const position = balloonClusterPositions[i] || balloonClusterPositions[0];
        const floatAnim = floatAnims[i]?.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8],
        }) || 0;
        
        const handlePressIn = () => {
          Animated.timing(scaleAnims[i], {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true,
          }).start();
        };
        
        const handlePressOut = () => {
          Animated.timing(scaleAnims[i], {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }).start();
        };

        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              left: position.x - BALLOON_SIZE / 2,
              top: position.y - BALLOON_SIZE / 2,
              zIndex: position.z,
              opacity: balloonAnims[i],
              transform: [
                { translateY: floatAnim },
                { scale: scaleAnims[i] },
              ],
            }}
          >
            <TouchableOpacity
              onPress={() => handleBalloonPop(i)}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.8}
              disabled={boyFlying}
            >
              <Image
                source={balloonPNGs[i % balloonPNGs.length]}
                style={{
                  width: BALLOON_SIZE * position.scale,
                  height: BALLOON_SIZE * position.scale,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );

  // Render balloon strings
  const renderBalloonStrings = () => (
    <Svg style={{ position: 'absolute', left: handAnchor.x, top: handAnchor.y, zIndex: 5, width: 200, height: 300 }}>
      {Array.from({ length: totalBalloons }, (_, i) => {
        if (poppedBalloons.includes(i)) return null;
        
        const position = balloonClusterPositions[i] || balloonClusterPositions[0];
        const stringLength = Math.abs(position.y) + 20;
        
        return (
          <Path
            key={`string-${i}`}
            d={`M 0 0 L 0 ${stringLength}`}
            stroke="#8B4513"
            strokeWidth="2"
            fill="none"
            opacity={balloonAnims[i]}
          />
        );
      })}
    </Svg>
  );

  // Render question UI
  const renderQuestion = () => {
    if (!currentQuestion) return null;
    
    return (
      <View style={styles.questionCard}>
        <Text style={styles.questionTitle}>{currentQuestion.question}</Text>
        <Text style={styles.vocabularyText}>
          {currentQuestion.equation}
        </Text>
        <View style={styles.answerOptions}>
          {currentQuestion.options.map((option: number) => (
            <TouchableOpacity
              key={option}
              style={styles.answerButton}
              onPress={() => handleAnswer(option)}
              disabled={boyFlying}
            >
              <Text style={styles.answerButtonText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // Render completion screen
  const renderCompletion = () => (
    <View style={styles.completionCard}>
      {score > 0 ? (
        <>
          <Text style={styles.completionTitle}>🎉 Congratulations!</Text>
          <Text style={styles.completionText}>You solved the subtraction problem correctly!</Text>
        </>
      ) : (
        <>
          <Text style={styles.completionTitle}>Good Try!</Text>
          <Text style={styles.completionText}>
            The correct answer was {currentQuestion?.correctAnswer} balloons remaining.
          </Text>
        </>
      )}
      <TouchableOpacity style={styles.finishButton} onPress={() => onComplete({ correct: score > 0 })}>
        <Text style={styles.finishButtonText}>Back to Map</Text>
      </TouchableOpacity>
    </View>
  );

  // Show loading if assessment is loading
  if (assessmentLoading) {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/ElementsGame1/bg1.png')} style={styles.backgroundImage} resizeMode="cover" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading game...</Text>
        </View>
      </View>
    );
  }

  // Show error if assessment failed to load
  if (assessmentError || !currentQuestion) {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/ElementsGame1/bg1.png')} style={styles.backgroundImage} resizeMode="cover" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load game. Please try again.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/ElementsGame1/bg1.png')} style={styles.backgroundImage} resizeMode="cover" />
      <View style={styles.gameUI}>
        <Text style={styles.gameTitle}>Balloons in the Sky</Text>
        <Text style={styles.gameInstruction}>{currentQuestion.instruction}</Text>
        <Text style={styles.gameStory}>{currentQuestion.story}</Text>
        <Text style={styles.progressText}>Popped: {poppedBalloons.length} / {balloonsToPop}</Text>
      </View>
      {renderBalloonStrings()}
      {renderBalloons()}
      <Animated.Image source={boyImage} style={[styles.boyImage, boyFlying && { transform: [{ translateY: boyAnim }] }]} resizeMode="contain" />
      {showQuestion && !gameCompleted && renderQuestion()}
      {gameCompleted && renderCompletion()}
      {flashColor && (
        <View style={[styles.flashOverlay, { backgroundColor: flashColor === 'red' ? 'rgba(255,0,0,0.4)' : 'rgba(0,255,0,0.4)' }]} pointerEvents="none" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  loadingText: {
    fontSize: 18,
    color: '#3498db',
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  gameUI: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    zIndex: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  gameTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 8,
    textAlign: 'center',
  },
  gameInstruction: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  gameStory: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e67e22',
  },
  boyImage: {
    position: 'absolute',
    left: boyX,
    top: boyY,
    width: BOY_WIDTH,
    height: BOY_HEIGHT,
    zIndex: 1,
  },
  questionCard: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.3,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    zIndex: 200,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  vocabularyText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 25,
    textAlign: 'center',
  },
  answerOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  answerButton: {
    backgroundColor: '#3498db',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 25,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  answerButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  completionCard: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.3,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    zIndex: 200,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 15,
    textAlign: 'center',
  },
  completionText: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 25,
    textAlign: 'center',
  },
  finishButton: {
    backgroundColor: '#3498db',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 300,
  },
}); 