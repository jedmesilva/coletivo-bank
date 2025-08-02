import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

interface Fund {
  id: number;
  name: string;
  current_amount: number;
  target_amount: number;
  description: string;
  creator_id: number;
}

export default function FundsScreen({ navigation }: any) {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFunds();
  }, []);

  const loadFunds = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/funds/');
      setFunds(response.data.funds || []);
    } catch (error) {
      console.error('Erro ao carregar fundos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os fundos');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleDeposit = (fund: Fund) => {
    Alert.prompt(
      'Fazer Depósito',
      `Digite o valor para depositar no fundo "${fund.name}":`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Depositar',
          onPress: (value) => makeDeposit(fund.id, parseFloat(value || '0')),
        },
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  const makeDeposit = async (fundId: number, amount: number) => {
    if (!amount || amount <= 0) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }

    try {
      await axios.post(`/funds/${fundId}/deposits`, {
        amount,
        fund_id: fundId,
      });
      Alert.alert('Sucesso', 'Depósito realizado com sucesso!');
      loadFunds(); // Recarregar a lista
    } catch (error) {
      console.error('Erro no depósito:', error);
      Alert.alert('Erro', 'Não foi possível realizar o depósito');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fundos Coletivos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateFund')}
        >
          <Icon name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadFunds} />
        }
      >
        {funds.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="account-balance" size={64} color="#9ca3af" />
            <Text style={styles.emptyStateText}>Nenhum fundo disponível</Text>
            <Text style={styles.emptyStateSubtext}>
              Crie o primeiro fundo colaborativo da comunidade
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('CreateFund')}
            >
              <Icon name="add" size={20} color="white" />
              <Text style={styles.createButtonText}>Criar Fundo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          funds.map((fund) => (
            <View key={fund.id} style={styles.fundCard}>
              <View style={styles.fundHeader}>
                <View style={styles.fundTitleContainer}>
                  <Text style={styles.fundName}>{fund.name}</Text>
                  <Text style={styles.fundProgress}>
                    {getProgressPercentage(fund.current_amount, fund.target_amount).toFixed(1)}%
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={styles.depositButton}
                  onPress={() => handleDeposit(fund)}
                >
                  <Icon name="add-circle" size={20} color="#10b981" />
                  <Text style={styles.depositButtonText}>Depositar</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.fundDescription} numberOfLines={3}>
                {fund.description}
              </Text>
              
              <View style={styles.fundAmounts}>
                <Text style={styles.currentAmount}>
                  {formatCurrency(fund.current_amount)}
                </Text>
                <Text style={styles.targetAmount}>
                  de {formatCurrency(fund.target_amount)}
                </Text>
              </View>
              
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${getProgressPercentage(
                        fund.current_amount,
                        fund.target_amount
                      )}%`,
                    },
                  ]}
                />
              </View>

              <View style={styles.fundFooter}>
                <Text style={styles.fundStatus}>
                  {fund.current_amount >= fund.target_amount ? '✅ Meta atingida!' : '🎯 Em andamento'}
                </Text>
                <TouchableOpacity style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>Ver detalhes</Text>
                  <Icon name="arrow-forward-ios" size={12} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#10b981',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  createButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  fundCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fundHeader: {
    marginBottom: 12,
  },
  fundTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fundName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  fundProgress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  depositButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  depositButtonText: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: 14,
  },
  fundDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  fundAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  currentAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#10b981',
  },
  targetAmount: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  fundFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fundStatus: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
});