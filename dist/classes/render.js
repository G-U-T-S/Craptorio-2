export class Render {
    canvas;
    context;
    centerCanvas;
    spriteAtlas;
    tilesAtlas;
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.centerCanvas = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
        this.spriteAtlas = new Image();
        this.spriteAtlas.src = "./assets/sprites.png";
        this.tilesAtlas = new Image();
        this.tilesAtlas.src = "./assets/tiles.png";
        window.addEventListener("resize", this.resizeCanvas.bind(this));
    }
    drawSprite(src, x, y, coordX, coordY, sizeX = 8, sizeY = 8) {
        const scale = 5;
        if (src === "sprites") {
            this.context.drawImage(this.spriteAtlas, coordX, coordY, sizeX, sizeY, x, y, sizeX * scale, sizeY * scale);
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
    drawTextButton(cursor, x, y, width, height, mainColor, shadowColor, hoverColor, label, locked) {
        const middle = { x: x + (width / 2), y: y + (height / 2) };
        const hov = (!locked &&
            this.isHovered({ x: cursor.x, y: cursor.y }, { x: x, y: y, w: width, h: height }));
        if (!locked && hov && !cursor.l) {
            this.drawRect(x, y, width, height, hoverColor, hoverColor);
        }
        else if (!locked && hov && cursor.l) {
            this.drawRect(x, y, width, height, hoverColor, hoverColor);
        }
        else {
            this.drawRect(x, y, width, height, mainColor, mainColor);
        }
        this.drawText(label.text, middle.x + label.shadow.x, middle.y + label.shadow.y, 25, label.bg, "middle", "center");
        this.drawText(label.text, middle.x, middle.y, 25, label.fg, "middle", "center");
        if (hov && cursor.l) {
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
        this.canvas.width = 100;
        this.canvas.height = 100;
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
}
