import CURSOR from "./cursor.js";
class Render {
    canvas;
    context;
    topLeft;
    size;
    centerCanvas;
    integerScale;
    spriteAtlas;
    tilesAtlas;
    constructor(canvasId, integerScale) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.topLeft = { x: 0, y: 0 };
        this.size = { w: 0, h: 0 };
        this.centerCanvas = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
        this.spriteAtlas = new Image();
        this.spriteAtlas.src = "./assets/sprites.png";
        this.tilesAtlas = new Image();
        this.tilesAtlas.src = "./assets/tiles.png";
        this.integerScale = integerScale;
        window.addEventListener("resize", this.resizeCanvas.bind(this));
    }
    drawSprite(src, x, y, coordX, coordY, sizeX = 8, sizeY = 8) {
        const scale = 5;
        if (src === "sprites") {
            this.context.drawImage(this.spriteAtlas, coordX, coordY, sizeX, sizeY, x, y, sizeX * scale, sizeY * scale);
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
    drawLine(x1, y1, x2, y2, strokeColor) {
        this.context.strokeStyle = strokeColor;
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
    }
    drawPanel(x, y, w, h, bg, fg, shadowColor, label) {
        this.drawRect(x, y, w, h, bg, bg);
        this.drawText(label.text, x + (w / 2), y - 15, 20, label.fg, "middle", "center");
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
const render = new Render("mainCanvas", false);
export default render;
