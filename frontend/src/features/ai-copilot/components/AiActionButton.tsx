import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AiAction } from '../types/ai';
import { resolveRoute } from '../navigationRegistry';
import { useUIStore } from '../../../stores/useUIStore';

interface AiActionButtonProps {
  action: AiAction;
  onExecuted?: () => void;
}

export const AiActionButton: React.FC<AiActionButtonProps> = ({ action, onExecuted }) => {
  const navigate = useNavigate();
  const { setSelectedWellId } = useUIStore();

  const handleClick = () => {
    const route = resolveRoute(action.page, action.wellId);
    if (!route) {
      console.warn(`Unable to resolve route for page: ${action.page}`);
      return;
    }

    if (action.wellId) {
      setSelectedWellId(action.wellId);
    }

    navigate(route);
    if (onExecuted) onExecuted();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-petroleum hover:bg-petroleum-hover text-white text-xs font-medium shadow-xs transition-colors"
    >
      <span>{action.label}</span>
      <ArrowRight className="w-3 h-3" />
    </button>
  );
};
