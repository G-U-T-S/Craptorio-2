import CURSOR from "./cursor.js";
import Label from "./label.js";
import { items } from "./definitions.js";


class Render {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public topLeft: { x: number, y: number };
  public size: { w: number, h: number };
  public center: { x: number, y: number };
  public integerScale: boolean;
  private staticSpritesAtlas: HTMLImageElement;
  private rotatableSpritesAtlas: HTMLImageElement;
  private tilesAtlas: HTMLImageElement;
  private resizeCallbacks: Array<CallableFunction> = []

  constructor() {
    this.canvas = document.getElementsByTagName("Canvas")[0] as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.topLeft = { x: 0, y: 0 };
    this.size = { w: 0, h: 0 };
    this.center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    this.staticSpritesAtlas = new Image();
    this.staticSpritesAtlas.src = "./assets/staticSprites.png";
    this.rotatableSpritesAtlas = new Image();
    this.rotatableSpritesAtlas.src = "./assets/rotatableSprites.png";
    this.tilesAtlas = new Image();
    this.tilesAtlas.src = "./assets/tiles.png";
    this.integerScale = true;

    window.addEventListener("resize", this.resizeCanvas.bind(this));
    this.resizeCanvas();
  }

  drawSprite(src: "staticSprite" | "rotatableSprite" | "tiles", scale: number, x: number, y: number, coordX: number, coordY: number, sizeX: number = 8, sizeY: number = 8): void {
    if (src === "staticSprite") {
      this.context.drawImage(
        this.staticSpritesAtlas, coordX, coordY,
        sizeX, sizeY, x, y, sizeX * scale, sizeY * scale
      )
    }
    else if (src === "rotatableSprite") {
      this.context.drawImage(
        this.rotatableSpritesAtlas, coordX, coordY,
        sizeX, sizeY, x, y, sizeX * scale, sizeY * scale
      )
    }
    else if (src === "tiles") {
      this.context.drawImage(
        this.tilesAtlas, coordX, coordY,
        sizeX, sizeY, x, y, sizeX * scale, sizeY * scale
      )
    }
  }

  drawRect(x: number, y: number, w: number, h: number, fillColor: string, strokeColor: string): void {
    // this.context.strokeStyle = strokeColor;
    this.context.fillStyle = fillColor;
    this.context.fillRect(x, y, w, h);
  }

  drawEmptyRect(x: number, y: number, w: number, h: number, strokeColor: string): void {
    this.context.strokeStyle = strokeColor;
    this.context.strokeRect(x, y, w, h);
  }

  // drawLine(x1: number, y1: number, x2: number, y2: number, strokeColor: string): void {
  //   this.context.strokeStyle = strokeColor;
  //   this.context.moveTo(x1, y1);
  //   this.context.lineTo(x2, y2);
  // }

  drawPanel(x: number, y: number, w: number, h: number, bg: string, fg: string, shadowColor: string, label?: Label): void {
    this.drawRect(x, y, w, h, bg, bg); //-- background fill
    // drawRect(x, y + 6, w, 3, fg); //-- header lower-fill
    // drawRect(x + 2, y + h - 3, w - 4, 1, fg); //-- bottom footer fill
    // drawRect(x + (w / 2), y - 15, 50, 4, fg); //--header fill


    if (label) {
      this.drawText(label.text, x + (w / 2), y - 15, 20, label.fg, "middle", "center"); // header
    }
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

  drawGrid(x: number, y: number, rows: number, cols: number, bg: string, fg: string, sizeX: number, sizeY: number, border = false, rounded = false): void {
    // if border then rectb(x,y,cols*size+1,rows*size+1,fg) end
    // this.drawRect(x, y, cols * size, rows * size, bg, bg);

    for (let X = 0; X < cols + 1; X++) {
      this.drawRect(x + (X * sizeX), y, 1, rows * sizeY, fg, fg);
    }

    for (let Y = 0; Y < rows + 1; Y++) {
      this.drawRect(x, y + (Y * sizeY), cols * sizeX, 1, fg, fg);
    }

    //! Dont work
    // if (rounded) {
    //   for (let i = 0; i < rows; i ++) {
    //     for (let j = 0; j < cols; j++) {
    //       const xx = x + ( j * size);
    //       const yy = y +( i * size);

    //       this.drawRect(xx, yy, 1, 1, fg, fg);
    //       this.drawRect(xx + size - 2, yy, 1, 1, fg, fg);
    //       this.drawRect(xx + size - 2, yy + size - 2, 1, 1, fg, fg);
    //       this.drawRect(xx, yy + size - 2, 1, 1, fg, fg);
    //     }
    //   }
    // }
  }

  drawItemStack(itemName: string, scale: number, x: number, y: number, quant: number, showQuant: boolean): void {
    this.drawSprite(
      "staticSprite", scale, x, y,
      items[itemName].atlasCoord.normal.x, items[itemName].atlasCoord.normal.y
    );

    if (showQuant) {
      const text = `${quant}`;
      this.drawText(
        text, x + ((scale + 1) * 8) - 5, y + ((scale + 1) * 8), 15, "yellow", "bottom", "right"
      );
    }
  }

  drawText(text: string, x: number, y: number, fontSize: number, color: string, baseLine: "top" | "bottom" | "middle", textAling: "left" | "center" | "right"): void {
    this.context.textBaseline = baseLine;
    this.context.textAlign = textAling;
    this.context.font = `${fontSize}px Arial`;
    this.context.strokeStyle = color;
    this.context.fillStyle = color;
    this.context.fillText(text, x, y);
  }

  drawTextButton(x: number, y: number, width: number, height: number, mainColor: string, shadowColor: string, hoverColor: string, label: Label, locked: boolean): boolean {
    const middle = { x: x + (width / 2), y: y + (height / 2) };
    const hov = (
      !locked &&
      this.isHovered({ x: CURSOR.x, y: CURSOR.y }, { x: x, y: y, w: width, h: height })
    );

    if (!locked && hov && !CURSOR.l) {
      this.drawRect(x, y, width, height, hoverColor, hoverColor);
      // drawLine(x, y + height, x + width, y + height, shadow_color);
    }
    else if (!locked && hov && CURSOR.l) {
      this.drawRect(x, y, width, height, hoverColor, hoverColor);
    }
    else {
      this.drawRect(x, y, width, height, mainColor, mainColor);
      // drawLine(x, y + height, x + width, y + height, shadow_color);
    }

    this.drawText(label.text, middle.x + label.shadow.x, middle.y + label.shadow.y, 25, label.bg, "middle", "center");
    this.drawText(label.text, middle.x, middle.y, 25, label.fg, "middle", "center");

    //! hov && CURSOR.l && !CURSOR.ll);
    if (hov && CURSOR.l) {
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
    // const windowWidth = window.innerWidth;
    // const windowHeight = window.innerHeight;

    // const width = windowWidth;
    // const height = (windowWidth / 16) * 9;

    // if (height > windowHeight) {
    //   this.canvas.height = windowHeight;
    //   this.canvas.width = (windowHeight / 9) * 16;
    // }
    // else {
    //   this.canvas.width = width;
    //   this.canvas.height = height;
    // }

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    if (this.integerScale) {
      this.canvas.width = Math.floor(this.canvas.width);
      this.canvas.height = Math.floor(this.canvas.height);
    }

    this.size = { w: this.canvas.width, h: this.canvas.height };
    this.center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    this.context.imageSmoothingEnabled = false;
    this.drawBg("black");

    this.resizeCallbacks.forEach((func) => { func() });
  }

  isHovered(mouse: { x: number, y: number }, box: { x: number, y: number, w: number, h: number }): boolean {
    return (
      mouse.x >= box.x &&
      mouse.x <= box.x + box.w &&
      mouse.y >= box.y &&
      mouse.y <= box.y + box.h
    );
  }

  isInsideCamera(x: number, y: number): boolean {
    if (x >= this.topLeft.x && x <= this.topLeft.x + this.size.w && y >= this.topLeft.y && y <= this.topLeft.y + this.size.h) {
      return true;
    }

    return false;
  }

  addResizeListener(callback: CallableFunction): void {
    this.resizeCallbacks.push(callback);
  }
}


const render = new Render();
export default render;