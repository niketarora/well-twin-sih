import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
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
        element: <Navigate to="/overview" replace />,
      },
      {
        path: 'overview',
        element: <OverviewPage />,
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
        element: <Navigate to="/overview" replace />,
      },
    ],
  },
]);
