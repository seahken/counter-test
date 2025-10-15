import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CountdownTimer from '../CountdownTimer.vue'

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render countdown timer', () => {
    const targetTime = Math.floor(Date.now() / 1000) + 300 // 5 minutes from now
    const wrapper = mount(CountdownTimer, {
      props: { targetTime }
    })

    expect(wrapper.find('.countdown-timer').exists()).toBe(true)
    expect(wrapper.text()).toMatch(/\d{2}:\d{2}/)
  })

  it('should display correct time format', () => {
    const targetTime = Math.floor(Date.now() / 1000) + 125 // 2 minutes 5 seconds
    const wrapper = mount(CountdownTimer, {
      props: { targetTime }
    })

    expect(wrapper.text()).toBe('Starting in: 02:05')
  })

  it('should update countdown every second', async () => {
    const targetTime = Math.floor(Date.now() / 1000) + 3 // 3 seconds from now
    const wrapper = mount(CountdownTimer, {
      props: { targetTime }
    })

    expect(wrapper.text()).toBe('Starting in: 00:03')

    // Advance time by 1 second
    vi.advanceTimersByTime(1000)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toBe('Starting in: 00:02')

    // Advance time by 1 more second
    vi.advanceTimersByTime(1000)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toBe('Starting in: 00:01')
  })

  it('should show 00:00 when time has passed', async () => {
    const targetTime = Math.floor(Date.now() / 1000) - 10 // 10 seconds ago
    const wrapper = mount(CountdownTimer, {
      props: { targetTime }
    })

    expect(wrapper.text()).toBe('Started')
  })

  it('should apply warning class when less than 60 seconds', async () => {
    const targetTime = Math.floor(Date.now() / 1000) + 45 // 45 seconds from now
    const wrapper = mount(CountdownTimer, {
      props: { targetTime }
    })

    const timerElement = wrapper.find('.countdown-timer')
    expect(timerElement.classes()).toContain('countdown-warning')
    expect(timerElement.classes()).toContain('text-danger-600')
  })

  it('should apply critical class when less than 30 seconds', async () => {
    const targetTime = Math.floor(Date.now() / 1000) + 15 // 15 seconds from now
    const wrapper = mount(CountdownTimer, {
      props: { targetTime }
    })

    const timerElement = wrapper.find('.countdown-timer')
    expect(timerElement.classes()).toContain('countdown-critical')
    expect(timerElement.classes()).toContain('text-danger-700')
  })

  it('should clean up interval on unmount', () => {
    const targetTime = Math.floor(Date.now() / 1000) + 300
    const wrapper = mount(CountdownTimer, {
      props: { targetTime }
    })

    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
    
    wrapper.unmount()
    
    expect(clearIntervalSpy).toHaveBeenCalled()
  })

  it('should handle edge case of exactly 30 seconds', async () => {
    const targetTime = Math.floor(Date.now() / 1000) + 30 // Exactly 30 seconds
    const wrapper = mount(CountdownTimer, {
      props: { targetTime }
    })

    const timerElement = wrapper.find('.countdown-timer')
    expect(timerElement.classes()).toContain('countdown-critical')
    expect(timerElement.classes()).toContain('text-danger-700')
  })

  it('should handle edge case of exactly 60 seconds', async () => {
    const targetTime = Math.floor(Date.now() / 1000) + 60 // Exactly 60 seconds
    const wrapper = mount(CountdownTimer, {
      props: { targetTime }
    })

    const timerElement = wrapper.find('.countdown-timer')
    expect(timerElement.classes()).toContain('countdown-warning')
    expect(timerElement.classes()).toContain('text-danger-600')
  })
})
