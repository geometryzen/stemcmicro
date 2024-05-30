export function isInteger(x: unknown): boolean {
    // % coerces its operand to numbers so a typeof test is required.
    // Not ethat ECMAScript 6 provides Number.isInteger().
    return typeof x === "number" && x % 1 === 0;
}
