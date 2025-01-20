import render from "./render.js";
class Cursor {
    x = 0;
    y = 0;
    l = false;
    ll = false;
    itemStack = { id: 0, count: 0 };
    m = false;
    r = false;
    panelDrag = false;
    lm = false;
    lr = false;
    heldLeft = false;
    heldRight = false;
    holdTime = 0;
    type = "pointer";
    prog = false;
    drag = false;
    rot = 0;
    mouseDownListeners = [];
    mouseUpListeners = [];
    mouseWheelListeners = [];
    constructor() {
        window.addEventListener("mousemove", (ev) => {
            const rect = render.canvas.getBoundingClientRect();
            this.x = ev.clientX - rect.left;
            this.y = ev.clientY - rect.top;
        });
        window.addEventListener("mousedown", (ev) => {
            if (ev.button === 0) {
                this.l = true;
            }
            if (ev.button === 1) {
                this.m = true;
            }
            if (ev.button === 2) {
                this.r = true;
            }
            this.mouseDownListeners.forEach((func) => {
                func();
            });
        });
        window.addEventListener("mouseup", (ev) => {
            if (ev.button === 0) {
                this.l = false;
            }
            if (ev.button === 1) {
                this.m = false;
            }
            if (ev.button === 2) {
                this.r = false;
            }
            this.mouseUpListeners.forEach((func) => {
                func();
            });
        });
        window.addEventListener("wheel", (ev) => {
            this.mouseWheelListeners.forEach((func) => {
                func(ev.deltaY);
            });
        });
    }
    update() {
        const l = this.l;
        const r = this.r;
        if (l && this.l && !this.heldLeft && !this.r) {
            this.heldLeft = true;
        }
        if (r && this.r && !this.heldRight && !this.l) {
            this.heldRight = true;
        }
        if (this.heldLeft || this.heldRight) {
            this.holdTime = this.holdTime + 1;
        }
        if (!l && this.heldLeft) {
            this.heldLeft = false;
            this.holdTime = 0;
        }
        if (!r && this.heldRight) {
            this.heldRight = false;
            this.holdTime = 0;
        }
        this.ll = this.l;
        this.lm = this.m;
        this.lr = this.r;
    }
    rotate(dir) {
        if (cursor.drag) {
            this.rot = (dir == 'r' && this.rot + 1) || (this.rot - 1);
            if (this.rot > 3) {
                this.rot = 0;
            }
            if (this.rot < 0) {
                this.rot = 3;
            }
        }
    }
    addMouseDownListener(func) {
        this.mouseDownListeners.push(func);
    }
    addMouseUpListener(func) {
        this.mouseUpListeners.push(func);
    }
    addMouseWheelListener(func) {
        this.mouseWheelListeners.push(func);
    }
}
const cursor = new Cursor();
export default cursor;
