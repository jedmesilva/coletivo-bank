
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail, Phone } from 'lucide-react';
import TopNavbar from '@/components/TopNavbar';
import HeaderSection from '@/components/HeaderSection';
import { useApp } from '@/context/AppContext';

interface FAQItem {
  question: string;
  answer: string;
}

const SupportPage: React.FC = () => {
  const { setIsSidebarMenuOpen } = useApp();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData: FAQItem[] = [
    {
      question: "Como criar um novo fundo coletivo?",
      answer: "Para criar um novo fundo, clique no botão '+ Novo fundo' na tela principal. Preencha as informações necessárias como nome, descrição, imagem e adicione os membros desejados. Após finalizar, o fundo será criado e você poderá começar a fazer depósitos."
    },
    {
      question: "Como fazer um depósito no fundo?",
      answer: "Para fazer um depósito, acesse o fundo desejado e clique em 'Depositar'. Informe o valor desejado e a descrição do depósito. Você receberá as instruções de pagamento via PIX para completar a transação."
    },
    {
      question: "Como solicitar capital de um fundo?",
      answer: "Dentro do fundo, clique em 'Solicitar capital', informe o valor desejado, a finalidade e selecione as condições de pagamento. Sua solicitação ficará pendente de aprovação dos outros membros do fundo."
    },
    {
      question: "Como pagar uma dívida?",
      answer: "Acesse a seção 'Minha Conta' e vá até a aba 'Dívidas'. Clique na dívida que deseja pagar e selecione 'Pagar dívida'. Você receberá as instruções de pagamento via PIX."
    },
    {
      question: "O que são os níveis de conta (Bronze, Prata, Ouro, Platina)?",
      answer: "Os níveis representam sua experiência e confiabilidade na plataforma. Conforme você participa mais ativamente dos fundos, faz pagamentos em dia e mantém um bom histórico, seu nível aumenta, desbloqueando benefícios como limites maiores de crédito."
    },
    {
      question: "Como convidar novos membros para um fundo?",
      answer: "Nas configurações do fundo, você pode adicionar novos membros digitando o nome de usuário ou e-mail da pessoa. Elas receberão um convite para participar do fundo."
    },
    {
      question: "É seguro usar o Coletivo Bank?",
      answer: "Sim! Utilizamos criptografia de ponta a ponta, integração com o gateway de pagamento Asaas (certificado pelo Banco Central) e seguimos todas as normas de segurança financeira. Seus dados e transações estão protegidos."
    },
    {
      question: "Como funciona a aprovação de solicitações de capital?",
      answer: "Quando você solicita capital, todos os membros do fundo recebem uma notificação. Eles podem aprovar ou rejeitar sua solicitação. O valor só é liberado após a aprovação da maioria dos membros."
    },
    {
      question: "Posso sair de um fundo?",
      answer: "Sim, você pode sair de um fundo a qualquer momento, desde que não tenha dívidas pendentes relacionadas a esse fundo. Acesse as configurações do fundo e clique em 'Sair do fundo'."
    },
    {
      question: "Como alterar meus dados pessoais?",
      answer: "Vá até 'Minha Conta' e clique em 'Dados pessoais'. Lá você pode atualizar seu nome, foto de perfil, telefone e outras informações pessoais."
    }
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "Chat ao vivo",
      description: "Fale conosco em tempo real",
      action: "Iniciar chat"
    },
    {
      icon: Mail,
      title: "E-mail",
      description: "suporte@coletivobank.com",
      action: "Enviar e-mail"
    },
    {
      icon: Phone,
      title: "Telefone",
      description: "(11) 9999-9999",
      action: "Ligar agora"
    }
  ];

  return (
    <div className="fixed inset-0 bg-gray-50 font-sans overflow-hidden">
      <div className="h-full overflow-y-auto">
        {/* Top Navbar */}
        <TopNavbar 
          onMenuClick={() => setIsSidebarMenuOpen(true)}
          onNotificationClick={() => console.log('Notificações')}
          notificationCount={3}
        />

        {/* Header Section */}
        <HeaderSection>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HelpCircle size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Ajuda e Suporte
            </h1>
            <p className="text-blue-200/80 text-lg">
              Encontre respostas para suas dúvidas
            </p>
          </div>
        </HeaderSection>

        {/* Content */}
        <div className="bg-white min-h-screen">
          <div className="max-w-md mx-auto px-4 pt-8 pb-28">
            
            {/* FAQ Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h2>
              
              <div className="space-y-4">
                {faqData.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                      {expandedItems.includes(index) ? (
                        <ChevronUp size={20} className="text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    
                    {expandedItems.includes(index) && (
                      <div className="px-4 pb-4 text-gray-600 leading-relaxed">
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Precisa de mais ajuda?</h2>
              
              <div className="space-y-4">
                {contactOptions.map((option, index) => {
                  const IconComponent = option.icon;
                  return (
                    <div key={index} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <IconComponent size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{option.title}</h3>
                          <p className="text-gray-600 text-sm">{option.description}</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
                          {option.action}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Additional Help */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Não encontrou o que procurava?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Nossa equipe está sempre pronta para ajudar você com qualquer dúvida ou problema.
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                Falar com suporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
