import render from "./render.js";
class Cursor {
    x = 0;
    y = 0;
    l = false;
    m = false;
    r = false;
    holdTime = 0;
    type = "pointer";
    drag = false;
    rot = 0;
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
}
const cursor = new Cursor();
export default cursor;
