import { useState, useEffect, useCallback, useRef } from 'react';
import { Road, SimulationState, CycleRecord } from '../types';
import { calculatePriority, calculateGreenDuration, determineReason } from '../lib/priorityCalculator';

const INITIAL_ROADS: Road[] = [
  { id: 'A', name: 'North', queueLength: 10, waitingTime: 0, arrivalRate: 0.5, hasEmergency: false, priorityScore: 0, totalCleared: 0, totalWaitTime: 0, pendingArrivals: 0 },
  { id: 'B', name: 'East', queueLength: 8, waitingTime: 0, arrivalRate: 0.4, hasEmergency: false, priorityScore: 0, totalCleared: 0, totalWaitTime: 0, pendingArrivals: 0 },
  { id: 'C', name: 'South', queueLength: 15, waitingTime: 0, arrivalRate: 0.8, hasEmergency: false, priorityScore: 0, totalCleared: 0, totalWaitTime: 0, pendingArrivals: 0 },
  { id: 'D', name: 'West', queueLength: 5, waitingTime: 0, arrivalRate: 0.2, hasEmergency: false, priorityScore: 0, totalCleared: 0, totalWaitTime: 0, pendingArrivals: 0 },
];

const INITIAL_STATE: SimulationState = {
  roads: INITIAL_ROADS,
  currentGreenRoad: null,
  greenTimeRemaining: 0,
  greenDuration: 0,
  cycleNumber: 0,
  isRunning: false,
  speed: 1,
  history: [],
  totalTimeElapsed: 0,
};

export function useSimulation() {
  const [state, setState] = useState<SimulationState>(INITIAL_STATE);
  const stateRef = useRef(state);
  
  // Keep ref in sync for interval closure
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const tick = useCallback(() => {
    setState(prev => {
      let nextState = { ...prev, totalTimeElapsed: prev.totalTimeElapsed + 1 };
      let roads = [...prev.roads];

      // 1. Process Arrivals & Wait Times for ALL roads
      roads = roads.map(road => {
        let newPending = road.pendingArrivals + road.arrivalRate;
        let newArrivals = Math.floor(newPending);
        
        return {
          ...road,
          pendingArrivals: newPending - newArrivals,
          queueLength: road.queueLength + newArrivals,
          // Only increase wait time if NOT currently green
          waitingTime: road.id !== prev.currentGreenRoad ? road.waitingTime + 1 : road.waitingTime,
          totalWaitTime: road.id !== prev.currentGreenRoad ? road.totalWaitTime + (road.queueLength + newArrivals) : road.totalWaitTime
        };
      });

      // 2. Process Current Green Phase
      if (prev.greenTimeRemaining > 0 && prev.currentGreenRoad) {
        nextState.greenTimeRemaining = prev.greenTimeRemaining - 1;
        
        const greenIdx = roads.findIndex(r => r.id === prev.currentGreenRoad);
        if (greenIdx !== -1 && roads[greenIdx].queueLength > 0) {
          // Clear 1 vehicle per second while green
          roads[greenIdx].queueLength -= 1;
          roads[greenIdx].totalCleared += 1;
          // If emergency vehicle passes, clear flag (assuming 1 emergency vehicle at front)
          if (roads[greenIdx].hasEmergency) {
            roads[greenIdx].hasEmergency = false;
          }
        }
      } 
      
      // 3. Switch Phase if Green Time is Up (or starting for first time)
      if (nextState.greenTimeRemaining <= 0) {
        // Calculate new priorities
        roads = roads.map(r => ({ ...r, priorityScore: calculatePriority(r) }));
        
        // Find highest priority
        const nextRoad = [...roads].sort((a, b) => b.priorityScore - a.priorityScore)[0];
        
        // Setup new phase
        nextState.currentGreenRoad = nextRoad.id;
        nextState.greenDuration = calculateGreenDuration(nextRoad.queueLength);
        nextState.greenTimeRemaining = nextState.greenDuration;
        nextState.cycleNumber = prev.cycleNumber + 1;
        
        // Reset wait time for chosen road
        const nextIdx = roads.findIndex(r => r.id === nextRoad.id);
        roads[nextIdx].waitingTime = 0;

        // Record History
        const scores = roads.reduce((acc, r) => ({ ...acc, [r.id]: r.priorityScore }), {});
        const newRecord: CycleRecord = {
          cycle: nextState.cycleNumber,
          selectedRoad: nextRoad.name,
          scores,
          greenDuration: nextState.greenDuration,
          vehiclesCleared: 0, // Will be updated next cycle or calculated differently, simplifying for now
          remainingQueue: nextRoad.queueLength,
          reason: determineReason(nextRoad)
        };
        
        nextState.history = [newRecord, ...prev.history].slice(0, 20); // Keep last 20
      }

      nextState.roads = roads;
      return nextState;
    });
  }, []);

  // Interval Engine
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if (state.isRunning) {
      // 1000ms = 1 real second. Divided by speed multiplier.
      const intervalMs = 1000 / state.speed;
      intervalId = setInterval(tick, intervalMs);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [state.isRunning, state.speed, tick]);

  const toggleSimulation = () => setState(p => ({ ...p, isRunning: !p.isRunning }));
  const resetSimulation = () => setState(INITIAL_STATE);
  const setSpeed = (speed: number) => setState(p => ({ ...p, speed }));
  
  const updateRoad = (id: string, updates: Partial<Road>) => {
    setState(p => ({
      ...p,
      roads: p.roads.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  };

  const applyPreset = (preset: Record<string, { queue: number, rate: number, emergency: boolean }>) => {
    setState(p => ({
      ...p,
      roads: p.roads.map(r => ({
        ...r,
        queueLength: preset[r.id].queue,
        arrivalRate: preset[r.id].rate,
        hasEmergency: preset[r.id].emergency,
        waitingTime: 0, // Reset wait times on preset change
      })),
      history: [],
      cycleNumber: 0,
      currentGreenRoad: null,
      greenTimeRemaining: 0,
    }));
  };

  return {
    state,
    toggleSimulation,
    resetSimulation,
    setSpeed,
    updateRoad,
    applyPreset
  };
}
