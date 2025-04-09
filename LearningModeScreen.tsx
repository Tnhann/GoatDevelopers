import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Mock data for demonstration
const mockWords = [
  {
    id: '1',
    word: 'Ubiquitous',
    definition: 'Present, appearing, or found everywhere',
    example: 'Mobile phones are ubiquitous in modern society',
  },
  {
    id: '2',
    word: 'Ephemeral',
    definition: 'Lasting for a very short time',
    example: 'Social media stories are ephemeral, disappearing after 24 hours',
  },
  {
    id: '3',
    word: 'Pragmatic',
    definition: 'Dealing with things sensibly and realistically',
    example: 'We need a pragmatic approach to solve this problem',
  },
];

export default function LearningModeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const flipCard = () => {
    setShowDefinition(!showDefinition);
    Animated.spring(animation, {
      toValue: showDefinition ? 0 : 180,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const nextWord = () => {
    if (currentIndex < mockWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowDefinition(false);
      animation.setValue(0);
    }
  };

  const prevWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowDefinition(false);
      animation.setValue(0);
    }
  };

  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: animation.interpolate({
          inputRange: [0, 180],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: animation.interpolate({
          inputRange: [0, 180],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progress}>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {mockWords.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIndex + 1) / mockWords.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.cardContainer}>
        <Animated.View
          style={[styles.card, styles.cardFront, frontAnimatedStyle]}
        >
          <Text style={styles.wordText}>{mockWords[currentIndex].word}</Text>
          <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
            <Text style={styles.flipButtonText}>Tap to flip</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[styles.card, styles.cardBack, backAnimatedStyle]}
        >
          <Text style={styles.definitionTitle}>Definition:</Text>
          <Text style={styles.definitionText}>
            {mockWords[currentIndex].definition}
          </Text>
          <Text style={styles.exampleTitle}>Example:</Text>
          <Text style={styles.exampleText}>
            {mockWords[currentIndex].example}
          </Text>
          <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
            <Text style={styles.flipButtonText}>Tap to flip back</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, currentIndex === 0 && styles.disabled]}
          onPress={prevWord}
          disabled={currentIndex === 0}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={currentIndex === 0 ? '#CCC' : '#007AFF'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            currentIndex === mockWords.length - 1 && styles.disabled,
          ]}
          onPress={nextWord}
          disabled={currentIndex === mockWords.length - 1}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={
              currentIndex === mockWords.length - 1 ? '#CCC' : '#007AFF'
            }
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  progress: {
    padding: 16,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E8E8E8',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: Dimensions.get('window').width - 32,
    height: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    position: 'absolute',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardFront: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBack: {
    justifyContent: 'center',
  },
  wordText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  definitionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  definitionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 24,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  flipButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  flipButtonText: {
    color: '#666',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabled: {
    opacity: 0.5,
  },
});