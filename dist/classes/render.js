import CURSOR from "./cursor.js";
import { items } from "./definitions.js";
class Render {
    canvas;
    context;
    topLeft;
    size;
    centerCanvas;
    integerScale;
    staticSpritesAtlas;
    rotatableSpritesAtlas;
    tilesAtlas;
    constructor() {
        this.canvas = document.getElementsByTagName("Canvas")[0];
        this.context = this.canvas.getContext("2d");
        this.topLeft = { x: 0, y: 0 };
        this.size = { w: 0, h: 0 };
        this.centerCanvas = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
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
    drawSprite(src, scale, x, y, coordX, coordY, sizeX = 8, sizeY = 8) {
        if (src === "staticSprite") {
            this.context.drawImage(this.staticSpritesAtlas, coordX, coordY, sizeX, sizeY, x, y, sizeX * scale, sizeY * scale);
        }
        else if (src === "rotatableSprite") {
            this.context.drawImage(this.rotatableSpritesAtlas, coordX, coordY, sizeX, sizeY, x, y, sizeX * scale, sizeY * scale);
        }
        else if (src === "tiles") {
            this.context.drawImage(this.tilesAtlas, coordX, coordY, sizeX, sizeY, x, y, sizeX * scale, sizeY * scale);
        }
    }
    drawRect(x, y, w, h, fillColor, strokeColor) {
        this.context.strokeStyle = strokeColor;
        this.context.fillStyle = fillColor;
        this.context.fillRect(x, y, w, h);
    }
    drawPanel(x, y, w, h, bg, fg, shadowColor, label) {
        this.drawRect(x, y, w, h, bg, bg);
        this.drawText(label.text, x + (w / 2), y - 15, 20, label.fg, "middle", "center");
    }
    drawGrid(x, y, rows, cols, bg, fg, size, border, rounded) {
        for (let X = 0; X < cols + 1; X++) {
            this.drawRect(x + (X * size), y, 2, rows * size, fg, fg);
        }
        for (let Y = 0; Y < rows + 1; Y++) {
            this.drawRect(x, y + (Y * size), cols * size, 2, fg, fg);
        }
    }
    drawItemStack(itemName, x, y, quant, showQuant) {
        this.drawSprite("staticSprite", 4, x, y, items[itemName].atlasCoord.normal.x, items[itemName].atlasCoord.normal.y);
        if (showQuant) {
        }
    }
    drawText(text, x, y, fontSize, color, baseLine, textAling) {
        this.context.textBaseline = baseLine;
        this.context.textAlign = textAling;
        this.context.font = `${fontSize}px Arial`;
        this.context.strokeStyle = color;
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
    }
    drawTextButton(x, y, width, height, mainColor, shadowColor, hoverColor, label, locked) {
        const middle = { x: x + (width / 2), y: y + (height / 2) };
        const hov = (!locked &&
            this.isHovered({ x: CURSOR.x, y: CURSOR.y }, { x: x, y: y, w: width, h: height }));
        if (!locked && hov && !CURSOR.l) {
            this.drawRect(x, y, width, height, hoverColor, hoverColor);
        }
        else if (!locked && hov && CURSOR.l) {
            this.drawRect(x, y, width, height, hoverColor, hoverColor);
        }
        else {
            this.drawRect(x, y, width, height, mainColor, mainColor);
        }
        this.drawText(label.text, middle.x + label.shadow.x, middle.y + label.shadow.y, 25, label.bg, "middle", "center");
        this.drawText(label.text, middle.x, middle.y, 25, label.fg, "middle", "center");
        if (hov && CURSOR.l) {
            return true;
        }
        return false;
    }
    drawBg(color) {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    clearScreen() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.integerScale) {
            this.canvas.width = Math.floor(this.canvas.width);
            this.canvas.height = Math.floor(this.canvas.height);
        }
        this.size = { w: this.canvas.width, h: this.canvas.height };
        this.centerCanvas = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
        this.context.imageSmoothingEnabled = false;
        this.drawBg("black");
    }
    isHovered(mouse, box) {
        return (mouse.x >= box.x &&
            mouse.x <= box.x + box.w &&
            mouse.y >= box.y &&
            mouse.y <= box.y + box.h);
    }
    isInsideCamera(x, y) {
        if (x >= this.topLeft.x && x <= this.topLeft.x + this.size.w && y >= this.topLeft.y && y <= this.topLeft.y + this.size.h) {
            return true;
        }
        return false;
    }
}
const render = new Render();
export default render;
