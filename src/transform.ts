import { polyform } from './bake';
import { scan_meta } from './brite/scan';
import { decomp } from './decomp';
import { ExtensionEnv } from './env/ExtensionEnv';
import { items_to_cons } from './makeList';
import { is_num } from './operators/num/is_num';
import { subst } from './operators/subst/subst';
import { METAA, METAB, METAX, SYMBOL_A_UNDERSCORE, SYMBOL_B_UNDERSCORE, SYMBOL_X_UNDERSCORE } from './runtime/constants';
import { noexpand_unary } from './runtime/defs';
import { assert_cons } from './tree/cons/assert_cons';
import { cadr, cdddr, cddr } from './tree/helpers';
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

export function transform(F: U, X: U, s: string[] | U, generalTransform: boolean, $: ExtensionEnv): [retval: U, retvalFlag: boolean] {
    // console.lg("transform:", $.toInfixString(F), $.toInfixString(X), JSON.stringify(s), generalTransform);

    const state = saveMetaBindings($);
    try {

        $.setSymbolValue(METAX, X);

        const arg = polyform(F, X, $); // collect coefficients of x, x^2, etc.
        // console.lg("arg:", $.toInfixString(arg));
        const results = decomp(generalTransform, arg, X, $);

        let retvalFlag = false;
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
                // TODO: check for U or string[]
                const theTransform = s as U;

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

                if (f_equals_a([one, ...results], generalTransform, F, A, C, $)) {
                    // successful transformation, transformed result is in p6
                    retvalFlag = true;
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

                        const [t, success] = transform(
                            secondTerm,
                            nil,
                            s,
                            generalTransform,
                            $
                        );
                        retvalFlag = retvalFlag || success;

                        transformedTerms.push(t);
                    }

                    // recreate the tree we were passed,
                    // but with all the terms being transformed
                    if (transformedTerms.length !== 0) {
                        B = items_to_cons(...transformedTerms);
                    }
                }
            }
        }
        else {
            // "integrals" mode
            for (const sourceText of assert_string_array(s)) {
                if (sourceText) {
                    // console.lg("sourceText:", JSON.stringify(sourceText));
                    // Note that expr is (f A B C1 C2 C3 ...),
                    // where A is the expression to be integrated, B is the integral solution, Cn are optional conditions.
                    const expr = assert_cons(scan_meta(sourceText));
                    const argList = expr.argList;
                    const A = argList.head;
                    // console.lg("A:", $.toInfixString(A));
                    B = cadr(argList);
                    // console.lg("B:", $.toInfixString(B));
                    const C = cdddr(expr);
                    // console.lg("C:", $.toSExprString(C));

                    if (f_equals_a([one, ...results], generalTransform, F, A, C, $)) {
                        // there is a successful transformation, transformed result is in p6
                        retvalFlag = true;
                        break;
                    }
                }
            }
        }
        // console.lg("retvalFlag", retvalFlag);
        // console.lg("B:", $.toInfixString(B));
        if (retvalFlag) {
            // console.lg("METAA", $.toInfixString($.getSymbolValue(METAA)));
            // console.lg("METAX", $.toInfixString($.getSymbolValue(METAX)));
            const retval = $.valueOf(B);
            // console.lg("retval:", $.toInfixString(retval));
            return [retval, retvalFlag];
        }
        else {
            const retval = generalTransform ? F : nil;
            return [retval, retvalFlag];
        }
    }
    finally {
        restoreMetaBindings(state, $);
    }
}

function assert_string_array(tes: string[] | U): string[] {
    if (Array.isArray(tes)) {
        return tes;
    }
    else {
        throw new Error();
    }
}

interface TransformState {
    METAA: U;
    METAB: U;
    METAX: U;
}

/**
 * Returns a structure containing the values of METAA, METAB, and METAX.
 */
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
/**
 * 
 * @param stack 
 * @param generalTransform 
 * @param F The function to be integrated.
 * @param A The solution in terms of the $METAX variable.
 * @param C The conditions.
 * @param $ 
 * @returns 
 */
function f_equals_a(stack: U[], generalTransform: boolean, F: U, A: U, C: U, $: ExtensionEnv): boolean {
    // console.lg("f_equals_a", $.toInfixString(F), $.toInfixString(A), "generalTransform", JSON.stringify(generalTransform));
    for (const fea_i of stack) {
        $.setSymbolValue(METAA, fea_i);
        for (const fea_j of stack) {
            $.setSymbolValue(METAB, fea_j);

            // now test all the conditions (it's an and between them)
            let cList = C;
            while (is_cons(cList)) {
                const cFlag = $.valueOf(cList.head);
                // TODO: We're checking for zero, presumambly boolean false is more general?
                if ($.is_zero(cFlag)) {
                    break;
                }
                cList = cList.cdr;
            }

            if (is_cons(cList)) {
                // conditions are not met, skip to the next binding of metas
                continue;
            }
            const arg2 = generalTransform ? noexpand_unary(function (x) {
                return $.valueOf(x);
            }, A, $) : $.valueOf(A);

            // console.lg("F", $.toInfixString(F));
            // console.lg("arg2", $.toInfixString(arg2));

            const diff = $.subtract(F, arg2);

            // console.lg("diff", $.toSExprString(diff));

            if ($.is_zero(diff)) {
                return true;
            }
        }
    }
    return false;
}
