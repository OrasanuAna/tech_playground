(() => {
  const canvas = document.getElementById("c2d");
  const ctx = canvas.getContext("2d");
  const status = document.getElementById("status");

  /** @typedef {{id:string,type:"circle"|"rect",x:number,y:number,r?:number,w?:number,h?:number,fill:string}} Shape */

  /** @type {Shape[]} */
  const shapes = [];

  let selectedId = null;
  let dragOffset = { x: 0, y: 0 };
  let isDragging = false;

  const rand = (min, max) => Math.random() * (max - min) + min;
  const randColor = () => `hsl(${Math.floor(rand(0, 360))}, 80%, 60%)`;

  function setStatus(msg) {
    status.textContent = msg || "";
  }

  function addCircle() {
    shapes.push({
      id: crypto.randomUUID(),
      type: "circle",
      x: rand(80, canvas.width - 80),
      y: rand(80, canvas.height - 80),
      r: rand(22, 48),
      fill: randColor(),
    });
    draw();
  }

  function addRect() {
    shapes.push({
      id: crypto.randomUUID(),
      type: "rect",
      x: rand(40, canvas.width - 160),
      y: rand(40, canvas.height - 120),
      w: rand(70, 160),
      h: rand(40, 120),
      fill: randColor(),
    });
    draw();
  }

  function clearAll() {
    shapes.length = 0;
    selectedId = null;
    draw();
  }

  function exportPNG() {
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas2d.png";
    a.click();
  }

  function drawShape(s, { ghost = false } = {}) {
    ctx.save();
    ctx.globalAlpha = ghost ? 0.35 : 1;
    ctx.fillStyle = s.fill;

    ctx.beginPath();
    if (s.type === "circle") {
      ctx.arc(s.x, s.y, s.r ?? 30, 0, Math.PI * 2);
    } else {
      ctx.rect(s.x, s.y, s.w ?? 100, s.h ?? 60);
    }
    ctx.fill();

    if (s.id === selectedId) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255,255,255,.9)";
      ctx.stroke();
    }

    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,.03)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    for (const s of shapes) drawShape(s);
    setStatus(
      selectedId ? `Selectat: ${selectedId.slice(0, 8)}` : "Nimic selectat"
    );
  }

  function hitTest(x, y) {
    for (let i = shapes.length - 1; i >= 0; i--) {
      const s = shapes[i];
      ctx.beginPath();
      if (s.type === "circle") ctx.arc(s.x, s.y, s.r ?? 30, 0, Math.PI * 2);
      else ctx.rect(s.x, s.y, s.w ?? 100, s.h ?? 60);

      if (ctx.isPointInPath(x, y)) return s;
    }
    return null;
  }

  function getMousePos(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (canvas.width / r.width),
      y: (e.clientY - r.top) * (canvas.height / r.height),
    };
  }

  canvas.addEventListener("mousedown", (e) => {
    const { x, y } = getMousePos(e);
    const s = hitTest(x, y);
    if (!s) {
      selectedId = null;
      draw();
      return;
    }
    selectedId = s.id;

    isDragging = true;
    const dx = x - s.x;
    const dy = y - s.y;
    dragOffset = { x: dx, y: dy };
    draw();
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDragging || !selectedId) return;
    const s = shapes.find((x) => x.id === selectedId);
    if (!s) return;

    const { x, y } = getMousePos(e);

    if (s.type === "circle") {
      s.x = x - dragOffset.x;
      s.y = y - dragOffset.y;
    } else {
      s.x = x - dragOffset.x;
      s.y = y - dragOffset.y;
    }
    draw();
  });

  document.getElementById("btnAddCircle").addEventListener("click", addCircle);
  document.getElementById("btnAddRect").addEventListener("click", addRect);
  document.getElementById("btnClear").addEventListener("click", clearAll);
  document.getElementById("btnExport").addEventListener("click", exportPNG);

  addCircle();
  addRect();
})();
