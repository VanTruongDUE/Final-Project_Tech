---
name: T2 Commerce Vibrant
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#5b403b'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#8f7069'
  outline-variant: '#e3beb6'
  surface-tint: '#b62506'
  primary: '#b22204'
  on-primary: '#ffffff'
  primary-container: '#d63c1e'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a4'
  secondary: '#b41f00'
  on-secondary: '#ffffff'
  secondary-container: '#db3514'
  on-secondary-container: '#fffbff'
  tertiary: '#bb0017'
  on-tertiary: '#ffffff'
  tertiary-container: '#e51d27'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad3'
  primary-fixed-dim: '#ffb4a4'
  on-primary-fixed: '#3e0500'
  on-primary-fixed-variant: '#8d1600'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a4'
  on-secondary-fixed: '#3e0500'
  on-secondary-fixed-variant: '#8d1600'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb3ac'
  on-tertiary-fixed: '#410003'
  on-tertiary-fixed-variant: '#93000f'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e3e2e2'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.25'
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
  price-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1'
  price-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 12px
  margin-mobile: 12px
  margin-desktop: auto
  max-width: 1200px
---

## Brand & Style

The design system is engineered for high-velocity retail, prioritizing conversion and energetic engagement. It draws heavily from modern Pan-Asian eCommerce aesthetics, characterized by a "vibrant functionalism" that balances dense information architecture with loud, clear calls to action.

The style is **Corporate / Modern** with a **High-Contrast** twist. It utilizes a predominantly clean, white interface to allow product photography and price-point indicators to "pop." The emotional response should be one of urgency and reliability—users should feel that deals are immediate and the checkout process is frictionless. Key characteristics include:
- **Energetic Utility:** Every element is designed to lead the eye toward a purchase or discovery path.
- **Visual Urgency:** Frequent use of high-contrast red and orange for price tags and countdowns.
- **Structured Density:** A systematic approach to displaying large amounts of data (flash sales, categories, reviews) without overwhelming the user.

## Colors

The palette is anchored by a high-energy orange that drives action. 

- **Primary & Secondary:** The core brand orange (`#EE4D2D`) is used for primary buttons, selection states, and active navigation. The darker variant (`#D73211`) is reserved for hover states and text-on-light backgrounds to ensure accessibility.
- **Emphasis:** `#D0011B` is specifically designated for "Sale" prices, countdown timers, and critical price emphasis. 
- **System Neutral:** A cool grey spectrum manages the information hierarchy, with `#F5F5F5` providing a soft canvas that makes white surfaces feel elevated.
- **Light Brand Surface:** `#FFF1EC` is used for high-interest containers, such as voucher sections or shipping promotions, to differentiate them from standard product cards.

## Typography

This design system utilizes **Inter** exclusively to maintain a systematic, neutral, and highly readable environment. The hierarchy is strictly enforced:

- **Price Hierarchy:** Specialized "Price" tokens are defined. `price-lg` is for product detail pages, while `price-sm` is used in list views. Both use the primary brand color to ensure they are the most prominent element on any surface.
- **Weights:** Heavy weights (600-700) are used for product titles and section headers to provide immediate context in a dense UI.
- **Readability:** Body text is kept to a 14px base (`body-md`) for desktop, which is the standard for high-density eCommerce, ensuring a balance between information volume and legibility.

## Layout & Spacing

The layout follows a **Fixed Grid** model on desktop, centered with a maximum width of 1200px to ensure a consistent shopping experience across wide monitors.

- **Grid:** A 12-column grid is used for desktop. For mobile, a 2-column grid is standard for product listings to maximize the number of products visible above the fold.
- **Rhythm:** We use a 4px baseline. Most components use `md` (16px) for internal padding. Product grids use a `gutter` of 12px to maintain high density while providing enough "breathing room" to distinguish between product images.
- **Mobile:** Margins scale down to 12px on mobile devices to preserve screen real estate for content.

## Elevation & Depth

This design system uses **Tonal Layers** combined with **Ambient Shadows** to create a structured hierarchy:

- **Level 0 (Background):** `#F5F5F5`. This is the lowest plane.
- **Level 1 (Cards/Surfaces):** White background with a very subtle, diffused shadow (`0px 1px 20px 0px rgba(0,0,0,0.05)`). This makes products feel tangible but not heavy.
- **Level 2 (Hover/Floating):** Used for "Add to Cart" sticky bars or dropdown menus. These use a slightly more aggressive shadow to indicate they are closer to the user in the Z-axis.
- **Outlines:** In low-density areas, a 1px border of `#E5E7EB` is used instead of a shadow to keep the interface clean and "app-like."

## Shapes

The shape language is **Rounded**, favoring a friendly but professional appearance.

- **Global Radius:** 8px is the standard for buttons and inputs.
- **Container Radius:** Product cards and major surface containers use 12px (`rounded-lg`) to create a softer, more modern aesthetic that contrasts with the technical nature of a retail grid.
- **Pill Shapes:** Used exclusively for badges (e.g., "Flash Sale", "Free Shipping") to distinguish them from interactive buttons.

## Components

### Buttons
- **Primary:** Solid `#EE4D2D` with white text. 8px-10px corner radius. Used for "Buy Now" or "Add to Cart."
- **Secondary:** White background with `#EE4D2D` border and text. Used for "Chat Now" or "View Shop."
- **Ghost:** No border, primary color text. Used for secondary navigation actions.

### Cards
- **Product Card:** White background, 12px radius, subtle shadow. High contrast price at bottom left. Image takes up the top 60-70% of the card.
- **Category Card:** Smaller, centered icon with a 12px label underneath.

### Inputs
- **Text Fields:** 1px border `#E5E7EB`. On focus, the border transitions to `#EE4D2D` with a soft 2px outer glow of the same color.
- **Search Bar:** Typically features a prominent `#EE4D2D` search icon or button at the end of the field to drive search-first behavior.

### Feedback & Indicators
- **Chips:** Used for product attributes (e.g., Size, Color). Selected state uses primary orange background or border.
- **Badges:** Small, high-contrast overlays on product images (e.g., "-50%" or "Mall"). Use `#D0011B` for discount badges.
- **Progress Bars:** Used for "Stock Left" in flash sales. Uses a gradient from `#F97316` to `#EE4D2D` to show intensity.