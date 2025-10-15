import { describe, it, expect } from 'vitest'

// Utility functions for time formatting and calculations
export const formatTime = (seconds: number): string => {
  if (seconds <= 0) return '00:00'
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const getTimeUntil = (targetTime: number): number => {
  const now = Math.floor(Date.now() / 1000)
  return Math.max(0, targetTime - now)
}

export const isRaceExpired = (raceStartTime: number, bufferMinutes: number = 1): boolean => {
  const now = Math.floor(Date.now() / 1000)
  const bufferSeconds = bufferMinutes * 60
  return raceStartTime < (now - bufferSeconds)
}

export const getCountdownStatus = (seconds: number): 'normal' | 'warning' | 'critical' | 'expired' => {
  if (seconds <= 0) return 'expired'
  if (seconds <= 30) return 'critical'
  if (seconds <= 60) return 'warning'
  return 'normal'
}

describe('Time Utilities', () => {
  describe('formatTime', () => {
    it('should format seconds correctly', () => {
      expect(formatTime(125)).toBe('02:05')
      expect(formatTime(65)).toBe('01:05')
      expect(formatTime(5)).toBe('00:05')
      expect(formatTime(0)).toBe('00:00')
    })

    it('should handle negative values', () => {
      expect(formatTime(-10)).toBe('00:00')
      expect(formatTime(-1)).toBe('00:00')
    })

    it('should handle large values', () => {
      expect(formatTime(3661)).toBe('61:01') // 1 hour 1 minute 1 second
      expect(formatTime(7200)).toBe('120:00') // 2 hours
    })

    it('should pad single digits correctly', () => {
      expect(formatTime(61)).toBe('01:01')
      expect(formatTime(9)).toBe('00:09')
      expect(formatTime(599)).toBe('09:59')
    })
  })

  describe('getTimeUntil', () => {
    it('should return correct time until target', () => {
      const now = Math.floor(Date.now() / 1000)
      const futureTime = now + 300 // 5 minutes from now
      
      const timeUntil = getTimeUntil(futureTime)
      expect(timeUntil).toBeGreaterThan(290)
      expect(timeUntil).toBeLessThanOrEqual(300)
    })

    it('should return 0 for past times', () => {
      const now = Math.floor(Date.now() / 1000)
      const pastTime = now - 100 // 100 seconds ago
      
      const timeUntil = getTimeUntil(pastTime)
      expect(timeUntil).toBe(0)
    })

    it('should return 0 for current time', () => {
      const now = Math.floor(Date.now() / 1000)
      const timeUntil = getTimeUntil(now)
      expect(timeUntil).toBe(0)
    })
  })

  describe('isRaceExpired', () => {
    it('should return true for races that started more than buffer time ago', () => {
      const now = Math.floor(Date.now() / 1000)
      const expiredTime = now - 120 // 2 minutes ago
      
      expect(isRaceExpired(expiredTime, 1)).toBe(true)
    })

    it('should return false for races that started within buffer time', () => {
      const now = Math.floor(Date.now() / 1000)
      const recentTime = now - 30 // 30 seconds ago
      
      expect(isRaceExpired(recentTime, 1)).toBe(false)
    })

    it('should return false for future races', () => {
      const now = Math.floor(Date.now() / 1000)
      const futureTime = now + 300 // 5 minutes from now
      
      expect(isRaceExpired(futureTime, 1)).toBe(false)
    })

    it('should use custom buffer time', () => {
      const now = Math.floor(Date.now() / 1000)
      const raceTime = now - 90 // 1.5 minutes ago
      
      expect(isRaceExpired(raceTime, 2)).toBe(false) // 2 minute buffer
      expect(isRaceExpired(raceTime, 1)).toBe(true)  // 1 minute buffer
    })
  })

  describe('getCountdownStatus', () => {
    it('should return correct status for different time ranges', () => {
      expect(getCountdownStatus(300)).toBe('normal')   // 5 minutes
      expect(getCountdownStatus(90)).toBe('normal')    // 1.5 minutes
      expect(getCountdownStatus(60)).toBe('warning')   // Exactly 1 minute
      expect(getCountdownStatus(45)).toBe('warning')   // 45 seconds
      expect(getCountdownStatus(30)).toBe('critical')  // Exactly 30 seconds
      expect(getCountdownStatus(15)).toBe('critical')  // 15 seconds
      expect(getCountdownStatus(0)).toBe('expired')    // 0 seconds
      expect(getCountdownStatus(-10)).toBe('expired')  // Negative
    })

    it('should handle edge cases', () => {
      expect(getCountdownStatus(61)).toBe('normal')    // Just over 1 minute
      expect(getCountdownStatus(31)).toBe('warning')   // Just over 30 seconds
      expect(getCountdownStatus(1)).toBe('critical')   // 1 second remaining
    })
  })
})
