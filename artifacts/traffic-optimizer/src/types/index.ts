export interface Road {
  id: 'A' | 'B' | 'C' | 'D';
  name: string; // 'North', 'East', 'South', 'West'
  queueLength: number;
  waitingTime: number; // in seconds
  arrivalRate: number; // vehicles per second
  hasEmergency: boolean;
  priorityScore: number;
  totalCleared: number;
  totalWaitTime: number;
  // Internal tracker for fractional arrivals between seconds
  pendingArrivals: number; 
}

export interface CycleRecord {
  cycle: number;
  selectedRoad: string;
  scores: Record<string, number>;
  greenDuration: number;
  vehiclesCleared: number;
  remainingQueue: number;
  reason: string;
}

export interface SimulationState {
  roads: Road[];
  currentGreenRoad: 'A' | 'B' | 'C' | 'D' | null;
  greenTimeRemaining: number;
  greenDuration: number;
  cycleNumber: number;
  isRunning: boolean;
  speed: number;
  history: CycleRecord[];
  totalTimeElapsed: number;
}
