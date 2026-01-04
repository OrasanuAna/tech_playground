(() => {
  const KEY = "htp_editor_content_v1";
  const editor = document.getElementById("editor");
  const saved = document.getElementById("saved");

  function showSaved(msg) {
    saved.textContent = msg;
    setTimeout(() => (saved.textContent = ""), 1800);
  }

  const stored = localStorage.getItem(KEY);
  if (stored) editor.innerHTML = stored;

  document.querySelectorAll("[data-cmd]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cmd = btn.getAttribute("data-cmd");
      document.execCommand(cmd, false, null);
      editor.focus();
    });
  });

  document.getElementById("btnLink").addEventListener("click", () => {
    const url = prompt("URL pentru link:", "https://");
    if (!url) return;
    document.execCommand("createLink", false, url);
    editor.focus();
  });

  document.getElementById("btnH2").addEventListener("click", () => {
    document.execCommand("formatBlock", false, "h2");
    editor.focus();
  });

  document.getElementById("btnUl").addEventListener("click", () => {
    document.execCommand("insertUnorderedList", false, null);
    editor.focus();
  });

  document.getElementById("btnSave").addEventListener("click", () => {
    localStorage.setItem(KEY, editor.innerHTML);
    showSaved("Salvat!");
  });

  document.getElementById("btnReset").addEventListener("click", () => {
    if (!confirm("Sigur resetezi conținutul?")) return;
    localStorage.removeItem(KEY);
    location.reload();
  });
})();
