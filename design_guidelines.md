# Design Guidelines for Ephemeral Text Sharing Application

## Design Approach
**Reference-Based Approach** - Drawing inspiration from privacy-focused tools like Signal and developer platforms like GitHub Gist, emphasizing clean functionality with subtle sophistication.

## Core Design Principles
- **Stealth by Design**: Intentionally understated aesthetics that don't draw attention
- **Ephemeral Clarity**: Visual cues that reinforce temporary nature
- **Developer-Friendly**: Clean, code-focused interface design

## Color Palette

### Dark Mode (Primary)
- **Background**: 220 15% 8% (deep charcoal)
- **Surface**: 220 12% 12% (elevated charcoal)
- **Primary**: 210 100% 65% (soft blue)
- **Text Primary**: 0 0% 95% (near white)
- **Text Secondary**: 0 0% 70% (medium gray)
- **Border**: 220 10% 20% (subtle gray)
- **Success**: 142 76% 36% (muted green)
- **Warning**: 45 93% 47% (amber)
- **Danger**: 0 84% 60% (soft red)

### Light Mode (Secondary)
- **Background**: 0 0% 98% (off-white)
- **Surface**: 0 0% 100% (pure white)
- **Primary**: 210 100% 50% (vibrant blue)
- **Text Primary**: 220 15% 15% (dark charcoal)
- **Text Secondary**: 220 10% 45% (medium gray)

## Typography
- **Primary Font**: Inter (Google Fonts)
- **Monospace Font**: JetBrains Mono (Google Fonts)
- **Sizes**: text-sm, text-base, text-lg, text-xl, text-2xl
- **Weights**: font-normal (400), font-medium (500), font-semibold (600)

## Layout System
**Spacing Units**: Tailwind units of 2, 4, 6, 8, 12, 16
- Consistent rhythm using p-4, m-6, gap-8, etc.
- Generous whitespace for clarity and focus

## Component Library

### Stealth Landing Page (/)
- Minimal, professional appearance
- Generic business/contact page aesthetic
- Muted colors, standard layout
- No hints of the actual application functionality

### Main Application (/app)
- **Text Area**: Large, prominent textarea with monospace font
- **Timer Dropdown**: Clean select with predefined options (5min, 10min, 30min, 1hr)
- **Share Button**: Primary blue button with subtle glow effect
- **URL Display**: Copy-ready input with one-click copy functionality

### Share View (/share/[id])
- **Countdown Timer**: Large, prominent display with color-coded urgency
- **Content Display**: Read-only, syntax-highlighted code blocks
- **Expiration Message**: Clear, friendly messaging for expired content

### Navigation
- Minimal header with subtle branding
- No traditional navigation menu (stealth requirement)
- Breadcrumb indicators where needed

### Forms & Inputs
- **Text Areas**: Dark backgrounds with subtle borders
- **Buttons**: Rounded corners, subtle shadows
- **Copy Actions**: Instant feedback with brief success states

### Status Indicators
- **Timer States**: Green (safe), amber (warning), red (urgent)
- **Copy Feedback**: Brief toast notifications
- **Loading States**: Subtle spinners, no aggressive animations

## Animations
**Minimal Animation Policy**:
- Subtle hover states on interactive elements
- Brief copy confirmation feedback
- Smooth timer countdown transitions
- No distracting or attention-grabbing effects

## Key Visual Characteristics
- **Understated Elegance**: Professional without being flashy
- **Code-Centric**: Optimized for text/code readability
- **Privacy-Conscious**: Visual design reinforces temporary nature
- **Developer UX**: Familiar patterns from development tools

## Mobile Considerations
- Responsive text areas that adapt to viewport
- Touch-friendly button sizing (minimum 44px)
- Readable countdown timers on small screens
- Optimized copy interactions for mobile browsers

This design approach creates a sophisticated yet understated interface that serves the stealth requirements while providing excellent usability for the ephemeral sharing functionality.