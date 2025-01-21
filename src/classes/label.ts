export default class Label {
  public text: string;
  public fg: string; public bg: string;
  public shadow: {x: number, y: number};
  
  constructor(txt: string, bg: string, fg: string, shadow: {x: number, y: number}) {
    this.text = txt;
    this.fg = fg; this.bg = bg;
    this.shadow = { ...shadow }; 
  }
}