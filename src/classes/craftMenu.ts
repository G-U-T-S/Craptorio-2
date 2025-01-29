import cursor from "./cursor.js";
import render from "./render.js";
import playerInv from "./playerInv.js";
import { items } from "./definitions.js";


class ItemButton {
  public x: number; public y: number;
  public w: number; public h: number;
  public name: string

  constructor(name: string, x: number, y: number, w: number, h: number) {
    this.x = x; this.y = y;
    this.w = w; this.h = h;
    this.name = name
  }

  isHovered(x: number, y: number): boolean {
    if (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h) {
      return true;
    }

    return false;
  }

  draw(spriteScale: number): void {
    render.drawRect(
      this.x, this.y, this.w, this.h, "blue", "darkBlues"
    )

    const x = this.x + (this.w / 2) - ((8 * spriteScale) / 2);
    const y = this.y + (this.h / 2) - ((8 * spriteScale) / 2);

    render.drawSprite(
      "staticSprite", spriteScale, x, y,
      items[this.name].atlasCoord.normal.x, items[this.name].atlasCoord.normal.y
    );
  }
}


//! que confusão nessas coordenadas
class CraftMenu {
  public cols = 7; public rows = 5;
  public btnSize = 8 * 6;
  public w = this.btnSize * 7; public h = this.btnSize * 7;
  public x = (render.size.w / 2) + 5;
  public y = (render.size.h / 2) - ((this.btnSize * 3) / 2);
  public craftButtons: Array<Array<ItemButton>> = [[], [], []];
  public tabButtons: Array<ItemButton> = [];
  public actualTab = 0;

  constructor() {
    render.addResizeListener(() => {
      this.x = (render.size.w / 2) + 5;
      this.y = (render.size.h / 2) - ((this.btnSize * 3) / 2);

      let index = 0;
      for (let x = 0; x < this.rows; x++) {
        for (let y = 0; y < this.cols; y++) {
          const btn = this.craftButtons[0][index];

          btn.x = this.x + (x * this.btnSize);
          btn.y = this.y + (y * this.btnSize);
        }

        index++;
      }

      index = 0;
      for (let x = 0; x < this.rows; x++) {
        for (let y = 0; y < this.cols; y++) {
          const btn = this.craftButtons[1][index];

          btn.x = this.x + (x * this.btnSize);
          btn.y = this.y + (y * this.btnSize);
        }

        index++;
      }

      index = 0;
      for (let x = 0; x < this.rows; x++) {
        for (let y = 0; y < this.cols; y++) {
          const btn = this.craftButtons[2][index];

          btn.x = this.x + (x * this.btnSize);
          btn.y = this.y + (y * this.btnSize);
        }

        index++;
      }
    });

    const namesArrayZero: Array<string> = [
      "inserter", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
    ];

    let index = 0;
    for (let x = 0; x < this.rows; x++) {
      for (let y = 0; y < this.cols; y++) {
        if (namesArrayZero[index] !== "") {
          this.craftButtons[0].push(
            new ItemButton(namesArrayZero[index], this.x + (x * this.btnSize), this.y + (y * this.btnSize), this.btnSize, this.btnSize)
          );
        }

        index++;
      }
    }

    const namesArrayOne: Array<string> = [
      "green_circuit", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
    ];

    index = 0;
    for (let x = 0; x < this.rows; x++) {
      for (let y = 0; y < this.cols; y++) {
        if (namesArrayOne[index] !== "") {
          this.craftButtons[1].push(
            new ItemButton(namesArrayOne[index], this.x + (x * this.btnSize), this.y + (y * this.btnSize), this.btnSize, this.btnSize)
          );
        }

        index++;
      }
    }

    const namesArrayTwo: Array<string> = [
      "red_cience", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
    ];

    index = 0;
    for (let x = 0; x < this.rows; x++) {
      for (let y = 0; y < this.cols; y++) {
        if (namesArrayTwo[index] !== "") {
          this.craftButtons[2].push(
            new ItemButton(namesArrayTwo[index], this.x + (x * this.btnSize), this.y + (y * this.btnSize), this.btnSize, this.btnSize)
          );
        }

        index++;
      }
    }

    //------------------------------------------------------//

    const tabsArray = ["inserter", "green_circuit", "red_cience"];

    index = 0;
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 1; y++) {
        this.tabButtons.push(
          new ItemButton(
            tabsArray[index],
            this.x + (x * 112), this.y - 96,
            112, 96
          )
        );

        index++;
      }
    }
  }

  draw(): void {
    render.drawRect(
      this.x, this.y - 24 * 4, this.w, this.h, "blue", "blue"
    );

    this.tabButtons.forEach((tab) => {
      tab.draw(7);
    });

    this.craftButtons[this.actualTab].forEach((btn) => {
      btn.draw(5);
    });

    render.drawGrid(
      this.x, this.y - 24 * 4, 1, 3, "white", "white",
      112, 96
    );
  }

  isHovered(x: number, y: number): boolean {
    if (x >= this.x && x <= this.x + this.w && y >= this.y - (24 * 4) && y <= (this.y - (24 * 4)) + this.h) {
      return true;
    }

    return false;
  }

  handleClick(x: number, y: number): void {
    // essa variavel serve para não iterar mais que o necessario
    let consumed = false;
    this.tabButtons.forEach((tab) => {
      if (tab.isHovered(x, y)) {
        switch (tab.name) {
          case "inserter": {
            this.actualTab = 0;
            break;
          }
          case "green_circuit": {
            this.actualTab = 1;
            break;
          }
          case "red_cience": {
            this.actualTab = 2;
            break;
          }
        }

        consumed = true
        return;
      }
    });

    if (!consumed) {
      this.craftButtons[this.actualTab].forEach((btn) => {
        if (btn.isHovered(cursor.x, cursor.y)) {
          this.craft(btn.name);
          return;
        }
      });
    }
  }

  craft(itemName: string): void {
    playerInv.depositStack(
      itemName, 10, 0, true
    );
  }
}


const craftMenu = new CraftMenu();
export default craftMenu;