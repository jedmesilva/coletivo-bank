import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import PersonalDataSheet from './PersonalDataSheet';

const PersonalDataManager: React.FC = () => {
  const [isPersonalDataOpen, setIsPersonalDataOpen] = useState(false);
  const { currentUser } = useApp();

  useEffect(() => {
    const handleOpenPersonalData = () => {
      setIsPersonalDataOpen(true);
    };

    window.addEventListener('openPersonalData', handleOpenPersonalData);

    return () => {
      window.removeEventListener('openPersonalData', handleOpenPersonalData);
    };
  }, []);

  return (
    <PersonalDataSheet
      isOpen={isPersonalDataOpen}
      onClose={() => setIsPersonalDataOpen(false)}
      user={{
        id: currentUser.id,
        name: currentUser.name,
        email: (currentUser as any).email || 'lucas@example.com',
        phone: (currentUser as any).phone || '(11) 99999-9999',
        cpf: (currentUser as any).cpf || '123.456.789-00',
        address: (currentUser as any).address || 'Rua das Flores, 123, Centro, São Paulo - SP',
        profileImage: currentUser.profileImage || ''
      }}
    />
  );
};

export default PersonalDataManager;