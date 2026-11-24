// The demoscene effects of the Demo component: each draws a frame as light
// in a small grid of pixels, which ordered dithering turns into pixels of
// the site's accent, scaled up without smoothing. One loop draws every demo
// on screen; those off screen wait, and readers who ask for less motion get
// one still frame of each.

export type DemoName = 'knot' | 'plasma' | 'tunnel' | 'rotozoom' | 'bounce' | 'scope' | 'trail' | 'terrain' | 'stars';

/** What an effect draws on: its light per pixel, 0 to 1, cleared each frame unless it keeps it. */
interface Frame {
	w: number;
	h: number;
	light: Float32Array;
	/** Seconds since the page started. */
	t: number;
	/** The pointer over the canvas, 0 to 1 on each side, or none. */
	pointer: { x: number; y: number } | undefined;
	/** How far the page has scrolled, in pixels. */
	scroll: number;
	/** How far the reader has turned a draggable demo, in radians about each axis. */
	turn: { x: number; y: number };
}
type Effect = { keep?: boolean; draw(f: Frame): void };

const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

function plot(f: Frame, x: number, y: number, v: number) {
	x = Math.round(x);
	y = Math.round(y);
	if (x < 0 || y < 0 || x >= f.w || y >= f.h) return;
	const i = y * f.w + x;
	if (v > f.light[i]) f.light[i] = v;
}

function line(f: Frame, x0: number, y0: number, x1: number, y1: number, v: number) {
	const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
	for (let i = 0; i <= n; i++) plot(f, x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, v);
}

/** A (2, 3) torus knot, its tube lit from one side, with a few rings and lines drawn as wire; it turns on its own and as the reader drags it. */
function knot(): Effect {
	const along = 1100;
	const around = 56;
	const pts: number[] = [];
	const curve = (t: number) => {
		const r = Math.cos(3 * t) + 2.2;
		return [r * Math.cos(2 * t), r * Math.sin(2 * t), -Math.sin(3 * t)];
	};
	for (let i = 0; i < along; i++) {
		const t = (i / along) * Math.PI * 2;
		const p = curve(t);
		const q = curve(t + 0.001);
		let tx = q[0] - p[0], ty = q[1] - p[1], tz = q[2] - p[2];
		const tl = Math.hypot(tx, ty, tz);
		tx /= tl; ty /= tl; tz /= tl;
		const nl = Math.hypot(ty, tx) || 1;
		const nx = ty / nl, ny = -tx / nl, nz = 0;
		const bx = ty * nz - tz * ny, by = tz * nx - tx * nz, bz = tx * ny - ty * nx;
		for (let j = 0; j < around; j++) {
			const v = (j / around) * Math.PI * 2;
			const c = Math.cos(v), s = Math.sin(v);
			const ox = c * nx + s * bx, oy = c * ny + s * by, oz = c * nz + s * bz;
			const wire = i % 55 === 0 || j % 14 === 0 ? 1 : 0;
			pts.push(p[0] + 0.62 * ox, p[1] + 0.62 * oy, p[2] + 0.62 * oz, ox, oy, oz, wire);
		}
	}
	let depth = new Float32Array(0);
	return {
		draw(f) {
			if (depth.length !== f.w * f.h) depth = new Float32Array(f.w * f.h);
			depth.fill(-Infinity);
			const a = f.t * 0.35 + f.turn.x;
			const e = f.t * 0.21 + f.turn.y;
			const ca = Math.cos(a), sa = Math.sin(a), ce = Math.cos(e), se = Math.sin(e);
			// Scaled so its farthest point, nearest the eye, still falls inside: it is
			// never cut off, whichever way it is turned.
			const reach = 3.97;
			const eye = 18;
			const scale = (Math.min(f.w, f.h) * 0.48 * (eye - reach)) / (eye * reach);
			for (let k = 0; k < pts.length; k += 7) {
				let x = pts[k], y = pts[k + 1], z = pts[k + 2];
				let nx = pts[k + 3], ny = pts[k + 4], nz = pts[k + 5];
				[x, z] = [x * ca + z * sa, z * ca - x * sa];
				[y, z] = [y * ce - z * se, y * se + z * ce];
				[nx, nz] = [nx * ca + nz * sa, nz * ca - nx * sa];
				[ny, nz] = [ny * ce - nz * se, ny * se + nz * ce];
				if (nz < -0.15) continue;
				const p = eye / (eye - z);
				const px = Math.round(f.w / 2 + x * scale * p);
				const py = Math.round(f.h / 2 + y * scale * p);
				if (px < 0 || py < 0 || px >= f.w || py >= f.h) continue;
				const at = py * f.w + px;
				if (z <= depth[at]) continue;
				depth[at] = z;
				const lit = Math.max(0, -0.5 * nx - 0.6 * ny + 0.62 * nz);
				f.light[at] = pts[k + 6] ? 1 : 0.12 + 0.95 * lit;
			}
		},
	};
}

/** Four waves summed into a slowly turning field. */
const plasma: Effect = {
	draw(f) {
		const { w, h, t } = f;
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				const u = x / w, v = y / h;
				const s =
					Math.sin(u * 9 + t) +
					Math.sin(v * 7 - t * 1.3) +
					Math.sin((u + v) * 6 + t * 0.7) +
					Math.sin(Math.hypot(u - 0.5 - Math.sin(t * 0.4) * 0.3, v - 0.5) * 14 - t * 1.6);
				f.light[y * w + x] = Math.pow((s + 4) / 8, 1.4);
			}
		}
	},
};

/** A checkered tunnel flown into, darker at its far end. */
const tunnel: Effect = {
	draw(f) {
		const { w, h, t } = f;
		const cx = w / 2 + Math.sin(t * 0.7) * w * 0.12;
		const cy = h / 2 + Math.cos(t * 0.5) * h * 0.12;
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				const dx = x - cx, dy = y - cy;
				const d = Math.hypot(dx, dy) + 0.001;
				const u = (Math.atan2(dy, dx) / Math.PI) * 8 + t * 0.6;
				const v = (w * 0.9) / d + t * 2.2;
				const check = (Math.floor(u) + Math.floor(v)) & 1;
				f.light[y * w + x] = (check ? 0.95 : 0.25) * Math.min(1, d / (w * 0.45));
			}
		}
	},
};

/** A checkerboard turning and zooming in and out. */
const rotozoom: Effect = {
	draw(f) {
		const { w, h, t } = f;
		const a = t * 0.5;
		const z = 0.08 + 0.05 * Math.sin(t * 0.8);
		const ca = Math.cos(a) * z, sa = Math.sin(a) * z;
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				const dx = x - w / 2, dy = y - h / 2;
				const u = dx * ca - dy * sa + t;
				const v = dx * sa + dy * ca;
				const check = (Math.floor(u) + Math.floor(v)) & 1;
				const ring = Math.sin(Math.hypot(u % 2, v % 2) * 3) * 0.5 + 0.5;
				f.light[y * w + x] = check ? 0.6 : 0.05 + 0.2 * ring;
			}
		}
	},
};

/** Balls falling under gravity, bouncing off the floor and walls and each other's air. */
function bounce(): Effect {
	type Ball = { x: number; y: number; vx: number; vy: number; r: number };
	let balls: Ball[] = [];
	let last = 0;
	return {
		draw(f) {
			const { w, h } = f;
			if (!balls.length) {
				balls = Array.from({ length: 5 }, (_, i) => ({
					x: w * (0.2 + i * 0.15),
					y: h * (0.15 + (i % 2) * 0.2),
					vx: (i % 2 ? 1 : -1) * w * (0.15 + i * 0.04),
					vy: 0,
					r: h * (0.07 + (i % 3) * 0.025),
				}));
				last = f.t;
			}
			const dt = Math.min(0.05, f.t - last);
			last = f.t;
			const floor = h * 0.86;
			for (const b of balls) {
				b.vy += h * 2.4 * dt;
				b.x += b.vx * dt;
				b.y += b.vy * dt;
				if (b.y + b.r > floor) {
					b.y = floor - b.r;
					// The floor gives back what it took, so they bounce for ever.
					b.vy = -Math.sqrt(2 * h * 2.4 * (floor - h * 0.12 - b.r));
				}
				if (b.x - b.r < 0 || b.x + b.r > w) {
					b.vx *= -1;
					b.x = Math.max(b.r, Math.min(w - b.r, b.x));
				}
				for (let y = Math.floor(b.y - b.r); y <= b.y + b.r; y++) {
					for (let x = Math.floor(b.x - b.r); x <= b.x + b.r; x++) {
						const nx = (x - b.x) / b.r, ny = (y - b.y) / b.r;
						const d = nx * nx + ny * ny;
						if (d > 1) continue;
						const nz = Math.sqrt(1 - d);
						plot(f, x, y, 0.1 + 0.9 * Math.max(0, -0.5 * nx - 0.6 * ny + 0.62 * nz));
					}
				}
				// Its shadow on the floor, smaller as it rises.
				const s = b.r * (0.6 + 0.4 * (b.y / floor));
				line(f, b.x - s, floor + 2, b.x + s, floor + 2, 0.35);
			}
			for (let x = 0; x < w; x += 2) plot(f, x, floor + 1, 0.8);
		},
	};
}

/** A sound's spectrum as bars and its wave as a line, from a made-up chord. */
const scope: Effect = {
	draw(f) {
		const { w, h, t } = f;
		const bars = 16;
		const bw = Math.floor(w / bars);
		for (let i = 0; i < bars; i++) {
			const level = 0.15 + 0.85 * Math.abs(Math.sin(t * (1.3 + i * 0.37) + i) * Math.sin(t * 0.7 + i * 0.5));
			const top = Math.round(h * 0.95 - level * h * 0.5);
			for (let y = top; y < h * 0.95; y++) for (let x = i * bw + 1; x < (i + 1) * bw - 1; x++) plot(f, x, y, 0.3 + 0.6 * ((h - y) / h));
		}
		let py = 0;
		for (let x = 0; x < w; x++) {
			const u = x / w;
			const y = h * 0.28 + h * 0.16 * (Math.sin(u * 20 + t * 6) * 0.6 + Math.sin(u * 47 - t * 9) * 0.25 + Math.sin(u * 7 + t * 2) * 0.4);
			if (x) line(f, x - 1, py, x, y, 1);
			py = y;
		}
	},
};

/** Light that follows the pointer and fades behind it; without one, it traces a figure of its own. */
const trail: Effect = {
	keep: true,
	draw(f) {
		const { w, h, t } = f;
		for (let i = 0; i < f.light.length; i++) f.light[i] *= 0.9;
		const p = f.pointer ?? { x: 0.5 + 0.38 * Math.sin(t * 1.1), y: 0.5 + 0.34 * Math.sin(t * 1.7 + 1) };
		const cx = p.x * w, cy = p.y * h;
		const r = Math.min(w, h) * 0.09;
		for (let y = Math.floor(cy - r); y <= cy + r; y++) {
			for (let x = Math.floor(cx - r); x <= cx + r; x++) {
				const d = Math.hypot(x - cx, y - cy) / r;
				if (d <= 1) plot(f, x, y, 1 - d * 0.5);
			}
		}
		// A few sparks thrown off around it.
		for (let i = 0; i < 6; i++) {
			const a = t * 3 + i * 1.05;
			plot(f, cx + Math.cos(a) * r * 2.2, cy + Math.sin(a) * r * 2.2, 1);
		}
	},
};

/** Hills flown over, as the old voxel landscapes were: each column marched
 *  from near to far, its ground shaded by slope, ruled in a grid and fading
 *  into the distance, under a striped sun. */
const terrain: Effect = {
	draw(f) {
		const { w, h, t } = f;
		const horizon = h * 0.32;
		const height = (x: number, z: number) =>
			Math.sin(x * 0.45 + z * 0.21) * 0.9 + Math.sin(x * 0.21 - z * 0.37) * 1.3 + Math.sin(z * 0.13 + x * 0.07) * 1.6;
		const travel = t * 2.4;
		const camera = 4.2;
		const scale = h * 0.55;
		const ground = new Float32Array(w).fill(h);
		for (let x = 0; x < w; x++) {
			const across = (x / w - 0.5) * 2.2;
			let bottom = h;
			let row = Math.floor((1 + travel) * 3);
			let col = Math.floor(across - 0.5);
			let pending: boolean = false;
			for (let z = 1, dz = 0.05; z < 40; z += dz, dz *= 1.025) {
				const wx = across * z;
				const wz = z + travel;
				// A grid line where a sample crosses into another cell of the ground; the
				// columns are offset by one, so no line runs down the middle for ever.
				const r = Math.floor(wz * 3);
				const c = Math.floor(wx - 0.5);
				// A crossing hidden behind nearer ground marks the next sample seen instead.
				let grid: boolean = (pending || r !== row || c !== col) && z < 16;
				row = r;
				col = c;
				const y = height(wx, wz);
				const sy = Math.max(0, horizon + ((camera - y) / z) * scale);
				if (sy >= bottom) {
					pending = grid;
					continue;
				}
				pending = false;
				if (bottom - sy > 3 && grid) {
					// A tall face takes the line only at its top edge.
					f.light[Math.floor(sy) * w + x] = 1;
					grid = false;
				}
				const fade = Math.pow(1 - z / 40, 1.4);
				const slope = height(wx, wz - 0.3) - y;
				const light = grid ? 0.85 * fade + 0.05 : Math.max(0.02, 0.12 + slope * 0.5) * fade;
				for (let py = Math.floor(sy); py < bottom; py++) f.light[py * w + x] = light;
				bottom = sy;
			}
			ground[x] = bottom;
		}
		// The sun behind the hills, cut into stripes toward its foot.
		const sun = { x: w * 0.7, y: horizon - h * 0.04, r: h * 0.2 };
		for (let y = Math.max(0, Math.floor(sun.y - sun.r)); y < h; y++) {
			if (y > sun.y - sun.r * 0.2 && Math.floor(y / 2) % 2) continue;
			for (let x = Math.floor(sun.x - sun.r); x <= sun.x + sun.r; x++) {
				if (x >= 0 && x < w && y < ground[x] && Math.hypot(x - sun.x, y - sun.y) <= sun.r) f.light[y * w + x] = 0.8;
			}
		}
	},
};

/** Stars in three layers, the nearer passing faster as the page scrolls and drifting on their own. */
function stars(): Effect {
	const field = Array.from({ length: 150 }, (_, i) => ({ x: Math.random(), y: Math.random(), layer: i % 3 }));
	return {
		draw(f) {
			const { w, h } = f;
			for (const s of field) {
				const speed = [0.04, 0.1, 0.22][s.layer];
				const x = (((s.x + f.t * speed * 0.02) % 1) + 1) % 1;
				const y = (((s.y - (f.scroll / (h * 4)) * speed * 3) % 1) + 1) % 1;
				const v = [0.35, 0.6, 1][s.layer];
				plot(f, x * w, y * h, v);
				if (s.layer === 2) plot(f, x * w + 1, y * h, v * 0.6);
			}
		},
	};
}

const make: Record<DemoName, () => Effect> = {
	knot,
	plasma: () => plasma,
	tunnel: () => tunnel,
	rotozoom: () => rotozoom,
	bounce,
	scope: () => scope,
	trail: () => trail,
	terrain: () => terrain,
	stars,
};

interface Running {
	canvas: HTMLCanvasElement;
	effect: Effect;
	frame: Frame;
	image: ImageData;
	cx: CanvasRenderingContext2D;
	visible: boolean;
	/** How fast a dragged demo still turns after it is let go, in radians a frame. */
	spin?: { x: number; y: number; held: boolean };
}

const running: Running[] = [];
const still = matchMedia('(prefers-reduced-motion: reduce)');
const start = performance.now();
let looping = false;

/** The site's accent as RGB, read again when the theme changes; the unlit pixels stay clear, so the page's own ground shows. */
function readAccent(): [number, number, number] {
	const hex = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
	const m = /^#?([0-9a-f]{6})$/i.exec(hex);
	const n = m ? parseInt(m[1], 16) : 0xffb000;
	return [n >> 16, (n >> 8) & 255, n & 255];
}
let accent: [number, number, number] | undefined;
new MutationObserver(() => {
	accent = undefined;
	// Still demos are drawn again in the new colors; moving ones take them next frame.
	if (still.matches || !looping) for (const d of running) if (d.canvas.isConnected) render(d, lastT);
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

let lastT = 2.4;

function render(d: Running, t: number) {
	const f = d.frame;
	f.t = t;
	lastT = t;
	if (d.spin && !d.spin.held) {
		f.turn.x += d.spin.x;
		f.turn.y += d.spin.y;
		d.spin.x *= 0.94;
		d.spin.y *= 0.94;
	}
	f.scroll = scrollY;
	if (!d.effect.keep) f.light.fill(0);
	d.effect.draw(f);
	const [r, g, b] = (accent ??= readAccent());
	const px = d.image.data;
	for (let y = 0; y < f.h; y++) {
		for (let x = 0; x < f.w; x++) {
			const i = y * f.w + x;
			const o = i * 4;
			px[o] = r;
			px[o + 1] = g;
			px[o + 2] = b;
			px[o + 3] = f.light[i] > bayer[(y & 3) * 4 + (x & 3)] ? 255 : 0;
		}
	}
	d.cx.putImageData(d.image, 0, 0);
}

function loop(now: number) {
	const t = (now - start) / 1000;
	let any = false;
	for (const d of running) {
		if (!d.visible || !d.canvas.isConnected) continue;
		render(d, t);
		any = true;
	}
	looping = any && !still.matches;
	if (looping) requestAnimationFrame(loop);
}

function wake() {
	if (looping || still.matches) return;
	looping = true;
	requestAnimationFrame(loop);
}

const watch = new IntersectionObserver((entries) => {
	for (const entry of entries) {
		const d = running.find((r) => r.canvas === entry.target);
		if (d) d.visible = entry.isIntersecting;
	}
	wake();
});

/** Lets the reader turn a demo by dragging it; let go, it keeps turning and slows to its own pace. */
function drag(d: Running) {
	const { canvas, frame } = d;
	d.spin = { x: 0, y: 0, held: false };
	const spin = d.spin;
	let from: { x: number; y: number } | undefined;
	canvas.addEventListener('pointerdown', (e) => {
		from = { x: e.clientX, y: e.clientY };
		spin.held = true;
		spin.x = spin.y = 0;
		canvas.setPointerCapture(e.pointerId);
	});
	canvas.addEventListener('pointermove', (e) => {
		if (!from) return;
		const k = 3 / canvas.getBoundingClientRect().width;
		spin.x = (e.clientX - from.x) * k;
		spin.y = (e.clientY - from.y) * k;
		frame.turn.x += spin.x;
		frame.turn.y += spin.y;
		from = { x: e.clientX, y: e.clientY };
		// Still for readers who ask for less motion, but it follows their hand.
		if (still.matches) render(d, lastT);
	});
	const release = () => {
		from = undefined;
		spin.held = false;
	};
	canvas.addEventListener('pointerup', release);
	canvas.addEventListener('pointercancel', release);
}

/** Starts every Demo canvas on the page not yet started. */
export function startDemos() {
	for (const canvas of document.querySelectorAll<HTMLCanvasElement>('canvas[data-demo]:not([data-started])')) {
		const name = canvas.dataset.demo as DemoName;
		if (!(name in make)) continue;
		canvas.dataset.started = '';
		const cx = canvas.getContext('2d')!;
		const frame: Frame = { w: canvas.width, h: canvas.height, light: new Float32Array(canvas.width * canvas.height), t: 0, pointer: undefined, scroll: 0, turn: { x: 0, y: 0 } };
		const d: Running = { canvas, effect: make[name](), frame, image: cx.createImageData(canvas.width, canvas.height), cx, visible: false };
		// The trail follows the pointer while it is over the trail's part of the page.
		const target = name === 'trail' ? (canvas.closest('[data-demo-steer]') ?? canvas) : undefined;
		target?.addEventListener('pointermove', (e) => {
			const box = canvas.getBoundingClientRect();
			const ev = e as PointerEvent;
			frame.pointer = { x: (ev.clientX - box.left) / box.width, y: (ev.clientY - box.top) / box.height };
		});
		target?.addEventListener('pointerleave', () => (frame.pointer = undefined));
		if ('drag' in canvas.dataset) drag(d);
		running.push(d);
		render(d, 2.4);
		watch.observe(canvas);
	}
}

/** Content that drifts at its own speed as the page scrolls: data-parallax is how much, as a share of the scroll. */
export function startParallax() {
	const items = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
	if (!items.length || still.matches) return;
	let queued = false;
	const place = () => {
		queued = false;
		const mid = innerHeight / 2;
		for (const el of items) {
			const box = el.parentElement!.getBoundingClientRect();
			const offset = (box.top + box.height / 2 - mid) * Number(el.dataset.parallax);
			// Whole pixels, so text in it stays sharp.
			el.style.transform = `translateY(${Math.round(offset)}px)`;
		}
	};
	addEventListener('scroll', () => {
		if (!queued) requestAnimationFrame(place);
		queued = true;
	}, { passive: true });
	addEventListener('resize', place);
	place();
}
