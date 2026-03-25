import { Road } from '../types';
import { ALPHA, BETA, GAMMA, DELTA, MIN_GREEN_TIME, MAX_GREEN_TIME, QUEUE_TIME_MULTIPLIER } from './constants';

export function calculatePriority(road: Road): number {
  const queueScore = ALPHA * road.queueLength;
  const waitScore = BETA * road.waitingTime;
  const arrivalScore = GAMMA * road.arrivalRate;
  const emergencyScore = road.hasEmergency ? DELTA : 0;

  return Number((queueScore + waitScore + arrivalScore + emergencyScore).toFixed(2));
}

export function calculateGreenDuration(queueLength: number): number {
  const desiredTime = queueLength * QUEUE_TIME_MULTIPLIER;
  return Math.min(MAX_GREEN_TIME, Math.max(MIN_GREEN_TIME, desiredTime));
}

export function determineReason(road: Road): string {
  if (road.hasEmergency) return "Emergency Override";
  if (road.waitingTime > 120) return "Starvation Prevention";
  if (road.queueLength > 20) return "Critical Congestion";
  return "Highest Priority Score";
}
