import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AssessmentQuestion } from '../constants/assessmentConfig';
import { useDynamicAssessment } from '../hooks/useDynamicAssessment';

interface AssessmentManagerProps {
  gameId: string;
  onClose: () => void;
}

export default function AssessmentManager({ gameId, onClose }: AssessmentManagerProps) {
  const { 
    questions, 
    loading, 
    error, 
    addQuestion, 
    updateQuestion, 
    deleteQuestion,
    getNewQuestion 
  } = useDynamicAssessment(gameId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    equation: '',
    correctAnswer: '',
    options: '',
    totalItems: '',
    itemsToRemove: '',
    story: '',
    instruction: '',
    category: 'numbers' as 'pattern' | 'numbers',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard'
  });

  const resetForm = () => {
    setFormData({
      question: '',
      equation: '',
      correctAnswer: '',
      options: '',
      totalItems: '',
      itemsToRemove: '',
      story: '',
      instruction: '',
      category: 'numbers',
      difficulty: 'easy'
    });
  };

  const handleAddQuestion = async () => {
    try {
      const options = formData.options.split(',').map(opt => parseInt(opt.trim())).filter(num => !isNaN(num));
      
      if (options.length === 0) {
        Alert.alert('Error', 'Please enter valid options separated by commas');
        return;
      }

      await addQuestion({
        gameId,
        question: formData.question,
        equation: formData.equation,
        correctAnswer: parseInt(formData.correctAnswer),
        options,
        totalItems: parseInt(formData.totalItems),
        itemsToRemove: parseInt(formData.itemsToRemove),
        story: formData.story,
        instruction: formData.instruction,
        category: formData.category,
        difficulty: formData.difficulty
      });

      setShowAddModal(false);
      resetForm();
      Alert.alert('Success', 'Question added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add question');
    }
  };

  const handleEditQuestion = async () => {
    if (!editingQuestion) return;

    try {
      const options = formData.options.split(',').map(opt => parseInt(opt.trim())).filter(num => !isNaN(num));
      
      if (options.length === 0) {
        Alert.alert('Error', 'Please enter valid options separated by commas');
        return;
      }

      await updateQuestion(editingQuestion.id, {
        question: formData.question,
        equation: formData.equation,
        correctAnswer: parseInt(formData.correctAnswer),
        options,
        totalItems: parseInt(formData.totalItems),
        itemsToRemove: parseInt(formData.itemsToRemove),
        story: formData.story,
        instruction: formData.instruction,
        category: formData.category,
        difficulty: formData.difficulty
      });

      setShowEditModal(false);
      setEditingQuestion(null);
      resetForm();
      Alert.alert('Success', 'Question updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update question');
    }
  };

  const handleDeleteQuestion = (question: AssessmentQuestion) => {
    Alert.alert(
      'Delete Question',
      `Are you sure you want to delete this question?\n\n"${question.question}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteQuestion(question.id);
              Alert.alert('Success', 'Question deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete question');
            }
          }
        }
      ]
    );
  };

  const openEditModal = (question: AssessmentQuestion) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      equation: question.equation,
      correctAnswer: question.correctAnswer.toString(),
      options: question.options.join(', '),
      totalItems: question.totalItems.toString(),
      itemsToRemove: question.itemsToRemove.toString(),
      story: question.story,
      instruction: question.instruction,
      category: question.category,
      difficulty: question.difficulty
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading assessments...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Assessment Manager - {gameId}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{questions.length}</Text>
          <Text style={styles.statLabel}>Total Questions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {questions.filter(q => q.difficulty === 'easy').length}
          </Text>
          <Text style={styles.statLabel}>Easy</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {questions.filter(q => q.difficulty === 'medium').length}
          </Text>
          <Text style={styles.statLabel}>Medium</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {questions.filter(q => q.difficulty === 'hard').length}
          </Text>
          <Text style={styles.statLabel}>Hard</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
        <MaterialIcons name="add" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add New Question</Text>
      </TouchableOpacity>

      <ScrollView style={styles.questionsList}>
        {questions.map((question, index) => (
          <View key={question.id} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumber}>#{index + 1}</Text>
              <View style={styles.questionMeta}>
                <View style={[styles.difficultyBadge, styles[`difficulty${question.difficulty}`]]}>
                  <Text style={styles.difficultyText}>{question.difficulty}</Text>
                </View>
                <View style={[styles.categoryBadge, styles[`category${question.category}`]]}>
                  <Text style={styles.categoryText}>{question.category}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.questionText}>{question.question}</Text>
            <Text style={styles.equationText}>{question.equation}</Text>
            
            <View style={styles.questionDetails}>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Answer:</Text> {question.correctAnswer}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Options:</Text> {question.options.join(', ')}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Items:</Text> {question.totalItems} total, {question.itemsToRemove} to remove
              </Text>
            </View>

            <Text style={styles.storyText}>{question.story}</Text>
            <Text style={styles.instructionText}>{question.instruction}</Text>

            <View style={styles.questionActions}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => openEditModal(question)}
              >
                <MaterialIcons name="edit" size={16} color="#3498db" />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]} 
                onPress={() => handleDeleteQuestion(question)}
              >
                <MaterialIcons name="delete" size={16} color="#e74c3c" />
                <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Question Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Question</Text>
            <ScrollView style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Question text"
                value={formData.question}
                onChangeText={(text) => setFormData({...formData, question: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Equation (e.g., 10 - 5 = ?)"
                value={formData.equation}
                onChangeText={(text) => setFormData({...formData, equation: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Correct answer (number)"
                value={formData.correctAnswer}
                onChangeText={(text) => setFormData({...formData, correctAnswer: text})}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Options (comma separated, e.g., 3, 5, 7)"
                value={formData.options}
                onChangeText={(text) => setFormData({...formData, options: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Total items"
                value={formData.totalItems}
                onChangeText={(text) => setFormData({...formData, totalItems: text})}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Items to remove"
                value={formData.itemsToRemove}
                onChangeText={(text) => setFormData({...formData, itemsToRemove: text})}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Story text"
                value={formData.story}
                onChangeText={(text) => setFormData({...formData, story: text})}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Instruction text"
                value={formData.instruction}
                onChangeText={(text) => setFormData({...formData, instruction: text})}
              />
              
              <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>Category:</Text>
                <View style={styles.selectButtons}>
                  {(['numbers', 'pattern'] as const).map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.selectButton,
                        formData.category === cat && styles.selectButtonActive
                      ]}
                      onPress={() => setFormData({...formData, category: cat})}
                    >
                      <Text style={[
                        styles.selectButtonText,
                        formData.category === cat && styles.selectButtonTextActive
                      ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>Difficulty:</Text>
                <View style={styles.selectButtons}>
                  {(['easy', 'medium', 'hard'] as const).map(diff => (
                    <TouchableOpacity
                      key={diff}
                      style={[
                        styles.selectButton,
                        formData.difficulty === diff && styles.selectButtonActive
                      ]}
                      onPress={() => setFormData({...formData, difficulty: diff})}
                    >
                      <Text style={[
                        styles.selectButtonText,
                        formData.difficulty === diff && styles.selectButtonTextActive
                      ]}>
                        {diff}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]} 
                onPress={handleAddQuestion}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Question Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Question</Text>
            <ScrollView style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Question text"
                value={formData.question}
                onChangeText={(text) => setFormData({...formData, question: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Equation (e.g., 10 - 5 = ?)"
                value={formData.equation}
                onChangeText={(text) => setFormData({...formData, equation: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Correct answer (number)"
                value={formData.correctAnswer}
                onChangeText={(text) => setFormData({...formData, correctAnswer: text})}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Options (comma separated, e.g., 3, 5, 7)"
                value={formData.options}
                onChangeText={(text) => setFormData({...formData, options: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Total items"
                value={formData.totalItems}
                onChangeText={(text) => setFormData({...formData, totalItems: text})}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Items to remove"
                value={formData.itemsToRemove}
                onChangeText={(text) => setFormData({...formData, itemsToRemove: text})}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Story text"
                value={formData.story}
                onChangeText={(text) => setFormData({...formData, story: text})}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Instruction text"
                value={formData.instruction}
                onChangeText={(text) => setFormData({...formData, instruction: text})}
              />
              
              <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>Category:</Text>
                <View style={styles.selectButtons}>
                  {(['numbers', 'pattern'] as const).map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.selectButton,
                        formData.category === cat && styles.selectButtonActive
                      ]}
                      onPress={() => setFormData({...formData, category: cat})}
                    >
                      <Text style={[
                        styles.selectButtonText,
                        formData.category === cat && styles.selectButtonTextActive
                      ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>Difficulty:</Text>
                <View style={styles.selectButtons}>
                  {(['easy', 'medium', 'hard'] as const).map(diff => (
                    <TouchableOpacity
                      key={diff}
                      style={[
                        styles.selectButton,
                        formData.difficulty === diff && styles.selectButtonActive
                      ]}
                      onPress={() => setFormData({...formData, difficulty: diff})}
                    >
                      <Text style={[
                        styles.selectButtonText,
                        formData.difficulty === diff && styles.selectButtonTextActive
                      ]}>
                        {diff}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={() => {
                  setShowEditModal(false);
                  setEditingQuestion(null);
                  resetForm();
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]} 
                onPress={handleEditQuestion}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    color: '#e74c3c',
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  questionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },
  questionMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyeasy: {
    backgroundColor: '#d4edda',
  },
  difficultymedium: {
    backgroundColor: '#fff3cd',
  },
  difficultyhard: {
    backgroundColor: '#f8d7da',
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categorynumbers: {
    backgroundColor: '#cce5ff',
  },
  categorypattern: {
    backgroundColor: '#e2e3e5',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  equationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 10,
  },
  questionDetails: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  detailLabel: {
    fontWeight: 'bold',
  },
  storyText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  questionActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#3498db',
    marginLeft: 4,
  },
  deleteButton: {
    borderColor: '#e74c3c',
  },
  deleteButtonText: {
    color: '#e74c3c',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  formContainer: {
    maxHeight: 400,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  selectContainer: {
    marginBottom: 15,
  },
  selectLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  selectButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  selectButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  selectButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  selectButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectButtonTextActive: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  modalButtonTextPrimary: {
    color: '#fff',
  },
}); 