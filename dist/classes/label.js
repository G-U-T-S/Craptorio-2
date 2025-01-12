export class Label {
    text;
    fg;
    bg;
    shadow;
    constructor(txt, bg, fg, shadow) {
        this.text = txt;
        this.fg = fg;
        this.bg = bg;
        this.shadow = { ...shadow };
    }
}
