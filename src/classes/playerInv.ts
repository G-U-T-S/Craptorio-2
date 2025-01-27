import render from "./render.js";
import Inventory from "./inventory.js";


let cols = 7;
let rows = 7;
let slotSize = 8 * 6;
let w = slotSize * cols;
let h = slotSize * rows;
let x = (render.size.w / 2) - w - 5;
let y = (render.size.h / 2) - (h / 2);
const playerInv = new Inventory(
  "Inventory", x, y, rows, cols, slotSize, w, h
)
render.addResizeListener(() => {
  playerInv.moveTo(
    (render.size.w / 2) - w - 5,
    (render.size.h / 2) - (h / 2)
  );
});

export default playerInv;