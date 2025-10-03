---
trigger: always_on
---

# Vite + Supabase + TypeScript + React + Tailwind Style Guide

You are an expert in TypeScript, React, Vite, Supabase, Tailwind CSS, Shadcn UI, and Radix UI.

## Key Principles

- Write concise, technical responses with accurate TypeScript examples.
- Use functional, declarative programming. Avoid classes.
- Prefer iteration and modularization over duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Use lowercase with dashes for directories (e.g., components/auth-wizard).
- Favor named exports for components.
- Use the Receive an Object, Return an Object (RORO) pattern.

## JavaScript/TypeScript

- Use "function" keyword for pure functions. Omit semicolons.
- Use TypeScript for all code. Prefer interfaces over types. Avoid enums, use maps.
- File structure: Exported component, subcomponents, helpers, static content, types.
- Avoid unnecessary curly braces in conditional statements.
- For single-line statements in conditionals, omit curly braces.
- Use concise, one-line syntax for simple conditional statements (e.g., `if (condition) doSomething()`).

## Error Handling and Validation

- Prioritize error handling and edge cases:
  - Handle errors and edge cases at the beginning of functions.
  - Use early returns for error conditions to avoid deeply nested if statements.
  - Place the happy path last in the function for improved readability.
  - Avoid unnecessary else statements; use if-return pattern instead.
  - Use guard clauses to handle preconditions and invalid states early.
  - Implement proper error logging and user-friendly error messages.
  - Consider using custom error types or error factories for consistent error handling.

## React/Vite

- Use functional components and TypeScript interfaces.
- Use declarative JSX.
- Use function, not const, for components.
- Use Shadcn UI, Radix, and Tailwind CSS for components and styling.
- Implement responsive design with Tailwind CSS.
- Use mobile-first approach for responsive design.
- Place static content and interfaces at file end.
- Use content variables for static content outside render functions.
- Minimize `useEffect`; favor derived state and event handlers.
- Use Zod for form validation.
- Optimize images: WebP format, size data, lazy loading.
- Use dynamic imports for code splitting and lazy loading.

## Supabase Integration

- Use Supabase client for database operations, authentication, and storage.
- Initialize Supabase client in a separate file (e.g., `lib/supabase.ts`).
- Use environment variables for Supabase URL and anon key.
- Implement Row Level Security (RLS) policies for database security.
- Use Supabase Auth for authentication flows.
- Leverage Supabase Realtime for live data updates when needed.
- Use Supabase Storage for file uploads and management.

### Supabase Client Setup

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

### Database Operations

- Use TypeScript types generated from Supabase schema.
- Handle errors gracefully with proper error messages.
- Use transactions for multiple related operations.
- Implement optimistic updates for better UX.

```typescript
async function fetchUser(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw new Error(error.message)
  return data
}
```

### Authentication

- Use Supabase Auth helpers for session management.
- Implement protected routes with authentication checks.
- Handle auth state changes with `onAuthStateChange`.
- Store minimal user data in local state; fetch from database as needed.

```typescript
const { data: { user } } = await supabase.auth.getUser()
```

## State Management

- Use React Context for global state when needed.
- Prefer URL state and local state over global state.
- Use TanStack Query (React Query) for server state management.
- Implement proper cache invalidation strategies.

### TanStack Query with Supabase

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  })
}

function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
```

## Form Handling

- Use React Hook Form for form state management.
- Use Zod for schema validation.
- Combine with Shadcn UI form components.
- Handle loading and error states appropriately.

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormData = z.infer<typeof formSchema>

function LoginForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(data: FormData) {
    // Handle submission
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}
```

## Routing

- Use React Router v6 for client-side routing.
- Implement lazy loading for route components.
- Use layout routes for shared UI elements.
- Protect routes with authentication guards.

```typescript
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('@/pages/dashboard'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
      },
    ],
  },
])
```

## Performance Optimization

- Use `React.memo()` for expensive components.
- Implement virtual scrolling for long lists.
- Use `useMemo` and `useCallback` judiciously.
- Lazy load components and routes.
- Optimize images and assets.
- Use Vite's code splitting features.

## Key Conventions

1. Rely on Supabase for backend operations and real-time features.
2. Prioritize Web Vitals (LCP, CLS, FID).
3. Use TanStack Query for server state management.
4. Implement proper error boundaries for graceful error handling.
5. Use Tailwind CSS for styling; avoid inline styles.
6. Follow React best practices: component composition, props drilling solutions.
7. Keep components small and focused on a single responsibility.

## Folder Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   └── shared/          # Shared components
├── lib/
│   ├── supabase.ts      # Supabase client
│   └── utils.ts         # Utility functions
├── hooks/               # Custom hooks
├── pages/               # Page components
├── types/
│   ├── supabase.ts      # Generated Supabase types
│   └── index.ts         # App types
├── styles/
│   └── globals.css      # Global styles
└── main.tsx             # Entry point
```

## Environment Variables

- Use `.env` files for environment variables.
- Prefix with `VITE_` for client-side variables.
- Never commit sensitive keys.

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing

- Write unit tests for utilities and hooks.
- Use React Testing Library for component tests.
- Test authentication flows and protected routes.
- Mock Supabase client in tests.

Refer to Vite, React, Supabase, and Tailwind CSS documentation for best practices.