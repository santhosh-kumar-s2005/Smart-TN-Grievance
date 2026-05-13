# Modern Component Library

## Overview

This is a comprehensive, production-ready UI component library built with React 19, TypeScript, Tailwind CSS, and Framer Motion.

## Component Categories

### Atoms (Basic Reusable Components)

#### Button
**File**: `src/components/ui/Button.tsx`

Primary component for user interactions. Supports multiple variants and sizes.

**Props**:
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean - Shows loading spinner
- `leftIcon`, `rightIcon`: ReactNode - Optional icons
- `fullWidth`: boolean - Stretch to container width
- `animated`: boolean - Enable Framer Motion animations

**Example**:
```tsx
import { Button } from '@/components/ui';

<Button 
  variant="primary" 
  size="md"
  isLoading={isSubmitting}
>
  Submit
</Button>
```

---

#### Badge
**File**: `src/components/ui/Badge.tsx`

Display priority levels, status tags, or labels.

**Props**:
- `variant`: 'critical' | 'high' | 'medium' | 'low' | 'success' | 'warning' | 'danger' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `icon`: ReactNode - Optional left icon
- `animated`: boolean - Enable animations

**Example**:
```tsx
import { Badge } from '@/components/ui';
import { Flame } from 'lucide-react';

<Badge variant="critical" size="md" icon={<Flame />}>
  Critical
</Badge>
```

---

#### Card
**File**: `src/components/ui/Card.tsx`

Container component for content grouping with modern styling.

**Props**:
- `variant`: 'default' | 'elevated' | 'glass' | 'gradient'
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `hoverable`: boolean - Enable hover effects
- `animated`: boolean - Enable animations
- `background`: string - Custom background

**Example**:
```tsx
import { Card } from '@/components/ui';

<Card variant="elevated" padding="md" hoverable>
  <h3 className="text-lg font-bold">Complaint Details</h3>
  <p>Content here...</p>
</Card>
```

---

#### Input
**File**: `src/components/ui/Input.tsx`

Modern text input with validation feedback.

**Props**:
- `label`: string - Field label
- `error`: string - Error message
- `success`: boolean - Show success state
- `helperText`: string - Helper or validation text
- `leftIcon`, `rightIcon`: ReactNode - Optional icons
- `animated`: boolean - Enable animations

**Example**:
```tsx
import { Input } from '@/components/ui';

<Input 
  label="Email" 
  type="email"
  error={errors.email}
  placeholder="user@example.com"
/>
```

---

#### Select
**File**: `src/components/ui/Select.tsx`

Dropdown menu with keyboard support and animations.

**Props**:
- `options`: Array<{value, label, icon?}> - Available options
- `value`: string | number - Selected value
- `onChange`: (value) => void - Selection handler
- `label`: string - Field label
- `placeholder`: string - Placeholder text
- `error`: string - Error message
- `clearable`: boolean - Show clear button

**Example**:
```tsx
import { Select } from '@/components/ui';

<Select 
  options={departments}
  value={selectedDept}
  onChange={setSelectedDept}
  label="Department"
  placeholder="Select a department..."
/>
```

---

#### Avatar
**File**: `src/components/ui/Avatar.tsx`

User profile picture with fallback to initials.

**Props**:
- `src`: string - Image URL
- `alt`: string - Alt text
- `name`: string - Display name for initials fallback
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `online`: boolean - Show online status indicator

**Example**:
```tsx
import { Avatar } from '@/components/ui';

<Avatar 
  name={userName}
  src={avatarUrl}
  size="lg"
  online={true}
/>
```

---

#### LoadingSpinner
**File**: `src/components/ui/LoadingSpinner.tsx`

Animated loading spinner for async operations.

**Props**:
- `size`: 'sm' | 'md' | 'lg'
- `color`: 'primary' | 'white' | 'gray'
- `text`: string - Loading text (optional)
- `fullScreen`: boolean - Full-screen overlay mode

**Example**:
```tsx
import { LoadingSpinner } from '@/components/ui';

{isLoading ? (
  <LoadingSpinner size="lg" text="Loading complaints..." />
) : (
  <ComplaintList />
)}
```

---

### Molecules (Composite Components)

#### Modal
**File**: `src/components/ui/Modal.tsx`

Accessible modal dialog with backdrop and animations.

**Props**:
- `isOpen`: boolean - Control visibility
- `onClose`: () => void - Close handler
- `title`: string - Modal title
- `footer`: ReactNode - Footer content (buttons, etc.)
- `size`: 'sm' | 'md' | 'lg'
- `closeButton`: boolean - Show close button

**Example**:
```tsx
import { Modal, Button } from '@/components/ui';

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure you want to delete this complaint?</p>
  
  <footer slot="footer">
    <Button variant="secondary" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  </footer>
</Modal>
```

---

#### Toast Notifications
**File**: `src/components/ui/Toast.tsx`

Context-based toast notifications with auto-dismiss.

**Setup** (wrap your app):
```tsx
import { ToastProvider } from '@/components/ui';

function App() {
  return (
    <ToastProvider>
      {/* Your app content */}
    </ToastProvider>
  );
}
```

**Usage**:
```tsx
import { useToast } from '@/components/ui';

function MyComponent() {
  const { addToast } = useToast();
  
  const handleSave = async () => {
    try {
      await saveData();
      addToast('Data saved successfully!', 'success');
    } catch (error) {
      addToast('Failed to save data', 'error');
    }
  };
  
  return <button onClick={handleSave}>Save</button>;
}
```

---

### Organisms (Layout Components)

#### Navbar
**File**: `src/components/layouts/Navbar.tsx`

Top navigation bar with user menu and notifications.

**Props**:
- `userName`: string - User's display name
- `userEmail`: string - User's email
- `userAvatar`: string - Avatar image URL
- `onLogout`: () => void - Logout handler
- `onMenuToggle`: (isOpen) => void - Mobile menu toggle
- `showNotifications`: boolean - Show notification bell
- `notificationCount`: number - Notification badge count

**Example**:
```tsx
import { Navbar } from '@/components/layouts';

<Navbar 
  userName={user.name}
  userEmail={user.email}
  userAvatar={user.avatar}
  onLogout={handleLogout}
  notificationCount={5}
/>
```

---

#### Sidebar
**File**: `src/components/layouts/Sidebar.tsx`

Navigation sidebar with collapsible menu items.

**Props**:
- `isOpen`: boolean - Control visibility
- `onClose`: () => void - Close handler
- `items`: SidebarItem[] - Navigation items
- `onItemClick`: (item) => void - Item click handler
- `userRole`: 'admin' | 'user' | 'department'
- `onLogout`: () => void - Logout handler

**Example**:
```tsx
import { Sidebar } from '@/components/layouts';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'complaints', label: 'Complaints', icon: FileText },
];

<Sidebar 
  isOpen={isSidebarOpen}
  onClose={() => setIsSidebarOpen(false)}
  items={sidebarItems}
  userRole="admin"
/>
```

---

#### AppLayout
**File**: `src/components/layouts/AppLayout.tsx`

Main layout wrapper combining Navbar and Sidebar.

**Props**:
- `children`: ReactNode - Page content
- `userName`, `userEmail`, `userAvatar`: string - User info
- `userRole`: 'admin' | 'user' | 'department'
- `onLogout`: () => void - Logout handler
- `showSidebar`: boolean - Toggle sidebar visibility
- `notificationCount`: number - Notification count

**Example**:
```tsx
import { AppLayout } from '@/components/layouts';

export default function DashboardPage() {
  return (
    <AppLayout 
      userName="John Doe"
      userRole="admin"
      onLogout={handleLogout}
    >
      {/* Page content */}
    </AppLayout>
  );
}
```

---

## Utilities

### UI Helpers
**File**: `src/utils/ui-helpers.ts`

Utility functions for priority colors, status labels, and formatting.

**Available Functions**:
- `getPriorityColor(priority)` - Get Tailwind classes for priority
- `getPriorityIcon(priority)` - Get Lucide icon for priority
- `getPriorityLabel(priority)` - Get human-readable label
- `getStatusBadgeColor(status)` - Get status badge colors
- `getStatusIcon(status)` - Get status icon
- `formatDate(date)` - Format date for display
- `getTimeAgo(date)` - Human-readable relative time
- `truncateText(text, length)` - Truncate text with ellipsis

**Example**:
```tsx
import { 
  getPriorityIcon, 
  getPriorityColor, 
  getTimeAgo 
} from '@/utils/ui-helpers';

const Icon = getPriorityIcon('CRITICAL');
const colorClass = getPriorityColor('HIGH');
const timeText = getTimeAgo(complaint.createdAt);
```

---

## Animations

### Framer Motion Presets
**File**: `src/animations/variants.ts`

Pre-built animation variants for consistent animations across the app.

**Available Variants**:
- `pageVariants` - Page entrance/exit animations
- `cardVariants` - Card hover and rest states
- `containerVariants` - Staggered container animations
- `itemVariants` - Individual item animations
- `listVariants`, `listItemVariants` - List animations
- `modalVariants` - Modal entrance/exit
- `sidebarVariants` - Sidebar slide-in/out
- `fadeInVariants`, `slideInVariants`, `scaleInVariants` - Basic transitions
- `pulseVariants` - Pulsing animation
- `skeletonVariants` - Loading skeleton shimmer

**Example**:
```tsx
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/animations/variants';

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## Theme System

### Colors
**File**: `src/theme.ts`

Centralized theme configuration with government-tech blue palette.

**Available Colors**:
- **Primary Blues**: 50-900 scale (0F7D9 - primary, 0056A8 - dark)
- **Status Colors**: success, warning, danger, info, pending
- **Priority Colors**: CRITICAL, HIGH, MEDIUM, LOW
- **Neutrals**: Gray 50-900 scale
- **Gradients**: Primary, accent, success, warning, danger

**Usage**:
```tsx
import { theme } from '@/theme';

// Access colors
const primaryColor = theme.colors.primary[600];
const successGradient = theme.gradients.success;

// Use in styled components
const CustomDiv = styled.div`
  background: ${theme.colors.primary[500]};
  box-shadow: ${theme.shadows.lg};
`;
```

---

## Quick Import Guide

```tsx
// UI Components
import { 
  Button, 
  Card, 
  Badge, 
  Input, 
  Select, 
  Avatar,
  LoadingSpinner,
  Modal,
  useToast,
  ToastProvider
} from '@/components/ui';

// Layout Components
import { 
  Navbar, 
  Sidebar, 
  AppLayout 
} from '@/components/layouts';

// Utilities
import { 
  getPriorityColor, 
  getPriorityIcon,
  formatDate,
  getTimeAgo 
} from '@/utils/ui-helpers';

// Animations
import { 
  pageVariants, 
  cardVariants, 
  containerVariants 
} from '@/animations/variants';

// Theme
import { theme } from '@/theme';
```

---

## Styling Approach

All components use **Tailwind CSS** for styling with:
- Responsive design built-in
- Consistent spacing and sizing
- Dark mode support (can be extended)
- Custom color palette from theme
- Smooth transitions and animations

## Framer Motion Integration

All interactive components include smooth animations:
- **Hover effects**: Scale, shadow, and color transitions
- **Page transitions**: Fade-in and slide-in effects
- **Staggered animations**: For lists and grids
- **Loading states**: Pulsing and spinning animations
- **Modal behavior**: Scale and opacity transitions

## Accessibility

Components follow WCAG guidelines:
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Proper color contrast
- Form label associations

---

## Next Steps

To use this component library in your pages:

1. Import the layout wrapper:
   ```tsx
   import { AppLayout } from '@/components/layouts';
   ```

2. Wrap your page content:
   ```tsx
   export default function Dashboard() {
     return (
       <AppLayout userName="User">
         {/* Your content */}
       </AppLayout>
     );
   }
   ```

3. Use individual components for forms, cards, and interactions
4. Apply animations using Framer Motion variants
5. Leverage the theme system for consistent styling

---

**Component Library Version**: 1.0.0
**Last Updated**: 2024
**Framework**: React 19 + TypeScript 5 + Tailwind CSS 4
