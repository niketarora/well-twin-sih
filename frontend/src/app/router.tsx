import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
import { OverviewPage } from '../pages/OverviewPage';
import { DigitalTwinOverviewPage } from '../pages/DigitalTwinOverviewPage';
import { WellStatePage } from '../pages/WellStatePage';
import { ReservoirPage } from '../pages/ReservoirPage';
import { WellborePage } from '../pages/WellborePage';
import { SrpPage } from '../pages/SrpPage';
import { SurfaceProductionPage } from '../pages/SurfaceProductionPage';
import { TrendsPage } from '../pages/TrendsPage';
import { CssCyclePage } from '../pages/CssCyclePage';
import { AlertsPage } from '../pages/AlertsPage';
import { AnomaliesPage } from '../pages/AnomaliesPage';
import { AiInsightsPage } from '../pages/AiInsightsPage';
import { EquipmentPage } from '../pages/EquipmentPage';
import { WellDiagramPage } from '../pages/WellDiagramPage';
import { ModelComparisonPage } from '../pages/ModelComparisonPage';
import { RecommendationsPage } from '../pages/RecommendationsPage';
import { WorkOrdersPage } from '../pages/WorkOrdersPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'overview',
        element: <OverviewPage />,
      },
      {
        path: 'well/:wellId',
        element: <OverviewPage />,
      },
      {
        path: 'well/:wellId/overview',
        element: <OverviewPage />,
      },
      {
        path: 'well/:wellId/digital-twin',
        element: <DigitalTwinOverviewPage />,
      },
      {
        path: 'well/:wellId/well-state',
        element: <WellStatePage />,
      },
      {
        path: 'well/:wellId/reservoir',
        element: <ReservoirPage />,
      },
      {
        path: 'well/:wellId/wellbore',
        element: <WellborePage />,
      },
      {
        path: 'well/:wellId/srp-pump',
        element: <SrpPage />,
      },
      {
        path: 'well/:wellId/surface-production',
        element: <SurfaceProductionPage />,
      },
      {
        path: 'well/:wellId/trends',
        element: <TrendsPage />,
      },
      {
        path: 'well/:wellId/css-cycle',
        element: <CssCyclePage />,
      },
      {
        path: 'well/:wellId/alerts',
        element: <AlertsPage />,
      },
      {
        path: 'well/:wellId/anomalies',
        element: <AnomaliesPage />,
      },
      {
        path: 'well/:wellId/ai-insights',
        element: <AiInsightsPage />,
      },
      {
        path: 'well/:wellId/equipment',
        element: <EquipmentPage />,
      },
      {
        path: 'well/:wellId/well-diagram',
        element: <WellDiagramPage />,
      },
      {
        path: 'well/:wellId/model-comparison',
        element: <ModelComparisonPage />,
      },
      {
        path: 'well/:wellId/recommendations',
        element: <RecommendationsPage />,
      },
      {
        path: 'well/:wellId/work-orders',
        element: <WorkOrdersPage />,
      },
      {
        path: 'digital-twin',
        element: <DigitalTwinOverviewPage />,
      },
      {
        path: 'well-state',
        element: <WellStatePage />,
      },
      {
        path: 'reservoir',
        element: <ReservoirPage />,
      },
      {
        path: 'wellbore',
        element: <WellborePage />,
      },
      {
        path: 'srp-pump',
        element: <SrpPage />,
      },
      {
        path: 'surface-production',
        element: <SurfaceProductionPage />,
      },
      {
        path: 'trends',
        element: <TrendsPage />,
      },
      {
        path: 'css-cycle',
        element: <CssCyclePage />,
      },
      {
        path: 'alerts',
        element: <AlertsPage />,
      },
      {
        path: 'anomalies',
        element: <AnomaliesPage />,
      },
      {
        path: 'ai-insights',
        element: <AiInsightsPage />,
      },
      {
        path: 'equipment',
        element: <EquipmentPage />,
      },
      {
        path: 'well-diagram',
        element: <WellDiagramPage />,
      },
      {
        path: 'model-comparison',
        element: <ModelComparisonPage />,
      },
      {
        path: 'recommendations',
        element: <RecommendationsPage />,
      },
      {
        path: 'work-orders',
        element: <WorkOrdersPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
