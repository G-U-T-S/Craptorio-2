export class Keyboard {
  public w: boolean; public a: boolean
  public s: boolean; public d: boolean;

  constructor() {
    this.w = false; this.a = false;
    this.s = false; this.d = false;

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
          this.d = true
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
          this.d = false
          break;
        }
      }
    });
  }
}
// const KEYBOARD: { [index: string]: boolean } = {
//   "shift": false, // 16
//   "alt": false,
//   "ctrl": false,
//   "tab": false,
//   "w": false, // 87
//   "a": false, // 65
//   "s": false, // 83
//   "d": false, // 68
//   "f": false,
//   "g": false,
//   "m": false,
//   "r": false,
//   "q": false,
//   "i": false,
//   "h": false,
//   "c": false,
//   "y": false,
//   "e": false,
//   "t": false,
//   "0": false,
//   "1": false,
//   "2": false,
//   "3": false,
//   "4": false,
//   "5": false,
//   "6": false,
//   "7": false,
//   "8": false,
//   "9": false,
// };