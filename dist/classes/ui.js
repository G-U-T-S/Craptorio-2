import render from "./render.js";
import { Label } from "./label.js";
class Ui {
    drawStartMenu() {
        render.drawBg("gray");
        const middleScreen = {
            x: render.size.w / 2, y: render.size.h / 2
        };
        if (render.drawTextButton(middleScreen.x - 50, middleScreen.y - 25, 100, 50, "blue", "black", "darkBlue", new Label("Start", "black", "white", { x: 0, y: 2 }), false)) {
            return "game";
        }
        if (render.drawTextButton(middleScreen.x - 50, (middleScreen.y - 25) + 65, 100, 50, "blue", "black", "darkBlue", new Label("Controls", "black", "white", { x: 0, y: 2 }), false)) {
            return 'help';
        }
        return "start";
    }
    drawHelpMenu() {
        render.drawBg("gray");
        const middleScreen = {
            x: render.canvas.width / 2, y: render.canvas.height / 2
        };
        const info = [
            ['W A S D', 'Move PLAYER'],
            ['ESC', 'Exit game'],
            ['CTRL + R', 'Reload game'],
            ['I or TAB', 'Toggle inventory window'],
            ['C', 'Toggle crafting window'],
            ['T', 'Toggle research window'],
            ['R', 'Rotate held item or hovered object'],
            ['Q', 'Pipette tool - copy/swap objects'],
            ['Left-click', 'Place/deposit item/open machine'],
            ['Right-click hold', 'Mine resource or destroy object'],
            ['Scroll +/-', 'Scroll active hotbar slot']
        ];
        const panelCoords = {
            x: middleScreen.x - 250,
            y: middleScreen.y - 150,
            w: 500, h: 300
        };
        render.drawPanel(panelCoords.x, panelCoords.y, panelCoords.w, panelCoords.h, "white", "blue", "black", new Label("Controls", "black", "black", { x: 0, y: 0 }));
        for (let i = 0; i < info.length; i++) {
            render.drawText(info[i][1], panelCoords.x, panelCoords.y + (i * 20), 20, "black", "top", "left");
            render.drawText(info[i][0], panelCoords.x + panelCoords.w, panelCoords.y + (i * 20), 20, "black", "top", "right");
        }
        if (render.drawTextButton(middleScreen.x - (150 / 2), panelCoords.y + panelCoords.h, 150, 50, "red", "black", "darkRed", new Label("Back", "black", "white", { x: 0, y: 2 }), false)) {
            return "start";
        }
        return "help";
    }
    drawEndgameWindow(tick) {
        render.drawBg("black");
        const middleScreen = {
            x: render.size.w / 2, y: render.size.h / 2
        };
        if (tick % 60 > 30) {
        }
        if (render.drawTextButton(middleScreen.x - 50, middleScreen.y - 25, 100, 50, "blue", "black", "darkBlue", new Label("Continue", "black", "white", { x: 0, y: 2 }), false)) {
            return "game";
        }
        if (render.drawTextButton(middleScreen.x - 50, (middleScreen.y - 25) + 65, 100, 50, "blue", "black", "darkBlue", new Label("Quit", "black", "white", { x: 0, y: 2 }), false)) {
        }
        return "firstLaunch";
    }
}
const ui = new Ui();
export default ui;
