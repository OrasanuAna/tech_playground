(() => {
  const palette = Array.from(
    document.querySelectorAll(".item[draggable='true']")
  );
  const canvas = document.getElementById("dndCanvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.src = "../assets/img/cat.jpg";

  /** @type {{kind:string,x:number,y:number}[]} */
  const placed = [];

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,.03)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    for (const p of placed) {
      if (p.kind === "circle") {
        ctx.beginPath();
        ctx.fillStyle = "rgba(124,92,255,.9)";
        ctx.arc(p.x, p.y, 28, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.kind === "rect") {
        ctx.fillStyle = "rgba(0, 255, 170, .7)";
        ctx.fillRect(p.x - 40, p.y - 25, 80, 50);
      } else if (p.kind === "img") {
        if (img.complete) ctx.drawImage(img, p.x - 30, p.y - 30, 60, 60);
      }
    }
  }

  palette.forEach((el) => {
    el.addEventListener("dragstart", (e) => {
      e.dataTransfer.effectAllowed = "copy";
      e.dataTransfer.setData("text/plain", el.dataset.kind || "");
    });
  });

  canvas.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  });

  canvas.addEventListener("drop", (e) => {
    e.preventDefault();
    const kind = e.dataTransfer.getData("text/plain");
    if (!kind) return;

    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) * (canvas.width / r.width);
    const y = (e.clientY - r.top) * (canvas.height / r.height);

    placed.push({ kind, x, y });
    draw();
  });

  document.getElementById("btnUndo").addEventListener("click", () => {
    placed.pop();
    draw();
  });

  document.getElementById("btnClear").addEventListener("click", () => {
    placed.length = 0;
    draw();
  });

  img.onload = draw;
  draw();
})();
