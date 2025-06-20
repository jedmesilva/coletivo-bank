
import React, { useEffect } from 'react';
import { X, Bell, Clock, Check, AlertCircle, Info, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sheet, 
  SheetContent, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

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

  const handleClose = () => {
    onClose();
  };

  const markAllAsRead = () => {
    // Implementar lógica para marcar todas como lidas
    console.log('Marcar todas como lidas');
  };

  const viewAll = () => {
    // Implementar lógica para ver todas as notificações
    console.log('Ver todas as notificações');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="p-0 h-[100dvh] flex flex-col max-w-full"
        aria-describedby="notifications-description"
      >
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ height: 'calc(100dvh - 100px)' }}>
          {/* Header */}
          <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pt-4 pb-6">
            <div className="px-4 flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 mr-2 text-white hover:bg-white/10" 
                onClick={handleClose}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <SheetTitle className="text-xl text-white font-semibold">
                  Notificações
                </SheetTitle>
                {unreadCount > 0 && (
                  <div className="flex items-center mt-1">
                    <span className="text-white/70 text-sm">{unreadCount} não lidas</span>
                  </div>
                )}
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Bell size={20} className="text-white" />
              </div>
            </div>
            <div className="px-4">
              <SheetDescription className="text-white/70">
                Acompanhe todas as suas notificações importantes
              </SheetDescription>
            </div>
          </header>

          <div className="p-4 pb-60">
            {/* Notifications List */}
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Bell size={24} className="text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-medium mb-2">Nenhuma notificação</h3>
                <p className="text-gray-500 text-sm">Você não tem notificações no momento</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                      !notification.read 
                        ? 'bg-blue-50/50 border-blue-200 shadow-sm' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
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
                        
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock size={12} />
                            {notification.time}
                          </div>
                          
                          {notification.action && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={notification.action.onClick}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium h-auto p-1"
                            >
                              {notification.action.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        {notifications.length > 0 && (
          <div className="border-t border-gray-200 py-3 bg-white w-full fixed bottom-0 left-0 right-0">
            <div className="px-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={markAllAsRead}
                    className="flex-1 h-12 rounded-2xl border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  >
                    Marcar todas como lidas
                  </Button>
                  <Button 
                    onClick={viewAll}
                    className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Ver todas
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NotificationPanel;
