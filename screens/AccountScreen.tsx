import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

export default function AccountScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ]
    );
  };

  const copyPixKey = () => {
    const pixKey = `${user?.username}@ColetivoBank.app`;
    // No React Native, você precisaria usar react-native-clipboard
    Alert.alert('Chave PIX', pixKey);
  };

  const getAccountLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'bronze': return '#cd7f32';
      case 'silver': return '#c0c0c0';
      case 'gold': return '#ffd700';
      case 'platinum': return '#e5e4e2';
      default: return '#cd7f32';
    }
  };

  const getAccountLevelIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'bronze': return 'workspace-premium';
      case 'silver': return 'workspace-premium';
      case 'gold': return 'workspace-premium';
      case 'platinum': return 'diamond';
      default: return 'workspace-premium';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Icon name="person" size={40} color="white" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.username}>{user?.username}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <View style={styles.levelBadge}>
              <Icon 
                name={getAccountLevelIcon(user?.account_level || 'bronze')} 
                size={16} 
                color={getAccountLevelColor(user?.account_level || 'bronze')} 
              />
              <Text style={[
                styles.levelText,
                { color: getAccountLevelColor(user?.account_level || 'bronze') }
              ]}>
                {user?.account_level?.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações</Text>
          
          <TouchableOpacity style={styles.actionCard}>
            <Icon name="qr-code" size={24} color="#10b981" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Receber PIX</Text>
              <Text style={styles.actionSubtitle}>Gerar QR Code para recebimento</Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Icon name="send" size={24} color="#10b981" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Enviar PIX</Text>
              <Text style={styles.actionSubtitle}>Transferir para outros usuários</Text>
            </View>
            <Icon name="arrow-forward-ios" size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chave ColetivoBank</Text>
          <TouchableOpacity style={styles.pixKeyCard} onPress={copyPixKey}>
            <Icon name="key" size={24} color="#10b981" />
            <View style={styles.pixKeyContent}>
              <Text style={styles.pixKeyTitle}>Sua chave única</Text>
              <Text style={styles.pixKey}>{user?.username}@ColetivoBank.app</Text>
            </View>
            <Icon name="content-copy" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="notifications" size={24} color="#6b7280" />
            <Text style={styles.menuItemText}>Notificações</Text>
            <Icon name="arrow-forward-ios" size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icon name="security" size={24} color="#6b7280" />
            <Text style={styles.menuItemText}>Segurança</Text>
            <Icon name="arrow-forward-ios" size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icon name="help" size={24} color="#6b7280" />
            <Text style={styles.menuItemText}>Ajuda e Suporte</Text>
            <Icon name="arrow-forward-ios" size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icon name="info" size={24} color="#6b7280" />
            <Text style={styles.menuItemText}>Sobre o App</Text>
            <Icon name="arrow-forward-ios" size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={24} color="#ef4444" />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#10b981',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
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
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionContent: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  pixKeyCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pixKeyContent: {
    flex: 1,
    marginLeft: 16,
  },
  pixKeyTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  pixKey: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  menuItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 16,
  },
  logoutButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fecaca',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 12,
  },
});