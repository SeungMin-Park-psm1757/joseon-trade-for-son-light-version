2026-04-30 clean 2D rework

- User feedback: previous blocky pixel pass was visually worse and did not match the provided clean 2D/polished pixel-art references.
- Replaced rough block SVG scenes with cleaner 2D illustrated harbor, mudflat, inland, east port, Jeju, and Tsushima scenes.
- Replaced blocky NPC, hub, ship, and cart SVGs with smoother outlined 2D assets.
- Reworked the map silhouette from hard block shapes to a smoother full-peninsula 2D map while keeping existing port/route interactions.
- Updated final imported polish CSS to remove forced `image-rendering: pixelated`, soften scene/map overlays, and keep market popover usable on 844x390.
- Verification screenshots saved under `.logs/clean-2d-rework/`.
