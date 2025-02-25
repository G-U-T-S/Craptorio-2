import render from "../../engine/render.js";
import Label from "../label.js";
import BaseEntity from "./base_entity.js";
import itemSlot from "../itemSlot.js";
import { items } from "../definitions.js";
function map(value, inMin, inMax, outMin, outMax) {
    let mapped = ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
    return Math.min(Math.max(mapped, outMin), outMax);
}
export default class StoneFurnace extends BaseEntity {
    static tickRate = 5;
    static animTickRate = 9;
    static animMaxTick = 2;
    static bufferOuput = 100;
    static smeltTime = 3 * 60;
    fuelBuffer = new itemSlot(0, 0, 8 * 6, 8 * 6, "coal_ore", 50);
    inputBuffer = new itemSlot(0, 0, 8 * 6, 8 * 6, "iron_ore", 99);
    outputBuffer = new itemSlot(0, 0, 8 * 6, 8 * 6);
    fuelTime = 0;
    smeltTimer = 0;
    lastFuel = "";
    isSmelting = false;
    constructor(globalPos) {
        super("stone_furnace", { ...globalPos });
        this.showWindowCall = () => { this.showWindow(); };
    }
    update() {
        if (items[this.inputBuffer.name].smeltedName === undefined) {
            return;
        }
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
        }
    }
    showWindow() {
        const panelSize = 8 * 6 * 7;
        const panelPos = {
            x: (render.size.w / 2) + 15, y: (render.size.h / 2) - (panelSize / 2)
        };
        this.inputBuffer.pos.x = panelPos.x + ((8 * 5) / 5);
        this.inputBuffer.pos.y = panelPos.y + ((8 * 5) / 5) + panelSize - (8 * 20);
        this.outputBuffer.pos.x = panelPos.x + ((8 * 5) / 5) + panelSize - (8 * 8);
        this.outputBuffer.pos.y = panelPos.y + ((8 * 5) / 5) + panelSize - (8 * 20);
        this.fuelBuffer.pos.x = panelPos.x + ((8 * 5) / 5);
        this.fuelBuffer.pos.y = panelPos.y + ((8 * 5) / 5) + panelSize - (8 * 8);
        render.drawPanel(panelPos.x, panelPos.y, panelSize, panelSize, "blue", "darkBlue", new Label(items[this.type].fancyName, "black", "white", { x: 1, y: 1 }));
        this.inputBuffer.draw();
        this.outputBuffer.draw();
        this.fuelBuffer.draw();
        render.drawEmptyRect(this.fuelBuffer.pos.x + this.fuelBuffer.size.w + 15, this.fuelBuffer.pos.y + (this.fuelBuffer.size.h / 2), 150, 15, "white");
        if (this.smeltTimer > 0) {
            render.drawRect(this.fuelBuffer.pos.x + this.fuelBuffer.size.w + 15, this.fuelBuffer.pos.y + (this.fuelBuffer.size.h / 2), map(this.fuelTime, 0, items[this.fuelBuffer.name].fuelTime, 0, 150), 15, "red");
        }
    }
}
