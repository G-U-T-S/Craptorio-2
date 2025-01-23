import render from "./render.js";
import cursor from "./cursor.js";
import Label from "./label.js";


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
          index, {x: this.x + (x * this.slotSize),y: this.y + (y * this.slotSize), itemName: "", quant: -1}
        );
        
        index++;
      } 
    }

    index = 0;
    const hx = render.center.x - (this.w / 2);
    const hy = render.size.h - (this.slotSize + 4);
    for (let x = 0; x < this.colomns; x++) {
      this.hotbarSlots.set(
        index, {x: hx + (x * this.slotSize),y: hy, itemName: "", quant: -1}
      );
      
      index++;
    }
  }
  
  draw(): void {
    const slot = this.getHoveredSlot(cursor.x, cursor.y);
    
    if (this.visible) {
      render.drawPanel(this.x, this.y, this.w, this.h, "blue", "blue", "drakBlue", new Label("Inventory", "black", "white", {x: 1, y: 1}));
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

  click(x: number, y: number): boolean {
    const result = this.getHoveredSlot(x, y);
    if (result !== undefined) {
    //   if key(64) then
    //     local ent = ui.active_window and ENTS[ui.active_window.ent_key] or false
    //     if result and ent and self.slots[result.index].id ~= 0 and ui.active_window and ent.deposit_stack then
    //       local old_stack = {id = self.slots[result.index].id, count = self.slots[result.index].count}
    //       local deposited, stack = ent:deposit_stack(old_stack, false)
    //       if deposited then
    //         ui.new_alert(cursor.x, cursor.y, '-' .. self.slots[result.index].count - stack.count .. ' ' .. ITEMS[old_stack.id].fancy_name, 1000, 0, 2)
    //         self.slots[result.index].id = stack.id
    //         self.slots[result.index].count = stack.count
    //         sound('deposit')
    //         return true
    //       end
    //     end

    //     if result.index >= 57 and self.slots[result.index].id > 0 then
    //       local stack = {id = self.slots[result.index].id, count = self.slots[result.index].count}
    //       self.slots[result.index].id = 0
    //       self.slots[result.index].count = 0
    //       local res, stack = self:add_item(stack, 0)
    //       if stack then
    //         self.slots[result.index].id = stack.id
    //         self.slots[result.index].count = stack.count
    //       end
    //     end
    //   end

      this.slotClick(result.index, result.target);
      
      return true
    }
    
    return false;
  }

  private slotClick(index: number, target: "hotbar" | "inventory") {
    let slot: {x: number; y: number; itemName: string; quant: number;} | undefined;
      
    if (target === "inventory") {
      slot = this.slots.get(index);
    }
    else if (target === "hotbar") {
      slot = this.hotbarSlots.get(index);
    }
    
    
    // if index == cursor.item_stack.slot then return end
    
    // if cursor.type == 'item' and cursor.item_stack.slot and index ~= cursor.item_stack.slot then
    //   local old_item = self.slots[index]
    //   self.slots[cursor.item_stack.slot].id = self.slots[index].id
    //   self.slots[cursor.item_stack.slot].count = self.slots[index].count
    //   self.slots[index].id = cursor.item_stack.id
    //   self.slots[index].count = cursor.item_stack.count
    //   set_cursor_item()
    //   return
    // end

    if (cursor.type === 'item') {
      if (slot?.itemName === "") {
        // --deposit
        slot.itemName = cursor.itemStack.name;

        if (cursor.r) {
          slot.quant = 1;
          cursor.itemStack.quant = cursor.itemStack.quant - 1;
          
          if (cursor.itemStack.quant < 1) {
            cursor.setItem();
          }
        }
        else {
          slot.quant = cursor.itemStack.quant;
          
          // if (cursor.item_stack.slot and cursor.item_stack.slot ~= index) {
          //   self.slots[cursor.item_stack.slot].id = 0
          //   self.slots[cursor.item_stack.slot].count = 0
          // }
          
          cursor.setItem();
        }
      }
    }

    //   elseif self.slots[index].id == cursor.item_stack.id then
    //     if cursor.r then
    //       if self.slots[index].count < ITEMS[self.slots[index].id].stack_size then
    //         self.slots[index].count = self.slots[index].count + 1
    //         cursor.item_stack.count = cursor.item_stack.count - 1
    //         if cursor.item_stack.count < 1 then
    //           set_cursor_item()
    //         end
    //         return true
    //       end
    //     end

    //     local item = ITEMS[self.slots[index].id]
    //     --swap held partial stack with full stack
    //     if self.slots[index].count == item.stack_size then
    //       local stack = {id = self.slots[index].id, count = self.slots[index].count}
    //       self.slots[index].count = cursor.item_stack.count
    //       cursor.item_stack = stack
    //     elseif self.slots[index].count + cursor.item_stack.count <= item.stack_size then
    //       self.slots[index].count = self.slots[index].count + cursor.item_stack.count
    //       cursor.item_stack.count = 0
    //     elseif self.slots[index].count < item.stack_size then
    //       local diff = item.stack_size - self.slots[index].count
    //       cursor.item_stack.count = cursor.item_stack.count - diff
    //       self.slots[index].count = item.stack_size
    //     end

    //     if cursor.item_stack.count <= 0 then
    //       cursor.item_stack = {id = 0, count = 0}
    //       cursor.type = 'pointer'
    //     end
    //   else
    //     --swap stacks
    //     local inv_item = {id = self.slots[index].id, count = self.slots[index].count}
    //     self.slots[index].id = cursor.item_stack.id
    //     self.slots[index].count = cursor.item_stack.count
    //     cursor.item_stack = {id = inv_item.id, count = inv_item.count, slot = false}
    //     cursor.type = 'item'
    //     cursor.item = ITEMS[inv_item.id].name
    //   end
    else if (cursor.type === 'pointer') {
      if (slot !== undefined && slot.itemName !== "") {
      //   if cursor.r and not cursor.lr then
      //     set_cursor_item({id = id, count = math.ceil(count/2)}, false)
      //     self.slots[index].count = math.floor(count/2)
      //     return true
      //   end
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
}


const inv = new Inventory();
export default inv;