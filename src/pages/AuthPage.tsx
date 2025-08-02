import React from 'react';
import AuthScreen from '@/components/AuthModal';

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <AuthScreen />
    </div>
  );
};

export default AuthPage;