window.addEventListener("contextmenu", (ev) => {
  ev.preventDefault();
});


let tick: number = 0;
let delta: number = 0;
let lastTime: number = 0;
let state: string = "game";
// let integerScale: boolean = true;


function BOOT(): void {
  TIC(1);
}
function TIC(currentTime: number) {
  delta = (currentTime - lastTime) / 100;
  lastTime = currentTime;
  

  tick = tick + 1;
  requestAnimationFrame(TIC);
}


BOOT();