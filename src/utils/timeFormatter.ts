/**
 * Formats milliseconds into formatted time string components
 */
export interface TimeComponents {
  hours: string;
  minutes: string;
  seconds: string;
  milliseconds: string;
  hundredths: string;
  isHoursShown: boolean;
}

export function formatTimeComponents(timeMs: number): TimeComponents {
  const totalSeconds = Math.floor(timeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const hundredths = Math.floor((timeMs % 1000) / 10);
  const milliseconds = Math.floor(timeMs % 1000);

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    milliseconds: milliseconds.toString().padStart(3, '0'),
    hundredths: hundredths.toString().padStart(2, '0'),
    isHoursShown: hours > 0,
  };
}

/**
 * Formats time into "00:00" or "00:00:00"
 */
export function formatMainDisplay(timeMs: number): string {
  const { hours, minutes, seconds, isHoursShown } = formatTimeComponents(timeMs);
  if (isHoursShown) {
    return `${hours}:${minutes}:${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

/**
 * Formats hundredths / milliseconds e.g. "00" or "000"
 */
export function formatSubDisplay(timeMs: number): string {
  const { hundredths } = formatTimeComponents(timeMs);
  return hundredths;
}

/**
 * Full format e.g. "00:02.15" or "01:15:30.45"
 */
export function formatFullTime(timeMs: number): string {
  const { hours, minutes, seconds, hundredths, isHoursShown } = formatTimeComponents(timeMs);
  if (isHoursShown) {
    return `${hours}:${minutes}:${seconds}.${hundredths}`;
  }
  return `${minutes}:${seconds}.${hundredths}`;
}
