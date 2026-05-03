# Korea Relief Terrain Pass

## Goal

Rebuild the route-map background so the Korean terrain reads as a real relief map, especially the eastern Taebaek spine, southern Sobaek branch, and northern highlands, while keeping the existing port and route data stable.

## Asset Update

- Replaced the active map background at `starter/public/assets/painted2d/maps/korea-route-map.webp`.
- Preserved the generated source at `starter/public/assets/painted2d/source/korea-relief-map-taebaek.png`.
- Used image generation for a casual 2D Joseon fantasy RPG relief-map pass with a 4096-color, 16-bit-inspired painted palette.

## Terrain Decisions

- North: Baekdu/Kaema high plateau is drawn as the highest northern mass.
- Northeast: Hamgyong ridge runs along the East Sea side.
- Northern interior: Nangnim ridge is represented as the central north-south spine.
- East: Taebaek is the dominant long eastern mountain belt.
- South: Sobaek branches southwest toward the Jirisan area.
- West and southwest: lowlands remain flatter and greener for contrast.

## Code Overlay

- Added a non-interactive SVG mountain relief layer above the raster map and below routes/ports.
- The overlay labels the major ridge systems lightly so geography remains readable without blocking city buttons.
- Existing port coordinates, route data, and click behavior were not changed.

## Verification To Run

- `npm run validate:data`
- `npm run audit:consistency`
- `npm run build`
- `npm run test:smoke`
- `npm run test:visual`
- Browser screenshots at 844x390, 1365x768, and 1920x1080 on the map view.
