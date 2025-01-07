import { SimplexNoise2D } from "./noiseGenerator.js";
function lerp(a, b, t) {
    return a + t * (b - a);
}
class Tile {
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
    constructor(noise, visited, isLand, biome, isBorder, atlasCoord, ore, flip, rot, borderCol) {
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
    tiles;
    player;
    render;
    simplexNoise;
    offset;
    biomes;
    ores;
    constructor(noiseSeed, render, player) {
        this.tiles = {};
        this.render = render;
        this.player = player;
        this.simplexNoise = new SimplexNoise2D(noiseSeed);
        this.offset = 0;
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
    createTile(x, y) {
        const scale = 0.0005;
        const scale2 = 0.025;
        let baseNoise = (this.simplexNoise.get(x * scale + this.offset * scale, (y * scale) + (this.offset * scale)) / 2 + 0.5) * 100;
        const addlNoise = (this.simplexNoise.get(x * scale2 + this.offset * scale2, (y * scale2) + (this.offset * scale2))) * 100;
        baseNoise = lerp(baseNoise, addlNoise, 0.02);
        const tile = new Tile(baseNoise, false, baseNoise >= 20, 1, false, { x: 0, y: 0 }, 0, 0, 0, "green");
        for (let i = 0; i > this.biomes.length; i++) {
            if (baseNoise > this.biomes[i].min && baseNoise < this.biomes[i].max) {
                tile.biome = i;
                break;
            }
        }
        tile.flip = Math.random() > 0.5 ? 1 : 0;
        if (tile.isLand && baseNoise > 21 && this.oreSample(x, y, tile.biome, tile.noise) !== undefined) {
            tile.ore = this.oreSample(x, y, tile.biome, tile.noise);
        }
        return tile;
    }
    drawTerrain(showMiniMap) {
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
                if (this.tiles[`${worldX}_${worldY}`] === undefined) {
                    this.tiles[`${worldX}_${worldY}`] = this.createTile(worldX, worldY);
                }
                const tile = this.tiles[`${worldX}_${worldY}`];
                const sx = (screenX - 1) * 8 - subTileX;
                const sy = (screenY - 1) * 8 - subTileY;
                if (!showMiniMap) {
                    if (tile.ore) {
                        this.render.drawSprite("tiles", sx, sy, this.ores[tile.ore].tileAtlasCoord.x, this.ores[tile.ore].tileAtlasCoord.y);
                    }
                    else if (!tile.isBorder) {
                        const rot = tile.rot;
                        let flip = tile.flip;
                        if (!tile.isLand) {
                            if (worldX % 2 == 1 && worldY % 2 == 1) {
                                flip = 3;
                            }
                            else if (worldX % 2 == 1) {
                                flip = 1;
                            }
                            else if (worldY % 2 == 1) {
                                flip = 2;
                            }
                        }
                        else {
                            this.render.drawSprite("tiles", sx, sy, this.biomes[tile.biome].tileCoordOffset.x, this.biomes[tile.biome].tileCoordOffset.y);
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
                            flip = 3;
                        }
                        else if (worldX % 2 == 1) {
                            flip = 1;
                        }
                        else if (worldY % 2 == 1) {
                            flip = 2;
                        }
                        this.render.drawSprite("tiles", sx, sy, tile.atlasCoord.x, tile.atlasCoord.y);
                    }
                    else {
                    }
                }
            }
        }
    }
    oreSample(x, y, tilebiome, tilenoise) {
        const tileBiome = tilebiome;
        const tileNoise = tilenoise;
        for (let i = 0; i < this.ores.length; i++) {
            const scale = this.ores[i].scale;
            const noise = (this.simplexNoise.get(x * scale + ((this.ores[i].offset * tileBiome) * scale) + this.offset * scale, (y * scale) + ((this.ores[i].offset * tileBiome) * scale) + (this.offset * scale)) / 2 + 0.5) * 16;
            if (noise >= this.ores[i].min && noise <= this.ores[i].max && tileNoise >= this.ores[i].bMin && tileNoise <= this.ores[i].bMax) {
                return i;
            }
        }
        return undefined;
    }
}
