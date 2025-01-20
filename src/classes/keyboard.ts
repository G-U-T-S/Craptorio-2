class Keyboard {
  public w = false; public a = false
  public s = false; public d = false;
  public m = false; public r = false;
  public q = false; public i = false;
  public h = false; public c = false;
  public t = false;
  public y = false; public shift = false;
  public alt = false; public ctrl = false;
  public tab = false;

  constructor() {
    window.addEventListener("keydown", (ev) => {
      switch (ev.key) {
        case "w": {
          this.w = true;
          break;
        }
        case "a": {
          this.a = true;
          break;
        }
        case "s": {
          this.s = true;
          break;
        }
        case "d": {
          this.d = true;
          break;
        }
        case "m": {
          this.m = true;
          break;
        }
        case "r": {
          this.r = true;
          break;
        }
        case "q": {
          this.q = true;
          break;
        }
        case "i": {
          this.i = true;
          break;
        }
        case "h": {
          this.h = true;
          break;
        }
        case "c": {
          this.c = true;
          break;
        }
        case "t": {
          this.t = true;
          break;
        }
        case "y": {
          this.y = true;
          break;
        }
        case "Shift": {
          this.shift = true;
          break;
        }
        case "Alt": {
          this.alt = true;
          break;
        }
        case "Control": {
          this.ctrl = true;
          break;
        }
        case "Tab": {
          this.tab = true;
          break;
        }
      }
    });
    window.addEventListener("keyup", (ev) => {
      switch (ev.key) {
        case "w": {
          this.w = false;
          break;
        }
        case "a": {
          this.a = false;
          break;
        }
        case "s": {
          this.s = false;
          break;
        }
        case "d": {
          this.d = false;
          break;
        }
        case "m": {
          this.m = false;
          break;
        }
        case "r": {
          this.r = false;
          break;
        }
        case "q": {
          this.q = false;
          break;
        }
        case "i": {
          this.i = false;
          break;
        }
        case "h": {
          this.h = false;
          break;
        }
        case "c": {
          this.c = false;
          break;
        }
        case "t": {
          this.t = false;
          break;
        }
        case "y": {
          this.y = false;
          break;
        }
        case "Shift": {
          this.shift = false;
          break;
        }
        case "Alt": {
          this.alt = false;
          break;
        }
        case "Control": {
          this.ctrl = false;
          break;
        }
        case "Tab": {
          this.tab = false;
          break;
        }
      }
    });
  }
}


const keyboard = new Keyboard();
export default keyboard;