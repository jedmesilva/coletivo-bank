import React from 'react';
import { Circle, Hexagon, Diamond, Gem } from 'lucide-react';

interface GeometricStatusBadgeProps {
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
}

const GeometricStatusBadge: React.FC<GeometricStatusBadgeProps> = ({ level }) => {
  const statusConfig = {
    bronze: {
      label: "Bronze",
      icon: Circle,
      iconColor: "text-amber-500",
      bgGradient: "from-amber-400/20 to-orange-400/20",
      borderColor: "border-amber-400/40"
    },
    silver: {
      label: "Prata", 
      icon: Hexagon,
      iconColor: "text-gray-300",
      bgGradient: "from-gray-300/20 to-slate-300/20",
      borderColor: "border-gray-300/40"
    },
    gold: {
      label: "Ouro",
      icon: Diamond,
      iconColor: "text-yellow-400",
      bgGradient: "from-yellow-400/20 to-amber-400/20",
      borderColor: "border-yellow-400/40"
    },
    platinum: {
      label: "Platina",
      icon: Gem,
      iconColor: "text-purple-400",
      bgGradient: "from-purple-400/20 to-pink-400/20",
      borderColor: "border-purple-400/40"
    }
  };

  const config = statusConfig[level] || statusConfig.bronze;
  const IconComponent = config.icon;

  return (
    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border-2 ${
      level === 'bronze' ? 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-300 text-amber-700' :
      level === 'silver' ? 'bg-gradient-to-br from-gray-100 to-slate-100 border-gray-300 text-gray-700' :
      level === 'gold' ? 'bg-gradient-to-br from-yellow-100 to-amber-100 border-yellow-300 text-yellow-700' :
      'bg-gradient-to-br from-purple-100 to-indigo-100 border-purple-300 text-purple-700'
    } shadow-sm`}>
      <span className="text-xs font-bold uppercase tracking-wide">
        {level === 'bronze' ? 'B' :
         level === 'silver' ? 'S' :
         level === 'gold' ? 'G' : 'P'}
      </span>
    </div>
  );
};

export default GeometricStatusBadge;