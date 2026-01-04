(() => {
  const st = document.getElementById("st");
  const latEl = document.getElementById("lat");
  const lngEl = document.getElementById("lng");
  const accEl = document.getElementById("acc");
  const mapEl = document.getElementById("map");

  function setStatus(t) {
    st.textContent = t;
  }

  function setCoords(lat, lng, acc) {
    latEl.textContent = lat.toFixed(6);
    lngEl.textContent = lng.toFixed(6);
    accEl.textContent = acc ? `${Math.round(acc)} m` : "-";
    const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
    mapEl.href = url;
  }

  function pushToUrl(lat, lng, acc) {
    const params = new URLSearchParams();
    params.set("lat", String(lat));
    params.set("lng", String(lng));
    if (acc) params.set("acc", String(acc));
    const newUrl = `${location.pathname}?${params.toString()}`;
    history.pushState({ lat, lng, acc }, "", newUrl);
  }

  function readFromUrl() {
    const p = new URLSearchParams(location.search);
    const lat = Number(p.get("lat"));
    const lng = Number(p.get("lng"));
    const acc = Number(p.get("acc"));
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      setCoords(lat, lng, Number.isFinite(acc) ? acc : undefined);
      setStatus("Coordonate din URL");
      return true;
    }
    return false;
  }

  document.getElementById("getLoc").addEventListener("click", () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation nu e suportat.");
      return;
    }
    setStatus("Cer permisiune...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setCoords(latitude, longitude, accuracy);
        pushToUrl(latitude, longitude, accuracy);
        setStatus("OK (salvat în URL)");
      },
      (err) => {
        setStatus(`Eroare: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  });

  document.getElementById("clearState").addEventListener("click", () => {
    history.pushState({}, "", location.pathname);
    latEl.textContent = "-";
    lngEl.textContent = "-";
    accEl.textContent = "-";
    mapEl.href = "#";
    setStatus("Curățat");
  });

  window.addEventListener("popstate", () => {
    if (!readFromUrl()) setStatus("Idle");
  });

  readFromUrl();
})();
