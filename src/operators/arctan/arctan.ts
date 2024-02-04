import { is_flt, is_sym, Sym } from 'math-expression-atoms';
import { is_native, Native } from 'math-expression-native';
import { car, cdr, Cons, is_cons, items_to_cons, U } from 'math-expression-tree';
import { rational } from '../../bignum';
import { Directive, ExtensionEnv } from '../../env/ExtensionEnv';
import { equaln, is_num_and_equalq } from '../../is';
import { is_negative } from '../../predicates/is_negative';
import { ARCTAN, COS, POWER, SIN, TAN } from '../../runtime/constants';
import { DynamicConstants } from '../../runtime/defs';
import { is_multiply, is_power } from '../../runtime/helpers';
import { MATH_PI } from '../../runtime/ns_math';
import { create_flt, piAsFlt } from '../../tree/flt/Flt';
import { caddr, cadr } from '../../tree/helpers';
import { third, zero } from '../../tree/rat/Rat';
import { denominator } from '../denominator/denominator';
import { Cons1 } from '../helpers/Cons1';
import { numerator } from '../numerator/numerator';

export function is_sin(expr: U): expr is Cons1<Sym, U> {
    return is_cons(expr) && is_sym(expr.opr) && is_native(expr.opr, Native.sin);
}

export function is_cos(expr: U): expr is Cons1<Sym, U> {
    return is_cons(expr) && is_sym(expr.opr) && is_native(expr.opr, Native.cos);
}

export function Eval_arctan(expr: Cons, $: ExtensionEnv): U {
    const x = $.valueOf(expr.argList.head);
    // console.lg("Eval_arctan", $.toInfixString(x));
    return arctan(x, $);
}

function arctan(x: U, $: ExtensionEnv): U {
    // console.lg("arctan", $.toInfixString(x), "expanding", $.isExpanding());
    if (car(x).equals(TAN)) {
        return cadr(x);
    }

    if (is_flt(x)) {
        return create_flt(Math.atan(x.d));
    }

    if ($.iszero(x)) {
        return zero;
    }

    if (is_negative(x)) {
        return $.negate($.arctan($.negate(x)));
    }

    // arctan(sin(x)/cos(x)) --> x
    if (x.contains(SIN) && x.contains(COS)) {
        const numer = numerator(x, $);
        const denom = denominator(x, $);
        if (is_sin(numer) && is_cos(denom)) {
            const x = numer.arg;
            if (x.equals(denom.arg)) {
                return x;
            }
        }
    }

    // arctan(1/sqrt(3)) -> pi/6
    // second if catches the other way of saying it, sqrt(3)/3
    if (
        (is_power(x) && equaln(cadr(x), 3) && is_num_and_equalq(caddr(x), -1, 2)) ||
        (is_multiply(x) &&
            is_num_and_equalq(car(cdr(x)), 1, 3) &&
            car(car(cdr(cdr(x)))).equals(POWER) &&
            equaln(car(cdr(car(cdr(cdr(x))))), 3) &&
            is_num_and_equalq(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2))
    ) {
        return $.multiply(rational(1, 6), $.getDirective(Directive.evaluatingAsFloat) ? piAsFlt : MATH_PI);
    }

    // arctan(1) -> pi/4
    if (equaln(x, 1)) {
        return $.multiply(rational(1, 4), DynamicConstants.PI($));
    }

    // arctan(sqrt(3)) -> pi/3
    if (is_power(x) && equaln(cadr(x), 3) && is_num_and_equalq(caddr(x), 1, 2)) {
        return $.multiply(third, DynamicConstants.PI($));
    }

    // Construct but don't evaluate.
    return items_to_cons(ARCTAN, x);
}
