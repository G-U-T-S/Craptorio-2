import render from "./render.js";
import cursor from "./cursor.js";
import Label from "./label.js";


class Inventory {
  readonly slotSize = 8 * 4;
  readonly rows = 8; readonly colomns = 8;
  readonly w = this.slotSize * this.colomns;
  readonly h = this.slotSize * this.rows;
  readonly x = (render.size.w / 2) - (this.w / 2);
  readonly y = (render.size.h / 2) - (this.h / 2);
  public slots = new Map<number, {x: number, y: number, itemName: string, quant: number}>();
  public visible = false;

  constructor() {
    let quant = 0;
    for (let x = 0; x < this.colomns; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.slots.set(
          quant, {x: this.x + (x * this.slotSize),y: this.y + (y * this.slotSize), itemName: "", quant: -1}
        );
        
        quant++;
      } 
    }
  }
  
  draw(): void {
    const slotIndex = this.getHoveredSlotIndex(cursor.x, cursor.y);
    // local hx, hy = self.x, self.hotbar_y
    if (this.visible) {
      render.drawPanel(this.x, this.y, this.w, this.h, "blue", "blue", "drakBlue", new Label("Inventory", "black", "white", {x: 1, y: 1}));
      render.drawGrid(this.x, this.y, this.rows, this.colomns, "white", "white", this.slotSize, false, false);
    
      this.slots.forEach((slot) => {
        if (slot.itemName !== "") {
          render.drawItemStack(slot.x, slot.y, slot.quant, true);
        }
      });
      // for (let i = 0; i < this.rows; i++) {
        // for (let j = 0; j < this.colomns; j++) {
          // const index = ((i-1) * this.colomns) + j;
          // local x, y = self.x + self.grid_x + ((j - 1) * (INVENTORY_SLOT_SIZE + 1)), self.y + self.grid_y + ((i-1) * (INVENTORY_SLOT_SIZE + 1))
          
          // if self.slots[index] and self.slots[index].id ~= 0 then
          //   local item = ITEMS[self.slots[index].id]
          //   draw_item_stack(x, y, {id = self.slots[index].id, count = self.slots[index].count})
          // end
          
          // if index-56 == self.active_slot then
          //   ui.highlight(x-1, y-1, INVENTORY_SLOT_SIZE, INVENTORY_SLOT_SIZE, true, 3, 4)
          // end
      //   }
      // }
    
    //   if slot then
    //     ui.highlight(slot.x - 1, slot.y - 1, INVENTORY_SLOT_SIZE, INVENTORY_SLOT_SIZE, false, 3, 4)
    //   end
    
    //   local x, y = hx + ((self.active_slot - 1) * (INVENTORY_SLOT_SIZE+1)), hy + offset - 1
    //    ui.highlight(x, y, INVENTORY_SLOT_SIZE, INVENTORY_SLOT_SIZE, true, 3, 4)
    //    if cursor.type == 'item' and cursor.item_stack and cursor.item_stack.id ~= 0 and self:is_hovered(cursor.x, cursor.y) then
    //     draw_item_stack(cursor.x + 5, cursor.y + 5, cursor.item_stack)
    //   end
    }
    
    // if self.hotbar_vis and not self.vis then
    //   ui.draw_panel(hx, hy, self.w, INVENTORY_SLOT_SIZE + 4, self.bg, self.fg, false, 8)
    //   ui.draw_grid(hx + 1, hy + 1, 1, INVENTORY_COLS, self.grid_bg, self.grid_fg, INVENTORY_SLOT_SIZE+1)
    //   for col = 1, INVENTORY_COLS do
    //     local x, y = hx + ((col-1) * (INVENTORY_SLOT_SIZE+1)), hy + 4
    //     if alt_mode then prints(col, x + 5, y - 1, 0, 13) end
    //     local id, count = self.slots[INV_HOTBAR_OFFSET + col].id, self.slots[INV_HOTBAR_OFFSET + col].count
    //     if id ~= 0 then
    //       draw_item_stack(x + 2, hy + 2, {id = id, count = count})
    //     end
    //     if col == self.active_slot then
    //       ui.highlight(x+1, hy+1, INVENTORY_SLOT_SIZE, INVENTORY_SLOT_SIZE, true, 3, 4)
    //     end
    //   end
    //   local xx = (INVENTORY_SLOT_SIZE * INVENTORY_COLS) + INVENTORY_SLOT_SIZE - 2
    //   pix(self.x + self.grid_x, hy + 1, self.grid_fg)
    //   pix(self.x + self.grid_x, hy + INVENTORY_SLOT_SIZE, self.grid_fg)
    //   pix(self.x + self.grid_x + xx, hy + 1, self.grid_fg)
    //   pix(self.x + self.grid_x + xx, hy + INVENTORY_SLOT_SIZE, self.grid_fg)
    //   if cursor.type == 'item' and cursor.item_stack and cursor.item_stack.id ~= 0 and self:is_hovered(cursor.x, cursor.y) then
    //     draw_item_stack(cursor.x + 5, cursor.y + 5, cursor.item_stack)
    //   end
    // end
  
    // if slot and self.slots[slot.index].id ~= 0 then
    //   if self.vis or (self.hotbar_vis and slot.index >= 57) then
    //     if key(64) then draw_recipe_widget(cursor.x + 5, cursor.y + 5, self.slots[slot.index].id) end
    //   end
    // end
  }

  getHoveredSlotIndex(x: number, y: number): number | undefined {
    // local start_x = self.x + self.grid_x
    // local start_y = self.y + self.grid_y
    
    // local rel_x = x - start_x
    // local rel_y = y - start_y
    
    // local slot_x = math.floor(rel_x / (INVENTORY_SLOT_SIZE + 1))
    // local slot_y = math.floor(rel_y / (INVENTORY_SLOT_SIZE + 1))
    
    // local slot_pos_x = start_x + slot_x * (INVENTORY_SLOT_SIZE + 1)
    // local slot_pos_y = start_y + slot_y * (INVENTORY_SLOT_SIZE + 1)
    // local slot_index = slot_y * INVENTORY_ROWS + slot_x + 1
    // if slot_x >= 0 and slot_x < INVENTORY_COLS and slot_y >= 0 and slot_y < INVENTORY_ROWS then
    //   return {x = slot_pos_x, y = slot_pos_y, index = slot_index}
    // else
    //   return nil
    // end

    return undefined;
  }
}


const inv = new Inventory();
export default inv;