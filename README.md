# hairan.mn homepage

A static redesign of the hairan.mn homepage in the new Hairan brand, plus a design-system page documenting everything it uses.

## Run it locally

No dependencies and no network needed: fonts, icons and photos are all local, and every outbound link is disabled (`href="#"`) for the demo. You can open `index.html` directly, or serve the folder:

```bash
cd hairan-site
python3 -m http.server 8000
# open http://localhost:8000/            homepage
# open http://localhost:8000/design-system.html
```

If you change an icon or a page, edit `src/*.template.html` and run `python3 src/build.py`; it inlines `assets/icons/sprite.svg` into both pages.

## Structure

```
index.html              homepage (Mongolian, with МН / EN switch)
design-system.html      brand + component documentation
css/fonts.css           Nunito + Manrope embedded as data URIs (SIL OFL)
css/tokens.css          colours, type scale, spacing, radii, layout tokens
css/site.css            homepage components
css/app.css             app preview: launcher, dialog, app home screen
css/ds.css              documentation-page layout only
js/data.js              listing snapshot from hairan.mn (23 Oct 2026)
js/main.js              renders listings, filter, show more, mobile menu, language switch
assets/logo/            supplied logo SVGs, unchanged
assets/elements/        graphic elements (see below)
assets/icons/           UIcons Bold Rounded: sprite.svg + one SVG per icon
assets/photos/          demo bakery photos (Pexels), see CREDITS.txt
src/                    page templates + build.py
```

## Where the assets came from

| File | Source |
|---|---|
| `assets/logo/*.svg` | Supplied files, copied as-is |
| `elements/line-logo-dark.webp`, `solid-logo-basil.webp` | Rendered at 5× from `hairan_Visual_Guideline.pdf` (vector), labels removed. Background colour is baked in, so use only on Blackberry / Basil. |
| `elements/line-motif.png`, `line-slice.png` | Same PDF; background converted to transparency. The 1px slice repeats to extend the line to any width. |
| `elements/pattern.svg` | Rebuilt from the supplied `Pattern.svg` as a seamless SVG `<pattern>` (the supplied tile had visible seams when repeated). |
| `icons/` | Flaticon UIcons, Bold Rounded (npm `@flaticon/flaticon-uicons` 3.3.1), glyphs converted to SVG. Free use requires the credit "Uicons by Flaticon", which is in the footer. |

## Content

Copy and data come from hairan.mn, hairan.mn/zaavar and hairan.mn/partner. Listings in `js/data.js` are a snapshot; on production replace `window.HAIRAN_DATA` with the listings API. The listing and shop IDs are kept in the data so links can be restored (`/listings/{id}`, `/shops/{id}`); in this demo all such links are inert.

## Known limitations

- **Demo photos.** Product images are stock Pexels photos, not the bakeries' real listings.
- **Snapshot data.** Times left ("55 мин", "2 цаг") and prices are from 23 Oct 2026 and don't update.
- **Category filter** (Талх / Нарийн боов / Бялуу) uses a type I assigned to each listing from the shop name.
- **"Ойролцоох дуртай газрууд" (nearby favourites)** needs location and a login, so it's replaced by a static index of the partner places.
- **EN translation** covers the interface and copy; bakery names stay as written.
- **Links** are inert in this demo build.
- **Outline-logo SVGs** (`Logo_Outline_*`) contain a 150px embedded bitmap, so they're not used; the large outline logo comes from the PDF instead.
- The guidelines don't define logo clear space; the site keeps at least 24px around the logotype.
