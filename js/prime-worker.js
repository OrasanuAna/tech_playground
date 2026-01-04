self.onmessage = (e) => {
  try {
    const n = Number(e.data?.n ?? 0);
    if (!Number.isFinite(n) || n < 2) {
      self.postMessage({
        type: "error",
        error: "N trebuie să fie un număr >= 2.",
      });
      return;
    }

    const t0 = Date.now();

    const isPrime = new Uint8Array(n + 1);
    isPrime.fill(1, 2);

    const limit = Math.floor(Math.sqrt(n));
    for (let p = 2; p <= limit; p++) {
      if (isPrime[p]) {
        for (let m = p * p; m <= n; m += p) isPrime[m] = 0;
      }
      if (p % 1000 === 0)
        self.postMessage({ type: "progress", at: p, n: limit });
    }

    const primes = [];
    for (let i = 2; i <= n; i++) if (isPrime[i]) primes.push(i);

    const ms = Date.now() - t0;
    self.postMessage({
      type: "done",
      n,
      count: primes.length,
      ms,
      preview: primes.slice(0, 200),
    });
  } catch (err) {
    self.postMessage({ type: "error", error: String(err) });
  }
};
