import { BinaryOperator } from "@geometryzen/esprima";
import { Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";

export function op_from_string(operator: BinaryOperator): Sym {
    switch (operator) {
        case "+":
            return native_sym(Native.add);
        case "-":
            return native_sym(Native.subtract);
        case "*":
            return native_sym(Native.multiply);
        case "/":
            return native_sym(Native.divide);
        case "|":
            return native_sym(Native.inner);
        case "^":
            return native_sym(Native.outer);
        case "<<":
            return native_sym(Native.lco);
        case ">>":
            return native_sym(Native.rco);
        case "**":
            return native_sym(Native.pow);
        default:
            throw new Error(operator);
    }
}
