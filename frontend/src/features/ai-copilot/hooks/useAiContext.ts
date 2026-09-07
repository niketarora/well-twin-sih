import { useLocation } from 'react-router-dom';
import { useUIStore } from '../../../stores/useUIStore';
import { AiUiContext } from '../types/ai';

export function useAiContext(): AiUiContext {
  const location = useLocation();
  const { selectedWellId } = useUIStore();

  const pathname = location.pathname;

  let currentPage = 'overview';
  if (pathname === '/') {
    currentPage = 'home';
  } else if (pathname.includes('/reservoir')) {
    currentPage = 'reservoir';
  } else if (pathname.includes('/wellbore')) {
    currentPage = 'wellbore';
  } else if (pathname.includes('/srp-pump')) {
    currentPage = 'srp';
  } else if (pathname.includes('/surface-production')) {
    currentPage = 'production';
  } else if (pathname.includes('/digital-twin')) {
    currentPage = 'digitalTwin';
  } else if (pathname.includes('/well-state')) {
    currentPage = 'wellState';
  } else if (pathname.includes('/trends')) {
    currentPage = 'trends';
  } else if (pathname.includes('/css-cycle')) {
    currentPage = 'css';
  } else if (pathname.includes('/alerts')) {
    currentPage = 'alerts';
  } else if (pathname.includes('/anomalies')) {
    currentPage = 'anomalies';
  } else if (pathname.includes('/ai-insights')) {
    currentPage = 'aiInsights';
  } else if (pathname.includes('/equipment')) {
    currentPage = 'equipment';
  } else if (pathname.includes('/well-diagram')) {
    currentPage = 'wellDiagram';
  } else if (pathname.includes('/model-comparison')) {
    currentPage = 'modelComparison';
  } else if (pathname.includes('/recommendations')) {
    currentPage = 'recommendations';
  } else if (pathname.includes('/work-orders')) {
    currentPage = 'workOrders';
  }

  return {
    fieldId: 'baghewala',
    fieldName: 'Baghewala Heavy Oil Field',
    currentWellId: selectedWellId || 'well-bw-017',
    currentPage,
  };
}
