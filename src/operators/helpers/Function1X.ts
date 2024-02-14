import { Sym } from "math-expression-atoms";
import { Cons1, U } from "math-expression-tree";
import { Function1 } from "./Function1";
import { GUARD } from "./GUARD";

/**
 * A slightly more restrictive version of a unary function with a callback for testing the argument.
 */
export abstract class Function1X<T extends U> extends Function1<T> {
    constructor(name: string, opr: Sym, guardL: GUARD<U, T>, private readonly cross: (arg: T) => boolean) {
        super(name, opr, guardL);
    }
    match(expr: U): Cons1<Sym, T> | undefined {
        const m = super.match(expr);
        if (m) {
            if (this.cross(m.arg)) {
                return m;
            }
        }
        return void 0;
    }
}