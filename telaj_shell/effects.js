(function attachTELAJEffects(globalScope) {
  const typedCache = new Map();
  const activeTimers = new WeakMap();
  const prefersReducedMotion = () => globalScope.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  class TelajSoundEngine {
    constructor() {
      this.enabled = false;
      this.unlocked = false;
      this.audioContext = null;
      this.lastTickAt = 0;
    }

    setEnabled(enabled) {
      this.enabled = Boolean(enabled);
    }

    async unlock() {
      this.unlocked = true;
      if (!this.enabled) {
        return;
      }
      const AudioContextClass = globalScope.AudioContext || globalScope.webkitAudioContext;
      if (!AudioContextClass) {
        return;
      }
      if (!this.audioContext) {
        this.audioContext = new AudioContextClass();
      }
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }
    }

    registerInteractionUnlock() {
      const unlockOnce = () => {
        this.unlock().catch(() => {});
        globalScope.removeEventListener("pointerdown", unlockOnce);
        globalScope.removeEventListener("keydown", unlockOnce);
      };
      globalScope.addEventListener("pointerdown", unlockOnce, { passive: true, once: true });
      globalScope.addEventListener("keydown", unlockOnce, { once: true });
    }

    playTypeTick() {
      const now = performance.now();
      if (now - this.lastTickAt < 32) {
        return;
      }
      this.lastTickAt = now;
      this.#playTone({
        type: Math.random() > 0.55 ? "triangle" : "sine",
        frequency: 520 + Math.random() * 60,
        durationMs: 10 + Math.random() * 8,
        gainPeak: 0.009 + Math.random() * 0.004,
      });
    }

    playButtonTap(kind) {
      const baseFrequency = kind === "execute" ? 220 : 190;
      this.#playTone({
        type: "sine",
        frequency: baseFrequency + Math.random() * 18,
        durationMs: 26 + Math.random() * 12,
        gainPeak: 0.013,
      });
    }

    #playTone({ type, frequency, durationMs, gainPeak }) {
      if (!this.enabled || !this.unlocked) {
        return;
      }
      const AudioContextClass = globalScope.AudioContext || globalScope.webkitAudioContext;
      if (!AudioContextClass) {
        return;
      }
      if (!this.audioContext) {
        this.audioContext = new AudioContextClass();
      }
      const ctx = this.audioContext;
      const start = ctx.currentTime;
      const duration = durationMs / 1000;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gainNode.gain.setValueAtTime(0.0001, start);
      gainNode.gain.exponentialRampToValueAtTime(gainPeak, start + duration * 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.01);
    }
  }

  function clearTyping(element) {
    if (!element) {
      return;
    }
    const timer = activeTimers.get(element);
    if (timer) {
      globalScope.clearTimeout(timer);
      activeTimers.delete(element);
    }
  }

  function renderText(element, text, showCursor) {
    if (!element) {
      return;
    }
    const safeText = String(text || "");
    element.innerHTML = "";
    const textNode = document.createTextNode(safeText);
    element.appendChild(textNode);
    if (showCursor) {
      const cursor = document.createElement("span");
      cursor.className = "typewriter-cursor";
      cursor.setAttribute("aria-hidden", "true");
      cursor.textContent = "|";
      element.appendChild(cursor);
    }
  }

  function typeText(element, text, options = {}) {
    if (!element) {
      return;
    }

    const {
      key = element.id || element.dataset.typeKey || text,
      speed = 19,
      delay = 420,
      cursor = true,
      soundEngine = null,
      soundEnabled = false,
    } = options;

    const content = String(text || "");
    element.dataset.fullText = content;

    if (!content) {
      element.textContent = "";
      return;
    }

    if (prefersReducedMotion() || typedCache.get(key) === content) {
      renderText(element, content, false);
      typedCache.set(key, content);
      return;
    }

    clearTyping(element);
    element.innerHTML = "";
    let index = 0;
    let cadence = 2 + Math.floor(Math.random() * 2);

    const tick = () => {
      index += 1;
      renderText(element, content.slice(0, index), cursor && index < content.length);
      if (soundEnabled && soundEngine && index % cadence === 0) {
        soundEngine.playTypeTick();
        cadence = 2 + Math.floor(Math.random() * 2);
      }
      if (index < content.length) {
        const timer = globalScope.setTimeout(tick, speed);
        activeTimers.set(element, timer);
      } else {
        typedCache.set(key, content);
        renderText(element, content, cursor);
      }
    };

    const starter = globalScope.setTimeout(tick, delay);
    activeTimers.set(element, starter);
  }

  globalScope.TELAJEffects = {
    TelajSoundEngine,
    typeText,
    prefersReducedMotion,
    clearTyping,
  };
})(window);
