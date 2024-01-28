import { ExtensionEnv } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "./Function1";
import { GUARD } from "./GUARD";
import { Cons1 } from "./Cons1";

/**
 * A slightly more restrictive version of a unary function with a callback for testing the argument.
 */
export abstract class Function1X<T extends U> extends Function1<T> {
    constructor(name: string, opr: Sym, guardL: GUARD<U, T>, private readonly cross: (arg: T) => boolean, $: ExtensionEnv) {
        super(name, opr, guardL, $);
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