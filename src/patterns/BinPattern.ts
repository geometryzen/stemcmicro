import { ExtensionEnv } from "../env/ExtensionEnv";
import { is_binop } from "../operators/helpers/is_binop";
import { is_cons, U } from "../tree/tree";
import { Pattern } from "./Pattern";

export class BinPattern implements Pattern {
    constructor(private readonly opr: Pattern, private readonly lhs: Pattern, private readonly rhs: Pattern) {
        // Nothing to see here.
    }
    match(expr: U, $: ExtensionEnv): boolean {
        if (is_cons(expr) && is_binop(expr)) {
            return this.opr.match(expr.opr, $) && this.lhs.match(expr.lhs, $) && this.rhs.match(expr.rhs, $);
        }
        else {
            return false;
        }
    }
}