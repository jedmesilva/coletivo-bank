import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Fund {
  id: number;
  name: string;
  current_amount: number;
  target_amount: number;
  description: string;
}

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
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

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadFunds} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {user?.username}!</Text>
        <Text style={styles.subtitle}>Bem-vindo ao Coletivo Bank</Text>
        
        <View style={styles.levelBadge}>
          <Icon name="star" size={16} color="#f59e0b" />
          <Text style={styles.levelText}>{user?.account_level?.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CreateFund')}
        >
          <Icon name="add" size={24} color="white" />
          <Text style={styles.actionButtonText}>Criar Fundo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('Funds')}
        >
          <Icon name="account-balance" size={24} color="#10b981" />
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
            Ver Fundos
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fundos Recentes</Text>
        {funds.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="account-balance" size={48} color="#9ca3af" />
            <Text style={styles.emptyStateText}>Nenhum fundo disponível</Text>
            <Text style={styles.emptyStateSubtext}>
              Crie seu primeiro fundo colaborativo
            </Text>
          </View>
        ) : (
          funds.slice(0, 3).map((fund) => (
            <View key={fund.id} style={styles.fundCard}>
              <View style={styles.fundHeader}>
                <Text style={styles.fundName}>{fund.name}</Text>
                <Text style={styles.fundProgress}>
                  {getProgressPercentage(fund.current_amount, fund.target_amount).toFixed(1)}%
                </Text>
              </View>
              
              <Text style={styles.fundDescription} numberOfLines={2}>
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
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#10b981',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  levelText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#10b981',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: '#10b981',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  fundDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  fundAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  currentAmount: {
    fontSize: 20,
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
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
});