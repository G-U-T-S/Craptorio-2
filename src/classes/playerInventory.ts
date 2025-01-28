/*

import render from "./render.js";
import cursor from "./cursor.js";
import Label from "./label.js";
import { items } from "./definitions.js";


class Inventory {
  readonly offSet = 8;
  readonly slotSize = (8 * 6) + this.offSet;
  readonly rows = 8; readonly colomns = 8;
  readonly w = this.slotSize * this.colomns;
  readonly h = this.slotSize * this.rows;
  readonly x = (render.size.w / 2) - (this.w / 2);
  readonly y = (render.size.h / 2) - (this.h / 2);
  public slots = new Map<number, {x: number, y: number, itemName: string, quant: number}>();
  public hotbarSlots = new Map<number, {x: number, y: number, itemName: string, quant: number}>();
  public visible = false;
  public hotbarVisible = true;

  constructor() {
    let index = 0;
    for (let x = 0; x < this.colomns; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.slots.set(
          index, {x: this.x + (x * this.slotSize),y: this.y + (y * this.slotSize), itemName: "", quant: 0}
        );
        
        index++;
      }
    }

    index = 0;
    const hx = render.center.x - (this.w / 2);
    const hy = render.size.h - (this.slotSize + 4);
    for (let x = 0; x < this.colomns; x++) {
      this.hotbarSlots.set(
        index, {x: hx + (x * this.slotSize),y: hy, itemName: "", quant: 0}
      );
      
      index++;
    }
  }
  
  draw(): void {
    const slot = this.getHoveredSlot(cursor.x, cursor.y);
    
    if (this.visible) {
      render.drawPanel(this.x, this.y, this.w, this.h, "blue", "blue", "drakBlue", );
      render.drawGrid(this.x, this.y, this.rows, this.colomns, "white", "white", this.slotSize, false, false);
    
      this.slots.forEach((slot) => {
        if (slot.itemName !== "") {
          render.drawItemStack(slot.itemName, 5, slot.x + this.offSet + 2, slot.y + this.offSet + 2, slot.quant, true);
        }
      });
    
    //   local x, y = hx + ((self.active_slot - 1) * (INVENTORY_SLOT_SIZE+1)), hy + offset - 1
    //    ui.highlight(x, y, INVENTORY_SLOT_SIZE, INVENTORY_SLOT_SIZE, true, 3, 4)
    //    if cursor.type == 'item' and cursor.item_stack and cursor.item_stack.id ~= 0 and self:is_hovered(cursor.x, cursor.y) then
    //     draw_item_stack(cursor.x + 5, cursor.y + 5, cursor.item_stack)
    //   end
    }
    
    if (this.hotbarVisible) {
      const hx = render.center.x - (this.w / 2);
      const hy = render.size.h - (this.slotSize + 4);

      render.drawPanel(
        hx, hy,
        this.w, this.slotSize + 4, "blue", "blue", "darkBlue"
      )
      render.drawGrid(hx, hy, 1, this.colomns, "white", "white", this.slotSize)
      
      this.hotbarSlots.forEach((slot) => {
        if (slot.itemName !== "") {
          render.drawItemStack(slot.itemName, 5, slot.x + this.offSet + 2, slot.y + this.offSet + 2, slot.quant, true);
        }
      });
    }
  
    // TODO
    // if slot and self.slots[slot.index].id ~= 0 then
    //   if self.vis or (self.hotbar_vis and slot.index >= 57) then
    //     if key(64) then draw_recipe_widget(cursor.x + 5, cursor.y + 5, self.slots[slot.index].id) end
    //   end
    // end
  }

  getHoveredSlot(x: number, y: number): {target: "hotbar" | "inventory", index: number} | undefined {
    let result: {target: "hotbar" | "inventory", index: number} | undefined = undefined;
    
    this.slots.forEach((slot, index) => {
      if (cursor.x >= slot.x && cursor.x <= (slot.x + this.slotSize) && cursor.y >= slot.y && cursor.y <= (slot.y + this.slotSize)) {
        result = {target: "inventory", index: index};
      }
    });
    
    this.hotbarSlots.forEach((slot, index) => {
      if (cursor.x >= slot.x && cursor.x <= (slot.x + this.slotSize) && cursor.y >= slot.y && cursor.y <= (slot.y + this.slotSize)) {
        result = {target: "hotbar", index: index};
      }
    });

    return result;
  }

  isHovered(x: number, y: number): boolean {
    if (this.visible && x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h) {
      return true;
    }

    const hx = render.center.x - (this.w / 2);
    const hy = render.size.h - (this.slotSize + 4);
    if (x >= hx && x <= hx + this.w && y >= hy && y <= hy + this.slotSize + 4) {
      return true;
    }
    
    return false;
  }

  click(x: number, y: number): boolean {
    const slot = this.getHoveredSlot(x, y);
    
    if (slot !== undefined) {
    //   if key(64) then
    //     local ent = ui.active_window and ENTS[ui.active_window.ent_key] or false
    //     if slot and ent and self.slots[slot.index].id ~= 0 and ui.active_window and ent.deposit_stack then
    //       local old_stack = {id = self.slots[slot.index].id, count = self.slots[slot.index].count}
    //       local deposited, stack = ent:deposit_stack(old_stack, false)
    //       if deposited then
    //         ui.new_alert(cursor.x, cursor.y, '-' .. self.slots[slot.index].count - stack.count .. ' ' .. ITEMS[old_stack.id].fancy_name, 1000, 0, 2)
    //         self.slots[slot.index].id = stack.id
    //         self.slots[slot.index].count = stack.count
    //         sound('deposit')
    //         return true
    //       end
    //     end

    //     if slot.index >= 57 and self.slots[slot.index].id > 0 then
    //       local stack = {id = self.slots[slot.index].id, count = self.slots[slot.index].count}
    //       self.slots[slot.index].id = 0
    //       self.slots[slot.index].count = 0
    //       local res, stack = self:add_item(stack, 0)
    //       if stack then
    //         self.slots[slot.index].id = stack.id
    //         self.slots[slot.index].count = stack.count
    //       end
    //     end
    //   end

      this.slotClick(slot.index, slot.target);
      
      return true;
    }
    
    return false;
  }

  private slotClick(index: number, target: "hotbar" | "inventory"): void {
    let slot: {x: number; y: number; itemName: string; quant: number;} | undefined;
      
    if (target === "inventory") {
      slot = this.slots.get(index);
    }
    else if (target === "hotbar") {
      slot = this.hotbarSlots.get(index);
    }
    
    
    // if index == cursor.item_stack.slot then return end
    
    // if (cursor.type === 'item' && index !== cursor.itemStack.index) {
    //   const old_item = this.slots.get(index);
    //   self.slots[cursor.item_stack.slot].id = self.slots[index].id
    //   self.slots[cursor.item_stack.slot].count = self.slots[index].count
    //   self.slots[index].id = cursor.item_stack.id
    //   self.slots[index].count = cursor.item_stack.count
    //   cursor.setItem();
    //   return;
    // }

    if (cursor.type === 'item') {
      if (slot?.itemName === "") {
        // --deposit
        slot.itemName = cursor.itemStack.name;

        if (cursor.r) {
          slot.quant += 1;
          cursor.itemStack.quant = cursor.itemStack.quant - 1;
          
          if (cursor.itemStack.quant < 1) {
            cursor.setItem();
          }
        }
        else if (cursor.l) {
          slot.quant = cursor.itemStack.quant;
          
          // if (cursor.item_stack.slot and cursor.item_stack.slot ~= index) {
          //   self.slots[cursor.item_stack.slot].id = 0
          //   self.slots[cursor.item_stack.slot].count = 0
          // }
          
          cursor.setItem();
        }
      }
      else if (slot?.itemName == cursor.itemStack.name) {
        if (cursor.r) {
          if (slot.quant < items[slot.itemName].stackSize) {
            slot.quant += 1;
            cursor.itemStack.quant = cursor.itemStack.quant - 1;
            
            if (cursor.itemStack.quant < 1) {
              cursor.setItem();
            }
            
            return;
          }
        }
        else if (cursor.l) {
          //--swap held partial stack with full stack
          if (slot.quant == items[slot.itemName].stackSize) {
            const stack = {name: slot.itemName, quant: slot.quant};
            slot.quant = cursor.itemStack.quant;
            cursor.itemStack.name = stack.name;
            cursor.itemStack.quant = stack.quant;
          }
          else if (slot.quant + cursor.itemStack.quant <= items[slot.itemName].stackSize) {
            slot.quant += cursor.itemStack.quant
            cursor.itemStack.quant = 0;
          }
          else if (slot.quant < items[slot.itemName].stackSize) {
            const diff = items[slot.itemName].stackSize - slot.quant;
            cursor.itemStack.quant = cursor.itemStack.quant - diff;
            slot.quant = items[slot.itemName].stackSize;
          }

          if (cursor.itemStack.quant < 1) {
            cursor.setItem();
          }

          return;
        }
      }
      else if (slot !== undefined) {
        // --swap stacks
        const invStack = {itemName: slot.itemName, quant: slot.quant};
        slot.itemName = cursor.itemStack.name;
        slot.quant = cursor.itemStack.quant;
        cursor.itemStack.name = invStack.itemName;
        cursor.itemStack.quant = invStack.quant;
        cursor.type = 'item';
        // cursor.item = ITEMS[inv_item.id].name
      }
    }
    else if (cursor.type === 'pointer') {
      if (slot !== undefined && slot.itemName !== "") {
        if (cursor.r && slot.quant > 1) {
          const half = Math.floor(slot.quant / 2);
          const remainder = slot.quant - half;

          cursor.setItem({name: slot.itemName, quant: remainder});
          slot.quant = half;
          
          return;
        }
      //   --try to move to hotbar first
      //   if index < 57 and key(64) then
      //     local stack = {id = id, count = count}
      //     self.slots[index].id = 0
      //     self.slots[index].count = 0
      //     local res, stk = self:add_item(stack, 1)
      //     if res then
      //       return true
      //     else
      //       self.slots[index].id = stk.id
      //       self.slots[index].count = stk.count
      //     end
      //     return true
      //   end
        
        cursor.itemStack.name = slot.itemName;
        cursor.itemStack.quant = slot.quant;
        cursor.type = 'item';
        slot.itemName = "";
        slot.quant = 0;
      }
    }
  }
}


const inv = new Inventory();
export default inv;

*/