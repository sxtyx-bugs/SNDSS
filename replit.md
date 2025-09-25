# Ephemeral Text Sharing Application

## Overview

This is a privacy-focused ephemeral text sharing application that allows users to share text and code snippets with automatic expiration. The application features a unique "undetectable" stealth design with AI-powered text manipulation for enhanced privacy. It consists of two main parts: a stealth landing page that appears as a generic business website, and a clean sharing interface for creating and viewing temporary text shares.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component system
- **Styling**: Tailwind CSS with custom design system focused on dark mode and stealth aesthetics
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Data Storage**: In-memory storage with automatic cleanup for ephemeral content
- **API Design**: RESTful API with endpoints for creating and retrieving text shares
- **Build System**: ESBuild for production bundling with ESM modules

### Key Features
- **Stealth Landing Page**: Generic business website appearance at root path to hide the application's true purpose
- **Ephemeral Sharing**: Text shares with configurable expiration times (5 minutes to 1 hour)
- **AI Text Manipulation**: OpenAI GPT-4o-mini integration to subtly modify shared content for privacy
- **Responsive Design**: Mobile-first approach with clean, minimal interface
- **Dark Mode Focus**: Privacy-oriented dark theme with subtle color palette

### Data Model
- **Text Shares**: Contains original content, AI-manipulated content, expiration timestamp, and unique short IDs
- **Schema Validation**: Drizzle-Zod integration for type-safe database operations and API validation
- **Automatic Cleanup**: Background processes remove expired shares every minute

### Security and Privacy
- **No User Accounts**: Anonymous sharing without registration requirements
- **Short-lived Content**: Automatic expiration and deletion of shared content
- **Content Obfuscation**: AI-powered text manipulation to protect original content
- **Memory-only Storage**: No persistent database storage for enhanced privacy

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver (configured but using memory storage)
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React router
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation integration

### UI and Styling
- **@radix-ui/**: Complete set of accessible UI primitives (dialogs, dropdowns, tooltips, etc.)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variants
- **clsx**: Conditional class name utility
- **tailwind-merge**: Tailwind class merging utility

### Development and Build Tools
- **vite**: Fast build tool and development server
- **typescript**: Type safety and developer experience
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production

### AI Integration
- **openai**: OpenAI API client for text manipulation (optional, falls back gracefully)

### Additional Utilities
- **nanoid**: Secure random ID generation for share URLs
- **date-fns**: Date manipulation and formatting
- **zod**: Runtime type validation and schema definition

The application is designed to be easily deployable on platforms like Replit, Vercel, or similar cloud services, with minimal configuration required.