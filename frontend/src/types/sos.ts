// Manual SOS types. These mirror the backend contract exactly
// (backend/app/schemas/incident.py) - no fields are invented here.

export type SosCategory =
  | 'FIRE_SMOKE'
  | 'UNUSUAL_SMELL'
  | 'SUSPECTED_LEAK'
  | 'FLUID_LEAK'
  | 'MEDICAL_EMERGENCY'
  | 'EQUIPMENT_HAZARD'
  | 'PERSONNEL_DANGER'
  | 'OTHER';

export interface SosCategoryOption {
  value: SosCategory;
  label: string;
}

export const SOS_CATEGORY_OPTIONS: SosCategoryOption[] = [
  { value: 'FIRE_SMOKE', label: 'Fire / Smoke' },
  { value: 'UNUSUAL_SMELL', label: 'Unusual Smell' },
  { value: 'SUSPECTED_LEAK', label: 'Suspected Leak' },
  { value: 'FLUID_LEAK', label: 'Oil / Fluid Leak' },
  { value: 'MEDICAL_EMERGENCY', label: 'Medical Emergency' },
  { value: 'EQUIPMENT_HAZARD', label: 'Equipment Hazard' },
  { value: 'PERSONNEL_DANGER', label: 'Personnel Danger' },
  { value: 'OTHER', label: 'Other Emergency' },
];

// Request body for POST /api/v1/sos - matches SosCreateRequest.
export interface SosRequest {
  category: SosCategory;
  well_id?: string;
  location_description?: string;
  description?: string;
}

// Matches IncidentResponse (backend/app/schemas/incident.py).
export interface IncidentResponse {
  id: string;
  created_at: string;
  updated_at: string;
  source_type: string;
  category: string;
  status: string;
  well_id?: string | null;
  location_description?: string | null;
  description?: string | null;
  reporter_name?: string | null;
  reporter_role?: string | null;
  reporter_contact?: string | null;
  possible_duplicate_of?: string | null;
  acknowledged_by?: string | null;
  acknowledged_at?: string | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  resolution_notes?: string | null;
  escalation_level: number;
  escalated_at?: string | null;
  escalated_by?: string | null;
  escalation_notes?: string | null;
}

// Matches NotificationResultSchema.
export interface SosNotificationResult {
  contact_name?: string | null;
  contact_role?: string | null;
  channel: string; // SMS, VOICE
  provider: string; // mock, twilio
  status: string; // MOCK_SENT, SENT, FAILED
}

// Matches SosResponse - the exact shape returned by POST /api/v1/sos.
export interface SosResponse {
  incident: IncidentResponse;
  notifications: SosNotificationResult[];
}
