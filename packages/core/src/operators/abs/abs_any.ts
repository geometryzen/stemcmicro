import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, MODE_EXPANDING, TFLAGS } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { wrap_as_transform } from "../wrap_as_transform";
import { abs } from "./abs";

export const ABS = native_sym(Native.abs);

type ARG = U;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly phases = MODE_EXPANDING;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("abs_any", ABS, is_any);
    }
    // dependencies?: FEATURE[] | undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(expr: EXP, opr: Sym): boolean {
        throw new Error("Method not implemented.");
    }
    /*
    isKind(expr: U): expr is EXP {
        if (super.isKind(expr)) {
            const arg = expr.arg;
            if (is_sym(arg)) {
                return true;
            }
            else if (is_atom(arg)) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
    */
    transform1(opr: Sym, arg: ARG, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        // TODO: Ultimately we want this to do nothing for extensibility.
        // console.lg(this.name, this.$.toInfixString(arg));
        const retval = abs(arg, $);
        return wrap_as_transform(retval, expr);
    }
}

export const abs_any = mkbuilder(Op);
