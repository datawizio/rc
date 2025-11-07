export type BadgerPosition = "n" | "e" | "s" | "w" | "ne" | "nw" | "se" | "sw";

export type Point2D = { x: number; y: number };

export interface BadgerOptions {
  position?: BadgerPosition;
  radius?: number;
  backgroundColor?: string;
  color?: string;
  size?: number;
  onChange?: () => void;
  withCount?: boolean;
  src?: string;
}

const defaultOptions: Required<BadgerOptions> = {
  backgroundColor: "#f00",
  color: "#fff",
  size: 0.6,
  position: "ne",
  radius: 8,
  onChange: () => {},
  withCount: false,
  src: ""
};

class Badger implements Required<BadgerOptions> {
  public position: BadgerPosition;
  public radius: number;
  public backgroundColor: string;
  public color: string;
  public size: number;
  public onChange: () => void;
  public withCount: boolean;
  public src: string;

  private canvas: HTMLCanvasElement = document.createElement("canvas");
  private ctx!: CanvasRenderingContext2D;
  private faviconSize!: number;
  private badgeSize!: number;
  private offset!: Point2D;
  private img!: HTMLImageElement;
  private internalValue: string | number = "";
  private faviconElement: HTMLLinkElement | null =
    document.querySelector("link[rel$='icon']");

  constructor(options: BadgerOptions = {}) {
    const mergedOptions = { ...defaultOptions, ...options };

    this.position = mergedOptions.position;
    this.radius = mergedOptions.radius;
    this.backgroundColor = mergedOptions.backgroundColor;
    this.color = mergedOptions.color;
    this.size = mergedOptions.size;
    this.onChange = mergedOptions.onChange;
    this.withCount = mergedOptions.withCount;
    this.src =
      mergedOptions.src || this.faviconElement?.getAttribute("href") || "";

    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2D context from canvas.");

    this.ctx = ctx;
  }

  private drawIcon() {
    this.ctx.clearRect(0, 0, this.faviconSize, this.faviconSize);
    this.ctx.drawImage(this.img, 0, 0, this.faviconSize, this.faviconSize);
  }

  private drawShape() {
    if (!this.offset) return;

    const { x: xa, y: ya } = this.offset;
    const r = this.radius;
    const xb = xa + this.badgeSize;
    const yb = ya + this.badgeSize;

    this.ctx.beginPath();
    this.ctx.moveTo(xb - r, ya);
    this.ctx.quadraticCurveTo(xb, ya, xb, ya + r);
    this.ctx.lineTo(xb, yb - r);
    this.ctx.quadraticCurveTo(xb, yb, xb - r, yb);
    this.ctx.lineTo(xa + r, yb);
    this.ctx.quadraticCurveTo(xa, yb, xa, yb - r);
    this.ctx.lineTo(xa, ya + r);
    this.ctx.quadraticCurveTo(xa, ya, xa + r, ya);
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fill();
    this.ctx.closePath();
  }

  private drawVal() {
    if (!this.offset) return;

    const margin = (this.badgeSize * 0.18) / 2;

    this.ctx.beginPath();
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.font = `bold ${this.badgeSize * 0.82}px Arial`;
    this.ctx.fillStyle = this.color;
    this.ctx.fillText(
      this.internalValue.toString(),
      this.badgeSize / 2 + this.offset.x,
      this.badgeSize / 2 + this.offset.y + margin
    );
    this.ctx.closePath();
  }

  private drawFavicon() {
    this.faviconElement?.setAttribute("href", this.dataURL);
  }

  private draw() {
    this.drawIcon();
    if (this.internalValue) this.drawShape();
    if (this.internalValue && this.withCount) this.drawVal();
    this.drawFavicon();
  }

  public setup() {
    this.faviconSize = this.img.naturalWidth;
    this.badgeSize = this.faviconSize * this.size;
    this.canvas.width = this.faviconSize;
    this.canvas.height = this.faviconSize;

    const sd = this.faviconSize - this.badgeSize;
    const sd2 = sd / 2;

    const offsets: Record<BadgerPosition, Point2D> = {
      n: { x: sd2, y: 0 },
      e: { x: sd, y: sd2 },
      s: { x: sd2, y: sd },
      w: { x: 0, y: sd2 },
      nw: { x: 0, y: 0 },
      ne: { x: sd, y: 0 },
      sw: { x: 0, y: sd },
      se: { x: sd, y: sd }
    };

    this.offset = offsets[this.position];
  }

  public update() {
    if (typeof this.internalValue === "number") {
      this.internalValue = Math.min(99, this.internalValue);
    }

    if (this.img?.complete && this.img.naturalWidth > 0) {
      this.draw();
      this.onChange?.();
    } else {
      this.img = new Image();
      this.img.addEventListener("load", () => {
        this.setup();
        this.draw();
        this.onChange?.();
      });

      this.img.src = this.src;
    }
  }

  public get dataURL(): string {
    return this.canvas.toDataURL();
  }

  public get value(): string | number {
    return this.internalValue;
  }

  public set value(val: string | number) {
    this.internalValue = val;
    this.update();
  }

  public updateOptions(options: BadgerOptions = {}) {
    const merged = { ...defaultOptions, ...options };

    // Preserve current src if none provided to avoid wiping the favicon
    if (options.src === undefined || options.src === "") {
      merged.src =
        this.src || this.faviconElement?.getAttribute("href") || merged.src;
    }

    Object.assign(this, merged);
    this.update();
  }
}

export default Badger;
