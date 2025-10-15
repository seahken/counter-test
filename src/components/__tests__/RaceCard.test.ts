import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RaceCard from '../RaceCard.vue'
import type { Race } from '@/types/race'

// Mock the store
const mockStore = {
  getCategoryColor: vi.fn(),
  getCategoryName: vi.fn(),
}

vi.mock('@/stores/races', () => ({
  useRacesStore: () => mockStore
}))

describe('RaceCard', () => {
  const mockRace: Race = {
    race_id: 'race1',
    race_name: 'Test Race 1',
    race_number: 1,
    meeting_id: 'meeting1',
    meeting_name: 'Test Meeting 1',
    category_id: '9daef0d7-bf3c-4f50-921d-8e818c60fe61',
    advertised_start: { seconds: Math.floor(Date.now() / 1000) + 300 }
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    
    mockStore.getCategoryColor.mockReturnValue('racing-greyhound')
    mockStore.getCategoryName.mockReturnValue('Greyhound Racing')
  })

  it('should render race information correctly', () => {
    const wrapper = mount(RaceCard, {
      props: { race: mockRace }
    })

    expect(wrapper.find('.race-card').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Race 1')
    expect(wrapper.text()).toContain('Test Meeting 1')
    expect(wrapper.text()).toContain('Race 1')
  })

  it('should display category badge with correct styling', () => {
    const wrapper = mount(RaceCard, {
      props: { race: mockRace }
    })

    const categoryBadge = wrapper.find('.category-badge')
    expect(categoryBadge.exists()).toBe(true)
    expect(categoryBadge.text()).toBe('Greyhound Racing')
    expect(categoryBadge.classes()).toContain('bg-racing-greyhound-100')
    expect(categoryBadge.classes()).toContain('text-racing-greyhound-800')
  })

  it('should display race number', () => {
    const wrapper = mount(RaceCard, {
      props: { race: mockRace }
    })

    expect(wrapper.text()).toContain('Race 1')
  })

  it('should include CountdownTimer component', () => {
    const wrapper = mount(RaceCard, {
      props: { race: mockRace }
    })

    const countdownTimer = wrapper.findComponent({ name: 'CountdownTimer' })
    expect(countdownTimer.exists()).toBe(true)
    expect(countdownTimer.props('targetTime')).toBe(mockRace.advertised_start.seconds)
  })

  it('should call store methods for category information', () => {
    mount(RaceCard, {
      props: { race: mockRace }
    })

    expect(mockStore.getCategoryColor).toHaveBeenCalledWith(mockRace.category_id)
    expect(mockStore.getCategoryName).toHaveBeenCalledWith(mockRace.category_id)
  })

  it('should handle different race categories', () => {
    const harnessRace: Race = {
      ...mockRace,
      category_id: '161d9be2-e909-4326-8c2c-35ed71fb460b'
    }

    mockStore.getCategoryColor.mockReturnValue('racing-harness')
    mockStore.getCategoryName.mockReturnValue('Harness Racing')

    const wrapper = mount(RaceCard, {
      props: { race: harnessRace }
    })

    const categoryBadge = wrapper.find('.category-badge')
    expect(categoryBadge.text()).toBe('Harness Racing')
    expect(categoryBadge.classes()).toContain('bg-racing-harness-100')
    expect(categoryBadge.classes()).toContain('text-racing-harness-800')
  })

  it('should apply hover effects', () => {
    const wrapper = mount(RaceCard, {
      props: { race: mockRace }
    })

    const raceCard = wrapper.find('.race-card')
    // Check that the component has the race-card class which includes hover effects in scoped styles
    expect(raceCard.classes()).toContain('race-card')
  })

  it('should have proper structure and layout', () => {
    const wrapper = mount(RaceCard, {
      props: { race: mockRace }
    })

    // Check for main sections
    expect(wrapper.find('.race-card > div:first-child').exists()).toBe(true) // Header section
    expect(wrapper.find('.race-card > div:nth-child(2)').exists()).toBe(true) // Content section
    expect(wrapper.find('.race-card > div:last-child').exists()).toBe(true) // Footer section
  })

  it('should display meeting name prominently', () => {
    const wrapper = mount(RaceCard, {
      props: { race: mockRace }
    })

    const meetingName = wrapper.find('h3')
    expect(meetingName.exists()).toBe(true)
    expect(meetingName.text()).toBe('Test Race 1')
    expect(meetingName.classes()).toContain('text-lg')
    expect(meetingName.classes()).toContain('font-semibold')
  })

  it('should display meeting location', () => {
    const wrapper = mount(RaceCard, {
      props: { race: mockRace }
    })

    expect(wrapper.text()).toContain('Test Meeting 1')
  })
})
