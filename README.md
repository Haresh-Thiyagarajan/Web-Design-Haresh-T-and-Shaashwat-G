# Sammamish Community Resources

A website that helps people in Sammamish, Washington find local organizations, programs, services, events, and resources in one place.

Made by Haresh T. and Shaashwat G., juniors at Tesla STEM High School, for the 2026–2027 FBLA Chapter Website Design event. This is a student project, not an official City of Sammamish website.

## Running it

The site is plain HTML, CSS, and JavaScript with no build step. Open `index.html` in a browser, or serve the folder locally:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Pages

| File | Page |
|---|---|
| `index.html` | Home, with search and popular topics |
| `organizations.html` | Organizations |
| `programs.html` | Programs |
| `services.html` | Services |
| `events.html` | Events, with "Add to calendar" |
| `resources.html` | Resources |
| `sources.html` | Where every fact, photo, font, and icon came from |
| `about.html` | About the team |

## Project layout

- `js/data.js`: all site content. `SOURCES` lists citations, `ENTRIES` lists every organization, program, service, event, and resource, and `PHOTO_CREDITS` lists where each photo came from.
- `js/app.js`: renders the header, search, listings, and other page content from `data.js`.
- `js/icons.js`: icon set (Lucide).
- `css/styles.css`: all styles.
- `assets/`: fonts, images, and the favicon.

## Adding or updating a listing

1. Add an object to `ENTRIES` in `js/data.js` with a unique `id` and a `type` of `organization`, `program`, `service`, `event`, or `resource`.
2. Set `source` to a key in `SOURCES` (add a new source if needed) and `checked` to the date you confirmed the info.
3. If you add a photo, put it in `assets/img/`, give it descriptive `imageAlt` text, and add a matching entry to `PHOTO_CREDITS`.

## Credits

- Fonts: [Atkinson Hyperlegible](https://brailleinstitute.org/freefont) (Braille Institute) and Bricolage Grotesque (Mathieu Triay), both under the SIL Open Font License.
- Icons: [Lucide](https://lucide.dev) (ISC License).
- Accessibility guidance: [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

Full information sources and photo credits are on the Sources page.
