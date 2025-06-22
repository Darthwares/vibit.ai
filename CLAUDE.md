# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Vibit.ai** - an AI-powered website generation and management platform built on top of Fragments by E2B. It transforms existing websites or creates new ones using AI-powered component generation, with a focus on content-first architecture and SEO optimization.

## Essential Commands

```bash
# Development
npm run dev      # Start development server with Turbo

# Production
npm run build    # Build for production
npm run start    # Start production server

# Code Quality
npm run lint     # Run ESLint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui components + TailwindCSS
- **AI**: Vercel AI SDK with multi-provider support
- **Execution**: E2B SDK for sandboxed code execution
- **Auth**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Rate Limiting**: Upstash/Vercel KV (optional)
- **Analytics**: PostHog

### Code Structure
- `/app` - Next.js pages and API routes
  - `/api/chat` - LLM streaming endpoint
  - `/api/sandbox` - Code execution endpoint
- `/components` - React components (feature-based organization)
  - `/ui` - shadcn/ui primitives
- `/lib` - Core business logic
  - `models.ts` - LLM provider configurations
  - `templates.ts` - Execution environment definitions
  - `schema.ts` - Zod validation schemas
- `/sandbox-templates` - Docker templates for each supported framework

### Key Patterns
1. **Streaming Architecture**: Uses Vercel AI SDK for real-time AI responses
2. **Provider Abstraction**: Support for multiple LLM providers through unified interface
3. **Template System**: Each framework (Next.js, Vue, Streamlit, etc.) has its own sandbox template
4. **Type Safety**: Extensive TypeScript + Zod validation throughout

## Environment Setup

Required environment variables (see `.env.template`):
- `E2B_API_KEY` - Required for code execution
- At least one LLM provider key (e.g., `OPENAI_API_KEY`)

For Firebase authentication:
- `NEXT_PUBLIC_ENABLE_FIREBASE` - Set to 'true' to enable Firebase
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase app ID

## Adding New Features

### Adding a New LLM Provider
1. Add provider configuration to `lib/models.ts`
2. Add API key to `.env.template` and environment schema
3. Add provider logo to `public/thirdparty/logos/`

### Adding a New Execution Template
1. Create new directory in `/sandbox-templates/`
2. Add `e2b.toml`, `e2b.Dockerfile`, and necessary files
3. Update `lib/templates.ts` with new template configuration
4. Add template logo to `public/thirdparty/templates/`

## Important Notes

- No formal test suite exists - verify changes manually
- Rate limiting can be enabled via Upstash/Vercel KV
- All code execution happens in E2B sandboxes for security

## Authentication

The project uses Firebase Authentication with support for:
- Email/Password sign in and sign up
- Passwordless email link (Magic Link)
- Phone number authentication with SMS verification
- Google OAuth sign in
- Password reset functionality

All authentication is handled through Firebase with automatic user team creation and metadata tracking.

## Project Goals (from PRD)

1. **Website Analysis & Reconstruction**: Crawl existing websites, extract content, and rebuild with modern architecture
2. **AI-Powered Component Generation**: Use Claude to generate and evolve components
3. **SEO Optimization**: Automatic implementation of comprehensive SEO best practices
4. **Content-First Architecture**: Focus on MDX/Markdown for content management
5. **Template Evolution**: Continuously expand component library through user interactions
6. **Internationalization**: Built-in i18n support with automatic translations
7. **Site Assistant**: AI-powered assistant for each generated website