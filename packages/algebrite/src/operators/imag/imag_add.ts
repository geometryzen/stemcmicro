import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const ADD = native_sym(Native.add);
const IM = native_sym(Native.imag);

/**
 * im(a + b + ...) = im(a) + im(b) + ...
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(IM, ADD);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, addExpr: Cons, imExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, $.toInfixString(addExpr));
        const argList = addExpr.argList;
        const retval = $.add(...argList.map($.im));
        // console.lg(this.name, $.toInfixString(addExpr),"retval", $.toInfixString(retval));
        return [TFLAG_NONE, retval];
    }
}

export const imag_add = mkbuilder(Op);
