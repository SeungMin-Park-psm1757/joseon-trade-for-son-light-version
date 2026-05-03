2026-04-30 pixel/map art rework

- Replaced painterly scene selection with pixel SVG scenes by visual type so port, market, facility, and route previews share one pixel-art resolution.
- Added pixel NPC, hub, fish, ship, and cart SVG assets and routed code away from PNG cutouts/generated vehicle PNGs.
- Reworked the world map layer into a crisper full-peninsula pixel silhouette, including northern extent and island markers.
- Added a final imported `pixel-polish.css` layer to stabilize market popover, map dots, NPC placement, and small landscape viewport overlaps without breaking smoke tests.
- Verified 844x390, 932x430, 1365x768, and 1920x1080 screenshots in `.logs/pixel-map-art-rework/`.
