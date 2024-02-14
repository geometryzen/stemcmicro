import { is_num, is_rat, one } from 'math-expression-atoms';
import { car, cdr, is_cons, items_to_cons, U } from 'math-expression-tree';
import { compare_num_num } from '../../calculators/compare/compare_num_num';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { divide } from '../../helpers/divide';
import { isunivarpolyfactoredorexpandedform } from '../../is';
import { length_of_cons_otherwise_zero } from '../../length_of_cons_or_zero';
import { is_num_and_negative } from '../../predicates/is_negative_number';
import { MULTIPLY } from '../../runtime/constants';
import { doexpand_binary } from '../../runtime/defs';
import { is_add, is_multiply, is_power } from '../../runtime/helpers';
import { caddr, cadr } from '../../tree/helpers';
import { factorize } from '../factor/factor';

// Greatest common denominator
// can also be run on polynomials, however
// it works only on the integers and it works
// by factoring the polynomials (not Euclidean algorithm)
export function eval_gcd(p1: U, $: ExtensionEnv): U {
    p1 = cdr(p1);
    let result = $.valueOf(car(p1));

    if (is_cons(p1)) {
        result = p1.tail().reduce((acc: U, p: U) => gcd(acc, $.valueOf(p), $), result);
    }
    return result;
}

export function gcd(p1: U, p2: U, $: Pick<ExtensionEnv, 'add' | 'factorize' | 'isone' | 'iszero' | 'multiply' | 'negate' | 'extensionFor' | 'power' | 'popDirective' | 'pushDirective' | 'subtract' | 'valueOf'>): U {
    return doexpand_binary(gcd_main, p1, p2, $);
}

function gcd_main(p1: U, p2: U, $: Pick<ExtensionEnv, 'add' | 'factorize' | 'isone' | 'iszero' | 'multiply' | 'negate' | 'extensionFor' | 'power' | 'subtract' | 'valueOf' | 'popDirective' | 'pushDirective'>): U {
    if (p1.equals(p2)) {
        return p1;
    }

    if (is_rat(p1) && is_rat(p2)) {
        return p1.gcd(p2);
    }
    const polyVar = areunivarpolysfactoredorexpandedform(p1, p2);
    if (polyVar) {
        return gcd_polys(p1, p2, polyVar, $);
    }

    if (is_add(p1) && is_add(p2)) {
        return gcd_sum_sum(p1, p2, $);
    }

    if (is_add(p1)) {
        p1 = gcd_sum(p1, $);
    }

    if (is_add(p2)) {
        p2 = gcd_sum(p2, $);
    }

    if (is_multiply(p1)) {
        return gcd_sum_product(p1, p2, $);
    }

    if (is_multiply(p2)) {
        return gcd_product_sum(p1, p2, $);
    }

    if (is_multiply(p1) && is_multiply(p2)) {
        return gcd_product_product(p1, p2, $);
    }

    return gcd_powers_with_same_base(p1, p2, $);
}

// TODO this should probably be in "is"?
export function areunivarpolysfactoredorexpandedform(p1: U, p2: U): U | undefined {
    const polyVar = isunivarpolyfactoredorexpandedform(p1, null);
    if (polyVar) {
        if (isunivarpolyfactoredorexpandedform(p2, polyVar)) {
            return polyVar;
        }
    }
}

function gcd_polys(p1: U, p2: U, polyVar: U, $: Pick<ExtensionEnv, 'add' | 'factorize' | 'isone' | 'iszero' | 'multiply' | 'negate' | 'extensionFor' | 'power' | 'subtract' | 'valueOf' | 'popDirective' | 'pushDirective'>) {
    p1 = factorize(p1, polyVar, $ as ExtensionEnv);
    p2 = factorize(p2, polyVar, $ as ExtensionEnv);

    if (is_multiply(p1) || is_multiply(p2)) {
        if (!is_multiply(p1)) {
            p1 = items_to_cons(MULTIPLY, p1, one);
        }
        if (!is_multiply(p2)) {
            p2 = items_to_cons(MULTIPLY, p2, one);
        }
    }
    if (is_multiply(p1) && is_multiply(p2)) {
        return gcd_product_product(p1, p2, $);
    }
    return gcd_powers_with_same_base(p1, p2, $);
}

function gcd_product_product(p1: U, p2: U, $: Pick<ExtensionEnv, 'add' | 'factorize' | 'isone' | 'iszero' | 'multiply' | 'negate' | 'extensionFor' | 'power' | 'subtract' | 'valueOf' | 'popDirective' | 'pushDirective'>): U {

    const p3: U = cdr(p1);
    const p4: U = cdr(p2);
    if (is_cons(p3)) {
        return [...p3].reduce(
            (acc: U, pOuter: U) => {
                if (is_cons(p4)) {
                    return $.multiply(acc, [...p4].reduce(
                        (innerAcc: U, pInner: U) =>
                            $.multiply(innerAcc, gcd(pOuter, pInner, $))
                        , one
                    ));
                }
                else {
                    throw new Error();
                }
            }
            , one
        );
    }
    else {
        // Assertion or do we return void 0?
        throw new Error();
    }

    // another, (maybe more readable?) version:

    /*
    let totalProduct:U = one;
    let p3 = cdr(p1)
    while (iscons(p3)) {
  
      let p4: U = cdr(p2)
  
      if (iscons(p4)) {
        totalProduct = [...p4].reduce(
            ((acc: U, p: U) =>
                $.multiply(gcd(car(p3), p), acc))
            , totalProduct
        );
      }
  
      p3 = cdr(p3);
    }
  
    return totalProduct;
    */


}

function gcd_powers_with_same_base(base1: U, base2: U, $: Pick<ExtensionEnv, 'multiply' | 'power' | 'subtract' | 'valueOf'>): U {
    let exponent1: U, exponent2: U;
    if (is_power(base1)) {
        exponent1 = caddr(base1); // exponent
        base1 = cadr(base1); // base
    }
    else {
        exponent1 = one;
    }

    if (is_power(base2)) {
        exponent2 = caddr(base2); // exponent
        base2 = cadr(base2); // base
    }
    else {
        exponent2 = one;
    }

    if (!base1.equals(base2)) {
        return one;
    }

    // are both exponents numerical?
    if (is_num(exponent1) && is_num(exponent2)) {
        const exponent = compare_num_num(exponent1, exponent2) < 0 ? exponent1 : exponent2;
        return $.power(base1, exponent);
    }

    // are the exponents multiples of eah other?
    const expo1_div_expo2 = divide(exponent1, exponent2, $);

    if (is_num(expo1_div_expo2)) {
        // choose the smallest exponent
        const cadr_expo1 = cadr(exponent1);
        const p5 = is_multiply(exponent1) && is_num(cadr_expo1) ? cadr_expo1 : one;

        const cadr_expo2 = cadr(exponent2);
        const p6 = is_multiply(exponent2) && is_num(cadr_expo2) ? cadr_expo2 : one;

        const exponent = compare_num_num(p5, p6) < 0 ? exponent1 : exponent2;
        return $.power(base1, exponent);
    }

    const expo1_minus_expo2 = $.subtract(exponent1, exponent2);

    if (!is_num(expo1_minus_expo2)) {
        return one;
    }

    // can't be equal because of test near beginning
    // TODO NumExtension.isNegative
    const exponent = is_num_and_negative(expo1_minus_expo2) ? exponent1 : exponent2;
    return $.power(base1, exponent);
}

// in this case gcd is used as a composite function, i.e. gcd(gcd(gcd...
function gcd_sum_sum(p1: U, p2: U, $: Pick<ExtensionEnv, 'add' | 'factorize' | 'isone' | 'iszero' | 'multiply' | 'negate' | 'extensionFor' | 'power' | 'subtract' | 'valueOf' | 'pushDirective' | 'popDirective'>): U {

    if (length_of_cons_otherwise_zero(p1) !== length_of_cons_otherwise_zero(p2)) {
        return one;
    }

    const p3 = is_cons(p1) ? p1.tail().reduce(function (x, y) {
        return gcd(x, y, $);
    }) : car(cdr(p1));

    const p4 = is_cons(p2) ? p2.tail().reduce(function (x, y) {
        return gcd(x, y, $);
    }) : car(cdr(p2));

    const p5 = divide(p1, p3, $);
    const p6 = divide(p2, p4, $);

    if (p5.equals(p6)) {
        return $.multiply(p5, gcd(p3, p4, $));
    }

    return one;
}

function gcd_sum(p: U, $: Pick<ExtensionEnv, 'add' | 'factorize' | 'isone' | 'iszero' | 'multiply' | 'negate' | 'extensionFor' | 'power' | 'subtract' | 'valueOf' | 'pushDirective' | 'popDirective'>): U {
    return is_cons(p) ? p.tail().reduce(function (x, y) {
        return gcd(x, y, $);
    }) : car(cdr(p));
}

/*
function gcd_term_term(p1: U, p2: U): U {
  if (!iscons(p1) || !iscons(p2)) {
    return one;
  }
  return p1.tail().reduce((a: U, b: U) => {
    return p2.tail().reduce((x: U, y: U) => $.multiply(x, gcd(b, y)), a);
  }, one);
}
*/

function gcd_sum_product(p1: U, p2: U, $: Pick<ExtensionEnv, 'add' | 'factorize' | 'isone' | 'iszero' | 'multiply' | 'negate' | 'extensionFor' | 'power' | 'subtract' | 'valueOf' | 'popDirective' | 'pushDirective'>): U {
    return is_cons(p1)
        ? p1.tail().reduce((a: U, b: U) => $.multiply(a, gcd(b, p2, $)), one)
        : one;
}

function gcd_product_sum(p1: U, p2: U, $: Pick<ExtensionEnv, 'add' | 'factorize' | 'isone' | 'iszero' | 'multiply' | 'negate' | 'extensionFor' | 'power' | 'subtract' | 'valueOf' | 'popDirective' | 'pushDirective'>): U {
    return is_cons(p2)
        ? p2.tail().reduce((a: U, b: U) => $.multiply(a, gcd(p1, b, $)), one)
        : one;
}
