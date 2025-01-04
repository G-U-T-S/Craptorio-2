export class Tilemanager {
    tiles;
    player;
    canvas;
    constructor(canvasId, player) {
        this.tiles = {};
        this.canvas = document.getElementById(canvasId);
        this.player = player;
    }
    createTile(x, y) {
        const scale = 0.0005;
        const scale2 = 0.025;
    }
    drawTerrain(showMiniMap) {
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
                if (this.tiles[worldX][worldY] === undefined) {
                    this.createTile(worldX, worldY);
                }
                const tile = this.tiles[worldX][worldY];
                if (!showMiniMap) {
                    const sx = (screenX - 1) * 8 - subTileX;
                    const sy = (screenY - 1) * 8 - subTileY;
                    if (tile.ore) {
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
                    }
                    else {
                    }
                }
            }
        }
    }
}
