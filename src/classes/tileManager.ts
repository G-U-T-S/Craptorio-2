import { Player } from "./player";


interface Itile {
  visited: boolean; isLand: boolean; biome: number;
  isBorder: boolean; spriteId: number; ore: boolean;
  flip: number; rot: number; borderCol: string
}
export class Tilemanager {
  private tiles: { [index: number]: { [index: number]: Itile}};
  private player: Player; private canvas: HTMLCanvasElement;

  constructor(canvasId: string, player: Player) {
    this.tiles = {};
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.player = player;
  }

  createTile(x: number, y: number): void {
    const scale  = 0.0005;
    const scale2 = 0.025;
    // const base_noise = (simplex.Noise2D(x * scale + offset * scale, (y * scale) + (offset * scale)) / 2 + 0.5) * 100
    // const addl_noise = (simplex.Noise2D(x * scale2 + offset * scale2, (y * scale2) + (offset * scale2))) * 100

    // const base_noise = lerp(base_noise, addl_noise, 0.02);

    // local tile = {
    //   noise = base_noise,
    //   is_land = base_noise >= 20 and true or false,
    //   biome = 1,
    //   --biome = base_noise < 30 and 1 or base_noise < 45 and 2 or 3,
    //   is_border = false,
    //   is_tree = false,
    //   visited = false,
    //   b_visited = false,
    //   rot = 0,
    //   offset = {x = math.random(1, 2), y = math.random(1, 4)},
    // }
    // for i = 1, #biomes do
    //   if base_noise > biomes[i].min and base_noise < biomes[i].max then
    //     tile.biome = i
    //     break
    //   end
    // end
    // tile.flip = math.random() > 0.5 and 1 or 0
    // --If base_noise value is high enough, then try to generate an ore type
    // tile.ore = tile.is_land and base_noise > 21 and ore_sample(x, y, tile) or false
    
    // if not tile.is_land then
    //   --Water tile
    //   tile.color = floor(math.random(2)) + 8
    //   tile.sprite_id = WATER_SPRITE
    //   tile.rot = floor(math.random(0,3))
    // else
    //   tile.sprite_id = biomes[tile.biome].tile_id_offset
    //   tile.color = biomes[tile.biome].map_col
    // end

    // --If ore-generation was successful, then set sprite_id and color
    // if tile.ore then
    //   tile.color = ores[tile.ore].map_cols[floor(math.random(#ores[tile.ore].map_cols))]
    //   tile.rot = math.random(4) % 4
    // end

    // if tile.is_land and not tile.ore then
    //   --Generate clutter based on biome clutter scale, ex grass, rocks, trees, etc
    //   scale = 0.001
    //   local tree = base_noise
    //   --local tree = (simplex.Noise2D((x * scale) + (offset * scale), (y * scale) + (offset * scale)) / 2 + 0.5) * 100
    //   local tmin = biomes[tile.biome].t_min
    //   local tmax = biomes[tile.biome].t_max
    //   --local flip = math.random(0, 1)
    //   --trace('Tspawn try: ' .. biomes[tile.biome].name .. ', tmin: ' .. tmin .. ", tmax" .. tmax .. ', tnoise: ' .. tree .. ', tflip = ' .. flip)
    //   if tree >= biomes[tile.biome].t_min and tree <= biomes[tile.biome].t_max and math.random(0, 100) < (biomes[tile.biome].tree_density * 100) then
    //     --trace('trying to spawn a tree')
    //     tile.is_tree = true
    //     --tile.flip = flip
    //   elseif math.random(100) <= (biomes[tile.biome].clutter * 100) then
    //     local rand = floor(math.random(10))
    //     tile.sprite_id = biomes[tile.biome].tile_id_offset + rand
    //     --tile.flip = math.random(1) > 0.5 and 1 or 0
    //     if rand == 1 then
    //       tile.rot = math.random(4) % 4
    //     end
    //   else
    //     tile.rot = math.random(4) % 4
    //   end
    // end

    // return tile
  }

  drawTerrain(showMiniMap: boolean): void {
    const cameraTopLeftX = this.player.x - this.canvas.width / 2;
    const cameraTopLeftY = this.player.y - this.canvas.height / 2;
    const subTileX = cameraTopLeftX % 8;
    const subTileY = cameraTopLeftY % 8;
    const startX = Math.floor(cameraTopLeftX / 8);
    const startY = Math.floor(cameraTopLeftY / 8);

    for (let screenY = 0; screenY < this.canvas.height; screenY++) {
      for (let screenX = 0; screenX < this.canvas.width; screenX++) {
        const worldX = startX + screenX;
        const worldY = startY + screenY;

        //! a questão aqui é, na implementação original
        //! quando se tenta acessar um tile inexistente, um novo é criado
        if (this.tiles[worldX][worldY] === undefined) {
          this.createTile(worldX, worldY);
        }
        const tile = this.tiles[worldX][worldY];
        //!--------------------------------

        if (!showMiniMap) {
          const sx = (screenX - 1) * 8 - subTileX;
          const sy = (screenY - 1) * 8 - subTileY;

          // if (!tile.visited) { this.autoMap(worldX, worldY); }

          if (tile.ore) {
            // drawRect(sx, sy, 8, 8, this.biomes[tile.biome].map_col)
            //TODO sspr(ores[tile.ore].tile_id, sx, sy, ores[tile.ore].color_keys, 1, 0, tile.rot)
          }
          else if (!tile.isBorder) {
            // const id = tile.sprite_id;
            const rot = tile.rot;
            let flip = tile.flip;

            if (!tile.isLand) {
              
              if (worldX % 2 == 1 && worldY % 2 == 1) {
                flip = 3;// -- Both horizontal and vertical flip
              }
              else if (worldX % 2 == 1) {
                flip = 1;// -- Horizontal flip
              }
              else if (worldY % 2 == 1) {
                flip = 2;// -- Vertical flip
              }

              //TODO sspr(224, sx, sy, 0, 1, flip, rot)
            }
            else {
              // drawRect(sx, sy, 8, 8, this.biomes[tile.biome].map_col);
              //TODO sspr(biomes[tile.biome].tile_id_offset, sx, sy, biomes[tile.biome].map_col, 1, 0, tile.rot)
              // if (id !== this.biomes[tile.biome].tile_id_offset) {
                //TODO sspr(id, sx, sy, biomes[tile.biome].map_col, 1, flip);
              }
            }
          }
          else {
            if (tile.biome === 1) {
              let flip = 0;
              
              if (worldX % 2 == 1 && worldY % 2 == 1) {
                flip = 3;// -- Both horizontal and vertical flip
              }
              else if (worldX % 2 == 1) {
                flip = 1;// -- Horizontal flip
              }
              else if (worldY % 2 == 1) {
                flip = 2;// -- Vertical flip
              }
              
              //TODO sspr(224, sx, sy, -1, 1, flip)
              //TODO sspr(tile.sprite_id, sx, sy, 0, 1, 0, tile.rot)
            }
            else {
              //TODO sspr(tile.sprite_id, sx, sy, -1, 1, 0, tile.rot)
            }
          }
        }
      }
    }
}