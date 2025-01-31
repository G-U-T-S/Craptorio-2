interface Iitem {
  fancyName: string;
  info: string;
  stackSize: number;
  atlasCoord: {
    normal: { x: number, y: number };
    small: { x: number, y: number };
  };
}

export const items: { [index: string]: Iitem } = {
  "copper_plate": {
    fancyName: "Copper Plate",
    info: "Made by smelting copper",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 0, y: 0 },
      small: { x: 0, y: 8 }
    }
  },
  "iron_plate": {
    fancyName: "Iron Plate",
    info: "Made by smelting copper",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 8, y: 0 },
      small: { x: 8, y: 8 }
    }
  },
  "stone_brick": {
    fancyName: "Stone Brick",
    info: "Made by smelting stone",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 16, y: 0 },
      small: { x: 16, y: 8 }
    }
  },
  "wood": {
    fancyName: "Stone Brick",
    info: "Get by choping wood",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 24, y: 0 },
      small: { x: 24, y: 8 }
    }
  },
  "gear": {
    fancyName: "Gear",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 32, y: 0 },
      small: { x: 32, y: 8 }
    }
  },
  "copper_wire": {
    fancyName: "Copper Wire",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 40, y: 0 },
      small: { x: 40, y: 8 }
    }
  },
  "iron_stick": {
    fancyName: "Iron Stick",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 48, y: 0 },
      small: { x: 48, y: 8 }
    }
  },
  "plastic_bar": {
    fancyName: "Plastic Bar",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 56, y: 0 },
      small: { x: 56, y: 8 }
    }
  },
  "green_circuit": {
    fancyName: "Green Circuit",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 64, y: 0 },
      small: { x: 64, y: 8 }
    }
  },
  "red_circuit": {
    fancyName: "Red Circuit",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 72, y: 0 },
      small: { x: 72, y: 8 }
    }
  },
  "blue_circuit": {
    fancyName: "Blue Circuit",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 80, y: 0 },
      small: { x: 80, y: 8 }
    }
  },
  "white_circuit": {
    fancyName: "White Circuit",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 80, y: 0 },
      small: { x: 80, y: 8 }
    }
  },
  "red_cience": {
    fancyName: "Red Cience",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 96, y: 0 },
      small: { x: 96, y: 8 }
    }
  },
  "green_cience": {
    fancyName: "Green Cience",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 104, y: 0 },
      small: { x: 104, y: 8 }
    }
  },
  "blue_cience": {
    fancyName: "Blue Cience",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 112, y: 0 },
      small: { x: 112, y: 8 }
    }
  },
  "black_cience": {
    fancyName: "Black Cience",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 120, y: 0 },
      small: { x: 120, y: 8 }
    }
  },
  "white_cience": {
    fancyName: "White Cience",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 0, y: 16 },
      small: { x: 0, y: 24 }
    }
  },
  "steel": {
    fancyName: "Steel",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 56, y: 16 },
      small: { x: 56, y: 24 }
    }
  },
  "wood_chest": {
    fancyName: "Wood Box",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 64, y: 16 },
      small: { x: 64, y: 24 }
    }
  },
  "stone_furnace": {
    fancyName: "Stone Furnace",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 80, y: 16 },
      small: { x: 80, y: 24 }
    }
  },
  "steel_furnace": {
    fancyName: "Steel Furnace",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 88, y: 16 },
      small: { x: 88, y: 24 }
    }
  },
  "assembly_machine": {
    fancyName: "Assembly Machine",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 96, y: 16 },
      small: { x: 96, y: 24 }
    }
  },
  "research_lab": {
    fancyName: "Research Lab",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 104, y: 16 },
      small: { x: 104, y: 24 }
    }
  },
  "transport_belt": {
    fancyName: "Conveyor Belt",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 0, y: 40 },
      small: { x: 0, y: 48 }
    }
  },
  "splitter": {
    fancyName: "Splitter",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 8, y: 40 },
      small: { x: 8, y: 48 }
    }
  },
  "undergroun_belt": {
    fancyName: "Underground Belt",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 16, y: 40 },
      small: { x: 16, y: 48 }
    }
  },
  "mining_drill": {
    fancyName: "Mining Drill",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 40, y: 40 },
      small: { x: 40, y: 48 }
    }
  },
  "inserter": {
    fancyName: "Inserter",
    info: "",
    stackSize: 100,
    atlasCoord: {
      normal: { x: 48, y: 40 },
      small: { x: 40, y: 8 }
    }
  },
};

export const recipes: { [index: string]: { outputQuant: number, ingredients: Array<{ name: string, quant: number }> } } = {
  "gear": { outputQuant: 1, ingredients: [{ name: "iron_plate", quant: 2 }] },
  "copper_wire": { outputQuant: 2, ingredients: [{ name: "copper_plate", quant: 1 }] },
  "iron_stick": { outputQuant: 2, ingredients: [{ name: "iron_plate", quant: 2 }] },
  "green_circuit": { outputQuant: 1, ingredients: [{ name: "copper_wire", quant: 2 }, { name: "iron_plate", quant: 1 }] },
  "red_circuit": { outputQuant: 1, ingredients: [{ name: "copper_wire", quant: 4 }, { name: "green_circuit", quant: 2 }, { name: "plastic_bar", quant: 2 }] },
  "red_cience": { outputQuant: 1, ingredients: [{ name: "copper_plate", quant: 1 }, { name: "gear", quant: 1 }] },
  "green_cience": { outputQuant: 1, ingredients: [{ name: "inserter", quant: 1 }, { name: "conveyor_belt", quant: 1 }] },
  "blue_cience": { outputQuant: 2, ingredients: [{ name: "red_circuit", quant: 3 }, { name: "engine_unit", quant: 2 }, { name: "sulfur", quant: 1 }] },
  "wood_chest": { outputQuant: 1, ingredients: [{ name: "wood", quant: 2 }] },
  "stone_furnace": { outputQuant: 1, ingredients: [{ name: "stone", quant: 5 }] },
  "steel_furnace": { outputQuant: 1, ingredients: [{ name: "steel", quant: 6 }, { name: "stone_brick", quant: 10 }] },
  "assembly_machine": { outputQuant: 1, ingredients: [{ name: "green_circuit", quant: 3 }, { name: "gear", quant: 5 }, { name: "iron_plate", quant: 9 }] },
  "research_lab": { outputQuant: 1, ingredients: [{ name: "green_circuit", quant: 10 }, { name: "gear", quant: 10 }, { name: "conveyor_belt", quant: 4 }] },
  "transport_belt": { outputQuant: 2, ingredients: [{ name: "gear", quant: 1 }, { name: "iron_plate", quant: 1 }] },
  "splitter": { outputQuant: 1, ingredients: [{ name: "green_circuit", quant: 5 }, { name: "iron_plate", quant: 5 }, { name: "conveyor_belt", quant: 4 }] },
  "inserter": { outputQuant: 1, ingredients: [{ name: "green_circuit", quant: 1 }, { name: "iron_plate", quant: 1 }, { name: "gear", quant: 1 }] },
  "mining_drill": { outputQuant: 1, ingredients: [{ name: "gear", quant: 3 }, { name: "iron_plate", quant: 3 }, { name: "stone_furnace", quant: 1 }] },
  "underground_belt": { outputQuant: 1, ingredients: [{ name: "iron_plate", quant: 10 }, { name: "conveyor_belt", quant: 5 }] },
};

export const entities = {};