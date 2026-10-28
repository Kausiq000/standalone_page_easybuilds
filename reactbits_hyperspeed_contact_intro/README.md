# React Bits Hyperspeed → TrueFocus Contact Intro

This Vite + React project runs the configured React Bits Hyperspeed scene first, zooms continuously from scale 1 to 2.4 over 3 seconds, fades to black, then shows `CONTACT US` with React Bits TrueFocus brackets on a pure black background. The contact screen remains visible.

## Run in normal Windows CMD

1. Extract this ZIP.
2. Open the extracted `reactbits_hyperspeed_intro` folder in File Explorer.
3. Click the address bar, type `cmd`, and press Enter.
4. Run:

```cmd
node -v
npm -v
npm install
npm run setup:hyperspeed
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

The TrueFocus source and CSS are already included under `src/components/TrueFocus.jsx` and `src/components/TrueFocus.css`; its `motion` dependency is in package.json. Hyperspeed is installed from the official React Bits registry by `npm run setup:hyperspeed`.

To change the zoom duration, update `ZOOM_DURATION_MS` in `src/App.jsx` and the `3s` animation duration in `src/intro.css` to the same value.
