(() => {
  const nEl = document.getElementById("n");
  const startBtn = document.getElementById("start");
  const stopBtn = document.getElementById("stop");
  const progress = document.getElementById("progress");
  const out = document.getElementById("out");

  /** @type {Worker|null} */
  let w = null;

  function setProgress(t) {
    progress.textContent = t;
  }

  function start() {
    stop();

    out.value = "";
    setProgress("Pornit...");

    w = new Worker("../js/prime-worker.js", { type: "classic" });
    w.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === "progress") {
        setProgress(`Progres: ${msg.at} / ${msg.n}`);
      } else if (msg.type === "done") {
        setProgress(`Gata: ${msg.count} prime (în ${msg.ms}ms)`);
        out.value =
          msg.preview.join(", ") +
          (msg.count > msg.preview.length ? "\n... (preview)" : "");
      } else if (msg.type === "error") {
        setProgress("Eroare");
        out.value = msg.error;
      }
    };

    w.postMessage({ n: Number(nEl.value) });
  }

  function stop() {
    if (w) {
      w.terminate();
      w = null;
      setProgress("Oprit");
    }
  }

  startBtn.addEventListener("click", start);
  stopBtn.addEventListener("click", stop);
})();
