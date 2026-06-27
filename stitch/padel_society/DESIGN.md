---
name: Padel Society
colors:
  surface: '#fbf8ff'
  surface-dim: '#dad9e3'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2fd'
  surface-container: '#eeedf7'
  surface-container-high: '#e8e7f1'
  surface-container-highest: '#e3e1ec'
  on-surface: '#1a1b22'
  on-surface-variant: '#444933'
  inverse-surface: '#2f3038'
  inverse-on-surface: '#f1effa'
  outline: '#747a60'
  outline-variant: '#c4c9ac'
  surface-tint: '#506600'
  primary: '#506600'
  on-primary: '#ffffff'
  primary-container: '#ccff00'
  on-primary-container: '#5b7300'
  inverse-primary: '#abd600'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#5d5e60'
  on-tertiary: '#ffffff'
  tertiary-container: '#ededee'
  on-tertiary-container: '#696b6c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e2e2e3'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1d'
  on-tertiary-fixed-variant: '#454748'
  background: '#fbf8ff'
  on-background: '#1a1b22'
  surface-variant: '#e3e1ec'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  unit-xs: 4px
  unit-sm: 8px
  unit-md: 16px
  unit-lg: 32px
  unit-xl: 64px
---

## Brand & Style
The design system for this product is rooted in the "Modern Startup" aesthetic—specifically drawing inspiration from the precision of Linear and the premium tactility of Apple. It targets an affluent, active demographic in Indonesia who views Padel not just as a sport, but as a lifestyle and social hub.

The visual direction is **Minimalist-Premium**. It leverages massive whitespace to create a sense of "air" and luxury, punctuated by a singular, high-energy accent color. The emotional response should be one of "atletisme elit" (elite athleticism)—clean, energetic, and highly professional. We avoid clutter at all costs, ensuring the court booking experience feels as smooth as the surfaces of the courts themselves.

## Colors
The palette is built on high-contrast functionality. 
- **Primary (Padel Green):** A vibrant `#CCFF00`. This is used exclusively for primary actions (CTA), active states, and critical highlights. It represents the ball and the energy of the game.
- **Surface & Background:** The primary background is pure white (`#FFFFFF`). Secondary surfaces use a very light gray (`#F4F4F5`) to create subtle depth without losing the clean aesthetic.
- **Typography:** Deep Charcoal (`#121212`) provides maximum readability and a premium "ink" feel, while Neutral Gray (`#71717A`) is reserved for secondary information and metadata.
- **Accents:** Success, Error, and Warning states should use desaturated versions of their respective colors to maintain the "Modern Startup" restraint.

## Typography
The typography system creates a "Tech-Sport" hybrid. 
- **Headings:** We use **Space Grotesk**. Its geometric and slightly technical letterforms evoke innovation and precision. Use "Bold" for main headlines to command attention.
- **Body:** **Inter** is the workhorse. It ensures that complex booking schedules and club profiles remain legible at all sizes.
- **Styling:** For Indonesian text, ensure line-heights are generous (`1.6` for body) to maintain the airy, premium feel. Headlines should use slight negative letter-spacing for a tighter, more "editorial" look.

## Layout & Spacing
This design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 
- **Philosophy:** Content should feel "un-boxed." Use generous outer margins (`64px` on desktop) to push content toward the center, creating an elite, focused reading experience.
- **Rhythm:** Spacing follows an 8px base unit. Section vertical spacing should be aggressive (`unit-xl` or `64px+`) to emphasize the minimal, premium aesthetic.
- **Responsiveness:** On mobile, margins shrink to `20px`, and complex grids (like court availability) should transition into horizontal carousels or vertical stacks to maintain touch-target integrity.

## Elevation & Depth
Depth is achieved through **Glassmorphism** and **Ambient Shadows** rather than heavy borders.
- **The "Floating" Effect:** Main cards and navigation bars use a background blur (`backdrop-filter: blur(20px)`) with a highly transparent white fill (`rgba(255, 255, 255, 0.7)`).
- **Shadows:** Use extremely soft, large-radius shadows. For example, a "Level 1" elevation should have a blur of `40px` with only `4%` opacity, using a neutral gray-blue tint to avoid looking "dirty."
- **Layering:** The navigation bar should always be "Floating" (not attached to the top of the browser), with a subtle `1px` border of `rgba(0,0,0,0.05)` to define its edges against the white background.

## Shapes
In line with the premium startup aesthetic, shapes are friendly yet structured.
- **Standard Radius:** We use `0.5rem` (8px) for small elements like checkboxes or inner-nested items.
- **Large Radius:** For primary cards and containers, we use `rounded-2xl` (1rem) or `rounded-3xl` (1.5rem) to evoke a modern, "App-like" feel.
- **Buttons:** Primary buttons should be "Semi-Pill" or "Large Rounded" (minimum `12px` radius) to contrast with the sharp, technical look of the Space Grotesk headings.

## Components
- **Buttons:** 
  - *Primary:* Padel Green background, Black text, Bold weight. No shadow on rest, slight lift on hover.
  - *Secondary:* Ghost style with a subtle `1px` border or light gray background.
- **Cards:** 
  - Must have `rounded-3xl` corners. 
  - Use a subtle white-to-gray gradient or glassmorphism. 
  - Padding should be generous (minimum `32px` for desktop cards).
- **Inputs:** 
  - Minimalist style. No background (transparent) or very light gray. 
  - Bottom-border only or a very soft full border that turns Padel Green on focus.
- **Chips (Court Status):** 
  - Use "Tersedia" (Available) in Padel Green text with a 10% opacity green background.
  - Use "Penuh" (Full) in Neutral Gray.
- **Navbar:** 
  - Floating container with glassmorphism. 
  - Links in `label-md` style. 
  - Centered or split-layout for a premium feel.
- **Booking Grid:**
  - Clear, architectural lines. 
  - Time slots should be large, clickable tiles with high-contrast active states.