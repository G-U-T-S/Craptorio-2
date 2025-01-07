import { Render } from "./render.js";
import { Player } from "./player.js";
import { SimplexNoise2D } from "./noiseGenerator.js";


// const tile = {
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

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}
class Tile {
  public visited: boolean; public isLand: boolean; public biome: number;
  public isBorder: boolean; public atlasCoord: { x: number, y: number }; public ore: number;
  public flip: number; public rot: number; public borderCol: string; public noise: number;

  constructor(noise: number, visited: boolean, isLand: boolean, biome: number, isBorder: boolean, atlasCoord: { x: number, y: number }, ore: number, flip: number, rot: number, borderCol: string) {
    this.noise = noise; this.visited = visited; this.isLand = isLand; this.biome = biome; this.isBorder = isBorder;
    this.atlasCoord = { ...atlasCoord }; this.ore = ore; this.flip = flip; this.rot = rot; this.borderCol = borderCol;
  }
}
export class Tilemanager {
  private tiles: { [index: string]: Tile };//! `x_y`
  private player: Player; private render: Render;
  private simplexNoise: SimplexNoise2D;
  private offset: number;
  private biomes: Array<{
    name: string, tileCoordOffset: { x: number, y: number }, min: number, max: number,
    tMin: number, tMax: number, treeId: number, treeDensity: number,
    colorKey: number, mapCol: string, clutter: number
  }>;
  private ores: Array<{
    name: string, offset: number, id: number, scale: number, min: number, max: number,
    bMin: number, bMax: number, tileAtlasCoord: { x: number, y: number }, spriteAtlasCoord: { x: number, y: number },
    colorKey: number, biomeId: number, mapCols: Array<number>;
  }>;

  constructor(noiseSeed: number, render: Render, player: Player) {
    this.tiles = {};
    this.render = render
    this.player = player;
    this.simplexNoise = new SimplexNoise2D(noiseSeed);
    this.offset = 0;//! não descobri o valor padrão do offset
    this.biomes = [
      {
        name: "Desert", tileCoordOffset: { x: 0, y: 8 }, min: 20, max: 30,
        tMin: 20.5, tMax: 21.5, treeId: 194, treeDensity: 0.05,
        colorKey: 0, mapCol: "white", clutter: 0.01
      },
      {
        name: "Prarie", tileCoordOffset: { x: 0, y: 16 }, min: 30, max: 45,
        tMin: 33, tMax: 40, treeId: 200, treeDensity: 0.075,
        colorKey: 1, mapCol: "white", clutter: 0.09
      },
      {
        name: "Forest", tileCoordOffset: { x: 0, y: 0 }, min: 45, max: 101,
        tMin: 65, tMax: 85, treeId: 197, treeDensity: 0.15,
        colorKey: 1, mapCol: "white", clutter: 0.05
      }
    ];
    this.ores = [
      {
        name: "Iron", offset: 15000, id: 3, scale: 0.011, min: 15, max: 16,
        bMin: 45, bMax: 100, tileAtlasCoord: { x: 0, y: 0 }, spriteAtlasCoord: { x: 24, y: 24 },
        colorKey: 4, biomeId: 2, mapCols: [8, 11, 12, 13, 14, 15]
      },
      {
        name: "Copper", offset: 10000, id: 4, scale: 0.013, min: 15, max: 16,
        bMin: 33, bMax: 65, tileAtlasCoord: { x: 0, y: 0 }, spriteAtlasCoord: { x: 16, y: 24 },
        colorKey: 1, biomeId: 2, mapCols: [2, 3, 4, 15]
      },
      {
        name: "Coal", offset: 50000, id: 6, scale: 0.020, min: 14, max: 17,
        bMin: 35, bMax: 75, tileAtlasCoord: { x: 0, y: 0 }, spriteAtlasCoord: { x: 32, y: 24 },
        colorKey: 4, biomeId: 3, mapCols: [0, 14, 15]
      },
      {
        name: "Stone", offset: 22500, id: 5, scale: 0.018, min: 15, max: 16,
        bMin: 20, bMax: 70, tileAtlasCoord: { x: 0, y: 0 }, spriteAtlasCoord: { x: 8, y: 24 },
        colorKey: 4, biomeId: 1, mapCols: [12, 13, 14, 15]
      },
      {
        name: "Oil Shale", offset: 22500, id: 5, scale: 0.018, min: 15, max: 16,
        bMin: 20, bMax: 70, tileAtlasCoord: { x: 0, y: 0 }, spriteAtlasCoord: { x: 48, y: 24 },
        colorKey: 4, biomeId: 1, mapCols: [12, 13, 14, 15]
      },
      {
        name: "Uranium", offset: 22500, id: 5, scale: 0.018, min: 15, max: 16,
        bMin: 20, bMax: 70, tileAtlasCoord: { x: 0, y: 0 }, spriteAtlasCoord: { x: 40, y: 24 },
        colorKey: 4, biomeId: 1, mapCols: [12, 13, 14, 15]
      }
    ];
  }

  createTile(x: number, y: number): Tile {
    const scale = 0.0005;
    const scale2 = 0.025;
    let baseNoise = (this.simplexNoise.get(x * scale + this.offset * scale, (y * scale) + (this.offset * scale)) / 2 + 0.5) * 100
    const addlNoise = (this.simplexNoise.get(x * scale2 + this.offset * scale2, (y * scale2) + (this.offset * scale2))) * 100
    baseNoise = lerp(baseNoise, addlNoise, 0.02);

    const tile = new Tile(
      baseNoise, false, baseNoise >= 20, 1,
      false, { x: 0, y: 0 }, 0, 0, 0, "green"
    );

    for (let i = 0; i > this.biomes.length; i++) {
      if (baseNoise > this.biomes[i].min && baseNoise < this.biomes[i].max) {
        tile.biome = i;
        break;
      }
    }
    tile.flip = Math.random() > 0.5 ? 1 : 0;
    // --If base_noise value is high enough, then try to generate an ore type
    // tile.ore = tile.isLand && baseNoise > 21 && this.oreSample(x, y, tile.biome, tile.noise);
    if (tile.isLand && baseNoise > 21 && this.oreSample(x, y, tile.biome, tile.noise) !== undefined) {
      tile.ore = this.oreSample(x, y, tile.biome, tile.noise) as number;
    }

    //TODO if (!tile.isLand) {
    //   // --Water tile
    //   tile.color = floor(math.random(2)) + 8;
    //   tile.spriteId = WATER_SPRITE;
    //   tile.rot = floor(math.random(0,3));
    // }
    // else {
    //   tile.spriteId = biomes[tile.biome].tile_id_offset;
    //   tile.color = biomes[tile.biome].map_col;
    // }

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

    return tile
  }

  drawTerrain(showMiniMap: boolean): void {
    const cameraTopLeftX = this.player.x - this.render.canvas.width / 2;
    const cameraTopLeftY = this.player.y - this.render.canvas.height / 2;
    const subTileX = cameraTopLeftX % 8;
    const subTileY = cameraTopLeftY % 8;
    const startX = Math.floor(cameraTopLeftX / 8);
    const startY = Math.floor(cameraTopLeftY / 8);

    for (let screenY = 0; screenY < this.render.canvas.height; screenY++) {
      for (let screenX = 0; screenX < this.render.canvas.width; screenX++) {
        const worldX = startX + screenX;
        const worldY = startY + screenY;

        //! a questão aqui é, na implementação original
        //! quando se tenta acessar um tile inexistente, um novo é criado
        if (this.tiles[`${worldX}_${worldY}`] === undefined) {
          this.tiles[`${worldX}_${worldY}`] = this.createTile(worldX, worldY);
        }
        const tile = this.tiles[`${worldX}_${worldY}`];
        //!--------------------------------

        const sx = (screenX - 1) * 8 - subTileX;
        const sy = (screenY - 1) * 8 - subTileY;

        if (!showMiniMap) {
          //TODO if (!tile.visited) { this.autoMap(worldX, worldY); }

          if (tile.ore) {
            //TODO this.render.drawRect(sx, sy, 8, 8, this.biomes[tile.biome].mapCol, this.biomes[tile.biome].mapCol);
            //sspr(ores[tile.ore].tile_id, sx, sy, ores[tile.ore].color_keys, 1, 0, tile.rot)
            this.render.drawSprite(
              "tiles", sx, sy, this.ores[tile.ore].tileAtlasCoord.x, this.ores[tile.ore].tileAtlasCoord.y,
            );
          }
          else if (!tile.isBorder) {
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
              //TODO this.render.drawRect(sx, sy, 8, 8, this.biomes[tile.biome].mapCol, this.biomes[tile.biome].mapCol);
              //sspr(biomes[tile.biome].tile_id_offset, sx, sy, biomes[tile.biome].map_col, 1, 0, tile.rot)
              this.render.drawSprite(
                "tiles", sx, sy, this.biomes[tile.biome].tileCoordOffset.x, this.biomes[tile.biome].tileCoordOffset.y
              )

              const tileCoordOff = { ...this.biomes[tile.biome].tileCoordOffset };
              if (tile.atlasCoord.x !== tileCoordOff.x && tile.atlasCoord.y !== tileCoordOff.y) {
                this.render.drawSprite("tiles", sx, sy, this.biomes[tile.biome].tileCoordOffset.x, this.biomes[tile.biome].tileCoordOffset.y);
              }
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
            this.render.drawSprite("tiles", sx, sy, tile.atlasCoord.x, tile.atlasCoord.y);
          }
          else {
            //TODO sspr(tile.sprite_id, sx, sy, -1, 1, 0, tile.rot)
          }
        }
      }
    }
  }

  oreSample(x: number, y: number, tilebiome: number, tilenoise: number): number | undefined {
    const tileBiome = tilebiome;
    const tileNoise = tilenoise;
    for (let i = 0; i < this.ores.length; i++) {
      const scale = this.ores[i].scale //-- ((4 - biome)/100)
      const noise = (this.simplexNoise.get(x * scale + ((this.ores[i].offset * tileBiome) * scale) + this.offset * scale, (y * scale) + ((this.ores[i].offset * tileBiome) * scale) + (this.offset * scale)) / 2 + 0.5) * 16

      if (noise >= this.ores[i].min && noise <= this.ores[i].max && tileNoise >= this.ores[i].bMin && tileNoise <= this.ores[i].bMax) {
        return i;
      }
    }

    return undefined;
  }
}