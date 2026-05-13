# Modern Component System - Integration Guide

## 📋 Overview

This guide explains how to integrate the new modern component system into your Smart TN Grievance Management System. The system includes 13+ production-ready components built with React 19, TypeScript, Tailwind CSS, and Framer Motion.

## 🎯 What's Included

### Components Created
- **UI Components**: Button, Badge, Card, Input, Select, Avatar, LoadingSpinner, Modal, Toast
- **Layout Components**: Navbar, Sidebar, AppLayout
- **Utilities**: Theme system, animation presets, UI helpers
- **Examples**: Dashboard, Login, Complaint Form pages

### Features
✅ Modern animations with Framer Motion  
✅ Government-tech blue theme  
✅ Responsive design (mobile-first)  
✅ Full TypeScript support  
✅ Accessible (WCAG compliant)  
✅ Real-time priority scoring integration  
✅ Production-ready  

---

## 🚀 Quick Start

### Step 1: Copy Component Files

Copy these directories into your project:

```
src/
├── theme.ts                      # Theme configuration
├── animations/
│   └── variants.ts               # Framer Motion presets
├── components/
│   ├── ui/                       # UI components
│   └── layouts/                  # Layout components
└── utils/
    └── ui-helpers.ts             # Utility functions
```

### Step 2: Install Dependencies

Make sure you have these packages installed:

```bash
npm install framer-motion lucide-react
```

Already included in your project:
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- Next.js 16.1.6

### Step 3: Setup Toast Provider

Wrap your app with the ToastProvider for notifications:

```tsx
// app/layout.tsx
import { ToastProvider } from '@/components/ui';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
```

---

## 📚 Component Usage Examples

### Basic Components

#### Button
```tsx
import { Button } from '@/components/ui';

// Primary button
<Button variant="primary" size="md">
  Click me
</Button>

// With loading state
<Button isLoading={isSubmitting} variant="primary">
  Submit
</Button>

// With icons
<Button leftIcon={<Plus />} variant="success">
  Add New
</Button>
```

#### Badge
```tsx
import { Badge } from '@/components/ui';
import { Flame } from 'lucide-react';

<Badge variant="critical" icon={<Flame />}>
  Critical
</Badge>
```

#### Card
```tsx
import { Card } from '@/components/ui';

<Card variant="elevated" padding="lg" hoverable>
  <h3>Complaint Details</h3>
  <p>Content here...</p>
</Card>
```

#### Input
```tsx
import { Input } from '@/components/ui';

<Input
  label="Email"
  type="email"
  placeholder="user@example.com"
  error={errors.email}
  leftIcon={<Mail />}
/>
```

### Form Components

#### Select Dropdown
```tsx
import { Select } from '@/components/ui';

const options = [
  { value: 'road', label: 'Road Infrastructure' },
  { value: 'water', label: 'Water Supply' },
];

<Select
  options={options}
  value={selected}
  onChange={setSelected}
  label="Category"
  placeholder="Select category..."
/>
```

### Modal Dialogs

```tsx
import { Modal, Button } from '@/components/ui';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Delete"
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

### Toast Notifications

```tsx
import { useToast } from '@/components/ui';

function MyComponent() {
  const { addToast } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      addToast('Data saved successfully!', 'success');
    } catch (error) {
      addToast('Failed to save', 'error', 5000); // 5 second duration
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### Layout Components

#### AppLayout (Complete Page Wrapper)
```tsx
import { AppLayout } from '@/components/layouts';

export default function DashboardPage() {
  return (
    <AppLayout
      userName="John Doe"
      userEmail="john@example.com"
      userRole="admin"
      onLogout={handleLogout}
      notificationCount={5}
    >
      {/* Page content goes here */}
    </AppLayout>
  );
}
```

---

## 🎨 Using the Theme System

### Access Theme Values
```tsx
import { theme } from '@/theme';

// Use in components
const primaryColor = theme.colors.primary[600];
const shadowLarge = theme.shadows.lg;
const spacing = theme.spacing.lg;
```

### Color Palette
```tsx
// Primary Blues
theme.colors.primary[500]   // #0077D9 (main brand color)
theme.colors.primary[600]   // #0056A8
theme.colors.primary[700]   // #004080

// Status Colors
theme.colors.status.success   // #10B981
theme.colors.status.danger    // #EF4444
theme.colors.status.warning   // #F59E0B

// Priority Colors
theme.colors.priority.CRITICAL  // #EF4444
theme.colors.priority.HIGH      // #F59E0B
theme.colors.priority.MEDIUM    // #FBBF24
theme.colors.priority.LOW       // #10B981
```

---

## ✨ Using Animations

### Page Transitions
```tsx
import { motion } from 'framer-motion';
import { pageVariants } from '@/animations/variants';

<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
>
  Your page content
</motion.div>
```

### Staggered List
```tsx
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/animations/variants';

<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Card Hover Effects
```tsx
import { motion } from 'framer-motion';
import { cardVariants } from '@/animations/variants';

<motion.div
  variants={cardVariants}
  initial="rest"
  whileHover="hover"
>
  Your card content
</motion.div>
```

---

## 🛠️ Utility Functions

### Priority & Status Helpers
```tsx
import {
  getPriorityColor,
  getPriorityIcon,
  getPriorityLabel,
  getStatusBadgeColor,
  formatDate,
  getTimeAgo,
  capitalizeText,
  truncateText,
} from '@/utils/ui-helpers';

// Get priority styling
const colorClass = getPriorityColor('HIGH');  // Tailwind classes
const Icon = getPriorityIcon('CRITICAL');     // Lucide icon
const label = getPriorityLabel('MEDIUM');     // "Medium Priority"

// Format dates
const formatted = formatDate(new Date());     // "Jan 15, 2024, 10:30 AM"
const timeAgo = getTimeAgo(complaint.date);  // "2 hours ago"

// Text utilities
const shortened = truncateText(longText, 50); // "Lorem ipsum dolor sit amet..."
```

---

## 🔄 Integrating with Existing Pages

### Convert Existing Pages to Use New Components

#### Before (Old Next.js Page)
```tsx
export default function LoginPage() {
  return (
    <div className="p-8">
      <form>
        <input type="email" />
        <input type="password" />
        <button>Login</button>
      </form>
    </div>
  );
}
```

#### After (Using New Components)
```tsx
'use client';

import { Input, Button } from '@/components/ui';
import { pageVariants } from '@/animations/variants';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <form className="space-y-4">
        <Input label="Email" type="email" />
        <Input label="Password" type="password" />
        <Button variant="primary" fullWidth>
          Login
        </Button>
      </form>
    </motion.div>
  );
}
```

---

## 📱 Responsive Design

All components are mobile-first responsive:

```tsx
// Grid automatically adapts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Cards adapt to screen size */}
</div>

// Sidebar hidden on mobile
<Sidebar
  isOpen={isSidebarOpen}  // Controlled by mobile menu button
  onClose={() => setIsSidebarOpen(false)}
/>
```

---

## 🎬 Animation Best Practices

### 1. Page Entrance Animation
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  Page content
</motion.div>
```

### 2. List Item Stagger
```tsx
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### 3. Hover Effects
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Interactive Button
</motion.button>
```

---

## 🧪 Testing Components

### Component Testing Example
```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui';

test('button renders with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('button handles click events', async () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  
  const button = screen.getByText('Click');
  button.click();
  
  expect(handleClick).toHaveBeenCalled();
});
```

---

## 📖 Example Pages to Reference

Three complete example pages are included:

1. **DashboardPageExample.tsx** - Shows:
   - AppLayout wrapper
   - Stat cards with animations
   - Complaint list with badges
   - Responsive grid

2. **LoginPageExample.tsx** - Shows:
   - Form validation
   - Input components with error states
   - Button loading states
   - Glassmorphism effects

3. **ComplaintFormExample.tsx** - Shows:
   - Multi-step form
   - Real-time priority scoring
   - Select dropdowns
   - Success modal

---

## ⚠️ Common Gotchas

### 1. Client Components
Use `'use client'` at the top of pages using components:
```tsx
'use client';

import { Button } from '@/components/ui';
// ...
```

### 2. Toast Provider
Must wrap your app for notifications to work:
```tsx
<ToastProvider>
  {children}
</ToastProvider>
```

### 3. Animation Performance
For better performance, limit animations on mobile:
```tsx
const isMobile = useMediaQuery('(max-width: 768px)');

<motion.div
  animate={isMobile ? {} : { scale: 1.02 }}
>
  Content
</motion.div>
```

### 4. Type Safety
Always import TypeScript types:
```tsx
import type { SelectOption } from '@/components/ui/Select';

const options: SelectOption[] = [
  { value: '1', label: 'Option 1' },
];
```

---

## 🎯 Next Steps

1. ✅ Copy all component files to your project
2. ✅ Install `framer-motion` and `lucide-react`
3. ✅ Setup ToastProvider in root layout
4. ✅ Update your pages to use new components
5. ✅ Reference example pages for implementation
6. ✅ Customize theme if needed
7. ✅ Deploy and enjoy the modern UI!

---

## 📞 Support

- See **COMPONENT_LIBRARY.md** for detailed component documentation
- Check example pages (src/examples/) for implementation patterns
- Review Framer Motion docs for advanced animations
- Tailwind CSS docs for styling extensions

---

## 🎉 You're All Set!

Your Smart TN Grievance Management System now has a modern, professional component system ready for production use. Enjoy the smooth animations, responsive design, and delightful user experience!

**Version**: 1.0.0  
**Last Updated**: 2024  
**Framework**: React 19 + Next.js 16 + TypeScript 5 + Tailwind CSS 4
