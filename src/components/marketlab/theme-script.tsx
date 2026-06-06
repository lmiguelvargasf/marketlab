export function ThemeScript() {
  const script = `
    (function () {
      try {
        var stored = localStorage.getItem("marketlab-theme");
        var theme = stored === "light" || stored === "dark" ? stored : null;
        var dark =
          theme === "dark" ||
          (theme !== "light" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);
        document.documentElement.classList.toggle("dark", dark);
      } catch (e) {}
    })();
  `;

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: inline theme bootstrap
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
