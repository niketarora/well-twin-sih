import { resolveManifestRoute, getManifestEntryById } from './manifest';
import { useUIStore } from '../../../stores/useUIStore';

export interface ExecuteNavigationOptions {
  target: string;
  wellId?: string;
  navigate: (path: string) => void;
}

export const executeNavigation = ({ target, wellId, navigate }: ExecuteNavigationOptions): boolean => {
  const entry = getManifestEntryById(target);
  if (!entry) {
    console.warn(`[Navigator] Cannot navigate: target '${target}' is not in the Website Manifest.`);
    return false;
  }

  const cleanWellId = wellId || useUIStore.getState().selectedWellId || 'well-bw-017';

  // Normalize well selection in global UI store
  if (entry.requiresWell && cleanWellId) {
    useUIStore.getState().setSelectedWellId(cleanWellId);
  }

  const targetRoute = resolveManifestRoute(target, cleanWellId);
  navigate(targetRoute);
  return true;
};
