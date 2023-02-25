import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";
import { is_sym } from "../sym/is_sym";
import { MATH_CONJ } from "./MATH_CONJ";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new ConjSym($);
    }
}

class ConjSym extends Function1<Sym> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('conj_sym', MATH_CONJ, is_sym, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: Sym, expr: UCons<Sym, Sym>): [TFLAGS, U] {
        // TODO: Strictly speaking we need the symbol to be a real number.
        return [TFLAG_DIFF, arg];
    }
}

export const conj_sym = new Builder();
