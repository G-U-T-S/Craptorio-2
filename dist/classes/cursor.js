class Cursor {
    x;
    y;
    l;
    ll;
    m;
    r;
    heldLeft;
    heldRight;
    holdTime;
    prog;
    canvasId;
    mouseDownListeners;
    mouseUpListeners;
    constructor(canvasId = "mainCanvas") {
        this.x = 0;
        this.y = 0;
        this.l = false;
        this.ll = false;
        this.m = false;
        this.r = false;
        this.heldLeft = false;
        this.heldRight = false;
        this.holdTime = 0;
        this.prog = false;
        this.canvasId = canvasId;
        this.mouseDownListeners = [];
        this.mouseUpListeners = [];
        window.addEventListener("mousemove", (ev) => {
            const canvas = ev.target;
            if (canvas instanceof HTMLCanvasElement && canvas.id === this.canvasId) {
                const rect = canvas.getBoundingClientRect();
                this.x = ev.clientX - rect.left;
                this.y = ev.clientY - rect.top;
            }
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
    }
    addMouseDownListener(func) {
        this.mouseDownListeners.push(func);
    }
    addMouseUpListener(func) {
        this.mouseUpListeners.push(func);
    }
}
const cursor = new Cursor();
export default cursor;
