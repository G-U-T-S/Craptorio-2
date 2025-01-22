// interface Iitem {
//   fancy_name: string;
//   info?: string;
//   type: "consumable" | "ore" | "liquid" | "fuel" | "placeable";
//   atlasCoord?: {
//     fullSize: {x: number, y: number};
//     medium?: {x: number, y: number}
//     small: {x: number, y: number};
//   };
//   smelting_time?: number;
//   mining_time?: number;
//   fuel_time?: number;
//   craftable: false | Array<string>;
//   sub_type?: "icon_only";
//   stack_size: number;
//   recipe?: false | Irecipe;
// }
// interface Irecipe {
//   id: number;
//   crafting_time: number;
//   count: number;
//   ingredients: Array<{id: number, count: number}>;
// }


// const itemDefinitions: { [index: string]: Iitem} = {
//   advanced_circuit: {
//     fancy_name: "Advanced Circuit",
//     type: "consumable",
//     craftable: ["player", "machine"],
//     sub_type: "icon_only",
//     stack_size: 100,
//     recipe: {
//       id: 1,
//       crafting_time: 60 * 6,
//       count: 1,
//       ingredients: [
//         { id: 21, count: 4 }, // copper_cable
//         { id: 2, count: 2 },  // green_circuit
//         { id: 36, count: 2 }, // plastic_bar
//       ],
//     },
//   },
//   electronic_circuit: {
//     fancy_name: "Electronic Circuit",
//     type: "consumable",
//     craftable: ["player", "machine"],
//     sub_type: "icon_only",
//     stack_size: 100,
//     recipe: {
//       id: 2,
//       crafting_time: 60 * 0.5,
//       count: 1,
//       ingredients: [
//         { id: 21, count: 3 }, // copper_cable
//         { id: 15, count: 1 }, // iron_plate
//       ],
//     },
//   },
//   iron_ore: {
//     fancy_name: "Iron Ore",
//     info: "Collected by laser, or mining drill. Found at iron ore deposits in the wild",
//     type: "ore",
//     craftable: false,
//     stack_size: 100,
//     smelting_time: 1 * 60,
//     mining_time: 4 * 60,
//     recipe: false,
//   },
//   copper_ore: {
//     fancy_name: "Copper Ore",
//     info: "Collected by laser, or mining drill. Found at copper ore deposits in the wild",
//     type: "ore",
//     craftable: false,
//     stack_size: 100,
//     smelting_time: 5 * 60,
//     mining_time: 4 * 60,
//     recipe: false,
//   },
//   stone: {
//     fancy_name: "Stone Ore",
//     info: "Collected by laser, or mining drill. Found at stone ore deposits, and loose stones in the wild",
//     type: "ore",
//     craftable: false,
//     stack_size: 100,
//     smelting_time: 2 * 60,
//     mining_time: 2 * 60,
//     recipe: false,
//   },
//   coal: {
//     fancy_name: "Coal",
//     info: "Collected by laser, or mining drill. Found at coal ore deposits in the wild",
//     type: "fuel",
//     craftable: false,
//     stack_size: 100,
//     fuel_time: 60 * 15,
//     mining_time: 3 * 60,
//     recipe: false,
//   },
//   uranium: {
//     fancy_name: "Uranium Ore",
//     info: "Collected by mining drill only. Found at uranium ore deposits in the wild",
//     type: "liquid",
//     craftable: false,
//     stack_size: 100,
//     smelting_time: 5 * 60,
//     mining_time: 4 * 60,
//     recipe: false,
//   },
//   oil_shale: {
//     fancy_name: "Oil Shale",
//     info: "Collected by laser, or mining drill. Found at oil-shale deposits in the wild",
//     type: "liquid",
//     craftable: false,
//     stack_size: 100,
//     smelting_time: 5 * 60,
//     mining_time: 4 * 60,
//     recipe: false,
//   },
//   transport_belt: {
//     fancy_name: "Transport Belt",
//     type: "placeable",
//     craftable: ["player", "machine"],
//     stack_size: 100,
//     recipe: {
//       id: 9,
//       crafting_time: 60 * 0.5,
//       count: 2,
//       ingredients: [
//         { id: 20, count: 1 },
//         { id: 15, count: 1 },
//       ],
//     },
//   },
//   splitter: {
//     fancy_name: "Splitter",
//     type: "placeable",
//     craftable: ["player", "machine"],
//     stack_size: 100,
//     recipe: {
//       id: 10,
//       crafting_time: 60 * 1,
//       count: 2,
//       ingredients: [
//         { id: 2, count: 5 },
//         { id: 15, count: 5 },
//         { id: 9, count: 4 },
//       ],
//     },
//   },
//   inserter: {
//     fancy_name: "Inserter",
//     type: "placeable",
//     craftable: ["player", "machine"],
//     stack_size: 100,
//     recipe: {
//       id: 11,
//       crafting_time: 60 * 0.5,
//       count: 1,
//       ingredients: [
//         { id: 2, count: 1 },
//         { id: 20, count: 1 },
//         { id: 15, count: 1 },
//       ],
//     },
//   },
//   power_pole: {
//     fancy_name: "Power Pole",
//     type: "placeable",
//     craftable: ["player", "machine"],
//     stack_size: 100,
//     recipe: false,
//   },
//   mining_drill: {
//     fancy_name: "Mining Drill",
//     type: "placeable",
//     craftable: ["player", "machine"],
//     stack_size: 50,
//     recipe: {
//       id: 13,
//       crafting_time: 60 * 2,
//       count: 2,
//       ingredients: [
//         { id: 2, count: 3 },
//         { id: 15, count: 10 },
//         { id: 20, count: 5 },
//       ],
//     },
//   },
//   stone_furnace: {
//     fancy_name: "Stone Furnace",
//     type: "placeable",
//     atlasCoord: {
//       fullSize: {x: 72, y: 64},
//       small: {x: }
//     }
//     craftable: ["player", "machine"],
//     stack_size: 50,
//     recipe: {
//       id: 14,
//       crafting_time: 60 * 0.5,
//       count: 1,
//       ingredients: [
//         { id: 5, count: 5 },
//       ],
//     },
//   },
// };


interface Iitem {
  fancyName: string;
  info: string;
  atlasCoord: {
    normal: {x: number, y: number};
    small: {x: number, y: number};
  };
}

export const items: { [index: string]: Iitem } = {
  "copper_plate": {
    fancyName: "Copper Plate",
    info: "Made by smelting copper",
    atlasCoord: {
      normal: {x: 0, y: 0},
      small: {x: 0, y: 8}
    }
  },
  "iron_plate": {
    fancyName: "Iron Plate",
    info: "Made by smelting copper",
    atlasCoord: {
      normal: {x: 8, y: 0},
      small: {x: 8, y: 8}
    }
  },
  "stone_furnace": {
    fancyName: "Stone Furnace",
    info: "Used to smelt items",
    atlasCoord: {
      normal: {x: 80, y: 16},
      small: {x: 80, y: 24}
    }
  },
};

export const crafties = {};

export const entityes = {};