import { ExtensionEnv, MODE_EXPANDING, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";
import { wrap_as_transform } from "../wrap_as_transform";
import { abs } from "./abs";

export const ABS = native_sym(Native.abs);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = U;
type EXP = UCons<Sym, ARG>;

class Op extends Function1<ARG> implements Operator<EXP> {
    readonly phases = MODE_EXPANDING;
    constructor($: ExtensionEnv) {
        super('abs_any', ABS, is_any, $);
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
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        // TODO: Ultimately we want this to do nothing for extensibility.
        // console.lg(this.name, this.$.toInfixString(arg));
        const $ = this.$;
        const retval = abs(arg, $);
        return wrap_as_transform(retval, expr);
    }
}

export const abs_any = new Builder();
