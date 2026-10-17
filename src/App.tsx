/*
 * WebDIY starter page: a placeholder, not part of the app.
 *
 * On the first build, replace this whole file with the app's own shell. Don't
 * extend it, restyle it or keep any of it, and don't copy its pattern: the hex
 * colours in the <style> below are fixed only so the placeholder looks the same
 * whatever the app's tokens become. The app's colours belong in src/index.css
 * as tokens, used through Tailwind's semantic classes.
 *
 * data-webdiy-theme on <html> is set only inside the WebDIY builder's preview,
 * to mirror the builder's light or dark setting. Published sites, share links
 * and new tabs never have it, so the app should not rely on it.
 */

const STARTER_CSS = `
[data-webdiy-starter] {
  --starter-page: #f9f9f7;
  --starter-mark: #cfcfcd;
  --starter-line: #6f6c66;
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  margin: 0;
  background: var(--starter-page);
  font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-webdiy-theme='light']) [data-webdiy-starter] {
    --starter-page: #1f1f1e;
    --starter-mark: #545453;
    --starter-line: #9c998f;
  }
}
:root[data-webdiy-theme='dark'] [data-webdiy-starter] {
  --starter-page: #1f1f1e;
  --starter-mark: #545453;
  --starter-line: #9c998f;
}
[data-webdiy-starter] > div {
  position: relative;
}
[data-webdiy-starter] svg {
  display: block;
  width: 100px;
  height: auto;
  fill: var(--starter-mark);
}
[data-webdiy-starter] p {
  position: absolute;
  top: calc(100% + 22px);
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  max-width: min(32ch, calc(100vw - 48px));
  margin: 0;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  color: var(--starter-line);
  animation: webdiy-starter-line 500ms cubic-bezier(0.4, 0, 0.2, 1) both;
}
@keyframes webdiy-starter-line {
  from {
    opacity: 0;
  }
}
@media (max-width: 520px) {
  [data-webdiy-starter] svg {
    width: 72px;
  }
}
@media (prefers-reduced-motion: reduce) {
  [data-webdiy-starter] p {
    animation: none;
  }
}
`;

export default function App() {
  return (
    <main data-webdiy-starter="">
      <style>{STARTER_CSS}</style>
      <div>
        <svg viewBox="0 0 290 170" aria-hidden="true" focusable="false">
          <path d="m20.88 10.53-.75.37c-17 8.37-24 28.93-15.64 45.94l44.3 90.03c8.37 17 28.94 24 45.94 15.64l.75-.37c17-8.36 24-28.93 15.64-45.93l-44.3-90.04c-8.37-17-28.94-24-45.94-15.64ZM126.59 10.53l-.75.37c-17 8.37-24 28.93-15.64 45.94l44.3 90.03c8.37 17 28.94 24 45.94 15.64l.75-.37c17-8.36 24-28.93 15.64-45.93l-44.3-90.04c-8.37-17-28.94-24-45.94-15.64Z" />
          <path d="M248.3 79.65a36.3 36.3 0 0 0 36.26-36.32A36.31 36.31 0 0 0 248.3 7a36.3 36.3 0 0 0-36.26 36.31 36.3 36.3 0 0 0 36.26 36.32v.02Z" />
        </svg>
        <p>The first version appears here once WebDIY has built it.</p>
      </div>
    </main>
  );
}
