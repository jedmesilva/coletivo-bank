import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

export default function CreateFundScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateFund = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Digite o nome do fundo');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Erro', 'Digite a descrição do fundo');
      return;
    }

    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      Alert.alert('Erro', 'Digite um valor meta válido');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/funds/', {
        name: name.trim(),
        description: description.trim(),
        target_amount: parseFloat(targetAmount),
      });

      Alert.alert(
        'Sucesso!',
        'Fundo criado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao criar fundo:', error);
      Alert.alert('Erro', 'Não foi possível criar o fundo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    // Remove tudo que não é número
    const numericValue = value.replace(/[^\d]/g, '');
    
    // Converte para número e divide por 100 (centavos)
    const floatValue = parseFloat(numericValue) / 100;
    
    // Se for NaN, retorna string vazia
    if (isNaN(floatValue)) return '';
    
    // Formata como moeda brasileira
    return floatValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleAmountChange = (text: string) => {
    const formatted = formatCurrency(text);
    setTargetAmount(formatted);
  };

  const getNumericValue = (formattedValue: string) => {
    return formattedValue.replace(/[R$\s.]/g, '').replace(',', '.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Criar Fundo</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Fundo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Compra coletiva de equipamentos"
              value={name}
              onChangeText={setName}
              maxLength={100}
            />
            <Text style={styles.helperText}>
              Escolha um nome claro e descritivo
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva o objetivo do fundo e como os recursos serão utilizados..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.helperText}>
              {description.length}/500 caracteres
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Meta de Arrecadação</Text>
            <View style={styles.amountInputContainer}>
              <Icon name="attach-money" size={24} color="#10b981" />
              <TextInput
                style={styles.amountInput}
                placeholder="R$ 0,00"
                value={targetAmount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.helperText}>
              Defina quanto precisa arrecadar para atingir o objetivo
            </Text>
          </View>

          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Prévia do Fundo</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewName}>
                  {name || 'Nome do fundo aparecerá aqui'}
                </Text>
                <Text style={styles.previewProgress}>0%</Text>
              </View>
              
              <Text style={styles.previewDescription}>
                {description || 'A descrição do fundo aparecerá aqui...'}
              </Text>
              
              <View style={styles.previewAmounts}>
                <Text style={styles.previewCurrent}>R$ 0,00</Text>
                <Text style={styles.previewTarget}>
                  de {targetAmount || 'R$ 0,00'}
                </Text>
              </View>
              
              <View style={styles.previewProgressBar}>
                <View style={styles.previewProgressFill} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreateFund}
          disabled={loading}
        >
          <Icon name="add" size={24} color="white" />
          <Text style={styles.createButtonText}>
            {loading ? 'Criando...' : 'Criar Fundo'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    height: 120,
  },
  helperText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  amountInputContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  amountInput: {
    flex: 1,
    padding: 16,
    paddingLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#10b981',
  },
  previewSection: {
    marginTop: 32,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  previewCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  previewProgress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  previewDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  previewAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  previewCurrent: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  previewTarget: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  previewProgressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  previewProgressFill: {
    height: '100%',
    width: '0%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  createButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  createButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});