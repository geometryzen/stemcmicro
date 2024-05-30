import { isInteger } from "./isInteger";
import { mustSatisfy } from "./mustSatisfy";

function beAnInteger() {
    return "be an integer";
}

export function mustBeInteger(name: string, value: number, contextBuilder?: () => string): number {
    mustSatisfy(name, isInteger(value), beAnInteger, contextBuilder);
    return value;
}
