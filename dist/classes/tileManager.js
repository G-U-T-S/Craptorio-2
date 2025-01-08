import { SimplexNoise2D } from "./noiseGenerator.js";
function lerp(a, b, t) {
    return a + t * (b - a);
}
class Tile {
    position;
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
    constructor(position, noise, visited, isLand, biome, isBorder, atlasCoord, ore, flip, rot, borderCol) {
        this.position = { ...position };
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
    autoMapValues;
    offset;
    totalTiles;
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
        this.totalTiles = 0;
        window.addEventListener("mouseup", () => {
            console.log(this.totalTiles);
        });
    }
    createTile(x, y) {
        const scale = 0.0005;
        const scale2 = 0.025;
        let baseNoise = (this.simplexNoise.get(x * scale + this.offset * scale, (y * scale) + (this.offset * scale)) / 2 + 0.5) * 100;
        const addlNoise = (this.simplexNoise.get(x * scale2 + this.offset * scale2, (y * scale2) + (this.offset * scale2))) * 100;
        baseNoise = lerp(baseNoise, addlNoise, 0.02);
        const tile = new Tile({ x: x, y: y }, baseNoise, false, baseNoise >= 20, 1, false, { x: 0, y: 0 }, 0, 0, 0, "green");
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
        return { ...tile };
    }
    drawTerrain(showMiniMap) {
        const cameraTopLeftX = Math.floor(this.player.x - this.render.canvas.width / 2);
        const cameraTopLeftY = Math.floor(this.player.y - this.render.canvas.height / 2);
        this.render.drawRect(cameraTopLeftX, cameraTopLeftY, this.render.canvas.width, this.render.canvas.height, "green", "green");
        for (let screenX = cameraTopLeftX; screenX < cameraTopLeftX + this.render.canvas.width; screenX++) {
            if (screenX % 40 !== 0) {
                continue;
            }
            for (let screenY = cameraTopLeftY; screenY < cameraTopLeftY + this.render.canvas.height; screenY++) {
                if (screenY % 40 !== 0) {
                    continue;
                }
                const worldX = screenX;
                const worldY = screenY;
                if (this.tiles[`${worldX}_${worldY}`] === undefined && this.totalTiles < 5000) {
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
                        this.render.drawSprite("tiles", tile.position.x, tile.position.y, this.ores[tile.ore].spriteAtlasCoord.x, this.ores[tile.ore].spriteAtlasCoord.y);
                    }
                    else if (!tile.isBorder) {
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
                            this.render.drawSprite("tiles", tile.position.x, tile.position.y, this.biomes[tile.biome].tileCoordOffset.x, this.biomes[tile.biome].tileCoordOffset.y);
                            const tileCoordOff = { ...this.biomes[tile.biome].tileCoordOffset };
                            if (tile.atlasCoord.x !== tileCoordOff.x && tile.atlasCoord.y !== tileCoordOff.y) {
                                this.render.drawSprite("tiles", tile.position.x, tile.position.y, this.biomes[tile.biome].tileCoordOffset.x, this.biomes[tile.biome].tileCoordOffset.y);
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
                        this.render.drawSprite("tiles", tile.position.x, tile.position.y, tile.atlasCoord.x, tile.atlasCoord.y);
                    }
                    else {
                        this.render.drawSprite("tiles", tile.position.x, tile.position.y, tile.atlasCoord.x, tile.atlasCoord.y);
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
