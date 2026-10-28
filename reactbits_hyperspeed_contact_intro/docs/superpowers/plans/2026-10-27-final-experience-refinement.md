# EasyBuilds 360° Office — Final Experience Master Plan

> **Goal**: Complete final refinement covering route-scoped instructions, seamless solid panorama without fading, fast Contact Us startup, full particle dispersal transition, and 4 interactive service frame popups with Galaxy backgrounds.

---

### Phase 1: Route-Scoped UI & Instructions (Priority 1)
- **App.jsx**:
  - Remove `<header className="home-header ...">` on Contact Us page (`display: none` or conditional render only if explicitly needed).
  - Scope all Workspace badges and labels strictly to the Workspace.
- **ContactStudio.jsx**:
  - Gate `.studio-instruction-overlay` with `isActive` (i.e. `{!isModalOpen && !isChatOpen && !activeServiceModal && isActive && (...)}`).
  - Result: On Contact Us page (`/` or `!introDismissed`), ZERO instructions or Workspace badges appear. On Workspace (`/contact`), the two exact instruction lines appear at top-left.

---

### Phase 2: Eliminate Panorama Fading & Incomplete Desk/Monitors (Priority 2)
- **Diagnose**:
  - `FRONT VIEW.png` is 1672px wide with full solid monitors and desk spanning up to x=1550+.
  - In `build_clean_panorama.ps1`, `$frontCropX = 216` and `$frontW = 1240` artificially cropped the right monitor and desk, while `$featherR = 45` and `$featherL = 45` faded them into the dark conference room background.
  - `$fBot = 45` faded the bottom 45px of the desk.
- **Fix**:
  - Expand `FRONT VIEW` crop to encompass the full desk and all 3 monitors (crop from x=40 to x=1580, width 1540).
  - Remove bottom vertical fading (`$fBot = 0`) on the desk so it sits solid and opaque on the floor.
  - Position horizontal blends along the natural architectural vertical grooves/edges (left window mullion at x=50, right shelf edge at x=1550), completely outside the monitors and desk.
  - Re-generate `public/assets/easybuilds_office_360.jpg`.
  - Result: All three desktop monitors are 100% solid and naturally opaque; both desk edges are solid and continuous.

---

### Phase 3: Fast Contact Us Startup & Dispersal Transition (Priority 3 & 4)
- **intro.css**:
  - Remove artificial animation delay (180ms/320ms) so `contact-heading-wrap` and `contact-cta-wrap` render immediately on page mount with zero black pause.
- **WarpText.jsx**:
  - Set `intro={false}` so `introProgress` starts at 1, rendering the crisp "CONTACT US" heading immediately.
- **AeroShards.jsx**:
  - Optimize shard count to 800 for instant WebGPU/WebGL pipeline creation without blocking the main thread.
- **Transition**:
  - Clicking `LET'S GO` triggers `isDispersing=true`.
  - Heading and button disperse smoothly with `AeroShards` particle explosion.
  - Reveal 3D workspace at full calibrated brightness without any black fade-to-black overlay or dimming pause.
  - After 2.2s, dismiss intro screen from DOM so it uses 0 GPU.
  - Instructions and SplashCursor mount cleanly in Workspace.

---

### Phase 4: Interactive 4 Service Boards & Galaxy Popups (Priority 5 & 6)
- **studioEngine.js**:
  - Add 4 hit target meshes in 3D world space corresponding to the 4 service frames:
    1. `hosting`: Top Left `(-285, 125, -500)` — `HOSTING & DEPLOYMENT`
    2. `uiux`: Bottom Left `(-285, 40, -500)` — `UI / UX DESIGN`
    3. `management`: Top Right `(285, 125, -500)` — `WEBSITE MANAGEMENT`
    4. `webdev`: Bottom Right `(285, 40, -500)` — `WEBSITE DEVELOPMENT`
  - On genuine click without drag, trigger `onServiceTrigger(serviceKey)`.
  - Preserve drag rotation (drag threshold >= 6px).
  - Desktop monitors continue opening Contact Information.
- **ContactStudio.jsx & ContactStudio.css**:
  - Add state `activeServiceModal` (`null | 'hosting' | 'uiux' | 'management' | 'webdev'`).
  - Implement 4 individual Galaxy-style popups with the exact headings and service capabilities.
  - Contained Galaxy background, accessible close button, smooth animations, ESC key support.
  - Closing maintains current camera angle.

---

### Phase 5: Verification & Preservation
- Verify all 14 points:
  1. Contact Us page has no Workspace badges or instructions.
  2. Immediate load without black pause.
  3. Particle dispersal into bright workspace.
  4. Panorama has solid monitors, solid desk edges, no laptop.
  5. 4 service boards open their respective Galaxy popups.
  6. 3 monitors open Contact Information.
  7. Gold/yellow SplashCursor only on Workspace.
  8. Build passing with 0 errors.
