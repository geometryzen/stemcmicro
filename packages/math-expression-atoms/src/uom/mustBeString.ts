import { mustSatisfy } from "./mustSatisfy";

function beAString() {
    return "be a string";
}

export function mustBeString(name: string, value: string, contextBuilder?: () => string): string {
    mustSatisfy(name, typeof value === "string", beAString, contextBuilder);
    return value;
}
