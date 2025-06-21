# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Fragments by E2B** - an open-source alternative to Claude Artifacts, Vercel v0, and GPT Engineer. It's a Next.js application that enables AI-powered code generation and execution in secure sandboxes.

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
- **Auth**: Supabase (optional)
- **Database**: Supabase PostgreSQL (optional)
- **Rate Limiting**: Upstash/Vercel KV (optional)

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
- Authentication and database features are optional
- Rate limiting can be enabled via Upstash/Vercel KV
- All code execution happens in E2B sandboxes for security