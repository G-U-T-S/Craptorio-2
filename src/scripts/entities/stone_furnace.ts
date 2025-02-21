import render from "../../engine/render.js";
import Label from "../label.js";
import { items } from "../definitions.js";
import BaseEntity from "./base_entity.js";


export default class StoneFurnace extends BaseEntity {
  static readonly tickRate = 5;
  static readonly animTickRate = 9;
  static readonly animMaxTick = 2;
  static readonly bufferOuput = 100;
  static readonly smeltTime = 3 * 60;

  public fuelBuffer = { name: "", quant: 0 };
  public inputBuffer = { name: "iron_ore", quant: 10 };
  public outputBuffer = { name: "", quant: 0 };
  public fuelTime = 0;
  public smeltTimer = 0;
  public lastFuel = "";
  public oreType = "";
  public isSmelting = false;

  constructor(globalPos: { x: number, y: number }) {
    super("stone_furnace", { ...globalPos });

    this.showWindowCall = () => { this.showWindow() };
  }

  public update(): void {
    //   --update fuel ticks
    if (this.fuelTime > 0) {
      this.fuelTime -= StoneFurnace.tickRate;
    }

    if (this.fuelTime <= 0) {
      // --if we run out of fuel_time, check fuel_buffer to re-fuel self
      if (this.isSmelting) {
        if (this.fuelBuffer.quant > 0) {
          this.fuelBuffer.quant -= 1;

          //! isso aqui é eu assumindo que sempre vai ser um numero
          this.fuelTime = items[this.fuelBuffer.name].fuelTime as number;

          this.lastFuel = this.fuelBuffer.name;

          if (this.fuelBuffer.quant == 0) {
            this.fuelBuffer.name = "";
          }
        }
        else {
          // --otherwise we have ran out of fuel completely, so shut-down
          this.isSmelting = false;
        }
      }
    }

    if (this.isSmelting) {
      // --update smelting countdown timer
      this.smeltTimer -= StoneFurnace.tickRate;

      if (this.smeltTimer <= 0) {
        // --smelting operation completed
        // --pop last item from output_buffer to input_buffer
        let smeltedOre = "";

        if (this.inputBuffer.quant > 0 && items[this.inputBuffer.name].smeltedName !== "") {
          smeltedOre = items[this.inputBuffer.name].smeltedName as string;
        }

        this.isSmelting = false;
        if (smeltedOre === "") {
          return;
        }

        if (this.outputBuffer.quant == 0) {
          this.outputBuffer.name = smeltedOre;
          this.inputBuffer.quant -= 1;
          this.outputBuffer.quant += 1;
        }
        else if (this.outputBuffer.quant < items[this.outputBuffer.name].stackSize) {
          this.inputBuffer.quant -= 1;
          this.outputBuffer.quant += 1;
        }

        return;
      }
    }


    // --check for incoming ore
    if (!this.isSmelting && this.inputBuffer.quant > 0 && this.inputBuffer.quant < StoneFurnace.bufferOuput && (this.fuelTime > 0 || this.fuelBuffer.quant > 0)) {
      this.isSmelting = true;
      this.smeltTimer = StoneFurnace.smeltTime;
    }

    if (this.inputBuffer.quant == 0 && this.outputBuffer.quant == 0) {
      this.inputBuffer.name = "";
      this.outputBuffer.name = "";
      this.oreType = "";
    }
  }

  public showWindow() {
    const panelSize = 8 * 6 * 7;
    const panelPos = {
      x: (render.size.w / 2) + 15, y: (render.size.h / 2) - (panelSize / 2)
    };

    //   local fx, fy = x + (w / 2) - 8, y + 19 --furnace icon screen pos
    //   --background window and border
    render.drawPanel(
      panelPos.x, panelPos.y, panelSize, panelSize, "blue", "darkBlue", new Label(items[this.type].fancyName, "black", "white", { x: 1, y: 1 })
    );
    //   -- --close button
    //    sspr(CLOSE_ID, x + w - 9, y + 2, 15)
    //   --input slot
    render.drawRect(panelPos.x, panelPos.y, 8 * 6, 8 * 6, "black");
    if (this.inputBuffer.quant > 0) {
      render.drawItemStack(this.inputBuffer.name, 5, panelPos.x + ((8 * 5) / 5), panelPos.y + ((8 * 5) / 5), this.inputBuffer.quant, true);
    }
    //    --self.input:draw(self.x, self.y, ent.input_buffer)
    //    --box(x + 4, y + 45, 10, 10, 0, fg)
    //    --prints(input.count .. '/' .. FURNACE_BUFFER_INPUT, x + 4, y + 57, 0, 4)
    //   if input.count > 0 then
    //     --sspr(ITEMS[input.id].sprite_id, x + 5, y + 46, ITEMS[input.id].color_key)
    //   end
    //   --smelting progress bar
    //   box(x + 16, y + 47, 42, 5, 0, fg)
    //   if ent.smelt_timer > 0 then
    //     rect(x + 17, y + 48, 40 - remap(ent.smelt_timer, 0, FURNACE_SMELT_TIME, 0, 40), 3, 6)
    //   end
    //   --output slot
    //   box(self.output.x + self.x, self.output.y + self.y, self.output.w, self.output.h, 0, 9)
    //   if ent.output_buffer.count > 0 then
    //     draw_item_stack(self.output.x + self.x + 1, self.output.y + self.y + 1, ent.output_buffer)
    //   end
    //   --self.output:draw(self.x, self.y, ent.output_buffer)
    //   --box(x + w - 14, y + 45, 10, 10, 0, fg)
    //   local text_width = print(output.count .. '/' .. FURNACE_BUFFER_OUTPUT, 0, -10, 0, false, 1, true)
    //   --prints(output.count .. '/' .. FURNACE_BUFFER_OUTPUT, x + w - 4 - text_width, y + 57, 0, 4)
    //   --if output.count > 0 then sspr(ITEMS[output.id].sprite_id, x + w - 13, y + 46, ITEMS[output.id].color_key) end
    //   -- --divider
    //   line(x + 4, y + 65, x + w - 5, y + 65, fg)
    //   -- --fuel slot
    //   --rectb(x + 4, y + 68, 10, 10, fg)
    //   box(self.fuel.x + self.x, self.fuel.y + self.y, self.fuel.w, self.fuel.h, 0, 9)
    //   if ent.fuel_buffer.count > 0 then
    //     draw_item_stack(self.fuel.x + self.x + 1, self.fuel.y + self.y + 1, ent.fuel_buffer)
    //   end
    //   --self.fuel:draw(self.x, self.y, ent.fuel_buffer)
    //   if fuel.count > 0 then
    //     --sspr(ITEMS[fuel.id].sprite_id, x + 5, y + 69, ITEMS[fuel.id].color_key)
    //   else
    //     sspr(FURNACE_FUEL_ICON, x + 5, y + 69, -1)
    //   end
    //   -- --fuel progress bar
    //   box(x + 16, y + 71, 42, 5, 0, fg)
    //   if ent.fuel_time > 0 and ent.last_fuel then
    //     rect(x + 17, y + 72, remap(ent.fuel_time, 0, ITEMS[ent.last_fuel].fuel_time, 0, 40), 3, 2)
    //   end
    //   --prints(fuel.count .. '/' .. FURNACE_BUFFER_FUEL, x + 4, y + 80, 0, 4)
    //   -- --terrain background-------------------------
    //   local sprite_id = FURNACE_ID
    //   for i = -1, 2 do
    //     for j = -3, 4 do
    //       local tile = TileMan.tiles[ent.y + i][ent.x + j]
    //       local tile_id = tile.sprite_id
    //       if tile.ore then
    //         sspr(biomes[tile.biome].tile_id_offset, fx + (j*8), fy + (i*8), -1, 1, 0, tile.rot)
    //         sspr(ores[tile.ore].tile_id, fx + (j*8), fy + (i*8), 4, 1, 0, tile.rot)
    //       elseif tile.is_border and tile.biome == 1 then
    //         sspr(WATER_SPRITE, fx + (j*8), fy + (i*8), -1, 1, 0, tile.rot)
    //         sspr(tile.sprite_id, fx + (j*8), fy + (i*8), 0, 1, 0, tile.rot)
    //       else
    //         sspr(tile.sprite_id, fx + (j*8), fy + (i*8), -1, 1, 0, tile.rot)
    //       end
    //     end
    //   end
    //   -- --terrain border
    //   rectb(fx - 25, fy - 8, 66, 33, fg)
    //   --furnace graphic
    //   ent:draw_sprite(fx, fy, ent.is_smelting)
    //   local hov = self:is_hovered(cursor.x, cursor.y)
    //   if hov and cursor.type == 'item' and cursor.item_stack.id > 0 then
    //     draw_item_stack(cursor.x + 5, cursor.y + 5, {id = cursor.item_stack.id, count = cursor.item_stack.count})
    //   end

    //   if hov then
    //     local slots = {[1] = self.input, [2] = self.output, [3] = self.fuel}
    //     for k, v in ipairs(slots) do
    //       if hovered({x = cursor.x, y = cursor.y}, {x = v.x + self.x, y = v.y + self.y, w = v.w, h = v.h}) then
    //         ui.highlight(self.x + v.x, self.y + v.y, 8, 8, false, 3, 4)
    //       end
    //     end
    //   end

    // end
  }
}