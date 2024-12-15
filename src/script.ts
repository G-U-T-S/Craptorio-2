const CVS = document.getElementById("mainCanvas") as HTMLCanvasElement;
const CTX = CVS.getContext("2d") as CanvasRenderingContext2D;

window.addEventListener("resize", resizeCanvas);

let TICK: number = 0;


function resizeCanvas(): void {
  CVS.width = window.innerWidth;
  CVS.height = window.innerHeight;
}


function BOOT(): void {
  resizeCanvas();

  TIC();
}


function TIC(): void {
  CTX.fillRect(0, 0, CVS.width, CVS.height);
  
  TICK += 1;

  requestAnimationFrame(TIC);
}


BOOT();