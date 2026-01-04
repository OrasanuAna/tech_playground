(() => {
  const msg = document.getElementById("msg");
  const svg = document.querySelector("svg");
  const hot = Array.from(svg.querySelectorAll(".hot"));

  function clearSel() {
    hot.forEach((el) => el.classList.remove("selected"));
  }

  hot.forEach((el) => {
    el.addEventListener("click", () => {
      clearSel();
      el.classList.add("selected");
      msg.textContent = `Selectat: #${el.id}`;
    });
  });

  svg.addEventListener("click", (e) => {
    if (
      !e.target.classList.contains("hot") &&
      e.target.closest(".hot") == null
    ) {
      clearSel();
      msg.textContent = "Click pe un element din SVG";
    }
  });
})();
