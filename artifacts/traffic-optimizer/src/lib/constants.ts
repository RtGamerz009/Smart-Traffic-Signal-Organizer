// Algorithm Weights
export const ALPHA = 1.5;   // Queue Length multiplier
export const BETA = 0.8;    // Waiting Time multiplier
export const GAMMA = 1.2;   // Arrival Rate multiplier
export const DELTA = 10000; // Emergency Flag multiplier (massive to override)

// Constraints
export const MIN_GREEN_TIME = 10;
export const MAX_GREEN_TIME = 60;
export const QUEUE_TIME_MULTIPLIER = 2; // seconds per vehicle in queue

export const MAX_QUEUE_VISUAL = 30; // Max cars to show visually per road

export const PRESETS = {
  BALANCED: {
    A: { queue: 5, rate: 0.5, emergency: false },
    B: { queue: 5, rate: 0.5, emergency: false },
    C: { queue: 5, rate: 0.5, emergency: false },
    D: { queue: 5, rate: 0.5, emergency: false },
  },
  RUSH_HOUR: {
    A: { queue: 25, rate: 2.5, emergency: false },
    B: { queue: 10, rate: 0.8, emergency: false },
    C: { queue: 20, rate: 2.0, emergency: false },
    D: { queue: 8, rate: 0.5, emergency: false },
  },
  EMERGENCY: {
    A: { queue: 15, rate: 1.0, emergency: false },
    B: { queue: 3, rate: 0.2, emergency: true },
    C: { queue: 20, rate: 1.5, emergency: false },
    D: { queue: 10, rate: 0.5, emergency: false },
  }
};
