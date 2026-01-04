(() => {
  // VIDEO
  const video = document.getElementById("video");
  const vTime = document.getElementById("vTime");

  document.getElementById("vPlay").addEventListener("click", () => {
    if (video.paused) video.play();
    else video.pause();
  });

  document.getElementById("vBack").addEventListener("click", () => {
    video.currentTime = Math.max(0, video.currentTime - 5);
  });

  document.getElementById("vFwd").addEventListener("click", () => {
    video.currentTime = Math.min(video.duration || 1e9, video.currentTime + 5);
  });

  function formatTime(t) {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  video.addEventListener("timeupdate", () => {
    if (!isNaN(video.duration)) {
      vTime.textContent = `${formatTime(video.currentTime)} / ${formatTime(
        video.duration
      )}`;
    }
  });

  // AUDIO
  const audio = document.getElementById("audio");
  const aInfo = document.getElementById("aInfo");

  document.querySelectorAll("[data-seek]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const delta = Number(btn.dataset.seek);
      const target = Math.min(audio.duration || 1e9, audio.currentTime + delta);
      audio.currentTime = target;
      audio.play().catch(() => {});
    });
  });

  document.getElementById("aVolDown").addEventListener("click", () => {
    audio.volume = Math.max(0, audio.volume - 0.1);
    aInfo.textContent = `Volum: ${Math.round(audio.volume * 100)}%`;
  });

  document.getElementById("aVolUp").addEventListener("click", () => {
    audio.volume = Math.min(1, audio.volume + 0.1);
    aInfo.textContent = `Volum: ${Math.round(audio.volume * 100)}%`;
  });

  audio.addEventListener("loadedmetadata", () => {
    aInfo.textContent = `Durată: ${Math.round(audio.duration)}s`;
  });
})();
