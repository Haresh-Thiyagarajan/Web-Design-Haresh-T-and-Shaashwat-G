# Sammamish Community Resources

A community resource website for Sammamish, Washington, made by Haresh T and Shaashwat G for the FBLA 2026–2027 Website Design event (topic: Community Resource Website).

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Organizations | `organizations.html` |
| Programs | `programs.html` |
| Services | `services.html` |
| Events | `events.html` |
| Resources | `resources.html` |
| Sources | `sources.html` |
| About (planning, UX design, evaluation, metrics, rubric guide) | `about.html` |

## How to open it

- **Online:** the GitHub Pages link in this repo's About sidebar.
- **Offline (backup for competition):** double-click `index.html`. Everything (fonts, icons, photos) is stored in this folder, so no internet is needed.

## How to edit content

All listings live in **`js/data.js`**. To add, fix, or remove an organization, program, service, event, or resource, edit that file. Every page, the search, and the Sources page update automatically.

- Each entry needs a `source` (a key from `SOURCES` at the top of the file) and a `checked` date.
- Repeating events use `recur`, so the site calculates the next date by itself. One-time events use `date: "YYYY-MM-DD"`.

The shared header, menu, and footer are in `js/app.js`. The colors and fonts are in `css/styles.css`.

## Before competition: checklist

- [ ] Re-check every listing's address, phone, and hours, then update its `checked` date.
- [ ] Replace or get permission for the two watermarked photos: `assets/img/lake-sunset.jpg` (© Gary Hamburgh) and `assets/img/farmers-market.jpg` (© 2017).
- [ ] Find the original photographer for each other photo and add credits in `js/data.js` (`PHOTO_CREDITS`).
- [ ] Add real upcoming events for the competition date.
- [ ] Proofread every page (grammar is 5 rubric points).
- [ ] Test on laptop, tablet, and phone. Run Lighthouse in Chrome DevTools.

## Credits

Fonts: Atkinson Hyperlegible (Braille Institute, OFL) and Bricolage Grotesque (OFL). Icons: Lucide (ISC). Full source list on the Sources page.
