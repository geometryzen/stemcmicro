import { ExtensionEnv } from '../../env/ExtensionEnv';
import { is_complex_number } from '../../is';
import { makeList } from '../../makeList';
import { mmul } from '../../mmul';
import { is_negative } from '../../predicates/is_negative';
import { SGN } from '../../runtime/constants';
import { cadr } from '../../tree/helpers';
import { negOne, one, zero } from '../../tree/rat/Rat';
import { U } from '../../tree/tree';
import { abs } from '../abs/abs';
import { is_flt } from '../flt/is_flt';
import { is_rat } from '../rat/is_rat';

//-----------------------------------------------------------------------------
//s
//  Author : philippe.billet@noos.fr
//
//  sgn sign function
//
//
//-----------------------------------------------------------------------------
export function Eval_sgn(p1: U, $: ExtensionEnv): U {
    return sgn($.valueOf(cadr(p1)), $);
}

export function sgn(X: U, $: ExtensionEnv): U {
    if (is_flt(X)) {
        if (X.d > 0) {
            return one;
        }
        if (X.d === 0) {
            return one;
        }
        return negOne;
    }

    if (is_rat(X)) {
        const ab = mmul(X.a, X.b);
        if (ab.isNegative()) {
            return negOne;
        }
        if (ab.isZero()) {
            return zero;
        }
        return one;
    }

    if (is_complex_number(X)) {
        return $.multiply($.power(negOne, abs(X, $)), X);
    }

    if (is_negative(X)) {
        return $.multiply(makeList(SGN, $.negate(X)), negOne);
    }

    return makeList(SGN, X);
}
