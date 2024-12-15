"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CVS = document.getElementById("mainCanvas");
const CTX = CVS.getContext("2d");
window.addEventListener("resize", resizeCanvas);
let TICK = 0;
function resizeCanvas() {
    CVS.width = window.innerWidth;
    CVS.height = window.innerHeight;
}
function BOOT() {
    resizeCanvas();
    TIC();
}
function TIC() {
    CTX.fillRect(0, 0, CVS.width, CVS.height);
    TICK += 1;
    requestAnimationFrame(TIC);
}
BOOT();
