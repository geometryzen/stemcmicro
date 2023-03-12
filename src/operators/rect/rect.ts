import { cadnr } from '../../calculators/cadnr';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { imu } from '../../env/imu';
import { makeList } from '../../makeList';
import { ASSUME_REAL_VARIABLES, COS, RECT } from '../../runtime/constants';
import { has_clock_form, has_exp_form } from '../../runtime/find';
import { is_add, is_multiply } from '../../runtime/helpers';
import { MATH_SIN } from '../../runtime/ns_math';
import { cadr } from '../../tree/helpers';
import { zero } from '../../tree/rat/Rat';
import { Cons, is_cons, U } from '../../tree/tree';
import { abs } from '../abs/abs';
import { arg } from '../arg/arg';
import { cos } from '../cos/cosine';
import { is_imu } from '../imu/is_imu';
import { sin } from '../sin/sine';
import { is_sym } from '../sym/is_sym';

/**
 * Convert complex z to rectanglar from.
 * @param p1 (rect z)
 */
export function Eval_rect(p1: Cons, $: ExtensionEnv): U {
    const arg = cadnr(p1, 1);
    const valueOfArg = $.valueOf(arg);
    const result = rect(valueOfArg, $);
    return result;
}

export function rect(z: U, $: ExtensionEnv): U {
    // console.lg("rect", $.toSExprString(z));
    // if we assume real variables, then the
    // rect of any symbol is the symbol itself
    // (note that 'i' is not a symbol, it's made of (-1)^(1/2))
    // otherwise we have to leave unevalled
    if (is_sym(z)) {
        if (!$.is_zero($.getSymbolValue(ASSUME_REAL_VARIABLES))) {
            return z;
        }

        return makeList(RECT, z);

        // TODO this is quite dirty, ideally we don't need this
        // but removing this creates a few failings in the tests
        // that I can't investigate right now.
        // --
        // if we assume all variables are real AND
        // it's not an exponential nor a polar nor a clock form
        // THEN rect(_) = _
        // note that these matches can be quite sloppy, one can find expressions
        // which shouldn't match but do
        //
    }

    const assumeRealVariables = !$.is_zero($.getSymbolValue(ASSUME_REAL_VARIABLES));
    // console.lg("assumeRealVariables", assumeRealVariables);
    const hasExpForm = has_exp_form(z, $);
    // console.lg("hasExpForm", hasExpForm);

    if (assumeRealVariables && !has_exp_form(z, $) && !has_clock_form(z, z, $) && !(z.contains(MATH_SIN) && z.contains(COS) && z.contains(imu))
    ) {
        // console.lg("rect has no polar form", $.toSExprString(z));
        // no polar form?
        return z; // ib
    }

    if (is_cons(z) && is_multiply(z) && is_imu(cadr(z)) && assumeRealVariables) {
        // console.lg("rect is sum", $.toSExprString(z));
        return z; // sum
    }

    if (is_cons(z) && is_add(z)) {
        // console.lg("rect is add", $.toSExprString(z));
        return z.tail().reduce((a: U, b: U) => $.add(a, rect(b, $)), zero);
    }

    // TODO: Shouldn't the final statement be the wrapping of the arg in (rect ...)?
    // Then the code below is used in a matcher.

    // try to get to the rectangular form by doing
    // abs(p1) * (cos (theta) + i * sin(theta))
    // where theta is arg(p1)
    // abs(z) * (cos(arg(z)) + i sin(arg(z)))
    // console.lg("rect is computing abs(z)", $.toInfixString(z));
    const A = arg(z, $);
    // console.lg("theta", $.toInfixString(A));
    const result = $.multiply(
        abs(z, $),
        $.add(cos(arg(z, $), $), $.multiply(imu, sin(arg(z, $), $)))
    );

    return result;
}
