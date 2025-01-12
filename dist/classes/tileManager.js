import RENDER from "./render.js";
import { SimplexNoise2D } from "./noiseGenerator.js";
function lerp(a, b, t) {
    return a + t * (b - a);
}
class Tile {
    globalPos;
    color;
    visited;
    isLand;
    biome;
    isBorder;
    atlasCoord;
    ore;
    flip;
    rot;
    borderCol;
    noise;
    constructor(globalBos, noise, visited, isLand, biome, isBorder, atlasCoord, ore, flip, rot, borderCol) {
        this.globalPos = { ...globalBos };
        this.color = "black";
        this.noise = noise;
        this.visited = visited;
        this.isLand = isLand;
        this.biome = biome;
        this.isBorder = isBorder;
        this.atlasCoord = { ...atlasCoord };
        this.ore = ore;
        this.flip = flip;
        this.rot = rot;
        this.borderCol = borderCol;
    }
}
export class Tilemanager {
    totalTiles;
    tiles;
    simplexNoise;
    autoMapValues;
    offset;
    biomes;
    ores;
    constructor(noiseSeed) {
        this.tiles = {};
        this.simplexNoise = new SimplexNoise2D(noiseSeed);
        this.offset = 0;
        this.totalTiles = 0;
        this.biomes = [
            {
                name: "Desert", tileCoordOffset: { x: 0, y: 8 }, min: 20, max: 30,
                tMin: 20.5, tMax: 21.5, treeId: 194, treeDensity: 0.05,
                colorKey: 0, mapCol: "rgb(239, 230, 107)", clutter: 0.01
            },
            {
                name: "Prarie", tileCoordOffset: { x: 0, y: 16 }, min: 30, max: 45,
                tMin: 33, tMax: 40, treeId: 200, treeDensity: 0.075,
                colorKey: 1, mapCol: "rgb(221, 245, 173)", clutter: 0.09
            },
            {
                name: "Forest", tileCoordOffset: { x: 0, y: 0 }, min: 45, max: 101,
                tMin: 65, tMax: 85, treeId: 197, treeDensity: 0.15,
                colorKey: 1, mapCol: "rgb(39, 107, 50)", clutter: 0.05
            }
        ];
        this.ores = [
            {
                name: "Iron", offset: 15000, id: 3, scale: 0.011, min: 15, max: 16,
                bMin: 45, bMax: 100, tileAtlasCoord: { x: 0, y: 0 }, spriteAtlasCoord: { x: 24, y: 24 },
                colorKey: 4, biomeId: 2, mapCols: ["#257179", "#41a6f6", "#73eff7", "#f4f4f4", "#94b0c2", "#566c86"]
            },
            {
                name: "Copper", offset: 10000, id: 4, scale: 0.013, min: 15, max: 16,
                bMin: 33, bMax: 65, tileAtlasCoord: { x: 0, y: 0 }, spriteAtlasCoord: { x: 16, y: 24 },
                colorKey: 1, biomeId: 2, mapCols: ["#5d275d", "#b13e53", "#ef7d57", "#566c86"]
            },
            {
                name: "Coal", offset: 50000, id: 6, scale: 0.020, min: 14, max: 17,
                bMin: 35, bMax: 75, tileAtlasCoord: { x: 0, y: 0 }, spriteAtlasCoord: { x: 32, y: 24 },
                colorKey: 4, biomeId: 3, mapCols: ["#1a1c2c", "#94b0c2", "#566c86"]
            },
            {
                name: "Stone", offset: 22500, id: 5, scale: 0.018, min: 15, max: 16,
                bMin: 20, bMax: 70, tileAtlasCoord: { x: 0, y: 0 }, spriteAtlasCoord: { x: 8, y: 24 },
                colorKey: 4, biomeId: 1, mapCols: ["#73eff7", "#f4f4f4", "#94b0c2", "#566c86"]
            },
            {
                name: "Oil Shale", offset: 22500, id: 5, scale: 0.018, min: 15, max: 16,
                bMin: 20, bMax: 70, tileAtlasCoord: { x: 0, y: 0 }, spriteAtlasCoord: { x: 48, y: 24 },
                colorKey: 4, biomeId: 1, mapCols: ["#73eff7", "#f4f4f4", "#94b0c2", "#566c86"]
            },
            {
                name: "Uranium", offset: 22500, id: 5, scale: 0.018, min: 15, max: 16,
                bMin: 20, bMax: 70, tileAtlasCoord: { x: 0, y: 0 }, spriteAtlasCoord: { x: 40, y: 24 },
                colorKey: 4, biomeId: 1, mapCols: ["#73eff7", "#f4f4f4", "#94b0c2", "#566c86"]
            }
        ];
        this.autoMapValues = {
            '1000': { spriteCoord: { x: 0, y: 0 } },
            '0100': { spriteCoord: { x: 0, y: 0 } },
            '0010': { spriteCoord: { x: 0, y: 0 } },
            '0001': { spriteCoord: { x: 0, y: 0 } },
            '1100': { spriteCoord: { x: 0, y: 0 } },
            '0110': { spriteCoord: { x: 0, y: 0 } },
            '0011': { spriteCoord: { x: 0, y: 0 } },
            '1001': { spriteCoord: { x: 0, y: 0 } },
            '1101': { spriteCoord: { x: 0, y: 0 } },
            '1110': { spriteCoord: { x: 0, y: 0 } },
            '0111': { spriteCoord: { x: 0, y: 0 } },
            '1011': { spriteCoord: { x: 0, y: 0 } },
            '0101': { spriteCoord: { x: 0, y: 0 } },
            '1010': { spriteCoord: { x: 0, y: 0 } },
            '1111': { spriteCoord: { x: 0, y: 0 } }
        };
    }
    createTile(x, y) {
        const scale = 0.0005;
        const scale2 = 0.025;
        const baseNoise = lerp((this.simplexNoise.get(x * scale + this.offset * scale, (y * scale) + (this.offset * scale)) / 2 + 0.5) * 100, (this.simplexNoise.get(x * scale2 + this.offset * scale2, (y * scale2) + (this.offset * scale2))) * 100, 0.02);
        const tile = new Tile({ x: x, y: y }, baseNoise, false, baseNoise >= 20, 0, false, { x: 0, y: 0 }, 0, 0, 0, "green");
        for (let i = 0; i < this.biomes.length; i++) {
            if (baseNoise > this.biomes[i].min && baseNoise < this.biomes[i].max) {
                tile.biome = i;
                break;
            }
        }
        if (tile.isLand && baseNoise > 21 && this.oreSample(x, y, tile.biome, tile.noise) !== undefined) {
            tile.ore = this.oreSample(x, y, tile.biome, tile.noise);
        }
        if (tile.isLand) {
            tile.color = this.biomes[tile.biome].mapCol;
        }
        if (tile.ore) {
            tile.color = this.ores[tile.ore].mapCols[Math.floor(Math.random() * this.ores[tile.ore].mapCols.length)];
        }
        return { ...tile };
    }
    drawTerrain(showMiniMap) {
        for (let worldX = RENDER.topLeft.x - 40; worldX < RENDER.topLeft.x + RENDER.canvas.width; worldX++) {
            if (worldX % 40 !== 0) {
                continue;
            }
            for (let worldY = RENDER.topLeft.y - 40; worldY < RENDER.topLeft.y + RENDER.canvas.height; worldY++) {
                if (worldY % 40 !== 0) {
                    continue;
                }
                if (this.tiles[`${worldX}_${worldY}`] === undefined) {
                    this.tiles[`${worldX}_${worldY}`] = this.createTile(worldX, worldY);
                    this.totalTiles += 1;
                }
                const tile = this.tiles[`${worldX}_${worldY}`];
                if (tile === undefined) {
                    return;
                }
                if (!showMiniMap) {
                    if (!tile.visited) {
                        this.autoMap(worldX, worldY);
                    }
                    if (tile.ore !== -1) {
                        RENDER.drawSprite("tiles", tile.globalPos.x - RENDER.topLeft.x, tile.globalPos.y - RENDER.topLeft.y, this.ores[tile.ore].spriteAtlasCoord.x, this.ores[tile.ore].spriteAtlasCoord.y);
                    }
                    if (!tile.isBorder) {
                        let flip = tile.flip;
                        if (!tile.isLand) {
                        }
                        else {
                            RENDER.drawSprite("tiles", tile.globalPos.x - RENDER.topLeft.x, tile.globalPos.y - RENDER.topLeft.y, this.biomes[tile.biome].tileCoordOffset.x, this.biomes[tile.biome].tileCoordOffset.y);
                            const tileCoordOff = { ...this.biomes[tile.biome].tileCoordOffset };
                            if (tile.atlasCoord.x !== tileCoordOff.x && tile.atlasCoord.y !== tileCoordOff.y) {
                                RENDER.drawSprite("tiles", tile.globalPos.x - RENDER.topLeft.x, tile.globalPos.y - RENDER.topLeft.y, this.biomes[tile.biome].tileCoordOffset.x, this.biomes[tile.biome].tileCoordOffset.y);
                            }
                        }
                    }
                }
                else {
                    if (tile.biome === 1) {
                        let flip = 0;
                        if (worldX % 2 == 1 && worldY % 2 == 1) {
                            flip = 3;
                        }
                        else if (worldX % 2 == 1) {
                            flip = 1;
                        }
                        else if (worldY % 2 == 1) {
                            flip = 2;
                        }
                        RENDER.drawSprite("tiles", tile.globalPos.x - RENDER.topLeft.x, tile.globalPos.y - RENDER.topLeft.y, tile.atlasCoord.x, tile.atlasCoord.y);
                    }
                    else {
                        RENDER.drawSprite("tiles", tile.globalPos.x - RENDER.topLeft.x, tile.globalPos.y - RENDER.topLeft.y, tile.atlasCoord.x, tile.atlasCoord.y);
                    }
                }
            }
        }
    }
    drawClutter() {
        for (let worldX = RENDER.topLeft.x - 40; worldX < RENDER.topLeft.x + RENDER.canvas.width; worldX++) {
            if (worldX % 40 !== 0) {
                continue;
            }
            for (let worldY = RENDER.topLeft.y - 40; worldY < RENDER.topLeft.y + RENDER.canvas.height; worldY++) {
                if (worldY % 40 !== 0) {
                    continue;
                }
                const tile = this.tiles[`${worldX}_${worldY}`];
                if (tile === undefined) {
                    return;
                }
            }
        }
    }
    oreSample(x, y, tilebiome, tilenoise) {
        const tileBiome = tilebiome;
        const tileNoise = tilenoise;
        for (let i = 0; i < this.ores.length; i++) {
            const scale = 5;
            const noise = (this.simplexNoise.get(x * scale + ((this.ores[i].offset * tileBiome) * scale) + this.offset * scale, (y * scale) + ((this.ores[i].offset * tileBiome) * scale) + (this.offset * scale)) / 2 + 0.5) * 16;
            if (noise >= this.ores[i].min && noise <= this.ores[i].max && tileNoise >= this.ores[i].bMin && tileNoise <= this.ores[i].bMax) {
                return i;
            }
        }
        return undefined;
    }
    autoMap(x, y) {
        const tile = this.tiles[`${x}_${y}`];
        tile.visited = true;
        const adj = [
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
        ];
        let key = "";
        for (let i = 0; i < 4; i++) {
            const near = this.tiles[`${x + adj[i].x}_${y + adj[i].y}`];
            if (near === undefined) {
                break;
            }
            if (!near.isLand || near.biome < tile.biome) {
                key = key + '1';
                tile.borderCol = this.biomes[near.biome].mapCol;
            }
            else {
                key = key + '0';
            }
        }
        const new_tile = this.autoMapValues[key];
        if (new_tile === undefined) {
            return;
        }
        tile.atlasCoord.x = new_tile.spriteCoord.x + this.biomes[tile.biome].tileCoordOffset.x;
        tile.atlasCoord.y = new_tile.spriteCoord.y + this.biomes[tile.biome].tileCoordOffset.y;
        tile.isBorder = true;
        tile.ore = -1;
        tile.flip = 0;
    }
}
