# KU Club Frontend

A Next.js application for discovering and managing student clubs and activities at Kasetsart University.

## 🚀 Quick Start

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page
│   ├── organizations/           # Organization pages
│   │   ├── page.tsx            # Organizations listing page
│   │   └── [id]/               # Dynamic organization detail
│   │       └── page.tsx        # Organization detail page
│   └── projects/               # Project pages
│       ├── page.tsx            # Projects listing page
│       └── [id]/               # Dynamic project detail
│           └── page.tsx        # Project detail page
│
├── components/                  # Reusable UI components
│   ├── home/                   # Home page specific components
│   │   ├── heroSection.tsx     # Main hero section with search
│   │   ├── categorySection.tsx # Category filters and stats
│   │   ├── organizationSection.tsx # Organization grid display
│   │   └── upcomingProjectSection.tsx # Upcoming events section
│   │
│   ├── layout/                 # Layout components
│   │   ├── Navbar.tsx          # Main navigation with theme toggle
│   │   └── Footer.tsx          # Site footer
│   │
│   ├── organization/           # Organization related components
│   │   ├── organizationGrid.tsx # Grid layout for organizations
│   │   ├── organizationContent.tsx # Content wrapper with pagination
│   │   ├── organizationEnhancedFilters.tsx # Advanced filtering
│   │   ├── organizationHeader.tsx # Page header with error handling
│   │   └── [id]/              # Organization detail components
│   │       ├── heroSection.tsx # Organization hero banner
│   │       ├── aboutSection.tsx # About information
│   │       ├── projectSection.tsx # Related projects
│   │       └── sidebarSection.tsx # Additional info sidebar
│   │
│   ├── project/               # Project related components
│   │   ├── projectList.tsx    # List view for projects
│   │   ├── calendarViewSection.tsx # Calendar view
│   │   ├── viewToggle.tsx     # Switch between list/calendar
│   │   ├── MonthSelector.tsx  # Month navigation
│   │   ├── ActivityTypeFilter.tsx # Activity type filtering
│   │   ├── selectedDate.tsx   # Selected date projects display
│   │   └── [id]/             # Project detail components
│   │       ├── heroSection.tsx # Project hero with date display
│   │       ├── projectContentSection.tsx # Main content
│   │       ├── projectSidebarSection.tsx # Sidebar info
│   │       └── competencyActiviSection.tsx # Activity hours display
│   │
│   └── ui/                    # Generic UI components
│       ├── cardOrganization.tsx # Organization card component
│       ├── cardProject.tsx    # Project card component
│       ├── dateDisplay.tsx    # Date formatting component
│       ├── vortex.tsx         # Animated background effect
│       ├── loading/           # Loading state components
│       ├── error/             # Error state components
│       └── empty/             # Empty state components
│
├── contexts/                   # React Context providers
│   ├── ThemeContext.tsx       # Dark/light theme management
│   └── AuthContext.tsx        # Authentication state (future use)
│
├── hooks/                     # Custom React hooks
│   ├── useApi.ts             # Generic API hook
│   ├── useAuth.ts            # Authentication hook
│   ├── useThemeUtils.ts      # Theme utility hook
│   ├── useOrganization.ts    # Organization data hooks
│   ├── useOrganizationType.ts # Organization type hooks
│   ├── useProject.ts         # Project data hooks
│   └── useCampuses.ts        # Campus data hooks
│
├── services/                  # External service integrations
│   ├── apiService.ts         # HTTP client configuration
│   └── authService.ts        # Authentication service
│
├── types/                     # TypeScript type definitions
│   ├── auth.ts               # Authentication types
│   ├── organization.ts       # Organization data types
│   ├── organizationType.ts   # Organization type definitions
│   ├── project.ts            # Project data types
│   └── storage.ts            # Local storage types
│
├── utils/                     # Utility functions
│   ├── theme.ts              # Theme helper functions
│   ├── formatdate.ts         # Date formatting utilities
│   └── calendarUtils.ts      # Calendar and activity utilities
│
├── constants/                 # Application constants
│   └── activity.ts           # Activity type definitions and labels
│
├── configs/                   # Configuration files
│   └── API.config.ts         # API endpoints and configuration
│
├── styles/                    # Styling files
│   ├── globals.css           # Global styles and Tailwind
│   └── calendar.css          # Calendar specific styles
│
└── assets/                    # Static assets
    └── logo.png              # Application logo
```

## 🏗️ Architecture Overview

### App Router Structure
The application uses Next.js 13+ App Router with the following structure:
- **`app/`**: Contains all pages and layouts
- **Dynamic routes**: `[id]` folders for detail pages
- **Layout**: Root layout provides theme and auth contexts

### Component Organization

#### Feature-Based Structure
Components are organized by feature areas:
- **`home/`**: Landing page components
- **`organization/`**: Club/organization related UI
- **`project/`**: Event/project related UI
- **`layout/`**: Site-wide layout components
- **`ui/`**: Reusable, generic components

#### Component Naming Convention
- **PascalCase**: All component files use PascalCase
- **Descriptive names**: Components clearly indicate their purpose
- **Grouped by feature**: Related components are co-located

### Data Management

#### Custom Hooks Pattern
All data fetching is handled through custom hooks:
```typescript
// Example hook usage
const { organizations, loading, error } = useOrganizations();
```

#### API Service Layer
- **Centralized HTTP client**: `apiService.ts` handles all API calls
- **Error handling**: Consistent error handling across the app
- **Type safety**: Full TypeScript support for API responses

#### State Management
- **React Context**: Global state (theme, auth) via Context API
- **Local state**: Component-specific state with useState
- **Server state**: API data managed by custom hooks

### Styling Architecture

#### Tailwind CSS
- **Utility-first**: All styling uses Tailwind CSS classes
- **Custom utilities**: Extended with project-specific utilities
- **Responsive design**: Mobile-first responsive approach

#### Theme System
```typescript
// Dynamic theme values
const themeValues = {
  cardBg: getValueForTheme(
    "bg-white/5 border-white/10", // Dark mode
    "bg-white border-gray-200"    // Light mode
  )
};
```

#### Component Styling Pattern
- **Theme-aware**: All components support dark/light themes
- **Utility composition**: Complex styles built from utility classes
- **Performance optimized**: Memoized theme calculations

### Type Safety

#### Comprehensive TypeScript
- **Full type coverage**: All components, hooks, and utilities typed
- **API types**: Generated types for all API responses
- **Strict configuration**: TypeScript strict mode enabled

#### Type Organization
```typescript
// Example type structure
export interface Organization {
  id: string;
  orgnameth: string;
  orgnameen: string;
  // ... other properties
}
```

### Performance Optimizations

#### React Optimizations
- **React.memo**: Performance-critical components memoized
- **useMemo/useCallback**: Expensive calculations and functions memoized
- **Lazy loading**: Components loaded on demand

#### Rendering Optimizations
- **Virtualization**: Large lists use virtual scrolling
- **Pagination**: Data split into manageable chunks
- **Caching**: API responses cached appropriately

## 🎨 UI/UX Features

### Theme System
- **Dark/Light modes**: Complete theme switching support
- **System preference**: Follows OS theme preference
- **Persistent**: Theme choice saved to localStorage

### Responsive Design
- **Mobile-first**: Designed for mobile devices first
- **Breakpoint system**: Uses Tailwind's responsive utilities
- **Touch-friendly**: Optimized for touch interactions

### Animation & Effects
- **Framer Motion**: Smooth animations and transitions
- **Loading states**: Skeleton loading for better UX
- **Micro-interactions**: Hover effects and feedback

## 🔧 Configuration

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_API_NETWORK=http://10.31.37.199:4000
NEXT_PUBLIC_API_PREFIX=/api
NEXT_PUBLIC_CLIENT_SECRET=TokenDEV123
NEXT_PUBLIC_NETWORK=192.168.1.169
```

### API Configuration
The app supports multiple API endpoints based on network conditions:
- **Local development**: `localhost:4000`
- **Network mode**: Configurable network IP
- **Dynamic switching**: Automatically detects appropriate endpoint

## 📱 Features

### Core Functionality
- **Organization Discovery**: Browse and search student clubs
- **Event Calendar**: View upcoming activities and events
- **Detailed Views**: Complete information for clubs and events
- **Campus Filtering**: Filter content by university campus
- **Category Browsing**: Browse clubs by type/category

### User Experience
- **Fast Search**: Real-time search with debouncing
- **Pagination**: Efficient data loading and navigation
- **Error Handling**: Graceful error states and recovery
- **Loading States**: Smooth loading experiences

### Accessibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **High Contrast**: Theme support for better visibility
- **Mobile Optimization**: Touch-friendly interface

## 🚀 Deployment

### Build Process
```bash
# Production build
npm run build

# Start production server
npm start
```

### Deployment Options
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🛠️ Development Guidelines

### Code Style
- **ESLint**: Enforced code style and quality
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict typing for reliability

### Component Guidelines
- **Single Responsibility**: Each component has one clear purpose
- **Props Interface**: All component props are typed
- **Error Boundaries**: Critical components wrapped in error boundaries

### Performance Best Practices
- **Bundle Optimization**: Code splitting and tree shaking
- **Image Optimization**: Next.js Image component usage
- **API Optimization**: Efficient data fetching patterns

## 📄 License

This project is part of the KU Club management system for Kasetsart University.
