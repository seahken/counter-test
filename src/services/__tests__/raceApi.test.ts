import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { RaceApiService } from '../raceApi'
import type { Race, RaceResponse } from '@/types/race'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('RaceApiService', () => {
  let service: RaceApiService

  beforeEach(() => {
    service = RaceApiService.getInstance()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getInstance', () => {
    it('should return the same instance (singleton)', () => {
      const instance1 = RaceApiService.getInstance()
      const instance2 = RaceApiService.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('fetchRaces', () => {
    const mockRaceData: RaceResponse = {
      status: 200,
      data: {
        next_to_go_ids: ['race1', 'race2'],
        race_summaries: {
          race1: {
            race_id: 'race1',
            race_name: 'Test Race 1',
            race_number: 1,
            meeting_id: 'meeting1',
            meeting_name: 'Test Meeting 1',
            category_id: '9daef0d7-bf3c-4f50-921d-8e818c60fe61',
            advertised_start: { seconds: Math.floor(Date.now() / 1000) + 300 }
          },
          race2: {
            race_id: 'race2',
            race_name: 'Test Race 2',
            race_number: 2,
            meeting_id: 'meeting2',
            meeting_name: 'Test Meeting 2',
            category_id: '161d9be2-e909-4326-8c2c-35ed71fb460b',
            advertised_start: { seconds: Math.floor(Date.now() / 1000) + 600 }
          }
        }
      }
    }

    it('should fetch and return races successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRaceData
      })

      const races = await service.fetchRaces()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
      expect(races).toHaveLength(2)
      expect(races[0].race_id).toBe('race1')
      expect(races[1].race_id).toBe('race2')
    })

    it('should sort races by advertised_start time', async () => {
      const unsortedData = {
        ...mockRaceData,
        data: {
          ...mockRaceData.data,
          race_summaries: {
            race2: mockRaceData.data.race_summaries.race2,
            race1: mockRaceData.data.race_summaries.race1
          }
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => unsortedData
      })

      const races = await service.fetchRaces()

      expect(races[0].race_id).toBe('race1') // Earlier time
      expect(races[1].race_id).toBe('race2') // Later time
    })

    it('should throw error when fetch fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(service.fetchRaces()).rejects.toThrow('Network error')
    })

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      await expect(service.fetchRaces()).rejects.toThrow('HTTP error! status: 404')
    })

    it('should throw error when API status is not 200', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockRaceData, status: 500 })
      })

      await expect(service.fetchRaces()).rejects.toThrow('API error! status: 500')
    })
  })

  describe('filterAndSortRaces', () => {
    const now = Math.floor(Date.now() / 1000)
    const races: Race[] = [
      {
        race_id: 'race1',
        race_name: 'Test Race 1',
        race_number: 1,
        meeting_id: 'meeting1',
        meeting_name: 'Test Meeting 1',
        category_id: '9daef0d7-bf3c-4f50-921d-8e818c60fe61', // Greyhound
        advertised_start: { seconds: now + 300 }
      },
      {
        race_id: 'race2',
        race_name: 'Test Race 2',
        race_number: 2,
        meeting_id: 'meeting2',
        meeting_name: 'Test Meeting 2',
        category_id: '161d9be2-e909-4326-8c2c-35ed71fb460b', // Harness
        advertised_start: { seconds: now + 600 }
      },
      {
        race_id: 'race3',
        race_name: 'Test Race 3',
        race_number: 3,
        meeting_id: 'meeting3',
        meeting_name: 'Test Meeting 3',
        category_id: '4a2788f8-e825-4d36-9894-efd4baf1cfae', // Horse
        advertised_start: { seconds: now - 120 } // Started 2 minutes ago
      }
    ]

    it('should filter by selected categories', () => {
      const selectedCategories = ['9daef0d7-bf3c-4f50-921d-8e818c60fe61']
      const filtered = service.filterAndSortRaces(races, selectedCategories)

      expect(filtered).toHaveLength(1)
      expect(filtered[0].race_id).toBe('race1')
    })

    it('should return all races when no categories selected', () => {
      const filtered = service.filterAndSortRaces(races, [])

      expect(filtered).toHaveLength(2) // race3 is filtered out due to time
      expect(filtered[0].race_id).toBe('race1')
      expect(filtered[1].race_id).toBe('race2')
    })

    it('should remove races that started more than 1 minute ago', () => {
      const filtered = service.filterAndSortRaces(races, [])

      expect(filtered.find(r => r.race_id === 'race3')).toBeUndefined()
    })

    it('should limit results to 5 races', () => {
      const manyRaces = Array.from({ length: 10 }, (_, i) => ({
        ...races[0],
        race_id: `race${i}`,
        advertised_start: { seconds: now + (i * 60) }
      }))

      const filtered = service.filterAndSortRaces(manyRaces, [])

      expect(filtered).toHaveLength(5)
    })
  })

  describe('getCountdownSeconds', () => {
    it('should return correct countdown seconds', () => {
      const now = Math.floor(Date.now() / 1000)
      const race: Race = {
        race_id: 'race1',
        race_name: 'Test Race',
        race_number: 1,
        meeting_id: 'meeting1',
        meeting_name: 'Test Meeting',
        category_id: '9daef0d7-bf3c-4f50-921d-8e818c60fe61',
        advertised_start: { seconds: now + 300 }
      }

      const countdown = service.getCountdownSeconds(race)
      expect(countdown).toBeGreaterThan(290)
      expect(countdown).toBeLessThanOrEqual(300)
    })

    it('should return 0 for races that have already started', () => {
      const now = Math.floor(Date.now() / 1000)
      const race: Race = {
        race_id: 'race1',
        race_name: 'Test Race',
        race_number: 1,
        meeting_id: 'meeting1',
        meeting_name: 'Test Meeting',
        category_id: '9daef0d7-bf3c-4f50-921d-8e818c60fe61',
        advertised_start: { seconds: now - 60 }
      }

      const countdown = service.getCountdownSeconds(race)
      expect(countdown).toBe(0)
    })
  })

  describe('formatCountdown', () => {
    it('should format seconds correctly', () => {
      expect(service.formatCountdown(125)).toBe('02:05')
      expect(service.formatCountdown(65)).toBe('01:05')
      expect(service.formatCountdown(5)).toBe('00:05')
      expect(service.formatCountdown(0)).toBe('00:00')
      expect(service.formatCountdown(-10)).toBe('00:00')
    })
  })
})
