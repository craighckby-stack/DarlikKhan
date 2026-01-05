--- FILE: README.md ---
# 🚀 Welcome to Z.ai Code Scaffold

A modern, production-ready web application scaffold powered by cutting-edge technologies, designed to accelerate your development with [Z.ai](https://chat.z.ai)'s AI-powered coding assistance.

## ✨ Technology Stack

This scaffold provides a robust foundation built with:

### 🎯 Core Framework
- **⚡ Next.js 15** - The React framework for production with App Router
- **📘 TypeScript 5** - Type-safe JavaScript for better developer experience
- **🎨 Tailwind CSS 4** - Utility-first CSS framework for rapid UI development

### 🧩 UI Components & Styling
- **🧩 shadcn/ui** - High-quality, accessible components built on Radix UI
- **🎯 Lucide React** - Beautiful & consistent icon library
- **🌈 Framer Motion** - Production-ready motion library for React
- **🎨 Next Themes** - Perfect dark mode in 2 lines of code

### 📋 Forms & Validation
- **🎣 React Hook Form** - Performant forms with easy validation
- **✅ Zod** - TypeScript-first schema validation

### 🔄 State Management & Data Fetching
- **🐻 Zustand** - Simple, scalable state management
- **🔄 TanStack Query** - Powerful data synchronization for React
- **⚡ tRPC (v11)** - End-to-end type safety for API calls and maximum developer confidence.

### 🗄️ Database & Backend
- **🗄️ Prisma** - Next-generation TypeScript ORM
- **🔐 NextAuth.js** - Complete open-source authentication solution

### 🎨 Advanced UI Features
- **📊 TanStack Table** - Headless UI for building tables and datagrids
- **🖱️ DND Kit** - Modern drag and drop toolkit for React
- **📊 Recharts** - Redefined chart library built with React and D3
- **🖼️ Sharp** - High performance image processing

### 🌍 Internationalization & Utilities
- **🌍 Next Intl** - Internationalization library for Next.js
- **📅 Date-fns** - Modern JavaScript date utility library
- **🪝 ReactUse** - Collection of essential React hooks for modern development

## 🎯 Why This Scaffold?

- **🏎️ Fast Development** - Pre-configured tooling and best practices
- **🎨 Beautiful UI** - Complete shadcn/ui component library with advanced interactions
- **🔒 Type Safety (E2E)** - Full TypeScript configuration with Zod validation **and tRPC contracts** across the network boundary.
- **📱 Responsive** - Mobile-first design principles with smooth animations
- **🗄️ Database Ready** - Prisma ORM configured for rapid backend development
- **🔐 Auth Included** - NextAuth.js for secure authentication flows
- **🚀 Production Ready** - Optimized build settings (**PPR enabled**) and mandatory quality gates.
- **🤖 AI-Friendly** - Structured codebase perfect for AI assistance, now with fully typed API contracts.

## 🚀 Quick Start

# Install dependencies (runs prisma generate automatically)
bun install

# Start development server
bun run dev

# Build for production (enforces type/lint checks)
bun run build

# Start production server (Requires Bun runtime environment)
bun run start

# Quality Control
bun run lint:fix    # Fixes linting errors
bun run type-check  # Runs TypeScript checks without building
bun run test:unit   # Runs unit tests using Vitest (upgraded)
bun run test:coverage # Runs unit tests with coverage report
bun run test:e2e    # Runs end-to-end tests using Playwright

# Database Tools
bun run db:studio   # Opens Prisma Studio
bun run postinstall # Ensures Prisma is generated after every dependency change

Open [http://localhost:3000](http://localhost:3000) to see your application running.

## 🤖 Powered by Z.ai

This scaffold is optimized for use with [Z.ai](https://chat.z.ai) - your AI assistant for:

- **💻 Code Generation** - Generate components, pages, and features instantly
- **🎨 UI Development** - Create beautiful interfaces with AI assistance  
- **🔧 Bug Fixing** - Identify and resolve issues with intelligent suggestions
- **📝 Documentation** - Auto-generate comprehensive documentation
- **🚀 Optimization** - Performance improvements and best practices

Ready to build something amazing? Start chatting with Z.ai at [chat.z.ai](https://chat.z.ai) and experience the future of AI-powered development!

## 📁 Project Structure

src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── server/             # tRPC Router definitions and context (New)
└── lib/                # Utility functions and configurations

## 🎨 Available Features & Components

This scaffold includes a comprehensive set of modern web development tools:

### 🔐 Backend Integration
- **Type-Safe API**: Fully type-checked API layer using **tRPC**.
- **Authentication**: Ready-to-use auth flows with NextAuth.js
- **Database**: Type-safe database operations with Prisma
- **State Management**: Simple and scalable with Zustand

--- FILE: next.config.ts ---
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // HYPER-PERFORMANCE & DEPLOYMENT
  // Enables building a self-contained output, ideal for Docker/containerization.
  output: "standalone", 
  
  // Strict mode is essential for ensuring forward compatibility (React 19).
  reactStrictMode: true, 
  
  // Disable telemetry for production privacy and clean builds
  telemetry: false, 

  // NEXT.JS 15 PERFORMANCE TUNING (Infinity Point)
  experimental: {
    // Allows massive body payloads for complex Server Actions (e.g., large file uploads)
    serverActions: {
      bodySizeLimit: '10mb', 
    },
    // Partial Prerendering: Mandatory for instant perceived loading
    ppr: true, 
    // Optimization for faster asset loading
    optimizeCss: true,
    // Automated dependency bundle size reduction
    optimizePackageImports: [
        '@tanstack/react-query',
        'lucide-react',
        'framer-motion',
        '@radix-ui/react-*'
    ]
  },

  // QUALITY GATE ENFORCEMENT (Mandate 1: Remove liability)
  // Type and lint errors MUST break the build to ensure future maintainability and AI confidence.
  typescript: {
    ignoreBuildErrors: false, // MANDATE: Must be false
  },
  eslint: {
    ignoreDuringBuilds: false, // MANDATE: Must be false
  },
};

export default nextConfig;

--- FILE: package.json ---
{
  "name": "nextjs_tailwind_shadcn_ts",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build && cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public", 
    "start": "NODE_ENV=production bun .next/standalone/server.js",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test:unit": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:reset": "prisma migrate reset",
    "db:studio": "prisma studio",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@hookform/resolvers": "^5.1.1",
    "@mdxeditor/editor": "^3.39.1",
    "@prisma/client": "^6.11.1",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@reactuses/core": "^6.0.5",
    "@tanstack/react-query": "^5.82.0",
    "@tanstack/react-table": "^8.21.3",
    "@trpc/client": "11.0.0-rc.470",
    "@trpc/server": "11.0.0-rc.470",
    "@trpc/react-query": "11.0.0-rc.470",
    "@trpc/next": "11.0.0-rc.470",
    "superjson": "^2.2.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.23.2",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.525.0",
    "next": "15.3.5",
    "next-auth": "^4.24.11",
    "next-intl": "^4.3.4",
    "next-themes": "^0.4.6",
    "prisma": "^6.11.1",
    "react": "^19.0.0",
    "react-day-picker": "^9.8.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.60.0",
    "react-markdown": "^10.1.0",
    "react-resizable-panels": "^3.0.3",
    "react-syntax-highlighter": "^15.6.1",
    "recharts": "^2.15.4",
    "sharp": "^0.34.3",
    "sonner": "^2.0.6",
    "tailwind-merge": "^3.3.1",
    "tailwindcss-animate": "^1.0.7",
    "uuid": "^11.1.0",
    "vaul": "^1.1.2",
    "z-ai-web-dev-sdk": "^0.0.15",
    "zod": "^4.0.2",
    "zustand": "^5.0.6"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@playwright/test": "^1.45.0",
    "@tailwindcss/postcss": "^4",
    "@testing-library/react": "^16.0.0",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "bun-types": "^1.3.4",
    "eslint": "^9",
    "eslint-config-next": "15.3.5",
    "jsdom": "^24.1.0",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.3.5",
    "typescript": "^5",
    "vitest": "^2.0.4"
  }
}

--- FILE: vitest.config.ts ---
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts', // Assuming a setup file for React Testing Library
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'prisma/',
        'src/components/ui/', // Excluding generic UI components from coverage
        '**/*.config.ts',
        '**/*.types.ts',
        'src/app/globals.css'
      ],
    },
  },
});