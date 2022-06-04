import { besselj } from '../../../besselj';
import { bessely } from '../../../bessely';
import { rational } from '../../../bignum';
import { add_terms } from '../../../calculators/add/add_terms';
import { compare_terms_redux } from '../../../calculators/compare/compare_terms';
import { ycosh } from '../../../cosh';
import { dirac } from '../../../dirac';
import { ExtensionEnv } from '../../../env/ExtensionEnv';
import { exp } from '../../../exp';
import { hermite } from '../../../hermite';
import { makeList } from '../../../makeList';
import {
    ARCCOS,
    ARCCOSH,
    ARCSIN,
    ARCSINH,
    ARCTAN,
    ARCTANH,
    BESSELJ,
    BESSELY,
    COS,
    COSH,
    ERF,
    ERFC,
    HERMITE,
    INTEGRAL,
    LOG, SECRETX,
    SGN,
    SIN,
    SINH,
    TAN,
    TANH
} from '../../../runtime/constants';
import { DynamicConstants } from '../../../runtime/defs';
import { is_abs, is_add } from '../../../runtime/helpers';
// import { stack_push } from '../../runtime/stack';
import { sgn } from '../../../sgn';
import { subst } from '../../../subst';
import { caddr, cadr } from '../../../tree/helpers';
import { negOne, one, two, wrap_as_int, zero } from '../../../tree/rat/Rat';
import { Sym } from '../../../tree/sym/Sym';
import { car, cdr, is_cons, nil, U } from '../../../tree/tree';
import { simplify } from '../../simplify/simplify';
import { sine } from '../../sin/sin';
import { sinh } from '../../sinh/sinh';
import { is_sym } from '../../sym/is_sym';
import { derivative_wrt } from '../derivative_wrt';
import { MATH_DERIVATIVE } from '../MATH_DERIVATIVE';

export function d_scalar_scalar(p1: U, p2: U, $: ExtensionEnv): U {
    // console.log(`d_scalar_scalar ${p1} ${p2}`);
    if (is_sym(p2)) {
        return d_scalar_scalar_1(p1, p2, $);
    }

    // Example: d(sin(cos(x)),cos(x))
    // Replace cos(x) <- X, find derivative, then do X <- cos(x)
    const arg1 = subst(p1, p2, SECRETX, $); // p1: sin(cos(x)), p2: cos(x), SECRETX: X => sin(cos(x)) -> sin(X)
    const darg1x = derivative_wrt(arg1, SECRETX, $);
    return subst(darg1x, SECRETX, p2, $); // p2:  cos(x)  =>  cos(X) -> cos(cos(x))
}

function d_scalar_scalar_1(p1: U, p2: Sym, $: ExtensionEnv): U {
    // d(x,x)?
    if (p1.equals(p2)) {
        return one;
    }

    // d(a,x)?
    if (!is_cons(p1)) {
        return zero;
    }

    // TODO: The generalization here would seem to be that we delegate the task to a binary operation implemented by the
    // operator that matches.
    if (is_abs(p1)) {
        return dabs(p1, p2, $);
    }
    if (is_add(p1)) {
        return dsum(p1, p2, $);
    }
    // console.log(`car(p1)=>${car(p1)}`);
    // Turning these into matching patterns...
    const opr = car(p1);
    if (opr.equals(MATH_DERIVATIVE)) {
        return dd(p1, p2, $);
    }
    if (opr.equals(LOG)) {
        return dlog(p1, p2, $);
    }
    if (opr.equals(SIN)) {
        return dsin(p1, p2, $);
    }
    if (opr.equals(COS)) {
        return dcos(p1, p2, $);
    }
    if (opr.equals(TAN)) {
        return dtan(p1, p2, $);
    }
    if (opr.equals(ARCSIN)) {
        return darcsin(p1, p2, $);
    }
    if (opr.equals(ARCCOS)) {
        return darccos(p1, p2, $);
    }
    if (opr.equals(ARCTAN)) {
        return darctan(p1, p2, $);
    }
    if (opr.equals(SINH)) {
        return dsinh(p1, p2, $);
    }
    if (opr.equals(COSH)) {
        return dcosh(p1, p2, $);
    }
    if (opr.equals(TANH)) {
        return dtanh(p1, p2, $);
    }
    if (opr.equals(ARCSINH)) {
        return darcsinh(p1, p2, $);
    }
    if (opr.equals(ARCCOSH)) {
        return darccosh(p1, p2, $);
    }
    if (opr.equals(ARCTANH)) {
        return darctanh(p1, p2, $);
    }
    if (opr.equals(SGN)) {
        return dsgn(p1, p2, $);
    }
    if (opr.equals(HERMITE)) {
        return dhermite(p1, p2, $);
    }
    if (opr.equals(ERF)) {
        return derf(p1, p2, $);
    }
    if (opr.equals(ERFC)) {
        return derfc(p1, p2, $);
    }
    if (opr.equals(BESSELJ)) {
        return dbesselj(p1, p2, $);
    }
    if (opr.equals(BESSELY)) {
        return dbessely(p1, p2, $);
    }
    if (car(p1) === INTEGRAL && caddr(p1) === p2) {
        return derivative_of_integral(p1);
    }
    return dfunction(p1, p2, $);
}

function dsum(p1: U, p2: Sym, $: ExtensionEnv): U {
    const toAdd = is_cons(p1) ? p1.tail().map((el) => derivative_wrt(el, p2, $)) : [];
    return add_terms(toAdd, $);
}

function dlog(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.divide(deriv, cadr(p1));
}

//  derivative of derivative
//
//  example: d(d(f(x,y),y),x)
//
//  p1 = d(f(x,y),y)
//
//  p2 = x
//
//  cadr(p1) = f(x,y)
//
//  caddr(p1) = y
function dd(p1: U, p2: Sym, $: ExtensionEnv): U {
    // d(f(x,y),x)
    const p3 = derivative_wrt(cadr(p1), p2, $);

    if (car(p3) === MATH_DERIVATIVE) {
        // handle dx terms
        const caddr_p3 = caddr(p3);
        const caddr_p1 = caddr(p1);
        const cadr_p3 = cadr(p3);
        // Determine whether we should be comparing as terms or factors. I think it is as terms.
        if (compare_terms_redux(caddr_p3, caddr_p1, $) < 0) {
            return makeList(MATH_DERIVATIVE, makeList(MATH_DERIVATIVE, cadr_p3, caddr_p3), caddr_p1);
        }
        else {
            return makeList(MATH_DERIVATIVE, makeList(MATH_DERIVATIVE, cadr_p3, caddr_p1), caddr_p3);
        }
    }

    return derivative_wrt(p3, caddr(p1), $);
}

// derivative of a generic function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function dfunction(p1: U, p2: Sym, $: ExtensionEnv): U {
    const p3 = cdr(p1); // p3 is the argument list for the function

    if (nil === p3 || p3.contains(p2)) {
        return makeList(MATH_DERIVATIVE, p1, p2);
    }
    return zero;
}

function dsin(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.multiply(deriv, $.cos(cadr(p1)));
}

function dcos(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.negate($.multiply(deriv, sine(cadr(p1), $)));
}

function dtan(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.multiply(deriv, $.power($.cos(cadr(p1)), wrap_as_int(-2)));
}

function darcsin(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.multiply(
        deriv,
        $.power($.subtract(one, $.power(cadr(p1), two)), rational(-1, 2))
    );
}

function darccos(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.negate(
        $.multiply(
            deriv,
            $.power(
                $.subtract(one, $.power(cadr(p1), two)),
                rational(-1, 2)
            )
        )
    );
}

//        Without simplify  With simplify
//
//  d(arctan(y/x),x)  -y/(x^2*(y^2/x^2+1))  -y/(x^2+y^2)
//
//  d(arctan(y/x),y)  1/(x*(y^2/x^2+1))  x/(x^2+y^2)
function darctan(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return simplify(
        $.multiply(deriv, $.inverse($.add(one, $.power(cadr(p1), two)))), $
    );
}

function dsinh(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.multiply(deriv, ycosh(cadr(p1), $));
}

function dcosh(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.multiply(deriv, sinh(cadr(p1), $));
}

function dtanh(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.multiply(deriv, $.power(ycosh(cadr(p1), $), wrap_as_int(-2)));
}

function darcsinh(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.multiply(
        deriv,
        $.power($.add($.power(cadr(p1), two), one), rational(-1, 2))
    );
}

function darccosh(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.multiply(
        deriv,
        $.power($.add($.power(cadr(p1), two), negOne), rational(-1, 2))
    );
}

export function darctanh(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.multiply(
        deriv,
        $.inverse($.subtract(one, $.power(cadr(p1), two)))
    );
}

export function dabs(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.multiply(deriv, sgn(cadr(p1), $));
}

export function dsgn(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.multiply($.multiply(deriv, dirac(cadr(p1), $)), two);
}

export function dhermite(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.multiply(
        $.multiply(deriv, $.multiply(two, caddr(p1))),
        hermite(cadr(p1), $.add(caddr(p1), negOne), $)
    );
}

export function derf(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.multiply(
        $.multiply(
            $.multiply(
                exp($.multiply($.power(cadr(p1), two), negOne), $),
                $.power(DynamicConstants.Pi(), rational(-1, 2))
            ),
            two
        ),
        deriv
    );
}

export function derfc(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.multiply(
        $.multiply(
            $.multiply(
                exp($.multiply($.power(cadr(p1), two), negOne), $),
                $.power(DynamicConstants.Pi(), rational(-1, 2))
            ),
            wrap_as_int(-2)
        ),
        deriv
    );
}

export function dbesselj(p1: U, p2: Sym, $: ExtensionEnv): U {
    if ($.isZero(caddr(p1))) {
        return dbesselj0(p1, p2, $);
    }
    return dbesseljn(p1, p2, $);
}

export function dbesselj0(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.multiply(
        $.multiply(deriv, besselj(cadr(p1), one, $)),
        negOne
    );
}

export function dbesseljn(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    const A = $.add(caddr(p1), negOne);
    const B = $.multiply(caddr(p1), negOne);
    const C = besselj(cadr(p1), A, $);
    const D = $.divide(B, cadr(p1));
    const E = besselj(cadr(p1), caddr(p1), $);
    const F = $.multiply(D, E);
    const G = $.add(C, F);
    return $.multiply(deriv, G);
}

export function dbessely(p1: U, p2: Sym, $: ExtensionEnv): U {
    if ($.isZero(caddr(p1))) {
        return dbessely0(p1, p2, $);
    }
    return dbesselyn(p1, p2, $);
}

export function dbessely0(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    return $.multiply(
        $.multiply(deriv, besselj(cadr(p1), one, $)),
        negOne
    );
}

export function dbesselyn(p1: U, p2: Sym, $: ExtensionEnv): U {
    const deriv = derivative_wrt(cadr(p1), p2, $);
    const A = $.add(caddr(p1), negOne);
    const B = $.multiply(caddr(p1), negOne);
    const C = $.divide(B, cadr(p1));
    const D = bessely(cadr(p1), caddr(p1), $);
    const E = bessely(cadr(p1), A, $);
    const F = $.multiply(C, D);
    const G = $.add(E, F);
    return $.multiply(deriv, G);
}

export function derivative_of_integral(p1: U): U {
    return cadr(p1);
}
