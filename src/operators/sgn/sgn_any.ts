import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from '../../env/ExtensionEnv';
import { HASH_ANY, hash_unaop_atom } from '../../hashing/hash_info';
import { divide } from '../../helpers/divide';
import { SGN } from '../../runtime/constants';
import { cadr } from '../../tree/helpers';
import { Sym } from '../../tree/sym/Sym';
import { U } from '../../tree/tree';
import { abs } from '../abs/abs';
import { is_flt } from '../flt/is_flt';
import { Function1 } from '../helpers/Function1';
import { is_any } from '../helpers/is_any';
import { UCons } from '../helpers/UCons';

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new SgnFlt($);
    }
}

class SgnFlt extends Function1<U> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('sgn_any', SGN, is_any, $);
        this.hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    // This may not be needed for uniqueness because of hash in other operators.
    isKind(expr: U): expr is UCons<Sym, U> {
        if (super.isKind(expr)) {
            if (is_flt(expr)) {
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
    transform1(opr: Sym, arg: U): [TFLAGS, U] {
        return [TFLAG_DIFF, sgn(arg, this.$)];
    }
}

export const sgn_any = new Builder();

export function Eval_sgn(expr: U, $: ExtensionEnv): U {
    // console.lg("Eval_sgn", $.toSExprString(expr));
    return sgn($.valueOf(cadr(expr)), $);
}

/**
 * sgn(x) = x / abs(x) is the generalized defnition.
 * The meaning is that we are discerning the normalized direction.
 */
export function sgn(X: U, $: ExtensionEnv): U {
    // TODO: The definition is undefined when abs(x) is zero.
    // But in the case of numbers, sgn evaluates to zero.
    const numer = X;
    const denom = abs(X, $);
    return divide(numer, denom, $);
}