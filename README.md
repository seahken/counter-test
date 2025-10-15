# Next to Go Races - Vue.js Application

A modern single-page application that displays "Next to go" races using the Neds API. Built with Vue.js 3, TypeScript, Tailwind CSS, and Pinia for state management.

## 🏁 Features

- **Real-time Race Display**: Shows up to 5 upcoming races sorted by start time
- **Category Filtering**: Toggle between Greyhound, Harness, and Horse racing
- **Live Countdown Timers**: Real-time countdown to race start with visual indicators
- **Auto-refresh**: Automatically updates race data every 30 seconds
- **Smart Race Removal**: Races automatically disappear 1 minute after their start time
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Error Handling**: Graceful error states and loading indicators

## 🚀 Quick Start

### Prerequisites

- Node.js (v20.19.0 or >=22.12.0)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <directory name>
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
# Build the application
pnpm build

# Preview the production build
pnpm preview
```

## 🏗️ Architecture

### Tech Stack

- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework with custom branding
- **Pinia** - Vue state management
- **Vite** - Fast build tool and dev server

### Project Structure

```
src/
├── components/          # Vue components
│   ├── CategoryFilter.vue    # Category selection component
│   ├── CountdownTimer.vue    # Live countdown timer
│   └── RaceCard.vue          # Individual race display
├── services/           # API services
│   └── raceApi.ts           # Neds API integration
├── stores/             # Pinia stores
│   └── races.ts             # Race data and filtering logic
├── types/              # TypeScript definitions
│   └── race.ts              # Race data interfaces
├── App.vue             # Main application component
├── main.ts             # Application entry point
└── style.css           # Global styles and Tailwind imports
```

### Key Components

#### RaceCard Component
Displays individual race information including:
- Meeting name and race number
- Category badge with color coding
- Live countdown timer with visual states

#### CategoryFilter Component
Provides filtering functionality:
- Toggle individual categories
- Select all / clear all options
- Visual feedback for selected categories

#### CountdownTimer Component
Real-time countdown with:
- MM:SS format display
- Color-coded urgency (normal → warning → critical)
- Automatic cleanup when component unmounts

## 🎨 Design System

### Custom Branding
The application uses a custom color palette defined in `tailwind.config.js`:

- **Primary Colors**: Blue spectrum for main UI elements
- **Racing Categories**:
  - Greyhound Racing: Purple (`racing-greyhound`)
  - Harness Racing: Cyan (`racing-harness`) 
  - Horse Racing: Green (`racing-horse`)
- **Danger Colors**: Red spectrum for urgent states

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interface elements
- Optimized for all screen sizes

## 🔧 Configuration

### Environment Variables
No environment variables are required. The application uses the public Neds API endpoint.

### API Configuration
The Neds API endpoint is configured in `src/types/race.ts`:
```typescript
export const NEDS_API_URL = 'https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10';
```

### Auto-refresh Settings
The application automatically refreshes race data every 30 seconds. This can be modified in `src/App.vue`:
```typescript
racesStore.startAutoRefresh(30000); // 30 seconds
```

## 📱 Usage

### Viewing Races
1. The application loads with all available races
2. Races are automatically sorted by start time (ascending)
3. Only races starting within the next minute are shown
4. Maximum of 5 races displayed at once

### Filtering by Category
1. Use the category filter sidebar on the left
2. Check/uncheck categories to filter races
3. Use "Select All" or "Clear All" for quick selection
4. Selected categories are highlighted with colored badges

### Understanding the Countdown
- **Blue**: Normal countdown (>60 seconds)
- **Orange**: Warning state (30-60 seconds)
- **Red**: Critical state (<30 seconds)
- **Green**: Race has started or passed

## 🧪 Development

### Available Scripts

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm format

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests once
pnpm test:run

# Run tests with coverage
pnpm test:coverage
```

### Testing
The application includes comprehensive unit testing with:

- **Vitest**: Fast unit testing framework
- **Vue Test Utils**: Vue component testing utilities
- **Happy DOM**: Lightweight DOM implementation for testing
- **Test Coverage**: API services, Pinia stores, Vue components, and utilities

#### Test Structure
```
src/
├── components/__tests__/     # Component unit tests
├── services/__tests__/       # API service tests
├── stores/__tests__/         # Pinia store tests
├── utils/__tests__/          # Utility function tests
└── test/
    └── setup.ts              # Test configuration and mocks
```

#### Running Tests
```bash
# Run all tests in watch mode
pnpm test

# Run tests once (CI mode)
pnpm test:run

# Run tests with interactive UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

### Code Quality
- **ESLint**: Code linting with Vue and TypeScript rules
- **Prettier**: Code formatting
- **TypeScript**: Type safety and IntelliSense
- **Oxlint**: Fast linting for development
- **Vitest**: Unit testing and coverage

## 🚨 Error Handling

The application includes comprehensive error handling:

- **Network Errors**: Displays user-friendly error messages
- **API Errors**: Handles non-200 responses gracefully
- **Loading States**: Shows loading indicators during data fetching
- **Empty States**: Informative messages when no races are available

## 🔄 Data Flow

1. **Initial Load**: App fetches races from Neds API
2. **Filtering**: Races filtered by selected categories and time
3. **Sorting**: Races sorted by start time (ascending)
4. **Display**: Up to 5 races shown with live countdowns
5. **Auto-refresh**: Data refreshes every 30 seconds
6. **Cleanup**: Races older than 1 minute are automatically removed

## 🎯 Race Categories

The application supports three racing categories with specific IDs:

- **Greyhound Racing**: `9daef0d7-bf3c-4f50-921d-8e818c60fe61`
- **Harness Racing**: `161d9be2-e909-4326-8c2c-35ed71fb460b`
- **Horse Racing**: `4a2788f8-e825-4d36-9894-efd4baf1cfae`

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Pinia](https://pinia.vuejs.org/) - Vue state management
- [Neds API](https://api.neds.com.au/) - Racing data provider
