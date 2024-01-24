import { Directive, ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";

const MATH_E = native_sym(Native.E);
const EXP = native_sym(Native.exp);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Exp($);
    }
}

type ARG = U;
type EXP = UCons<Sym, ARG>;

class Exp extends Function1<ARG> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('exp', EXP, is_any, $);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(expr), "isExpanding", this.$.isExpanding(), "isFactoring", this.$.isExpanding());
        const $ = this.$;
        if ($.getDirective(Directive.canonicalize)) {
            return [TFLAG_DIFF, $.power(MATH_E, arg)];
        }
        else {
            // The argument is evaluated by the base class in all other phases.
            return [TFLAG_NONE, expr];
        }
    }
}

export const exp = new Builder();
