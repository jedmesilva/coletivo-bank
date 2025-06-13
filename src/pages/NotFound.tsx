import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 font-sans flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm bg-white/95">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">🔍</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Página não encontrada
            </h1>
            <p className="text-gray-600 text-lg">
              A página que você procura não existe ou foi movida
            </p>
          </div>

          {/* Error Details */}
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-red-500 mb-4">404</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Oops! Algo deu errado</h2>
            <p className="text-gray-600 text-sm mb-6">
              A página <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{location.pathname}</span> não foi encontrada
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <button 
              onClick={handleGoHome}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            >
              🏠 Voltar ao início
            </button>
            
            <button 
              onClick={handleGoBack}
              className="w-full px-6 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all duration-200 hover:shadow-md hover:border-gray-300 flex items-center justify-center gap-2"
            >
              ← Voltar à página anterior
            </button>
          </div>

          {/* Help Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
              💡 Precisa de ajuda?
            </h3>
            <p className="text-gray-600 text-sm mb-4 text-center">
              Se você acredita que isso é um erro, tente:
            </p>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                <span>Verificar se digitou o endereço corretamente</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                <span>Atualizar a página (F5)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                <span>Limpar o cache do navegador</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;