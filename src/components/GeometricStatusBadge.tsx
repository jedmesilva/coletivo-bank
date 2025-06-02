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
    <div className="flex flex-col items-center gap-2">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm border ${config.borderColor} flex items-center justify-center shadow-lg`}>
        <IconComponent size={20} className={config.iconColor} strokeWidth={2} />
      </div>
      <span className="text-white/90 font-medium text-xs">{config.label}</span>
    </div>
  );
};

export default GeometricStatusBadge;