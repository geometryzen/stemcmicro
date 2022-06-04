import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_HALT } from "../../env/ExtensionEnv";
import { HASH_SYM, hash_unaop_atom } from "../../hashing/hash_info";
import { SINH } from "../../runtime/constants";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = Sym;
type EXP = UCons<Sym, ARG>;

class Op extends Function1<ARG> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('sinh_sym', SINH, is_sym, $);
        this.hash = hash_unaop_atom(this.opr, HASH_SYM);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(exp: EXP): boolean {
        return true;
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        return [TFLAG_HALT, expr];
    }
}

export const sinh_sym = new Builder();
