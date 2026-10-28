const TAU = Math.PI * 2;
const PADDING = 24;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const wrap = (value) => ((value % 1) + 1) % 1;
const smoothstep = (value) => value * value * (3 - 2 * value);
const colorCache = new Map();
let colorProbe;

function colorWithAlpha(color, alpha) {
  let rgb = colorCache.get(color);
  if (!rgb) {
    colorProbe ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    if (!colorProbe) return `rgba(255, 255, 255, ${alpha})`;
    colorProbe.fillStyle = color;
    colorProbe.fillRect(0, 0, 1, 1);
    const [red, green, blue] = colorProbe.getImageData(0, 0, 1, 1).data;
    rgb = [red, green, blue];
    colorCache.set(color, rgb);
  }
  return `rgba(${rgb.join(", ")}, ${alpha})`;
}

function roundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

export function mountLandingEffects(root) {
  const buttons = [...root.querySelectorAll("[data-landing-register]")];
  const cleanups = [];

  for (const button of buttons) {
    if (button.querySelector(".specular-button__light")) continue;

    button.classList.add("specular-button");
    button.style.position = "relative";
    button.style.isolation = "isolate";

    const canvas = document.createElement("canvas");
    canvas.className = "specular-button__light";
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.position = "absolute";
    canvas.style.top = "50%";
    canvas.style.left = "50%";
    canvas.style.transform = "translate(-50%, -50%)";
    canvas.style.pointerEvents = "none";

    const label = document.createElement("span");
    label.className = "specular-button__label";
    while (button.firstChild) label.append(button.firstChild);
    button.append(label, canvas);

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) continue;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = { spot: 0.125, level: 0.35, pointerX: 0, pointerY: 0, known: false };
    const options = {
      lineColor: button.dataset.lineColor || "#ffffff",
      baseColor: button.dataset.baseColor || "#ffffff",
      intensity: Math.max(0, Number(button.dataset.intensity ?? 1)),
      idleIntensity: clamp(Number(button.dataset.idleIntensity ?? 0.35), 0, 1),
      shineSize: Math.max(0, Number(button.dataset.shineSize ?? 10)),
      shineFade: Math.max(0, Number(button.dataset.shineFade ?? 34)),
      thickness: Math.max(0, Number(button.dataset.thickness ?? 1.2)),
      glow: Math.max(0, Number(button.dataset.glow ?? 1)),
      proximity: Math.max(1, Number(button.dataset.proximity ?? 250)),
    };
    let frameId = 0;
    let width = 0;
    let height = 0;
    let ratio = 1;

    const draw = () => {
      const radius = Math.min(parseFloat(getComputedStyle(button).borderTopLeftRadius) || 18, width / 2, height / 2);
      const centerX = width / 2;
      const centerY = height / 2;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.scale(ratio, ratio);
      context.translate(PADDING, PADDING);
      roundedRect(context, 0.6, 0.6, width - 1.2, height - 1.2, radius);
      context.strokeStyle = colorWithAlpha(options.baseColor, 0.45);
      context.lineWidth = 1.2;
      context.stroke();

      const gradient = context.createConicGradient(0, centerX, centerY);
      const hotWidth = options.shineSize / 720;
      const fadeWidth = options.shineFade / 360;
      for (let step = 0; step <= 64; step += 1) {
        const position = step / 64;
        const distance = (spot) => Math.abs(wrap(position - spot + 0.5) - 0.5);
        const lobe = (spot) => 1 - smoothstep(clamp((distance(spot) - hotWidth) / Math.max(fadeWidth, 0.0001), 0, 1));
        const light = clamp(lobe(state.spot) + lobe(wrap(state.spot + 0.5)) * 0.45, 0, 1);
        gradient.addColorStop(position, colorWithAlpha(options.lineColor, light * state.level * options.intensity));
      }
      context.strokeStyle = gradient;
      context.lineWidth = Math.max(0.7, options.thickness * 2);
      context.shadowBlur = 12 * options.glow * state.level;
      context.shadowColor = colorWithAlpha(options.lineColor, 0.8);
      context.stroke();
      context.restore();
    };

    const aim = () => {
      if (!state.known) return { spot: 0.125, level: options.idleIntensity };
      const rect = button.getBoundingClientRect();
      const x = clamp(state.pointerX, rect.left, rect.right) - rect.left;
      const y = clamp(state.pointerY, rect.top, rect.bottom) - rect.top;
      const distance = Math.hypot(state.pointerX - (rect.left + x), state.pointerY - (rect.top + y));
      const proximity = clamp(1 - distance / options.proximity, 0, 1);
      const spot = wrap(Math.atan2(x - width / 2, height / 2 - y) / TAU);
      return { spot, level: options.idleIntensity + (1 - options.idleIntensity) * smoothstep(proximity) };
    };

    const animate = () => {
      frameId = 0;
      const target = aim();
      if (reduceMotion) {
        state.spot = target.spot;
        state.level = target.level;
        draw();
        return;
      }
      const spotDelta = target.spot - state.spot;
      const shortestDelta = spotDelta - Math.round(spotDelta);
      state.spot = wrap(state.spot + shortestDelta * 0.3);
      state.level += (target.level - state.level) * 0.3;
      draw();
      if (Math.abs(shortestDelta) > 0.0005 || Math.abs(target.level - state.level) > 0.002) {
        frameId = requestAnimationFrame(animate);
      }
    };

    const wake = () => {
      if (!frameId) frameId = requestAnimationFrame(animate);
    };
    const onPointerMove = (event) => {
      state.pointerX = event.clientX;
      state.pointerY = event.clientY;
      state.known = true;
      wake();
    };
    const onPointerLeave = () => {
      state.known = false;
      wake();
    };
    const measure = () => {
      const newWidth = Math.max(1, button.offsetWidth);
      const newHeight = Math.max(1, button.offsetHeight);
      const newRatio = Math.min(window.devicePixelRatio || 1, 3);
      if (newWidth === width && newHeight === height && newRatio === ratio) {
        return;
      }
      width = newWidth;
      height = newHeight;
      ratio = newRatio;
      canvas.width = Math.round((width + PADDING * 2) * ratio);
      canvas.height = Math.round((height + PADDING * 2) * ratio);
      canvas.style.width = `${width + PADDING * 2}px`;
      canvas.style.height = `${height + PADDING * 2}px`;
      draw();
    };
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(button);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    button.addEventListener("pointerleave", onPointerLeave);
    measure();

    cleanups.push(() => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      button.removeEventListener("pointerleave", onPointerLeave);
    });
  }

  for (const card of root.querySelectorAll(".workflow-steps article, .check-card")) {
    const onPointerMove = (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    };
    const onPointerLeave = () => {
      card.style.removeProperty("--pointer-x");
      card.style.removeProperty("--pointer-y");
    };
    card.addEventListener("pointermove", onPointerMove, { passive: true });
    card.addEventListener("pointerleave", onPointerLeave);
    cleanups.push(() => {
      card.removeEventListener("pointermove", onPointerMove);
      card.removeEventListener("pointerleave", onPointerLeave);
    });
  }

  const flipWord = root.querySelector("[data-flip-word]");
  if (flipWord) {
    const words = [
      "true to your brand.",
      "backed by approved facts.",
      "consistent everywhere.",
      "clear, verified & trusted."
    ];
    let index = 0;
    const interval = setInterval(() => {
      flipWord.classList.add("flip-out");
      setTimeout(() => {
        index = (index + 1) % words.length;
        flipWord.textContent = words[index];
        flipWord.classList.remove("flip-out");
        flipWord.classList.add("flip-in");
        setTimeout(() => {
          flipWord.classList.remove("flip-in");
        }, 450);
      }, 400);
    }, 3200);
    cleanups.push(() => clearInterval(interval));
  }

  return () => cleanups.forEach((cleanup) => cleanup());
}
