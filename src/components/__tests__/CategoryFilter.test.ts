import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CategoryFilter from '../CategoryFilter.vue'

// Mock the store
const mockStore = {
  availableCategories: [
    {
      id: '9daef0d7-bf3c-4f50-921d-8e818c60fe61',
      name: 'Greyhound Racing',
      color: 'racing-greyhound'
    },
    {
      id: '161d9be2-e909-4326-8c2c-35ed71fb460b',
      name: 'Harness Racing',
      color: 'racing-harness'
    },
    {
      id: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
      name: 'Horse Racing',
      color: 'racing-horse'
    }
  ],
  selectedCategories: [],
  selectedCategoryNames: [],
  toggleCategory: vi.fn(),
  selectAllCategories: vi.fn(),
  clearAllCategories: vi.fn(),
}

vi.mock('@/stores/races', () => ({
  useRacesStore: () => mockStore
}))

describe('CategoryFilter', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    // Reset mock state
    Object.assign(mockStore, {
      selectedCategories: [],
      selectedCategoryNames: []
    })
  })

  it('should render category filter component', () => {
    const wrapper = mount(CategoryFilter)

    expect(wrapper.find('.bg-white').exists()).toBe(true)
    expect(wrapper.text()).toContain('Filter by Category')
  })

  it('should display all available categories', () => {
    const wrapper = mount(CategoryFilter)

    expect(wrapper.text()).toContain('Greyhound Racing')
    expect(wrapper.text()).toContain('Harness Racing')
    expect(wrapper.text()).toContain('Horse Racing')
  })

  it('should render category checkboxes', () => {
    const wrapper = mount(CategoryFilter)

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    expect(checkboxes).toHaveLength(3)
  })

  it('should call toggleCategory when checkbox is clicked', async () => {
    const wrapper = mount(CategoryFilter)

    const firstCheckbox = wrapper.find('input[type="checkbox"]')
    await firstCheckbox.trigger('change')

    expect(mockStore.toggleCategory).toHaveBeenCalledWith('9daef0d7-bf3c-4f50-921d-8e818c60fe61')
  })

  it('should call selectAllCategories when Select All is clicked', async () => {
    const wrapper = mount(CategoryFilter)

    const selectAllButton = wrapper.findAll('button').find(btn => btn.text().includes('Select All'))
    expect(selectAllButton).toBeTruthy()
    await selectAllButton!.trigger('click')

    expect(mockStore.selectAllCategories).toHaveBeenCalled()
  })

  it('should call clearAllCategories when Clear All is clicked', async () => {
    const wrapper = mount(CategoryFilter)

    const clearAllButton = wrapper.findAll('button').find(btn => btn.text().includes('Clear All'))
    expect(clearAllButton).toBeTruthy()
    await clearAllButton!.trigger('click')

    expect(mockStore.clearAllCategories).toHaveBeenCalled()
  })

  it('should display selected categories when any are selected', () => {
    // Update the mock to have selected categories
    Object.assign(mockStore, {
      selectedCategoryNames: ['Greyhound Racing', 'Horse Racing']
    })
    
    const wrapper = mount(CategoryFilter)

    expect(wrapper.text()).toContain('Filter by Category')
    expect(wrapper.text()).toContain('Greyhound Racing')
    expect(wrapper.text()).toContain('Horse Racing')
  })

  it('should display "No categories selected" message when none are selected', () => {
    const wrapper = mount(CategoryFilter)

    expect(wrapper.text()).toContain('No categories selected. All races will be shown.')
  })

  it('should render category color indicators', () => {
    const wrapper = mount(CategoryFilter)

    const colorIndicators = wrapper.findAll('.w-3.h-3.rounded-full')
    expect(colorIndicators).toHaveLength(3)
    
    expect(colorIndicators[0].classes()).toContain('bg-racing-greyhound-500')
    expect(colorIndicators[1].classes()).toContain('bg-racing-harness-500')
    expect(colorIndicators[2].classes()).toContain('bg-racing-horse-500')
  })

  it('should have proper checkbox styling', () => {
    const wrapper = mount(CategoryFilter)

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    checkboxes.forEach(checkbox => {
      expect(checkbox.classes()).toContain('h-4')
      expect(checkbox.classes()).toContain('w-4')
      expect(checkbox.classes()).toContain('text-primary-600')
      expect(checkbox.classes()).toContain('focus:ring-primary-500')
    })
  })

  it('should have hover effects on category labels', () => {
    const wrapper = mount(CategoryFilter)

    const labels = wrapper.findAll('label')
    labels.forEach(label => {
      expect(label.classes()).toContain('hover:bg-gray-50')
      expect(label.classes()).toContain('cursor-pointer')
    })
  })


  it('should have proper layout structure', () => {
    const wrapper = mount(CategoryFilter)

    // Check for main sections
    expect(wrapper.find('h2').exists()).toBe(true) // Title
    expect(wrapper.find('.space-y-3').exists()).toBe(true) // Categories list
    expect(wrapper.find('.mt-4.pt-4.border-t').exists()).toBe(true) // Selected categories section
  })

  it('should have responsive design classes', () => {
    const wrapper = mount(CategoryFilter)

    const container = wrapper.find('.bg-white.rounded-lg.shadow-md')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('p-6')
  })
})
