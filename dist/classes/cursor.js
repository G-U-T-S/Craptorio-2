class Cursor {
    x;
    y;
    l;
    ll;
    m;
    r;
    prog;
    canvasId;
    constructor(canvasId = "mainCanvas") {
        this.x = 0;
        this.y = 0;
        this.l = false;
        this.ll = false;
        this.m = false;
        this.r = false;
        this.prog = false;
        this.canvasId = canvasId;
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
const cursor = new Cursor();
export default cursor;
