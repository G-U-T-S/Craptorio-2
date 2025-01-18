import render from "./render.js";
import { Label } from "./label.js";


class Ui {
  public currentHelp: number;

  constructor() {
    this.currentHelp = 0;
  }

  drawStartMenu(): string {
    render.drawBg("gray");
    // this.draw_logo();

    const middleScreen = {
      x: render.size.w / 2, y: render.size.h / 2
    };
  
    if (render.drawTextButton(middleScreen.x - 50, middleScreen.y - 25, 100, 50, "blue", "black", "darkBlue", new Label("Start", "black", "white", {x: 0, y: 2}), false)) {
      return "game";
    }
    
    if (render.drawTextButton(middleScreen.x - 50, (middleScreen.y - 25) + 65, 100, 50, "blue", "black", "darkBlue", new Label("Controls", "black", "white", {x: 0, y: 2}), false)) {
      return 'help';
    }

    return "start";
  }

  drawHelpMenu(): string {
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

    render.drawPanel(panelCoords.x, panelCoords.y, panelCoords.w, panelCoords.h, "white", "blue", "black", new Label("Controls", "black", "black", {x: 0, y: 0}));
    for (let i = 0; i < info.length; i++) {
      render.drawText(info[i][1], panelCoords.x, panelCoords.y + (i * 20), 20, "black", "top", "left");
      render.drawText(info[i][0], panelCoords.x + panelCoords.w, panelCoords.y + (i * 20), 20, "black", "top", "right");
    }

    if (render.drawTextButton(middleScreen.x - (150 / 2), panelCoords.y + panelCoords.h, 150, 50, "red", "black", "darkRed", new Label("Back", "black", "white", {x: 0, y: 2}), false)) {
      return "start";
    }
    return "help";
  }

  drawEndgameWindow(tick: number): string {
    render.drawBg("black");
    const middleScreen = {
      x: render.size.w / 2, y: render.size.h / 2
    };

    if (tick % 60 > 30) {
      // print('Congratulations!', 31, 44, 15, false, 2, false)
      // print('Congratulations!', 30, 44, 4, false, 2, false)
      // print('You\'ve won the game!', 11, 64, 15, false, 2, false)
      // print('You\'ve won the game!', 10, 64, 4, false, 2, false)
    }

    if (render.drawTextButton(middleScreen.x - 50, middleScreen.y - 25, 100, 50, "blue", "black", "darkBlue", new Label("Continue", "black", "white", {x: 0, y: 2}), false)) {
      return "game";
    }
    if (render.drawTextButton(middleScreen.x - 50, (middleScreen.y - 25) + 65, 100, 50, "blue", "black", "darkBlue", new Label("Quit", "black", "white", {x: 0, y: 2}), false)) {
      // cls()
      // exit()
      // -- STATE = 'game'
    }

    return "firstLaunch";
  }

  /*
  drawHelpScreen(): void {
    // this.draw_panel(0, 0, 240, 136, 8, 9, {text = help[current_help].name, bg = 15, fg = 4})
    if (this.currentHelp < 3) {
      for k, v in ipairs(help[current_help].info) do
        prints(v[2], 3, 10 + ((k-1) * 7), 15, 4)
        prints(v[1], 150, 10 + ((k-1) * 7), 15, 11, _, true)
      end
    }
    else {
      local y = 10
      for k, v in ipairs(help[current_help].info) do
        local lines = text_wrap(v, 232, false)
        for i, line in ipairs(lines) do
          prints(line, 3, y, 15, 4)
          y = y + 8
        end
        y = y + 8
      end
    }
    // --page left button
    if (ui.draw_button(240 - 20, 1, 1, UI_BUTTON, 2, 8, 3)) {
      current_help = clamp(current_help - 1, 1, #help)
      return;
    }

    // --page right button
    if (ui.draw_button(240 - 12, 1, 0, UI_BUTTON, 2, 8, 3)) {
      current_help = clamp(current_help + 1, 1, #help)
      return;
    }

    if (ui.draw_text_button(2, 1, UI_BUTTON2, _, 8, 2, 15, 3, {text = ' Back ', x = 1, y = 1, bg = 15, fg = 4, shadow = {x = 1, y = 0}})) {
      if (STATE === 'help') {
        cls()
        STATE = 'start'
        return;
      }
      else {
        show_help = false
      }
      
      return;
    }

  }
  */
}


const ui = new Ui();
export default ui;