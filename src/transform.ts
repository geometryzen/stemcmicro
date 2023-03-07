import { polyform } from './bake';
import { decomp } from './decomp';
import { ExtensionEnv } from './env/ExtensionEnv';
import { makeList } from './makeList';
import { is_num } from './operators/num/is_num';
import { subst } from './operators/subst/subst';
import { METAA, METAB, METAX, SYMBOL_A_UNDERSCORE, SYMBOL_B_UNDERSCORE, SYMBOL_X_UNDERSCORE } from './runtime/constants';
import { DEBUG, noexpand_unary } from './runtime/defs';
import { scan_meta } from './brite/scan';
import { caddr, cadr, cdddr, cddr } from './tree/helpers';
import { one } from './tree/rat/Rat';
import { car, cdr, is_cons, nil, U } from './tree/tree';

/*
Transform an expression using a pattern. The
pattern can come from the integrals table or
the user-defined patterns.

The expression and free variable are on the stack.

The argument s is a null terminated list of transform rules.

For example, see the itab (integrals table)

Internally, the following symbols are used:

  F  input expression

  X  free variable, i.e. F of X

  A  template expression

  B  result expression

  C  list of conditional expressions

Puts the final expression on top of stack
(whether it's transformed or not) and returns
true is successful, false if not.

*/

// p1 and p2 are tmps

//define F p3
//define X p4
//define A p5
//define B p6
//define C p7

export function transform(F: U, X: U, s: string[] | U, generalTransform: boolean, $: ExtensionEnv): [U, boolean] {
    // console.lg(`transform(F=${F}, X=${X}, s=${s}, general=${generalTransform})`);

    if (DEBUG) {
        // eslint-disable-next-line no-console
        // console.lg(`         !!!!!!!!!   transform on: ${F}`);
    }

    const state = saveMetaBindings($);

    $.setSymbolValue(METAX, X);

    const arg = polyform(F, X, $); // collect coefficients of x, x^2, etc.
    const result = decomp(generalTransform, arg, X, $);

    if (DEBUG) {
        // eslint-disable-next-line no-console
        // console.lg(`  ${result.length} decomposed elements ====== `);
        for (let i = 0; i < result.length; i++) {
            // eslint-disable-next-line no-console
            // console.lg(`  decomposition element ${i}: ${result[i]}`);
        }
    }

    let transformationSuccessful = false;
    let B: U = nil;
    if (generalTransform) {
        // "general tranform" mode is supposed to be more generic than
        // "integrals" mode.
        // In general transform mode we get only one transformation
        // in s

        // simple numbers can end up matching complicated templates,
        // which we don't want.
        // for example "1" ends up matching "inner(transpose(a_),a_)"
        // since "1" is decomposed to "1" and replacing "a_" with "1"
        // there is a match.
        // Although this match is OK at some fundamental level, we want to
        // avoid it because that's not what the spirit of this match
        // is: "1" does not have any structural resemblance with
        // "inner(transpose(a_),a_)". There are probably better ways
        // to so this, for example we might notice that "inner" is an
        // anchor since it "sits above" any meta variables, so we
        // might want to mandate it to be matched at the top
        // of the tree. For the time
        // being let's just skip matching on simple numbers.
        if (!is_num(F)) {
            const theTransform = s as U;
            if (DEBUG) {
                // eslint-disable-next-line no-console
                // console.lg(`applying transform: ${theTransform}`);
                // eslint-disable-next-line no-console
                // console.lg(`scanning table entry ${theTransform}`);
            }

            // replacements of meta variables. Note that we don't
            // use scan_meta because the pattern is not a string
            // that we have to parse, it's a tree already.
            // replace a_ with METAA in the passed transformation
            let expr = subst(theTransform, SYMBOL_A_UNDERSCORE, METAA, $);

            // replace b_ with METAB in the passed transformation
            expr = subst(expr, SYMBOL_B_UNDERSCORE, METAB, $);

            // replace x_ with METAX in the passed transformation
            const p1 = subst(expr, SYMBOL_X_UNDERSCORE, METAX, $);

            const A = car(p1);
            B = cadr(p1);
            const C = cddr(p1);

            if (f_equals_a([one, ...result], generalTransform, F, A, C, $)) {
                // successful transformation, transformed result is in p6
                transformationSuccessful = true;
            }
            else {
                // the match failed but perhaps we can match something lower down in
                // the tree, so let's recurse the tree

                const transformedTerms: U[] = [];

                let restTerm: U = F;

                if (is_cons(restTerm)) {
                    transformedTerms.push(car(F));
                    restTerm = cdr(F);
                }

                while (is_cons(restTerm)) {
                    const secondTerm = car(restTerm);
                    restTerm = cdr(restTerm);

                    if (DEBUG) {
                        // eslint-disable-next-line no-console
                        // console.lg('tos before recursive transform: ' + defs.tos);
                        // eslint-disable-next-line no-console
                        // console.lg(`testing: ${secondTerm}`);
                        // eslint-disable-next-line no-console
                        // console.lg(`about to try to simplify other term: ${secondTerm}`);
                    }
                    const [t, success] = transform(
                        secondTerm,
                        nil,
                        s,
                        generalTransform,
                        $
                    );
                    transformationSuccessful = transformationSuccessful || success;

                    transformedTerms.push(t);

                    if (DEBUG) {
                        // eslint-disable-next-line no-console
                        // console.lg(`tried to simplify other term: ${secondTerm} ...successful?: ${success} ...transformed: ${transformedTerms[transformedTerms.length - 1]}`);
                    }
                }

                // recreate the tree we were passed,
                // but with all the terms being transformed
                if (transformedTerms.length !== 0) {
                    B = makeList(...transformedTerms);
                }
            }
        }
    }
    else {
        // "integrals" mode
        // TODO; Make the cast safe. 
        for (const eachTransformEntry of Array.from(s as string[])) {
            if (DEBUG) {
                // eslint-disable-next-line no-console
                // console.lg(`scanning table entry ${eachTransformEntry}`);
                if ((eachTransformEntry + '').indexOf('f(sqrt(a+b*x),2/3*1/b*sqrt((a+b*x)^3))') !== -1) {
                    // ?
                }
            }
            if (eachTransformEntry) {
                const temp = scan_meta(eachTransformEntry);

                const p5 = cadr(temp);
                B = caddr(temp);
                const p7 = cdddr(temp);

                if (
                    f_equals_a([one, ...result], generalTransform, F, p5, p7, $)
                ) {
                    // there is a successful transformation, transformed result is in p6
                    transformationSuccessful = true;
                    break;
                }
            }
        }
    }

    const temp = transformationSuccessful ? $.valueOf(B) : generalTransform ? F : nil;

    restoreMetaBindings(state, $);

    return [temp, transformationSuccessful];
}

interface TransformState {
    METAA: U;
    METAB: U;
    METAX: U;
}

function saveMetaBindings($: ExtensionEnv): TransformState {
    return {
        METAA: $.getSymbolValue(METAA),
        METAB: $.getSymbolValue(METAB),
        METAX: $.getSymbolValue(METAX),
    };
}

function restoreMetaBindings(state: TransformState, $: ExtensionEnv) {
    $.setSymbolValue(METAX, state.METAX);
    $.setSymbolValue(METAB, state.METAB);
    $.setSymbolValue(METAA, state.METAA);
}

// search for a METAA and METAB such that F = A
function f_equals_a(stack: U[], generalTransform: boolean, F: U, A: U, C: U, $: ExtensionEnv): boolean {
    for (const fea_i of stack) {
        $.setSymbolValue(METAA, fea_i);
        for (const fea_j of stack) {
            $.setSymbolValue(METAB, fea_j);

            // now test all the conditions (it's an and between them)
            let temp = C;
            while (is_cons(temp)) {
                const p2 = $.valueOf(temp.car);
                if ($.isZero(p2)) {
                    break;
                }
                temp = temp.cdr;
            }

            if (is_cons(temp)) {
                // conditions are not met, skip to the next binding of metas
                continue;
            }
            const arg2 = generalTransform ? noexpand_unary(function (x) {
                return $.valueOf(x);
            }, A, $) : $.valueOf(A);

            if ($.isZero($.subtract(F, arg2))) {
                return true; // yes
            }
        }
    }
    return false; // no
}
