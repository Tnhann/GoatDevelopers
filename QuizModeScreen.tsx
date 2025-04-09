import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

// Mock quiz data
const mockQuiz = [
  {
    id: '1',
    question: 'What does "ubiquitous" mean?',
    options: [
      'Present everywhere',
      'Rare and unique',
      'Quickly disappearing',
      'Carefully planned',
    ],
    correctAnswer: 0,
  },
  {
    id: '2',
    question: 'Choose the correct example for "ephemeral":',
    options: [
      'A stone monument',
      'A butterfly's lifespan',
      'A permanent marker',
      'A steel building',
    ],
    correctAnswer: 1,
  },
  {
    id: '3',
    question: 'Which word means "dealing with things sensibly"?',
    options: [
      'Whimsical',
      'Emotional',
      'Pragmatic',
      'Idealistic',
    ],
    correctAnswer: 2,
  },
];

export default function QuizModeScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    
    // Animate the selection
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Check if answer is correct
    if (index === mockQuiz[currentQuestion].correctAnswer) {
      setScore(score + 1);
      toast.success('Correct answer!');
    } else {
      toast.error('Wrong answer!');
    }

    // Move to next question or show results
    setTimeout(() => {
      if (currentQuestion < mockQuiz.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
      }
    }, 1000);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Quiz Complete!</Text>
          <Text style={styles.scoreText}>
            Your Score: {score}/{mockQuiz.length}
          </Text>
          <Text style={styles.percentageText}>
            {Math.round((score / mockQuiz.length) * 100)}%
          </Text>
          
          <View style={styles.resultsFeedback}>
            <Ionicons
              name={score > mockQuiz.length / 2 ? 'trophy' : 'fitness'}
              size={64}
              color="#007AFF"
            />
            <Text style={styles.feedbackText}>
              {score > mockQuiz.length / 2
                ? 'Great job! Keep up the good work!'
                : 'Keep practicing to improve your score!'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.restartButton}
            onPress={restartQuiz}
          >
            <Text style={styles.restartButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progress}>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {mockQuiz.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentQuestion + 1) / mockQuiz.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {mockQuiz[currentQuestion].question}
          </Text>

          <View style={styles.optionsContainer}>
            {mockQuiz[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && styles.selectedOption,
                ]}
                onPress={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedAnswer === index && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.scoreContainer}>
        <Text style={styles.currentScore}>
          Current Score: {score}/{currentQuestion}
        </Text>
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
  content: {
    flex: 1,
  },
  questionContainer: {
    padding: 16,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 16,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: 'white',
  },
  scoreContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  currentScore: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  resultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  resultsTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 24,
    color: '#666',
    marginBottom: 8,
  },
  percentageText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 24,
  },
  resultsFeedback: {
    alignItems: 'center',
    marginBottom: 32,
  },
  feedbackText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  restartButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});