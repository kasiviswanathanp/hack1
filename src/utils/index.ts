import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoString?: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return isoString;
  }
}

export function formatTimeRelative(isoString?: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  } catch {
    return isoString;
  }
}

export interface SLACalculation {
  isOverdue: boolean;
  timeRemainingText: string;
  overdueDurationText?: string;
  percentElapsed: number;
  badgeVariant: 'safe' | 'warning' | 'critical' | 'overdue';
}

export function calculateSLA(deadlineIso?: string, startIso?: string): SLACalculation {
  if (!deadlineIso) {
    return {
      isOverdue: false,
      timeRemainingText: 'N/A',
      percentElapsed: 0,
      badgeVariant: 'safe',
    };
  }

  const now = Date.now();
  const deadline = new Date(deadlineIso).getTime();
  const start = startIso ? new Date(startIso).getTime() : deadline - 24 * 60 * 60 * 1000;

  const totalDuration = Math.max(1, deadline - start);
  const elapsed = now - start;
  const percentElapsed = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));

  const diffMs = deadline - now;

  if (diffMs <= 0) {
    const overdueMs = Math.abs(diffMs);
    const overdueHours = Math.floor(overdueMs / (1000 * 60 * 60));
    const overdueMins = Math.floor((overdueMs % (1000 * 60 * 60)) / (1000 * 60));
    return {
      isOverdue: true,
      timeRemainingText: 'Response deadline exceeded',
      overdueDurationText: overdueHours > 0 ? `${overdueHours}h ${overdueMins}m overdue` : `${overdueMins}m overdue`,
      percentElapsed: 100,
      badgeVariant: 'overdue',
    };
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  let badgeVariant: 'safe' | 'warning' | 'critical' = 'safe';
  if (percentElapsed > 85 || hours < 3) {
    badgeVariant = 'critical';
  } else if (percentElapsed > 60 || hours < 8) {
    badgeVariant = 'warning';
  }

  return {
    isOverdue: false,
    timeRemainingText: `${hours}h ${minutes}m remaining`,
    percentElapsed,
    badgeVariant,
  };
}

export function generateComplaintId(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `CIV-${year}-${rand}`;
}

export function generateWorkOrderId(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `WO-${year}-${rand}`;
}
