# 2026-05-03 Principal Reviewer + Red-team QA

## Scope

- Reviewed the accumulated 1~3 pass changes across narrative/tutorial, child-facing terminology, economy goals, worldbuilding/map data, and visual layout.
- Re-verified source/data in `starter/` and mirrored root `data/` files where existing data mirrors were present.
- Treated any screen that still felt temporary or clipped as a blocking issue.

## Blocking Findings Fixed

1. `hanyang-ganghwa` route still carried the `yalu_border` terrain tag. This made a central Joseon route inherit border-worldbuilding semantics. Removed the tag from both `starter/public/data/routes.json` and `data/routes.json`.
2. `tumen_north_market.region` said `러시아 방면`, which was too broad and too modern-feeling for the period framing. Changed it to `두만강 북방` in both data mirrors.
3. Several hard UI terms remained: `화물`, `예상가`, `내구`, `속도`, `명성`, and typo `수획`. Reworded the visible UI toward `짐칸`, `대략 값`, `튼튼함`, `빠르기`, `이름값`, and `수확`.
4. Narrow landscape HUD still clipped the right-side audio controls at 844/932 width. Changed the mobile landscape status bar to size inside its parent and show only the primary `소리` button in the tight HUD.
5. The original Google Drive workspace install produced corrupted `node_modules` package files while trying to install latest Vite dependencies. Pinned `vite` to `7.2.7` and `@vitejs/plugin-react` to `5.1.1`, then regenerated the lockfile from a clean local temp install.

## Verification

- `starter`: `npm run validate:data` passed.
- `starter`: `npm run audit:consistency` passed with the known non-git workspace warning.
- Clean temp copy: `npm run build` passed.
- Clean temp copy: `npm run test:smoke` passed, 6/6.
- Clean temp copy: `npm run test:visual` passed.
- Captured mobile landscape screenshots at 844x390 and 932x430 after the HUD fix.
- Captured desktop screenshots at 1366x768, 1600x900, and 1920x1080 for port, market, map, and vehicles.
- Desktop layout report showed zero horizontal/vertical document overflow and no side/bottom/coach panel overlap across all 12 captured desktop states.

## Remaining Notes

- `npm audit` in the clean temp copy reported one high-severity dependency advisory. It did not block local build or tests, but should be tracked before public release.
- The workspace is not a Git checkout in this local folder, so consistency audit reports the expected repository warning.
