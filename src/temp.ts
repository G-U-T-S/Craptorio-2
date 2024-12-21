interface item {
  name: string; fancy_name: string;
  id: number; type: "consumable" | "ore" | "fuel" | "liquid" | "placeable" | "intermediate";
  craftable: "PLAYER" | "MACHINE" | "BOTH" | "NULL"; smelting_time: undefined | number;
  sub_type: "icon_only" | "null"; stack_size: number; mining_time: undefined | number
  info: string;
  recipe: undefined | {
    id: number; crafting_time: number; quant: number;
    ingredients: Array< {name: string; quant: number} >;
  };
}

/*
"": {
    name: , fancy_name: ,
    id: , type: , craftable: , smelting_time: ,
    sub_type: , stack_size: 100, mining_time: ,
    info: ,
    recipe: undefined
  },
*/

const IITEMS: { [index: string]: item } = {
  "advanced_circuit": {
    name: "advanced_circuit", fancy_name: "advanced_circuit",
    id: 1, type: 'consumable', craftable: "BOTH", mining_time: undefined,
    sub_type: 'icon_only', stack_size: 100, info: "", smelting_time: undefined,
    recipe: {
      id: 1, crafting_time: 60*6, quant: 1,
      ingredients: [
        {name: "copper_cable", quant: 4},
        {name: "green_circuit", quant: 2},
        {name: "plastic_bar", quant: 2},
      ],
    }
  },

  "electronic_circuit": {
    name: 'electronic_circuit', fancy_name: 'Electronic Circuit',
    id: 2, type: 'consumable', craftable: "BOTH", mining_time: undefined,
    sub_type: 'icon_only', stack_size: 100, info: "", smelting_time: undefined,
    recipe: {
      id: 2, crafting_time: 60*0.5, quant: 1,
      ingredients: [
        {name: "copper_cable", quant: 3},
        {name: "iron_plate", quant: 1}
      ],
    }
  },

  "iron_ore": {
    name: 'iron_ore', fancy_name: 'Iron Ore', smelting_time: 4 * 60,
    id: 3, type: 'ore', craftable: "NULL",
    mining_time: 4 * 60, sub_type: "null", stack_size: 100,
    info: 'Collected by laser, or mining drill. Found at iron ore deposits in the wild',
    recipe: undefined
  },

  "copper_ore": {
    name: 'copper_ore', fancy_name: 'Copper Ore',
    id: 4, type: 'ore', craftable: "NULL", smelting_time: 5 * 60,
    sub_type: "null", stack_size: 100, mining_time: 4 * 60,
    info: 'Collected by laser, or mining drill. Found at copper ore deposits in the wild',
    recipe: undefined
  },

  "stone": {
    name: 'stone', fancy_name: 'Stone Ore',
    id: 5, type: 'ore', craftable: "NULL", smelting_time: 2 * 60,
    sub_type: "null", stack_size: 100, mining_time: 2 * 60,
    info: 'Collected by laser, or mining drill. Found at stone ore deposits, and loose stones in the wild',
    recipe: undefined
  },

  "coal": {
    name: 'coal', fancy_name: 'Coal',
    id: 6, type: 'fuel', craftable: "NULL", smelting_time: undefined,
    sub_type: "null", stack_size: 100, mining_time: 3 * 60,
    info: 'Collected by laser, or mining drill. Found at coal ore deposits in the wild',
    recipe: undefined
  },

  "uranium": {
    name: 'uranium', fancy_name: 'Uranium Ore',
    id: 7, type: 'liquid', craftable: "NULL", smelting_time: 5 * 60,
    sub_type: "null", stack_size: 100, mining_time: 4 * 60,
    info: 'Collected by mining drill only. Found at uranium ore deposits in the wild',
    recipe: undefined
  },

  "oil_shale": {
    name: 'oil_shale', fancy_name: 'Oil Shale',
    id: 8, type: 'liquid', craftable: "NULL", smelting_time: 5 * 60,
    sub_type: "null", stack_size: 100, mining_time: 4 * 60,
    info: 'Collected by laser, or mining drill. Found at oil-shale deposits in the wild',
    recipe: undefined
  },

  "transport_belt": {
    name: 'transport_belt', fancy_name: 'Transport Belt',
    id: 9, type: 'placeable', craftable: "BOTH", smelting_time: undefined,
    sub_type: "null", stack_size: 100, mining_time: undefined,
    info: "",
    recipe: {
      id: 9, crafting_time: 60 * 0.5,
      quant: 2, ingredients: [
        {name: 'gear', quant: 1},
        {name: 'iron_plate', quant: 1}
      ]
    }
  },

  "splitter": {
    name: 'splitter', fancy_name: 'Splitter',
    id: 10, type: 'placeable', craftable: "BOTH", smelting_time: undefined,
    sub_type: "null", stack_size: 100, mining_time: undefined,
    info: "",
    recipe: {
      id: 10, crafting_time: 60 * 1, quant: 2,
      ingredients: [
        {name: "electronic_circuit", quant: 5},
        {name: "iron_plate", quant: 5},
        {name: "transport_belt", quant: 4}
      ]
    }
  },

  "inserter": {
    name: 'inserter', fancy_name: 'Inserter',
    id: 11, type: 'placeable', craftable: "BOTH", smelting_time: undefined,
    sub_type: "null", stack_size: 100, mining_time: undefined,
    info: "",
    recipe: {
      id: 11, crafting_time: 60 * 0.5, quant: 1,
      ingredients: [
        {name: "electronic_circuit", quant: 1},
        {name: "gear", quant: 1},
        {name: "iron_plate", quant: 1}
      ]
    }
  },

  "power_pole": {
    name: 'power_pole', fancy_name: 'Power Pole',
    id: 12, type: 'placeable', craftable: "BOTH", smelting_time: undefined,
    sub_type: "null", stack_size: 100, mining_time: undefined,
    info: "",
    recipe: undefined
  },

  "mining_drill": {
    name: 'mining_drill', fancy_name: 'Mining Drill',
    id: 13, type: "placeable", craftable: "BOTH", smelting_time: undefined,
    sub_type: "null", stack_size: 50, mining_time: undefined,
    info: "",
    recipe: {
      id: 13, crafting_time: 60 * 2, quant: 2,
      ingredients: [
        {name: "electronic_circuit", quant: 3},
        {name: "iron_plate", quant: 10},
        {name: "gear", quant: 5}
      ]
    }
  },

  "stone_furnace": {
    name: 'stone_furnace', fancy_name: 'Stone Furnace',
    id: 14, type: 'placeable', craftable: "BOTH", smelting_time: undefined,
    sub_type: "null", stack_size: 50, mining_time: undefined,
    info: "",
    recipe: {
      id: 14, crafting_time: 60 * 0.5, quant: 1,
      ingredients: [
        {name: "stone", quant: 5}
      ]
    }
  },

  "iron_plate": {
    name: 'iron_plate', fancy_name: 'Iron Plate',
    id: 15, type: 'ore', craftable: "NULL", smelting_time: 5 * 60,
    sub_type: "null", stack_size: 100, mining_time: undefined,
    info: 'Obtained via smelting iron ore in a furnace',
    recipe: undefined
  },

  "copper_plate": {
    name: 'copper_plate', fancy_name: 'Copper Plate',
    id: 16, type: "intermediate", craftable: "NULL", smelting_time: 5 * 60,
    sub_type: "null", stack_size: 100, mining_time: undefined,
    info: 'Obtained via smelting copper ore in a furnace',
    recipe: undefined
  },

  "stone_brick": {
    name: 'stone_brick', fancy_name: 'Stone Brick',
    id: 17, type: 'intermediate', craftable: "NULL", smelting_time: 10,
    sub_type: "null", stack_size: 100, mining_time: undefined,
    info: 'Obtained via smelting stone ore in a furnace',
    recipe: undefined
  },

  "underground_belt": {
    name: 'underground_belt', fancy_name: 'Underground Belt',
    id: 18, type: 'placeable', craftable: "BOTH", smelting_time: undefined,
    sub_type: "null", stack_size: 50, mining_time: undefined,
    info: "",
    recipe: {
      id: 18, crafting_time: 60 * 1, quant: 2,
      ingredients: [
        {name: "iron_plate", quant: 10},
        {name: "transport_belt", quant: 5}
      ]
    }
  },

  "assembly_machine": {
    name: 'assembly_machine', fancy_name: 'Assembly Machine',
    id: 19, type: 'placeable', craftable: "BOTH", smelting_time: undefined,
    sub_type: "null", stack_size: 50, mining_time: undefined,
    info: "",
    recipe: {
      //! why this id is 21???
      id: 21, crafting_time: 60 * 0.5, quant: 2,
      ingredients: [
        {name: "electronic_circuit", quant: 3},
        {name: "gear", quant: 5},
        {name: "iron_plate", quant: 9}
      ]
    }
  },

  "gear": {
    name: 'gear', fancy_name: 'Gear',
    id: 20, type: 'intermediate', craftable: "BOTH", smelting_time: undefined,
    sub_type: "null", stack_size: 100, mining_time: undefined,
    info: "",
    recipe: {
      id: 20, crafting_time: 60 * 0.5, quant: 1,
      ingredients: [
        {name: "iron_plate", quant: 2}
      ]
    }
  },

  "copper_cable": {
    name: 'copper_cable', fancy_name: 'Copper Cable',
    id: 21, type: 'intermediate', craftable: "BOTH", smelting_time: undefined,
    sub_type: "null", stack_size: 100, mining_time: undefined,
    info: "",
    recipe: {
      id: 21, crafting_time: 60 * 0.5, quant: 2,
      ingredients: [
        {name: "copper_plate", quant: 1}
      ]
    }
  },
};

// ITEMS = {
//   [22] = {
//     name = 'research_lab',
//     fancy_name = 'Research Lab',
//     sprite_id = 399,
//     id = 22,
//     belt_id = 281,
//     color_key = 0,
//     type = 'placeable',
//     craftable = {'PLAYER', 'machine'},
//     sub_type = 'craftable',
//     stack_size = 50,
//     recipe = {
//       id = 22,
//       crafting_time = 60*2,
//       count = 1,
//       ingredients = {
//         [1] = {id = 2, count = 10},
//         [2] = {id = 20, count = 10},
//         [3] = {id = 9, count = 4}
//       },
//     }
//   },
//   [23] = {
//     name = 'automation_pack',
//     fancy_name = 'Automation Pack',
//     id = 23,
//     sprite_id = 460,
//     belt_id = 444,
//     color_key = 0,
//     type = 'intermediate',
//     craftable = {'PLAYER', 'machine'},
//     sub_type = 'craftable',
//     stack_size = 50,
//     recipe = {
//       id = 23,
//       crafting_time = 60*5,
//       count = 1,
//       ingredients = {
//         [1] = {id = 16, count = 1},
//         [2] = {id = 20, count = 1}
//       },
//     }
//   },
//   [24] = {
//     name = 'logistics_pack',
//     fancy_name = 'Logistics Pack',
//     id = 24,
//     sprite_id = 461,
//     belt_id = 445,
//     color_key = 0,
//     type = 'intermediate',
//     craftable = {'PLAYER', 'machine'},
//     sub_type = 'craftable',
//     stack_size = 50,
//     recipe = {
//       id = 24,
//       crafting_time = 60*6,
//       count = 1,
//       ingredients = {
//         [1] = {id = 11, count = 1},
//         [2] = {id =  9, count = 1}
//       },
//     }
//   },
//   [25] = {
//     name = 'biology_pack',
//     fancy_name = 'Biology Pack',
//     info = 'Crafed in a Bio Refinery',
//     id = 25,
//     sprite_id = 462,
//     belt_id = 446,
//     color_key = 0,
//     type = 'oil',
//     craftable = true,
//     sub_type = 'craftable',
//     stack_size = 50,
//     recipe = {
//       id = 25,
//       crafting_time = 60*10,
//       count = 1,
//       ingredients = {
//         [1] = {id = 32, count = 25},
//         [2] = {id = 6, count = 5},
//         [3] = {id = 8, count = 10}
//       },
//     }
//   },
//   [26] = {
//     name = 'production_pack',
//     fancy_name = 'Production Pack',
//     id = 26,
//     sprite_id = 463,
//     belt_id = 447,
//     color_key = 0,
//     type = 'intermediate',
//     craftable = true,
//     sub_type = 'craftable',
//     stack_size = 50,
//     recipe = {
//       id = 26,
//       crafting_time = 60*20,
//       count = 1,
//       ingredients = {
//         [1] = {id = 30, count = 1},
//         [2] = {id = 27, count = 5},
//         [3] = {id = 37, count = 1}
//       },
//     }
//   },
//   [27] = {
//     name = 'steel_plate',
//     fancy_name = 'Steel Plate',
//     info = 'Obtained via smelting 2x iron plates in a furnace',
//     id = 27,
//     sprite_id = 468,
//     belt_id = 469,
//     color_key = 1,
//     type = 'intermediate',
//     craftable = false,
//     stack_size = 50,
//     smelting_time = 180,
//     recipe = false,
//   },
//   [28] = {
//     name = 'wood',
//     fancy_name = 'Wood Planks',
//     info = 'Obtained via chopping trees in the wild',
//     id = 28,
//     sprite_id = 451,
//     belt_id = 467,
//     color_key = 0,
//     type = 'fuel',
//     craftable = false,
//     stack_size = 100,
//     fuel_time = 1 * 2 * 60,
//     recipe = false
//   },
//   [29] = {
//     name = 'solar_panel',
//     fancy_name = 'Solar Panel',
//     id = 29,
//     sprite_id = 510,
//     belt_id = 493,
//     color_key = 1,
//     type = 'placeable',
//     craftable = true,
//     stack_size = 50,
//     recipe = {
//       id = 29,
//       crafting_time = 4.5 * 60,
//       count = 1,
//       ingredients = {
//         [1] = {id = 16, count = 5},
//         [2] = {id = 2, count = 15},
//         [3] = {id = 27, count = 5},
//       },
//     }
//   },
//   [30] = {
//     name = 'bio_refinery',
//     fancy_name = 'Bio-Refinery',
//     id = 30,
//     sprite_id = 374,
//     belt_id = 390,
//     color_key = 1,
//     type = 'placeable',
//     craftable = true,
//     stack_size = 10,
//     recipe = {
//       id = 30,
//       crafting_time = 10 * 60,
//       count = 1,
//       ingredients = {
//         [1] = {id = 16, count = 5},
//         [2] = {id = 2, count = 15},
//         [3] = {id = 27, count = 5},
//       },
//     }
//   },
//   [31] = {
//     name = 'engine_unit',
//     fancy_name = 'Biofuel Engine',
//     id = 31,
//     sprite_id = 483,
//     belt_id = 484,
//     color_key = 1,
//     type = 'intermediate',
//     craftable = false,
//     stack_size = 5,
//     recipe = {
//       id = 31,
//       crafting_time = 10 * 60,
//       count = 1,
//       ingredients = {
//         [1] = {id = 20, count = 3},
//         [2] = {id = 27, count = 2},
//         [3] = {id = 2, count = 1},
//       },
//     }
//   },
//   [32] = {
//     name = 'fiber',
//     fancy_name = 'Organic Fibers',
//     info = 'Acquired via laser mining or made in Bio Refinery',
//     id = 32,
//     sprite_id = 268,
//     belt_id = 269,
//     color_key = 0,
//     type = 'oil',
//     craftable = false,
//     stack_size = 200,
//     recipe = {
//       id = 32,
//       crafting_time = 60 * 3,
//       count = 50,
//       ingredients = {
//         [1] = {id = 28, count = 10},
//       },
//     },
//   },
//   [33] = {
//     name = 'chest',
//     fancy_name = 'Storage Chest',
//     id = 33,
//     sprite_id = 464,
//     belt_id = 470,
//     color_key = 0,
//     type = 'placeable',
//     craftable = true,
//     stack_size = 50,
//     recipe = {
//       id = 33,
//       crafting_time = 60 * 3,
//       count = 1,
//       ingredients = {
//         [1] = {id = 28, count = 10},
//       },
//     },
//   },
//   [34] = {
//     name = 'laser_mining_speed',
//     fancy_name = 'Laser Mining 1 Upgrade',
//     info = 'Increases mining speed by 150%',
//     id = 34,
//     sprite_id = 358,
//     belt_id = -1,
//     color_key = 1,
//     type = 'upgrade',
//     craftable = false,
//     recipe = false,
//   },
//   [35] = {
//     name = 'biofuel',
//     fancy_name = 'Solid Biofuel',
//     info = 'Crafed in a Bio Refinery',
//     id = 35,
//     sprite_id = 482,
//     belt_id = 481,
//     color_key = 6,
//     type = 'oil',
//     craftable = false,
//     stack_size = 20,
//     recipe = {
//       id = 35,
//       crafting_time = 60 * 3,
//       count = 5,
//       ingredients = {
//         [1] = {id = 6, count = 1},
//         [2] = {id = 8, count = 5},
//         [3] = {id = 32, count = 10},
//       },
//     },
//   },
//   [36] = {
//     name = 'plastic_bar',
//     fancy_name = 'Plastic Bar',
//     info = 'Crafed in a Bio Refinery',
//     id = 36,
//     sprite_id = 455,
//     belt_id = 471,
//     color_key = 0,
//     type = 'oil',
//     craftable = false,
//     stack_size = 100,
//     recipe = {
//       id = 36,
//       crafting_time = 15,
//       count = 2,
//       ingredients = {
//         [1] = {id = 6, count = 1},
//         [2] = {id = 8, count = 5},
//         [3] = {id = 32, count = 10},
//       },
//     },
//   },
//   [37] = {
//     name = 'processing_unit',
//     fancy_name = 'Processing Unit',
//     info = 'Crafed in a Bio Refinery',
//     id = 36,
//     sprite_id = 472,
//     belt_id = 295,
//     color_key = 0,
//     type = 'oil',
//     craftable = false,
//     stack_size = 100,
//     recipe = {
//       id = 37,
//       crafting_time = 10,
//       count = 2,
//       ingredients = {
//         [1] = {id = 2, count = 10},
//         [2] = {id = 1, count = 10},
//         [3] = {id = 35, count = 10},
//       },
//     },
//   },
//   [38] = {
//     name = 'laser_mining_speed2',
//     fancy_name = 'Laser Mining 2 Upgrade',
//     info = 'Increases mining speed by +150%',
//     id = 38,
//     sprite_id = 359,
//     belt_id = -1,
//     color_key = 1,
//     type = 'upgrade',
//     craftable = false,
//     recipe = false,
//   },
//   [39] = {
//     name = 'laser_mining_speed3',
//     fancy_name = 'Laser Mining 3 Upgrade',
//     info = 'Increases mining speed by +150%',
//     id = 39,
//     sprite_id = 359,
//     belt_id = -1,
//     color_key = 1,
//     type = 'upgrade',
//     craftable = false,
//     recipe = false,
//   },
//   [40] = {
//     name = 'rocket_silo',
//     fancy_name = 'Rocket Silo',
//     info = 'placeholder rocket text',
//     id = 40,
//     sprite_id = 386,
//     belt_id = 402,
//     color_key = 1,
//     type = 'placeable',
//     craftable = true,
//     stack_size = 1,
//     recipe = {
//       id = 40,
//       crafting_time = 60*10,
//       count = 2,
//       ingredients = {
//         [1] = {id = 17, count = 250},
//         [2] = {id = 15, count = 100},
//         [3] = {id = 16, count = 100},
//         [4] = {id = 45, count = 100},
        
//       },
//     },
//   },
//   [41] = {
//     name = 'rocket_part',
//     fancy_name = 'Rocket Part',
//     info = 'An intermediate product used in repairing rockets',
//     id = 41,
//     sprite_id = 400,
//     belt_id = 401,
//     color_key = 0,
//     type = 'intermediate',
//     craftable = true,
//     stack_size = 100,
//     recipe = {
//       id = 41,
//       crafting_time = 60*5,
//       count = 2,
//       ingredients = {
//         [1] = {id = 2, count = 10},
//         [2] = {id = 1, count = 10},
//         [3] = {id = 17, count = 25},
//         [4] = {id = 15, count = 25},
//       },
//     },
//   },
//   [42] = {
//     name = 'rocket_fuel',
//     fancy_name = 'Rocket Fuel',
//     info = 'Like my grandpa\'s whiskey',
//     id = 42,
//     sprite_id = 391,
//     belt_id = 377,
//     color_key = 0,
//     type = 'oil',
//     craftable = false,
//     stack_size = 100,
//     recipe = {
//       id = 42,
//       crafting_time = 60*5,
//       count = 5,
//       ingredients = {
//         [1] = {id = 15, count = 5},
//         [2] = {id = 16, count = 5},
//         [3] = {id = 45, count = 10},
//         [4] = {id = 35, count = 10},
//       },
//     },
//   },
//   [43] = {
//     name = 'rocket_control_unit',
//     fancy_name = 'Rocket Control Unit',
//     info = 'High-tech electronics used to re-build rockets',
//     id = 43,
//     sprite_id = 375,
//     belt_id = 376,
//     color_key = 0,
//     type = 'intermediate',
//     craftable = true,
//     stack_size = 100,
//     recipe = {
//       id = 43,
//       crafting_time = 60*5,
//       count = 2,
//       ingredients = {
//         [1] = {id = 37, count = 5},
//         [2] = {id = 1, count = 10},
//         [3] = {id = 2, count = 10},
//         [4] = {id = 15, count = 5},
//       },
//     },
//   },
//   [44] = {
//     name = 'rocket_science_pack',
//     fancy_name = 'Rocket Science Pack',
//     info = '1k Obtained from a Rocket Silo after launching a rocket into space',
//     id = 44,
//     sprite_id = 495,
//     belt_id = 479,
//     color_key = 0,
//     type = 'none',
//     craftable = false,
//     stack_size = 100,
//   },
//   [45] = {
//     name = 'refined_oil_chunk',
//     fancy_name = 'Refined Oil Chunk',
//     info = 'Condensed heavy oil, used in high-grade fuels',
//     id = 45,
//     sprite_id = 283,
//     belt_id = 284,
//     color_key = 1,
//     type = 'oil',
//     craftable = false,
//     stack_size = 50,
//     recipe = {
//       id = 45,
//       crafting_time = 60*1.5,
//       count = 2,
//       ingredients = {
//         [1] = {id = 8, count = 10},
//       },
//     },
//   },
// }