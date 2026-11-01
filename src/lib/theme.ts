export function toggleMode() {
  const root = document.documentElement;
  const next = root.dataset.mode === "dark" ? "light" : "dark";
  root.dataset.mode = next;
  try {
    localStorage.setItem("mode", next);
  } catch {}
}
