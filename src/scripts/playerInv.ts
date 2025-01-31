import render from "../engine/render.js";
import cursor from "../engine/cursor.js";
import Inventory from "./inventory.js";
import { items } from "./definitions.js";


//! need a refactoring


const cols = 7;
const rows = 7;
const slotSize = 8 * 6;
const w = slotSize * cols;
const h = slotSize * rows;
const x = (render.size.w / 2) - w - 5;
const y = (render.size.h / 2) - (h / 2);
class PlayerInv extends Inventory {
  constructor() {
    super(
      "Inventory", x, y, rows, cols, slotSize, w, h
    );

    render.addResizeListener(() => {
      this.moveTo(
        (render.size.w / 2) - w - 5,
        (render.size.h / 2) - (h / 2)
      );
    });
  }

  handleClick(x: number, y: number): void {
    const slot = this.getHoveredSlot(x, y);

    if (slot !== undefined) {
      /*
        if key(64) then
          local ent = ui.active_window and ENTS[ui.active_window.ent_key] or false
          if slot and ent and self.slots[slot.index].id ~= 0 and ui.active_window and ent.deposit_stack then
            local old_stack = {id = self.slots[slot.index].id, count = self.slots[slot.index].count}
            local deposited, stack = ent:deposit_stack(old_stack, false)
            if deposited then
              ui.new_alert(cursor.x, cursor.y, '-' .. self.slots[slot.index].count - stack.count .. ' ' .. ITEMS[old_stack.id].fancy_name, 1000, 0, 2)
              self.slots[slot.index].id = stack.id
              self.slots[slot.index].count = stack.count
              sound('deposit')
              return true
            end
          end

          if slot.index >= 57 and self.slots[slot.index].id > 0 then
            local stack = {id = self.slots[slot.index].id, count = self.slots[slot.index].count}
            self.slots[slot.index].id = 0
            self.slots[slot.index].count = 0
            local res, stack = self:add_item(stack, 0)
            if stack then
              self.slots[slot.index].id = stack.id
              self.slots[slot.index].count = stack.count
            end
          end
        end

      if index == cursor.item_stack.slot then return end

      if (cursor.type === 'item' && index !== cursor.itemStack.index) {
        const old_item = this.slots.get(index);
        self.slots[cursor.item_stack.slot].id = self.slots[index].id
        self.slots[cursor.item_stack.slot].count = self.slots[index].count
        self.slots[index].id = cursor.item_stack.id
        self.slots[index].count = cursor.item_stack.count
        cursor.setItem();
        return;
      }
      */

      if (cursor.type === 'item') {
        if (slot.itemName === "") {
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
        else if (slot.itemName == cursor.itemStack.name) {
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
              const stack = { name: slot.itemName, quant: slot.quant };
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
          const invStack = { itemName: slot.itemName, quant: slot.quant };
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

            cursor.setItem({ name: slot.itemName, quant: remainder });
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
}


const playerInv = new PlayerInv();
export default playerInv;