import RENDER from "./render.js";
import PLAYER from "./player.js";
import CURSOR from "./cursor.js";


class Utils {
  getScreenCell(): {sx: number, sy: number} {
    const cameraTopLeftX = PLAYER.x - RENDER.canvas.width / 2;
    const cameraTopLeftY = PLAYER.y - RENDER.canvas.height / 2;

    RENDER.context.beginPath();
    RENDER.context.lineWidth = 5;
    RENDER.context.moveTo(PLAYER.x + RENDER.canvas.width / 2, PLAYER.y + RENDER.canvas.height / 2);
    RENDER.context.lineTo(cameraTopLeftX, cameraTopLeftY);
    RENDER.context.stroke();

    return {sx: CURSOR.x + cameraTopLeftX,sy: Math.floor(CURSOR.y + cameraTopLeftY)};
  }
}


const utils = new Utils();
export default utils;