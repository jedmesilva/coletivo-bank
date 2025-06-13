
import React, { useEffect } from 'react';
import { X, Bell, Clock, Check, AlertCircle, Info } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      title: 'Pagamento Aprovado',
      message: 'Seu pagamento de R$ 250,00 foi aprovado com sucesso',
      time: '2 min atrás',
      read: false,
      avatar: '/placeholder.svg'
    },
    {
      id: '2',
      type: 'info',
      title: 'Nova Solicitação de Capital',
      message: 'João Silva solicitou R$ 1.500,00 para o Fundo Emergencial',
      time: '15 min atrás',
      read: false,
      avatar: '/placeholder.svg'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Vencimento Próximo',
      message: 'Você tem uma dívida vencendo em 2 dias',
      time: '1 hora atrás',
      read: true
    },
    {
      id: '4',
      type: 'info',
      title: 'Fundo Criado',
      message: 'O fundo "Reserva de Emergência" foi criado com sucesso',
      time: '2 horas atrás',
      read: true
    },
    {
      id: '5',
      type: 'success',
      title: 'Depósito Confirmado',
      message: 'Depósito de R$ 500,00 confirmado no Fundo Principal',
      time: '1 dia atrás',
      read: true
    }
  ];

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Check size={16} className="text-green-600" />;
      case 'warning':
        return <AlertCircle size={16} className="text-yellow-600" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <Info size={16} className="text-blue-600" />;
    }
  };

  const getNotificationBadgeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'error':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`fixed inset-0 z-[9999] transition-all duration-300 ease-in-out ${
      isOpen ? 'visible' : 'invisible'
    }`} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, height: '100vh', width: '100vw' }}>
      {/* Overlay */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        style={{ height: '100vh', width: '100vw' }}
      />
      
      {/* Notification Panel */}
      <div className={`absolute right-0 top-0 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`} style={{ height: '100vh' }}>
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Bell size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Notificações</h3>
                {unreadCount > 0 && (
                  <p className="text-blue-200/80 text-sm">{unreadCount} não lidas</p>
                )}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ touchAction: 'pan-y' }}>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Bell size={24} className="text-gray-400" />
              </div>
              <h3 className="text-gray-900 font-medium mb-2">Nenhuma notificação</h3>
              <p className="text-gray-500 text-sm">Você não tem notificações no momento</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Avatar or Icon */}
                    <div className="flex-shrink-0">
                      {notification.avatar ? (
                        <Avatar className="w-10 h-10 border border-gray-200">
                          <AvatarImage src={notification.avatar} alt="User" />
                          <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                            {notification.title.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          getNotificationBadgeColor(notification.type)
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className={`text-sm font-medium truncate ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={12} />
                          {notification.time}
                        </div>
                        
                        {notification.action && (
                          <button 
                            onClick={notification.action.onClick}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {notification.action.label}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2">
              <button className="flex-1 py-2 px-4 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Marcar todas como lidas
              </button>
              <button className="flex-1 py-2 px-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                Ver todas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
