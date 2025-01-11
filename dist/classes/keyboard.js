class Keyboard {
    w;
    a;
    s;
    d;
    constructor() {
        this.w = false;
        this.a = false;
        this.s = false;
        this.d = false;
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
            }
        });
    }
}
const keyboard = new Keyboard();
export default keyboard;
