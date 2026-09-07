import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldHeader } from '../components/home/FieldHeader';
import { WellFilters } from '../components/home/WellFilters';
import { FieldMap } from '../components/home/FieldMap';
import { WellList } from '../components/home/WellList';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { fieldService } from '../services';
import { FieldSummary, FieldWell, MapLayerType, WellStatusFilter } from '../types/field';
import { useUIStore } from '../stores/useUIStore';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedWellId } = useUIStore();

  const [summary, setSummary] = useState<FieldSummary | null>(null);
  const [wells, setWells] = useState<FieldWell[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Home interactive states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<WellStatusFilter>('all');
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('health');
  const [activeWellId, setActiveWellId] = useState<string | null>('well-bw-017');

  const loadFieldData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const [sumData, wellsData] = await Promise.all([
        fieldService.getFieldSummary(),
        fieldService.getFieldWells(),
      ]);
      setSummary(sumData);
      setWells(wellsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load field surveillance data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadFieldData();
  }, []);

  // Filtered wells based on search and status
  const filteredWells = useMemo(() => {
    return wells.filter((well) => {
      // Search matching code, name, pad, or sector
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        well.code.toLowerCase().includes(q) ||
        well.name.toLowerCase().includes(q) ||
        well.pad.toLowerCase().includes(q) ||
        well.sector.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // Status pill matching
      if (statusFilter === 'all') return true;
      if (statusFilter === 'producing') return well.status === 'Optimal';
      if (statusFilter === 'attention') return well.status === 'Attention Required';
      if (statusFilter === 'critical') return well.status === 'Critical';
      if (statusFilter === 'css') return well.status === 'CSS-Active';
      if (statusFilter === 'shutin') return well.status === 'Shut-In';

      return true;
    });
  }, [wells, searchQuery, statusFilter]);

  const handleOpenWell = (well: FieldWell) => {
    setSelectedWellId(well.id);
    navigate(`/well/${well.id}/overview`);
  };

  if (loading && !summary) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="chart" />
      </div>
    );
  }

  if (error || !summary) {
    return <ErrorState message={error || 'No field summary data available'} onRetry={() => loadFieldData()} />;
  }

  return (
    <div className="space-y-5">
      {/* 1. Field Header & Summary Stats */}
      <FieldHeader
        summary={summary}
        onRefresh={() => loadFieldData(true)}
        isRefreshing={isRefreshing}
      />

      {/* 2. Search, Status Pills & Layer Switcher */}
      <WellFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        activeLayer={activeLayer}
        onLayerChange={setActiveLayer}
        wells={wells}
      />

      {/* 3. Interactive Baghewala Field GIS Map */}
      <FieldMap
        wells={filteredWells}
        selectedWellId={activeWellId}
        onSelectWell={setActiveWellId}
        onOpenWell={handleOpenWell}
        activeLayer={activeLayer}
      />

      {/* 4. Synchronized Well List / Inventory Cards */}
      <WellList
        wells={filteredWells}
        selectedWellId={activeWellId}
        onSelectWell={setActiveWellId}
        onOpenWell={handleOpenWell}
      />
    </div>
  );
};
