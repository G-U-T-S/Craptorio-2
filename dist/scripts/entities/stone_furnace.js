import render from "../../engine/render.js";
import Label from "../label.js";
import { items } from "../definitions.js";
import BaseEntity from "./base_entity.js";
export default class StoneFurnace extends BaseEntity {
    static tickRate = 5;
    static animTickRate = 9;
    static animMaxTick = 2;
    static bufferOuput = 100;
    static smeltTime = 3 * 60;
    fuelBuffer = { name: "", quant: 0 };
    inputBuffer = { name: "", quant: 0 };
    outputBuffer = { name: "", quant: 0 };
    fuelTime = 0;
    smeltTimer = 0;
    lastFuel = "";
    oreType = "";
    isSmelting = false;
    constructor(globalPos) {
        super("stone_furnace", { ...globalPos });
        this.showWindowCall = () => { this.showWindow(); };
    }
    update() {
        if (this.fuelTime > 0) {
            this.fuelTime -= StoneFurnace.tickRate;
        }
        if (this.fuelTime <= 0) {
            if (this.isSmelting) {
                if (this.fuelBuffer.quant > 0) {
                    this.fuelBuffer.quant -= 1;
                    this.fuelTime = items[this.fuelBuffer.name].fuelTime;
                    this.lastFuel = this.fuelBuffer.name;
                    if (this.fuelBuffer.quant == 0) {
                        this.fuelBuffer.name = "";
                    }
                }
                else {
                    this.isSmelting = false;
                }
            }
        }
        if (this.isSmelting) {
            this.smeltTimer -= StoneFurnace.tickRate;
            if (this.smeltTimer <= 0) {
                let smeltedOre = "";
                if (this.inputBuffer.quant > 0 && items[this.inputBuffer.name].smeltedName !== "") {
                    smeltedOre = items[this.inputBuffer.name].smeltedName;
                }
                this.isSmelting = false;
                if (smeltedOre === "") {
                    return;
                }
                if (this.outputBuffer.quant == 0) {
                    this.outputBuffer.name = smeltedOre;
                    this.inputBuffer.quant -= 1;
                    this.outputBuffer.quant += 1;
                }
                else if (this.outputBuffer.quant < items[this.outputBuffer.name].stackSize) {
                    this.inputBuffer.quant -= 1;
                    this.outputBuffer.quant += 1;
                }
                return;
            }
        }
        if (!this.isSmelting && this.inputBuffer.quant > 0 && this.inputBuffer.quant < StoneFurnace.bufferOuput && (this.fuelTime > 0 || this.fuelBuffer.quant > 0)) {
            this.isSmelting = true;
            this.smeltTimer = StoneFurnace.smeltTime;
        }
        if (this.inputBuffer.quant == 0 && this.outputBuffer.quant == 0) {
            this.inputBuffer.name = "";
            this.outputBuffer.name = "";
            this.oreType = "";
        }
    }
    draw() {
    }
    showWindow() {
        render.drawPanel((render.size.w / 2) + 15, (render.size.h / 2) - ((8 * 6 * 7) / 2), (8 * 6 * 7), (8 * 6 * 7), "blue", "darkBlue", new Label(items[this.type].fancyName, "black", "white", { x: 1, y: 1 }));
    }
}
