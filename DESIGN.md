---
name: Sammamish Community Resources
description: A warm civic directory of local organizations, programs, services, events, and resources.
colors:
  cedar: "#a4471c"
  cedar-deep: "#8a3a16"
  cedar-tint: "#f6e3d6"
  amber: "#f2a93b"
  amber-soft: "#fde9c8"
  evergreen: "#2f6b4f"
  evergreen-tint: "#e3f0e8"
  espresso: "#2b1b12"
  ink: "#2b1b12"
  ink-soft: "#6b5446"
  paper: "#ffffff"
  sand: "#fbf4ec"
  sand-soft: "#fcf6ef"
  line: "#eadccf"
  line-strong: "#d8c3b1"
  on-dark: "#f6ebe0"
  on-dark-soft: "#c9b6a6"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Avenir Next, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 1.4rem + 2.3vw, 3.1rem)"
    fontWeight: 750
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Bricolage Grotesque, Avenir Next, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.2rem + 1.2vw, 2.1rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Bricolage Grotesque, Avenir Next, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Atkinson Hyperlegible, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Atkinson Hyperlegible, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 700
    lineHeight: 1.4
rounded:
  sm: "8px"
  md: "10px"
  badge: "14px"
  lg: "16px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 32px)"
  wrap: "1180px"
  gap-sm: "8px"
  gap-md: "16px"
  gap-lg: "28px"
  section: "clamp(48px, 7vw, 88px)"
components:
  button-primary:
    backgroundColor: "{colors.cedar}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "10px 22px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.cedar-deep}"
    textColor: "{colors.paper}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cedar}"
    rounded: "{rounded.pill}"
    padding: "10px 22px"
    height: "48px"
  button-ghost-hover:
    backgroundColor: "{colors.cedar-tint}"
    textColor: "{colors.cedar-deep}"
  button-save:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.cedar}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
    height: "42px"
  button-save-saved:
    backgroundColor: "{colors.evergreen}"
    textColor: "{colors.paper}"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
    height: "40px"
  chip-pressed:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.paper}"
  tag:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  tag-type:
    backgroundColor: "{colors.cedar-tint}"
    textColor: "{colors.cedar-deep}"
  search-input:
    backgroundColor: "{colors.sand-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 14px 10px 44px"
    height: "46px"
  quick-link-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "22px 20px 20px"
  icon-badge:
    backgroundColor: "{colors.cedar}"
    textColor: "{colors.paper}"
    rounded: "{rounded.badge}"
    size: "48px"
  date-block:
    backgroundColor: "{colors.cedar-tint}"
    textColor: "{colors.cedar-deep}"
    rounded: "{rounded.badge}"
    size: "76px"
  nav-bar:
    backgroundColor: "{colors.cedar}"
    textColor: "{colors.paper}"
    height: "54px"
  nav-item-active:
    backgroundColor: "{colors.cedar-deep}"
    textColor: "{colors.paper}"
  help-card:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
    padding: "22px 22px 20px"
---

# Design System: Sammamish Community Resources

## Overview

**Creative North Star: "The Warm Civic Directory"**

The system keeps the shell residents already know from a city website: a slim utility bar, a white header with the wordmark, a full-width main nav bar, a photo hero, a row of icon quick links, and a footer packed with information. Then it repaints that shell in the materials of Sammamish itself. Cedar siding from Sammamish Commons and sunset over Lake Sammamish replace municipal blue. The result is a civic interface that reads as official in structure and neighborly in tone.

The layout is dense but calm. Long directory listings are separated by hairline rules, not boxed cards. Color is reserved for the shell (nav bar, brand mark, buttons) and for meaning: amber for focus and urgency, evergreen for "next date" and saved states. Everything else sits on a white ground with warm sand bands for page heads and the hero. Real photographs, supplied by the team, are framed in large rounded plates with a soft espresso-tinted shadow. Type pairs a characterful grotesque for headings with a legibility-first body face, because plain language and accessibility come before decoration.

**Key Characteristics:**
- City-site shell structure: espresso utility bar, white header, cedar nav bar, espresso footer.
- Warm, earth-derived palette with one shell color (cedar) and two signal colors (amber, evergreen).
- Pill-shaped interactive controls; rounded-rectangle containers (10px and 16px).
- Hairline-ruled lists for directory content; cards only for navigation targets.
- Lucide line icons at 1.75 stroke, inlined as SVG and colored by `currentColor`.
- Accessibility controls (text size, high contrast) built into the shell and backed by token overrides.

## Colors

A warm, earthy palette: cedar and espresso carry structure, amber and evergreen carry signal, sand and paper carry the content ground.

### Primary
- **Commons Cedar** (#a4471c): The shell color. Main nav bar, brand mark tile, primary buttons, My List button, icon badges, link text, the accent word in the home H1, inline detail icons, and quick-link counts.
- **Deep Cedar** (#8a3a16): Hover and pressed state for every cedar surface, and the active nav item background. Also text on cedar-tint.
- **Cedar Blush** (#f6e3d6): Soft fill for date blocks, type tags, and ghost/save button hovers.

### Secondary
- **Lake Sunset Amber** (#f2a93b): Focus ring, text selection, active-nav underline, My List count badge, crisis phone numbers on dark grounds, pressed tool buttons, skip link.
- **Amber Haze** (#fde9c8): Note callouts and the arrival highlight on a linked-to entry.

### Tertiary
- **Evergreen** (#2f6b4f): Meaning, not decoration. The computed "next date" line on entries and the Saved state of the Save button.
- **Evergreen Mist** (#e3f0e8): Pale evergreen fill, reserved for saved/positive contexts.

### Neutral
- **Espresso** (#2b1b12): The crisis/utility bar, the "Need help right now?" band, the footer, pressed filter chips, the rubric table header, and the toast. Also the ink color for headings and body text (`ink`), which high-contrast mode deepens to pure black.
- **Bark** (#6b5446, `ink-soft`): Secondary text: ledes, captions, meta lines, breadcrumbs, placeholders, source citations.
- **Paper** (#ffffff): The default content ground and text on cedar and espresso.
- **Sand** (#fbf4ec): Warm tint band behind the hero, page heads, drawer head, tags, and list hover.
- **Pale Sand** (#fcf6ef, `sand-soft`): Header search field fill, striped table rows, upcoming-list hover.
- **Hairline** (#eadccf, `line`): Rules between entries, sections, and drawer items; card borders.
- **Strong Hairline** (#d8c3b1, `line-strong`): Input and chip borders.
- **Warm Cream** (#f6ebe0, `on-dark`) and **Dusk** (#c9b6a6, `on-dark-soft`): Primary and secondary text on espresso.

### Named Rules
**The Cedar Shell Rule.** Cedar is the shell and the call to action: nav bar, brand, primary buttons, icon badges, links. It does not flood content sections; the hero ground is sand, not cedar, so the H1 and search read at full legibility.

**The Signal Color Rule.** Amber means "look here" (focus, urgency, current location). Evergreen means "this is good or upcoming" (next date, saved). Never use either as a decorative fill.

**The High-Contrast Override Rule.** High-contrast mode is a token swap on `:root`, not a separate stylesheet: cedar darkens to #7a2e0c, ink to #000000, sand to white, and lines to espresso/black. New components must draw every color from tokens so the swap reaches them.

## Typography

**Display Font:** Bricolage Grotesque (with Avenir Next, system-ui)
**Body Font:** Atkinson Hyperlegible (with system-ui, Segoe UI)

**Character:** Bricolage brings a friendly, slightly quirky grotesque voice to headings and numerals; Atkinson Hyperlegible, designed for low-vision readers, keeps every listing and phone number unambiguous. Both are self-hosted so the site works offline.

### Hierarchy
- **Display** (750, clamp(2.1rem, 1.4rem + 2.3vw, 3.1rem), 1.05, -0.03em): Home hero H1 only. One accent word is set in cedar (an `em` with normal style). Interior page H1s use the same weight at clamp(2rem, 1.4rem + 2.6vw, 3.25rem), line-height 1.15.
- **Headline** (700, clamp(1.5rem, 1.2rem + 1.2vw, 2.1rem), 1.15): Section headings ("Coming up", "Need help right now?") and prose-page section titles.
- **Title** (700, 1.2-1.35rem, 1.15): Entry names (1.35rem), quick-link names (1.3rem), upcoming event names and place labels (1.2-1.25rem). All in Bricolage.
- **Body** (400, 1.0625rem; 1rem under 640px, 1.6): All running text, capped at 70ch.
- **Label** (700, 0.82rem): Tags and the My List count. Small meta text uses 0.85-0.95rem at 400 in Bark.
- **Big numerals** (800, Bricolage): Help-line numbers (2.6rem, amber on espresso) and date-block days (2rem, deep cedar).

### Named Rules
**The Balanced Heading Rule.** Every heading uses `text-wrap: balance` and slight negative tracking (-0.015em, -0.03em on the hero). Body copy never goes below 0.85rem.

**The Root-Scale Rule.** Size everything in rem. The A-/A+ controls scale the root to 112.5% and 125%, and the layout must survive both.

## Layout

A single centered column (1180px max) with a fluid gutter (clamp(16px, 4vw, 32px)). Sections breathe at clamp(48px, 7vw, 88px) vertically. The home hero is a two-column split (1.05fr / 0.95fr): headline, lede, large search, and popular chips on the left; a framed photo with a map-pin caption on the right. The five-card quick-link row is pulled up into the hero band with a negative top margin so all five categories show in the first viewport at 1440x900.

Category pages open with a sand page head (breadcrumb, icon-badge H1, lede, optional photo), then a toolbar (filter search plus chips), then a ruled list. Each entry is a three-column grid: 160px photo, content, and a 240-320px aside with contact details and the Save button. Prose pages (About, Sources) use a 240px sticky table of contents beside the content.

Breakpoints: at 1080px quick links go to three columns and entry photos shrink to 120px; at 900px the hero, page head, and prose layouts stack, the page-head photo hides, and the nav collapses into a full-width cedar "Menu" toggle; at 640px quick links go to two columns, entries stack with 16:9 photos, and button labels compress.

## Elevation & Depth

A hybrid: mostly flat with tonal banding (paper, sand, espresso), plus a three-step shadow scale tinted with espresso rather than gray. Shadows mark things that float or invite a click: the hero photo plate, the hero search, quick-link cards, the search dropdown, the drawer, and the toast.

### Shadow Vocabulary
- **Resting** (`box-shadow: 0 1px 2px rgb(43 27 18 / 0.06), 0 2px 6px rgb(43 27 18 / 0.05)`): Quick-link cards and the hero search at rest.
- **Lifted** (`box-shadow: 0 6px 18px rgb(43 27 18 / 0.10), 0 2px 4px rgb(43 27 18 / 0.06)`): Quick-link hover (with a 4px rise) and page-head photos.
- **Floating** (`box-shadow: 0 18px 48px rgb(43 27 18 / 0.18)`): Hero photo plate, search results popover, My List drawer, toast.

### Named Rules
**The Warm Shadow Rule.** Shadows are always tinted espresso (rgb 43 27 18), never neutral black, and always soft and diffuse. Directory entries carry no shadow; they are separated by hairlines.

## Shapes

Two families. Interactive controls are full pills (999px): buttons, chips, tags, search fields, the count badge, the toast. Containers are rounded rectangles: 10px for entry photos, list hover rows, notes, and swatches; 16px for cards, photo plates, the search popover, and help cards; 14-16px for icon badges and date blocks (the brand mark tile echoes this at rx 13 on 48px). Small utility buttons in the top bar and TOC links use 8px. Borders are 1px hairlines for structure and 1.5px for interactive outlines (chips, inputs, ghost and save buttons, card borders).

## Components

### Buttons
Confident, rounded, and plainly labeled.
- **Shape:** Full pill (999px), 48px minimum height, bold body font.
- **Primary:** Cedar fill, white text, 10px 22px padding. Hover deepens to Deep Cedar.
- **Ghost:** Transparent with a 1.5px cedar border and cedar text; hover fills Cedar Blush.
- **Focus:** 3px amber outline, 2px offset, site-wide.
- **My List button:** Header pill in cedar (46px) with an amber count badge that bumps (scale 1.35) when an item is added.

### Save Button (signature)
The signature interaction. Every entry carries one.
- **Default:** Paper fill, 1.5px cedar border, cedar text with a bookmark icon, 42px pill.
- **Hover:** Cedar Blush fill, Deep Cedar text.
- **Saved:** Evergreen fill and border, white text, bookmark-check icon.

### Chips
- **Style:** 40px pill, paper fill, 1.5px Strong Hairline border, ink text at 0.95rem. In the hero they sit on transparent over sand.
- **State:** Hover shifts border to cedar and text to Deep Cedar; pressed (`aria-pressed`) fills espresso with white text.

### Tags
Small 0.82rem bold pills on sand with Bark text; the entry-type tag uses Cedar Blush with Deep Cedar text.

### Cards / Containers
- **Quick-link card:** Paper, 1.5px hairline border, 16px radius, 22px 20px 20px padding, resting shadow. Contains a 56px cedar icon badge, title, short description, and a cedar "N listed" count with an arrow that slides 4px on hover. Hover lifts the card 4px, shifts the border to cedar, and raises the shadow.
- **Help card:** On espresso: translucent cream fill (6%), cream hairline (14%), 16px radius; big amber numeral; hover border turns amber.
- **Place tile:** Photo fills a 16px-radius tile; an espresso gradient scrim holds the label; image scales 1.04 on hover over 0.8s.
- **Note:** Amber Haze fill, 10px radius, deep-cedar icon.

### Inputs / Fields
- **Style:** Pill search field, 46px (60px in the hero), Pale Sand fill (paper in the hero), 1.5px Strong Hairline border, leading search icon in Bark.
- **Hover / Focus:** Border turns cedar; on focus the fill goes white and a 4px amber halo (`rgb(242 169 59 / 0.35)`) appears instead of an outline.
- **Results:** A 16px-radius popover with floating shadow; options are 10px-radius rows that highlight in sand.

### Navigation
- **Utility bar:** Espresso, 44px, crisis numbers in amber bold on the left, text-size and contrast tool buttons (8px radius, translucent cream border, amber when pressed) on the right.
- **Main nav:** Full-width cedar bar, 54px items, white bold labels. Hover and current page fill Deep Cedar; a 4px amber underline grows from the center (half on hover, full on the current page) with the ease-out curve.
- **Mobile (900px and below):** A full-width cedar "Menu" toggle with a rotating chevron opens a stacked list; the amber marker moves to a 4px left edge bar.
- **Footer:** Espresso, four columns (brand, Explore, About this site, City Hall contact), cream links that turn amber on hover, a hairline-separated bottom row.

### Date Block
A 76px (64px on mobile) Cedar Blush tile with 14px radius: uppercase tracked month (0.8rem, 0.08em) over a large Bricolage day numeral in Deep Cedar. Leads each row of the upcoming-events list.

### My List Drawer
A right-side `dialog` (max 440px) that slides in over 0.45s on an espresso scrim at 45%. Sand header, hairline-ruled list with remove buttons, footer with Print and Clear actions. Printing turns the list into a plain black-on-white "Sammamish Resource Card".

## Do's and Don'ts

### Do:
- **Do** draw every color from the `:root` tokens so high-contrast mode reaches the component.
- **Do** keep cedar on the shell and calls to action, and the hero and page heads on sand (#fbf4ec).
- **Do** use amber (#f2a93b) for focus, urgency, and current location, and evergreen (#2f6b4f) for next dates and saved states.
- **Do** separate directory entries with 1px hairlines (#eadccf) rather than boxing them in cards.
- **Do** use pill shapes for controls and 10px/16px rounded rectangles for containers.
- **Do** use Lucide line icons at 1.75 stroke, inlined as SVG with `currentColor`.
- **Do** tint every shadow espresso and keep it soft; animate with `cubic-bezier(0.16, 1, 0.3, 1)` and honor reduced motion.
- **Do** keep touch targets at 40px or more and body text at 70ch maximum.

### Don't:
- **Don't** use municipal blue or any cool-gray neutral; the warm palette replaces the city's colors.
- **Don't** use the City of Sammamish logo or anything implying official affiliation.
- **Don't** use AI-generated images; photographs are team-supplied and credited on the Sources page.
- **Don't** use amber or evergreen as decorative fills.
- **Don't** stack two dark bars at the top of the page; the utility bar is the only espresso band above the header.
- **Don't** use neutral black shadows or hard offset shadows.
