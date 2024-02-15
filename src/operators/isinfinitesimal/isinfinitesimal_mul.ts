import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Cons } from "../../tree/tree";
import { CompositePredicate } from "../helpers/CompositePredicate";

const ISINIFINITESIMAL = native_sym(Native.isinfinitesimal);
const MULTIPLY = native_sym(Native.multiply);

class Op extends CompositePredicate {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(ISINIFINITESIMAL, MULTIPLY, config);
    }
    compute(inner: Cons, $: ExtensionEnv): boolean {
        return [...inner.argList].some(function (arg) {
            return $.isinfinitesimal(arg);
        });
    }
}

export const isinfinitesimal_mul = mkbuilder(Op);
