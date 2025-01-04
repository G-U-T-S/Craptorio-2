import { Cursor } from "./cursor.js";
import { Label } from "./label.js";

export class Render {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  private spriteAtlas: HTMLImageElement;
  private tilesAtlas: HTMLImageElement;
  
  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.spriteAtlas = new Image();
    this.spriteAtlas.src = "./assets/sprites.png";
    this.tilesAtlas = new Image();
    this.tilesAtlas.src = "./assets/tiles.png";

    window.addEventListener("resize", this.resizeCanvas.bind(this));
  }
  
  drawSprite(src: "sprites" | "tiles", x: number, y: number, coordX: number, coordY: number, sizeX: number = 8, sizeY: number = 8): void {
    const scale = 5;
  
    if (src === "sprites") {
      this.context.drawImage(
        this.spriteAtlas, coordX, coordY,
        sizeX, sizeY, x, y, sizeX * scale, sizeY * scale
      )
    }
  }
  
  drawRect(x: number, y: number, w: number, h: number, fillColor: string, strokeColor: string): void {
    this.context.strokeStyle = strokeColor;
    this.context.fillStyle = fillColor;
    this.context.fillRect(x, y, w, h);
  }
  
  drawLine(x1: number, y1: number, x2: number, y2: number, strokeColor: string): void {
    this.context.strokeStyle = strokeColor;
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
  }
  
  drawPanel(x: number, y: number, w: number, h: number, bg: string, fg: string, shadowColor: string, label: Label): void {
    this.drawRect(x, y, w, h, bg, bg); //-- background fill
    // drawRect(x, y + 6, w, 3, fg); //-- header lower-fill
    // drawRect(x + 2, y + h - 3, w - 4, 1, fg); //-- bottom footer fill
    // drawRect(x + (w / 2), y - 15, 50, 4, fg); //--header fill
    
    this.drawText(label.text, x + (w / 2), y - 15, 20, label.fg, "middle", "center"); // header
    //TODO drawText(label.text, x + (w / 2), (y - 15) + 2, 20, label.fg, "middle", "center");
  
    //TODO drawRect(x + 6, y, w - 12, 2, fg); //-- top border
    // drawRect(x, y + 6, 2, h - 12, fg); //-- left border
    // drawRect(x + w - 2, y + 6, 2, h - 12, fg); //-- right border
    // drawRect(x + 6, y + h - 2, w - 12, 2, fg); //-- bottom border
  
    // TODO if (shadow_color === "") {
    //   drawLine(x + 4, y + h, x + w - 3, y + h, shadow_color); //-- shadow
    //   drawLine(x + w - 2, y + h - 1, x + w, y + h - 3, shadow_color); //-- shadow
    //   drawLine(x + w, y + 4, x + w, y + h - 4, shadow_color); //- shadow
    // }
  }

  drawText(text: string, x: number, y: number, fontSize: number, color: string, baseLine: "top" | "bottom" | "middle", textAling: "left" | "center" | "right"): void {
    this.context.textBaseline = baseLine;
    this.context.textAlign = textAling;
    this.context.font = `${fontSize}px Arial`;
    this.context.strokeStyle = color;
    this.context.fillStyle = color;
    this.context.fillText(text, x, y);
  }

  drawTextButton(cursor: Cursor, x: number, y: number, width: number, height: number, mainColor: string, shadowColor: string, hoverColor: string, label: Label, locked: boolean): boolean {
    const middle = {x: x + (width / 2), y: y + (height / 2)};
    const hov = (
      !locked &&
      this.isHovered({ x: cursor.x, y: cursor.y }, { x: x, y: y, w: width, h: height })
    );
  
    if (!locked && hov && !cursor.l) {
      this.drawRect(x, y, width, height, hoverColor, hoverColor);
      // drawLine(x, y + height, x + width, y + height, shadow_color);
    }
    else if (!locked && hov && cursor.l) {
      this.drawRect(x, y, width, height, hoverColor, hoverColor);
    }
    else {
      this.drawRect(x, y, width, height, mainColor, mainColor);
      // drawLine(x, y + height, x + width, y + height, shadow_color);
    }
    
    this.drawText(label.text, middle.x + label.shadow.x, middle.y + label.shadow.y, 25, label.bg, "middle", "center");
    this.drawText(label.text, middle.x, middle.y, 25, label.fg, "middle", "center");
    
    //! hov && CURSOR.l && !CURSOR.ll);
    if (hov && cursor.l) {
      return true;
    }
    
    return false;
  }

  drawBg(color: string): void {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  clearScreen(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  resizeCanvas(): void {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
  
    const width = windowWidth;
    const height = (windowWidth / 16) * 9;
  
    if (height > windowHeight) {
      this.canvas.height = windowHeight;
      this.canvas.width = (windowHeight / 9) * 16;
    }
    else {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  
    // if (integerScale) {
    //   this.canvas.width = Math.floor(this.canvas.width);
    //   this.canvas.height = Math.floor(this.canvas.height);
    // }
  
    this.context.imageSmoothingEnabled = false;
    this.drawBg("black");
  }

  isHovered(mouse: {x: number, y: number}, box: {x: number, y: number, w: number, h: number}): boolean {
    return (
      mouse.x >= box.x &&
      mouse.x <= box.x + box.w &&
      mouse.y >= box.y &&
      mouse.y <= box.y + box.h
    );
  }
}