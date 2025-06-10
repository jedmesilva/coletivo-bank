import React, { useState } from 'react';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';

const AuthPage: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleSwitchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const handleCloseModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <LoginModal
        isOpen={isLoginOpen}
        onClose={handleCloseModals}
        onSwitchToRegister={handleSwitchToRegister}
      />
      
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={handleCloseModals}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
};

export default AuthPage;