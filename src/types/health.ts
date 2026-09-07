export interface SubsystemHealth {
  id: string;
  name: string;
  score: number;
  weight: number;
  status: 'Normal' | 'Watch' | 'Critical';
  color: string;
  note: string;
  dominantFactor: string;
}

export interface WellHealth {
  score: number;
  status: 'Optimal' | 'Attention advised' | 'Critical intervention';
  description: string;
  subsystems: SubsystemHealth[];
  dominantConcern: string;
}
