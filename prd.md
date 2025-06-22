# Vibit.ai Product Requirements Document (PRD)

## 1. Executive Summary

**Product Name:** Vibit.ai  
**Base Repository:** Fragments by e2b.dev (Claude artifact style repo)  
**Core Purpose:** Expand the fragments project into a comprehensive website generation and management platform that allows users to convert existing websites or create new ones using AI-powered component generation.

## 2. Product Vision

Vibit.ai transforms how users create and manage websites by combining AI-powered component generation with intelligent website analysis and reconstruction. The platform focuses on creating **content-first websites** optimized for SEO and rapid deployment. Users can input existing websites to automatically generate modern, component-based alternatives or start from scratch using an AI chat interface.

**Core Focus Areas:**
- **Content-First Architecture:** Building landing pages and content sites with blogs and documentation
- **SEO Optimization:** Automatic implementation of comprehensive SEO best practices
- **Component Evolution:** Continuously expanding component library through user interactions
- **Rapid Deployment:** Quick generation of SEO-optimized content sites for immediate search visibility

## 3. Core Architecture

### 3.1 Technology Stack
- **Frontend:** Next.js with React
- **Backend:** Firebase (Firestore, Storage, Authentication)
- **AI Execution Layer:** e2b.dev Sandbox with Next.js template
- **AI Model:** Claude (via API)
- **Component Visualization:** React Flow
- **Content Management:** MDX/Markdown for content-first approach
- **Internationalization:** Next.js i18n library
- **Deployment:** e2b environment

### 3.2 Data Storage Strategy
- **Primary Database:** Firebase Firestore
- **File Storage:** Firebase Storage
- **Content Management:** All website content, components, and user data stored in Firebase
- **Component Library:** Expanding e2b.dev template with generated components

### 3.3 E2B Execution Layer Architecture

#### 3.3.1 Sandbox Environment
- **Base Template:** Use existing Next.js template from fragments repo by e2b.dev
- **Sandbox Loading:** Load prepared template environment for each site generation
- **Template Evolution:** Continuously expand and improve the base template

#### 3.3.2 Content-First Architecture
- **Primary Approach:** MDX/Markdown for content management
- **Component Separation:** Individual components created and integrated back into template
- **Modular Structure:** Clear separation between content and presentation layers

#### 3.3.3 Component Library Expansion
- **Component Collection:** Generate and store new components with each user interaction
- **Template Enhancement:** Add new components back to e2b.dev template
- **Section Types:** Expand available section types for future website generation
- **Reusability:** Enable component reuse across multiple user projects

## 4. Core Features

### 4.1 User Onboarding Wizard

#### 4.1.1 Entry Options
- **Option A:** Start with existing website (recommended)
- **Option B:** Start from empty website

#### 4.1.2 Existing Website Processing
When user provides existing website URL:

1. **Sitemap Generation**
   - Crawl entire website domain
   - Extract all internal links
   - Build comprehensive sitemap structure
   - Use e2b.dev as execution layer for crawling

2. **Content Extraction**
   - Page-by-page content analysis
   - Section identification within each page
   - Image and text extraction
   - Schema creation in Firebase

3. **Firebase Schema Structure**
   ```
   websites/
   ├── {websiteId}/
   │   ├── metadata/
   │   ├── sitemap/
   │   ├── pages/
   │   │   ├── {pageId}/
   │   │   │   ├── sections/
   │   │   │   │   ├── {sectionId}/
   │   │   │   │   │   ├── content/
   │   │   │   │   │   ├── images/
   │   │   │   │   │   └── text/
   ```

### 4.2 Sitemap Visualization

#### 4.2.1 React Flow Implementation
- Display sitemap as interactive flowchart
- Show navigation flow from home page
- Visual representation of site structure
- Clickable nodes for detailed page information

#### 4.2.2 Page Detail View
- Click on React Flow nodes to view page sections
- Display all extracted content
- Show section breakdown and structure

### 4.3 Design Customization Wizard

#### 4.3.1 Design Decisions
User selects:
- **Theme:** Overall design aesthetic
- **Structure:** Layout patterns
- **Navigation Style:** Menu types and positioning
- **Typography:** Font families and hierarchies
- **Color Scope:** Primary and secondary color schemes

#### 4.3.2 Palette Generation
- Generate multiple palette options based on user selections
- Allow user to choose from generated palettes
- Apply chosen palette across entire site

### 4.4 Component Library Integration

#### 4.4.1 Component Sources
- **Magic UI:** External component library
- **Other Component Libraries:** Additional external sources
- **Custom Library:** Internal component collection

#### 4.4.2 Component Selection
- AI-powered component matching based on content
- Generate components that fit selected design palette
- Ensure component compatibility with Next.js

### 4.5 Site Generation & Deployment

#### 4.5.1 Next.js Site Assembly
- Combine selected components into complete site
- Apply design decisions and palette
- Integrate extracted content into components

#### 4.5.2 Real-time Building
- Deploy to e2b environment
- Show real-time building progress
- Display site as it's being constructed by Claude

#### 4.5.3 Live Editing
- Allow section-by-section editing
- Component-level modifications within sitemap flowchart
- Real-time preview of changes

### 4.6 AI Chat Interface

#### 4.6.1 Site Modification
- Natural language requests for site changes
- AI-powered component updates
- Real-time site transformation

#### 4.6.2 Integration with Base Chat
- Build upon fragments.e2b.dev chat functionality
- Extend to handle full website modification requests
- Maintain component generation capabilities

### 4.7 Internationalization (i18n)

#### 4.7.1 Multi-language Support
- Next.js i18n library integration
- Automatic language generation via LLMs
- Support for multiple target languages

#### 4.7.2 Content Localization
- All site content stored as localizable strings
- Automatic translation of en.json strings
- Language-specific content management

### 4.8 Built-in Site Assistant

#### 4.8.1 Assistant Capabilities
- Answer questions about site content
- Navigate users to relevant pages
- Provide guided website tours
- Context-aware responses based on extracted content

#### 4.8.2 Assistant Integration
- Always visible on generated websites
- Powered by site-specific content knowledge
- Real-time user assistance

### 4.9 Component Library & Template Evolution

#### 4.9.1 Component Generation & Storage
- **User-Generated Components:** Capture every component created through user interactions
- **Template Integration:** Add new components to e2b.dev template automatically
- **Component Cataloging:** Maintain comprehensive library of generated sections and components
- **Quality Assurance:** Validate and optimize components before template integration

#### 4.9.2 Vibit.ai Content Library
- **Public Showcase:** Display all generated components as public library
- **Component Discovery:** Allow users to browse and select from existing components
- **Marketing Tool:** Use component showcase to attract new users
- **Community Building:** Enable component sharing across Vibit.ai ecosystem

#### 4.9.3 Template Management
- **Version Control:** Track template evolution and component additions
- **Performance Optimization:** Regularly optimize template for speed and efficiency
- **Component Organization:** Categorize components by type, style, and functionality
- **Documentation:** Maintain clear documentation for each component

### 4.10 SEO Optimization Engine

#### 4.10.1 Automatic SEO Implementation
- **Page-by-Page SEO:** Generate comprehensive SEO tags for every page
- **Meta Tags:** Automatic title, description, and keyword generation
- **Open Graph Tags:** Complete OG tag implementation for social sharing
- **Schema Markup:** Structured data implementation for enhanced search visibility
- **Sitemap Generation:** Automatic XML sitemap creation and updates

#### 4.10.2 SEO Requirements Compliance
- **Google Guidelines:** Full compliance with Google SEO best practices
- **Bing Optimization:** Ensure compatibility with Bing search algorithms
- **Core Web Vitals:** Optimize for Google's Core Web Vitals metrics
- **Mobile Optimization:** Ensure mobile-first indexing compatibility
- **Accessibility:** Implement SEO-friendly accessibility features

#### 4.10.3 SEO Content Generation
- **Keyword Research:** AI-powered keyword analysis and integration
- **Content Optimization:** Optimize extracted and generated content for SEO
- **Heading Structure:** Proper H1-H6 hierarchy implementation
- **Internal Linking:** Strategic internal link structure creation
- **Alt Text Generation:** Automatic image alt text for accessibility and SEO

#### 4.10.4 SEO Benchmarking & Validation
- **SEO Audit:** Comprehensive SEO analysis for generated sites
- **Performance Scoring:** SEO score calculation and reporting
- **Issue Detection:** Identify and flag SEO issues for correction
- **Optimization Recommendations:** Provide actionable SEO improvement suggestions
- **Monitoring:** Ongoing SEO performance tracking and alerts

## 5. Implementation Phases

### Phase 1: Foundation Setup
1. Firebase project configuration
2. E2B sandbox environment setup with Next.js template
3. Basic Next.js application setup with MDX support
4. Core authentication system
5. Template version control system

### Phase 2: Website Analysis Engine
1. Website crawling functionality
2. Sitemap generation
3. Content extraction pipeline with MDX conversion
4. Firebase schema implementation
5. SEO data extraction from existing sites

### Phase 3: Visualization Layer
1. React Flow sitemap display
2. Page detail views
3. Interactive navigation
4. Content preview system
5. Component showcase interface

### Phase 4: Design System & Component Library
1. Design wizard implementation
2. Palette generation system
3. Component library integration
4. Theme application engine
5. Component storage and cataloging system

### Phase 5: Site Generation & SEO
1. Next.js site assembly with MDX content
2. Component integration and template expansion
3. E2B deployment pipeline
4. Real-time building interface
5. Automatic SEO tag generation and implementation

### Phase 6: AI Enhancement & Template Evolution
1. Chat interface integration
2. Natural language site modification
3. Claude API integration
4. Real-time updates
5. Automatic component library expansion

### Phase 7: Advanced Features & Optimization
1. i18n implementation
2. Multi-language content generation
3. Built-in assistant development
4. SEO benchmarking and validation tools
5. Component showcase and public library
6. Performance optimization and monitoring

## 6. Technical Requirements

### 6.1 Firebase Configuration
- Firestore for data storage
- Firebase Storage for assets
- Firebase Authentication
- Security rules implementation

### 6.2 E2B Sandbox Environment
- Next.js template from fragments repo as base
- MDX/Markdown processing capabilities
- Component isolation and integration
- Template versioning and updates
- Sandbox resource management

### 6.3 API Integrations
- Claude API for AI functionality
- E2B.dev for execution environment
- Component library APIs
- Website crawling services
- SEO analysis tools

### 6.4 Performance Requirements
- Real-time site building visualization
- Efficient content extraction
- Optimized component loading
- Responsive user interface
- Fast SEO tag generation

### 6.5 SEO Technical Requirements
- **Meta Tag Generation:** Automated title, description, keywords
- **Open Graph Implementation:** Complete OG tag suite
- **Schema Markup:** JSON-LD structured data
- **Sitemap Management:** XML sitemap generation and updates
- **Performance Optimization:** Core Web Vitals compliance
- **Mobile Optimization:** Mobile-first indexing support
- **Accessibility:** WCAG compliance for SEO benefits

## 7. User Experience Flow

1. **Onboarding:** User enters existing website URL or chooses empty start
2. **Analysis:** System crawls and extracts website content with SEO data
3. **Visualization:** Sitemap displayed in React Flow format
4. **Customization:** Design wizard guides theme and style selection
5. **Generation:** AI assembles components into new Next.js site with MDX content
6. **SEO Implementation:** Automatic SEO tag generation and optimization
7. **Deployment:** Site deployed to e2b environment with real-time progress
8. **Template Enhancement:** Generated components added to expanding template library
9. **Editing:** User can modify sections and request AI-powered changes
10. **Localization:** Multi-language support automatically generated
11. **Assistant:** Built-in helper provides ongoing site assistance
12. **SEO Validation:** Comprehensive SEO audit and benchmarking
13. **Showcase:** Components added to public Vibit.ai component library

## 8. Success Metrics

- Successful website analysis and reconstruction
- User engagement with design customization
- Site generation completion rate
- AI chat interaction effectiveness
- Multi-language content quality
- Assistant usage and satisfaction
- **SEO Performance:** Search engine ranking improvements
- **Component Library Growth:** Number of components generated and reused
- **Template Evolution:** Improvement in template quality over time
- **SEO Benchmarking:** Site SEO scores and compliance rates
- **Content Showcase:** User engagement with public component library

## 9. Technical Considerations

### 9.1 Scalability
- Firebase scalability for multiple concurrent users
- e2b environment resource management
- Component library performance optimization

### 9.2 Security
- Secure website crawling
- User data protection
- Firebase security rules
- API key management

### 9.3 Reliability
- Error handling for failed crawls
- Backup and recovery systems
- Graceful degradation for missing components

## 10. Next Steps

1. Set up development environment with Firebase and e2b.dev sandbox
2. Configure Next.js template with MDX support in e2b environment
3. Implement core website crawling functionality with SEO data extraction
4. Develop Firebase schema and data models for components and templates
5. Create React Flow sitemap visualization with component showcase
6. Build design customization wizard with component library integration
7. Implement SEO optimization engine with automatic tag generation
8. Create component storage and template evolution system
9. Implement real-time site building and deployment with SEO validation
10. Add internationalization and assistant features
11. Build public component library and showcase interface
12. Implement comprehensive SEO benchmarking and monitoring tools

---

*This PRD serves as the comprehensive guide for implementing Vibit.ai step-by-step, ensuring all features are built systematically with a focus on content-first architecture, SEO optimization, and continuous template evolution. The platform is specifically designed for rapid deployment of SEO-optimized content sites while building a robust, ever-expanding component ecosystem.*