import { Pattern } from "../patterns/Pattern";
import { U } from "../tree/tree";
import { ExtensionEnv } from "./ExtensionEnv";

export class CostTable {
    private readonly costs: { pattern: Pattern, value: number }[] = [];
    constructor() {
        // Nothing to see here.
    }
    addCost(pattern: Pattern, value: number) {
        this.costs.push({ pattern, value });
    }
    getCost(expr: U, $: ExtensionEnv): number {
        let total = 1;
        for (const cost of this.costs) {
            if (cost.pattern.match(expr, $)) {
                total += cost.value;
            }
        }
        return total;
    }
    clear(): void {
        this.costs.length = 0;
    }
}