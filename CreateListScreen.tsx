import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

export default function CreateListScreen() {
  const navigation = useNavigation();
  const [listTitle, setListTitle] = useState('');
  const [description, setDescription] = useState('');
  const [words, setWords] = useState([{ word: '', definition: '', example: '' }]);

  const addWordField = () => {
    setWords([...words, { word: '', definition: '', example: '' }]);
  };

  const updateWord = (index, field, value) => {
    const newWords = [...words];
    newWords[index] = { ...newWords[index], [field]: value };
    setWords(newWords);
  };

  const removeWord = (index) => {
    const newWords = words.filter((_, i) => i !== index);
    setWords(newWords);
  };

  const handleCreate = () => {
    if (!listTitle.trim()) {
      toast.error('Please enter a list title');
      return;
    }

    if (words.some(w => !w.word.trim())) {
      toast.error('Please fill in all word fields');
      return;
    }

    // Here you would typically save the list to your backend
    toast.success('Word list created successfully!');
    navigation.navigate('WordLists');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.form}>
            <Text style={styles.label}>List Title</Text>
            <TextInput
              style={styles.input}
              value={listTitle}
              onChangeText={setListTitle}
              placeholder="Enter list title"
            />

            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter list description"
              multiline
              numberOfLines={3}
            />

            <Text style={styles.sectionTitle}>Words</Text>
            {words.map((word, index) => (
              <View key={index} style={styles.wordContainer}>
                <View style={styles.wordHeader}>
                  <Text style={styles.wordNumber}>Word {index + 1}</Text>
                  {index > 0 && (
                    <TouchableOpacity 
                      onPress={() => removeWord(index)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="close-circle" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                  )}
                </View>

                <TextInput
                  style={styles.input}
                  value={word.word}
                  onChangeText={(text) => updateWord(index, 'word', text)}
                  placeholder="Enter word"
                />
                <TextInput
                  style={styles.input}
                  value={word.definition}
                  onChangeText={(text) => updateWord(index, 'definition', text)}
                  placeholder="Enter definition"
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={word.example}
                  onChangeText={(text) => updateWord(index, 'example', text)}
                  placeholder="Enter example sentence"
                  multiline
                  numberOfLines={2}
                />
              </View>
            ))}

            <TouchableOpacity 
              style={styles.addWordButton} 
              onPress={addWordField}
            >
              <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
              <Text style={styles.addWordText}>Add Another Word</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleCreate}
            >
              <Text style={styles.createButtonText}>Create List</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 16,
  },
  wordContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  wordNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  removeButton: {
    padding: 4,
  },
  addWordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 24,
  },
  addWordText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});