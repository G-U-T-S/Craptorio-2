export class Cursor {
    x;
    y;
    l;
    ll;
    m;
    r;
    prog;
    canvas;
    constructor(canvasId) {
        this.x = 0;
        this.y = 0;
        this.l = false;
        this.ll = false;
        this.m = false;
        this.r = false;
        this.prog = false;
        this.canvas = document.getElementById(canvasId);
        window.addEventListener("mousemove", (ev) => {
            const rect = this.canvas.getBoundingClientRect();
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
        });
    }
    update() {
        const l = this.l;
        const r = this.r;
    }
}
