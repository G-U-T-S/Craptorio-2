import cursor from "../engine/cursor.js";
import render from "../engine/render.js";
import playerInv from "./playerInv.js";
import { items, recipes } from "./definitions.js";
import Label from "./label.js";


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

  draw(spriteScale: number, border: boolean): void {
    // render.drawRect(this.x, this.y, this.w, this.h, "blue", "darkBlue");

    if (border) {
      render.drawEmptyRect(this.x, this.y, this.w, this.h, "white");
    }

    const x = this.x + (this.w / 2) - ((8 * spriteScale) / 2);
    //! esse +1 é sacanagem;
    const y = this.y + (this.h / 2) - ((8 * spriteScale) / 2) + 1;

    render.drawSprite(
      "sprite", spriteScale, x, y,
      items[this.name].atlasCoord.normal.x, items[this.name].atlasCoord.normal.y
    );
  }
}


//! que confusão nessas coordenadas
class CraftMenu {
  public cols = 5; public rows = 7;
  public btnSize = 8 * 6;
  public w = this.btnSize * 7; public h = this.btnSize * 7;
  public x = (render.size.w / 2) + 15;
  public y = (render.size.h / 2) - ((this.btnSize * 3) / 2);
  public craftButtons: Array<Array<ItemButton>> = [[], [], []];
  public tabButtons: Array<ItemButton> = [];
  public actualTab = 0;

  constructor() {
    // render.addResizeListener(() => {
    //   this.x = (render.size.w / 2) + 5;
    //   this.y = (render.size.h / 2) - ((this.btnSize * 3) / 2);

    //   // this.craftButtons.forEach((btnGrid) => {
    //   //   btnGrid.forEach((btn) => {

    //   //   });
    //   // });

    //   let index = 0;
    //   for (let y = 0; y < this.cols; y++) {
    //     for (let x = 0; x < this.rows; x++) {
    //       const btn = this.craftButtons[0][index];

    //       if (btn !== undefined) {
    //         btn.x = this.x + (x * this.btnSize);
    //         btn.y = this.y + (y * this.btnSize);
    //       }
    //     }

    //     index++;
    //   }

    //   index = 0;
    //   for (let y = 0; y < this.cols; y++) {
    //     for (let x = 0; x < this.rows; x++) {
    //       const btn = this.craftButtons[1][index];

    //       if (btn !== undefined) {
    //         btn.x = this.x + (x * this.btnSize);
    //         btn.y = this.y + (y * this.btnSize);
    //       }
    //     }

    //     index++;
    //   }

    //   index = 0;
    //   for (let y = 0; y < this.cols; y++) {
    //     for (let x = 0; x < this.rows; x++) {
    //       const btn = this.craftButtons[2][index];

    //       if (btn !== undefined) {
    //         btn.x = this.x + (x * this.btnSize);
    //         btn.y = this.y + (y * this.btnSize);
    //       }
    //     }

    //     index++;
    //   }
    // });

    const namesArrayZero: Array<string> = [
      "wood_chest", "", "", "", "", "", "",
      "transport_belt", "underground_belt", "splitter", "", "", "", "",
      "inserter", "", "", "", "", "", "",
      "stone_furnace", "steel_furnace", "burner_mining_drill", "", "", "", "",
      "assembly_machine", "", "", "", "", "", "",
    ];

    let index = 0;
    for (let y = 0; y < this.cols; y++) {
      for (let x = 0; x < this.rows; x++) {
        if (namesArrayZero[index] !== "" && items[namesArrayZero[index]] !== undefined) {
          this.craftButtons[0].push(
            new ItemButton(namesArrayZero[index], this.x + (x * this.btnSize), this.y + (y * this.btnSize), this.btnSize, this.btnSize)
          );
        }

        index++;
      }
    }

    const namesArrayOne: Array<string> = [
      "green_circuit", "red_circuit", "blue_circuit", "", "", "", "",
      "copper_plate", "iron_plate", "stone_brick", "steel", "plastic_bar", "sulfur", "",
      "gear", "copper_wire", "", "", "", "", "",
      "", "", "", "", "", "", "",
      "", "", "", "", "", "", "",
    ];

    index = 0;
    for (let y = 0; y < this.cols; y++) {
      for (let x = 0; x < this.rows; x++) {
        if (namesArrayOne[index] !== "" && items[namesArrayOne[index]] !== undefined) {
          this.craftButtons[1].push(
            new ItemButton(namesArrayOne[index], this.x + (x * this.btnSize), this.y + (y * this.btnSize), this.btnSize, this.btnSize)
          );
        }

        index++;
      }
    }

    const namesArrayTwo: Array<string> = [
      "wood", "copper_ore", "iron_ore", "stone_ore", "coal_ore", "uranium_ore", "",
      "research_lab", "", "", "", "", "", "",
      "", "", "", "", "", "", "",
      "", "", "", "", "", "", "",
      "red_cience", "green_cience", "blue_cience", "black_cience", "white_cience", "", "",
    ];

    index = 0;
    for (let y = 0; y < this.cols; y++) {
      for (let x = 0; x < this.rows; x++) {
        if (namesArrayTwo[index] !== "" && items[namesArrayTwo[index]] !== undefined) {
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
    render.drawPanel(
      this.x, this.y - 24 * 4, this.w, this.h, "blue", "darkBlue",
      new Label("Crafting", "white", "white", { x: 1, y: 1 })
    )

    this.tabButtons.forEach((tab) => {
      tab.draw(7, false);
    });

    this.craftButtons[this.actualTab].forEach((btn) => {
      btn.draw(5, false);
    });

    render.drawGrid(
      this.x, this.tabButtons[0].y, 1, 3, "white", "white", 112, 96
    );
    render.drawGrid(
      this.x, this.y, this.cols, this.rows, "white", "white", this.btnSize, this.btnSize
    );
  }

  drawRecipeWidget(hitX: number, hitY: number): void {
    this.craftButtons[this.actualTab].forEach((btn) => {
      if (btn.isHovered(hitX, hitY)) {
        let largerSize = render.context.measureText(items[btn.name].fancyName).width + 10;

        if (recipes[btn.name]) {
          for (let index = 0; index < recipes[btn.name].ingredients.length; index++) {
            if (render.context.measureText(`${items[recipes[btn.name].ingredients[index].name].fancyName}`).width + 10 + (4 * 8) > largerSize) {
              largerSize = render.context.measureText(`${items[recipes[btn.name].ingredients[index].name].fancyName}`).width + 10 + (4 * 8);
            }
          }

          render.drawPanel(
            hitX + 20, hitY + 50,
            largerSize, (recipes[btn.name].ingredients.length * 30),
            "blue", "darkBlue",
            new Label(items[btn.name].fancyName, "white", "white", { x: 1, y: 1 })
          );

          for (let index = 0; index < recipes[btn.name].ingredients.length; index++) {
            render.drawText(
              `${items[recipes[btn.name].ingredients[index].name].fancyName}`,
              hitX + 22, hitY + 50 + (index * 30),
              20, "white", "top", "left"
            );

            render.drawItemStack(
              recipes[btn.name].ingredients[index].name,
              3, hitX + 20 + largerSize - (3 * 8), hitY + 50 + (index * 30),
              recipes[btn.name].ingredients[index].quant, true
            );
          }
        }

        return;
      }
    });
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
          this.craftToPlayerInv(btn.name, 1);
          return;
        }
      });
    }
  }

  craftToPlayerInv(itemName: string, quant: number): boolean {
    //TODO create a version who can be used for every craft, not just for playerInv

    if (recipes[itemName] !== undefined) {
      const toBeRemoved: { [item: string]: number } = {};
      const toBeAdded: { [item: string]: number } = {};

      const stack: Array<{ name: string, quant: number }> = [];

      recipes[itemName].ingredients.forEach((ing) => {
        stack.push({ name: ing.name, quant: ing.quant * quant });
      });

      let iterations = 0;
      const maxIterations = 100;

      while (stack.length > 0 && iterations <= maxIterations) {
        const current = stack.pop() as { name: string, quant: number };
        const recipe = recipes[current.name];

        if (recipe === undefined) {
          toBeRemoved[current.name] = (toBeRemoved[current.name] || 0) + current.quant;
        }
        else {
          if (playerInv.hasStack(current.name, current.quant)) {
            toBeRemoved[current.name] = (toBeRemoved[current.name] || 0) + current.quant;
          }
          else {
            const times = Math.ceil(current.quant / recipe.outputQuant);
            const totalProduced = recipe.outputQuant * times;
            const surplus = totalProduced - current.quant;

            if (surplus > 0) {
              toBeAdded[current.name] = (toBeAdded[current.name] || 0) + surplus;
            }

            recipe.ingredients.forEach((ing) => {
              stack.push({ name: ing.name, quant: ing.quant * times });
            });
          }
        }

        iterations++;
      }

      if (iterations >= maxIterations) {
        console.error("Iterações máximas atingidas; algo pode estar errado com as receitas.");
        return false;
      }

      for (const item in toBeRemoved) {
        if (!playerInv.hasStack(item, toBeRemoved[item])) {
          return false;
        }
      }

      for (const item in toBeRemoved) {
        playerInv.removeStack(0, item, toBeRemoved[item], true);
      }

      //! Obs: Pode ser que o item principal também tenha sobras se produzido por receita,
      // mas assumimos que a lógica acima já acumulou o excedente em toBeAdded.
      playerInv.depositStack(0, itemName, recipes[itemName].outputQuant * quant, true);

      for (const item in toBeAdded) {
        playerInv.depositStack(0, item, toBeAdded[item], true);
      }

      return true;
    }

    return false;
  }
}


const craftMenu = new CraftMenu();
export default craftMenu;