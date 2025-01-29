interface Iitem {
  fancyName: string;
  info: string;
  stackSize: number;
  atlasCoord: {
    normal: {x: number, y: number};
    small: {x: number, y: number};
  };
}

export const items: { [index: string]: Iitem } = {
  "copper_plate": {
    fancyName: "Copper Plate",
    info: "Made by smelting copper",
    stackSize: 100,
    atlasCoord: {
      normal: {x: 0, y: 0},
      small: {x: 0, y: 8}
    }
  },
  "iron_plate": {
    fancyName: "Iron Plate",
    info: "Made by smelting copper",
    stackSize: 100,
    atlasCoord: {
      normal: {x: 8, y: 0},
      small: {x: 8, y: 8}
    }
  },
  "green_circuit": {
    fancyName: "Green Circuit",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: {x: 64, y: 0},
      small: {x: 64, y: 8}
    }
  },
  "inserter": {
    fancyName: "Inserter",
    info: "",
    stackSize: 50,
    atlasCoord: {
      normal: {x: 48, y: 40},
      small: {x: 0, y: 0}
    }
  },
  "stone_furnace": {
    fancyName: "Stone Furnace",
    info: "Used to smelt items",
    stackSize: 50,
    atlasCoord: {
      normal: {x: 80, y: 16},
      small: {x: 80, y: 24}
    }
  },
  "red_cience": {
    fancyName: "Red Cience",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: {x: 96, y: 0},
      small: {x: 96, y: 8}
    }
  },
};

export const crafties = {};

export const entities = {};