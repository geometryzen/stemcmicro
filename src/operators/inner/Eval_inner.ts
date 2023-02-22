import { ExtensionEnv } from '../../env/ExtensionEnv';
import { inv } from '../../inv';
import { makeList } from '../../makeList';
import { SYMBOL_IDENTITY_MATRIX } from '../../runtime/constants';
import { halt } from '../../runtime/defs';
import { is_inner_or_dot, is_num_or_tensor_or_identity_matrix } from '../../runtime/helpers';
import { MATH_INNER } from '../../runtime/ns_math';
import { stack_push } from '../../runtime/stack';
import { car, cdr, is_cons, NIL, U } from '../../tree/tree';

/* dot =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
a,b,...

General description
-------------------

The inner (or dot) operator gives products of vectors,
matrices, and tensors.

Note that for Algebrite, the elements of a vector/matrix
can only be scalars. This allows for example to flesh out
matrix multiplication using the usual multiplication.
So for example block-representations are not allowed.

There is an aweful lot of confusion between sw packages on
what dot and inner do.

First off, the "dot" operator is different from the
mathematical notion of dot product, which can be
slightly confusing.

The mathematical notion of dot product is here:
  http://mathworld.wolfram.com/DotProduct.html

However, "dot" does that and a bunch of other things,
i.e. in Algebrite
dot/inner does what the dot of Mathematica does, i.e.:

scalar product of vectors:

  inner((a, b, c), (x, y, z))
  > a x + b y + c z

products of matrices and vectors:

  inner(((a, b), (c,d)), (x, y))
  > (a x + b y,c x + d y)

  inner((x, y), ((a, b), (c,d)))
  > (a x + c y,b x + d y)

  inner((x, y), ((a, b), (c,d)), (r, s))
  > a r x + b s x + c r y + d s y

matrix product:

  inner(((a,b),(c,d)),((r,s),(t,u)))
  > ((a r + b t,a s + b u),(c r + d t,c s + d u))

the "dot/inner" operator is associative and
distributive but not commutative.

In Mathematica, Inner is a generalisation of Dot where
the user can specify the multiplication and the addition
operators.
But here in Algebrite they do the same thing.

 https://reference.wolfram.com/language/ref/Dot.html
 https://reference.wolfram.com/language/ref/Inner.html

 http://uk.mathworks.com/help/matlab/ref/dot.html
 http://uk.mathworks.com/help/matlab/ref/mtimes.html

*/
/**
 * 
 */
export function Eval_inner(p1: U, $: ExtensionEnv): void {
    // if there are more than two arguments then
    // reduce it to a more standard version
    // of two arguments, which means we need to
    // transform the arguments into a tree of
    // inner products e.g.
    // inner(a,b,c) becomes inner(a,inner(b,c))
    // this is so we can get to a standard binary-tree
    // version that is simpler to manipulate.
    const args: U[] = [];
    args.push(car(cdr(p1)));
    const secondArgument = car(cdr(cdr(p1)));
    if (NIL === secondArgument) {
        halt('pattern needs at least a template and a transformed version');
    }

    let moreArgs = cdr(cdr(p1));
    while (NIL !== moreArgs) {
        args.push(car(moreArgs));
        moreArgs = cdr(moreArgs);
    }

    // make it so e.g. inner(a,b,c) becomes inner(a,inner(b,c))
    if (args.length > 2) {
        let temp = makeList(
            MATH_INNER,
            args[args.length - 2],
            args[args.length - 1]
        );
        for (let i = 2; i < args.length; i++) {
            temp = makeList(MATH_INNER, args[args.length - i - 1], temp);
        }
        Eval_inner(temp, $);
        return;
    }

    // TODO we have to take a look at the whole
    // sequence of operands and make simplifications
    // on that...
    let operands: U[] = [];
    get_innerprod_factors(p1, operands);

    // console.lg "printing operands --------"
    // for i in [0...operands.length]
    //  console.lg "operand " + i + " : " + operands[i]
    // console.lg(`operands=${operands}`);

    let refinedOperands: U[] = [];
    // removing all identity matrices
    for (let i = 0; i < operands.length; i++) {
        if (operands[i] !== SYMBOL_IDENTITY_MATRIX) {
            refinedOperands.push(operands[i]);
        }
    }
    operands = refinedOperands;

    refinedOperands = [];
    if (operands.length > 1) {
        let shift = 0;
        for (let i = 0; i < operands.length; i++) {
            // console.lg "comparing if " + operands[i+shift] + " and " + operands[i+shift+1] + " are inverses of each other"
            if (i + shift + 1 <= operands.length - 1) {
                // console.lg "isNumericAtomOrTensor " + operands[i+shift] + " : " + isNumericAtomOrTensor(operands[i+shift])
                // console.lg "isNumericAtomOrTensor " + operands[i+shift+1] + " : " + isNumericAtomOrTensor(operands[i+shift+1])
                if (
                    !(
                        is_num_or_tensor_or_identity_matrix(operands[i + shift]) ||
                        is_num_or_tensor_or_identity_matrix(operands[i + shift + 1])
                    )
                ) {
                    const arg2 = $.valueOf(operands[i + shift + 1]);
                    const arg1 = inv($.valueOf(operands[i + shift]), $);
                    const difference = $.subtract(arg1, arg2);
                    // console.lg "result: " + difference
                    if ($.isZero(difference)) {
                        shift += 1;
                    }
                    else {
                        refinedOperands.push(operands[i + shift]);
                    }
                }
                else {
                    refinedOperands.push(operands[i + shift]);
                }
            }
            else {
                break;
            }

            // console.lg "i: " + i + " shift: " + shift + " operands.length: " + operands.length

            if (i + shift === operands.length - 2) {
                // console.lg "adding last operand 2 "
                refinedOperands.push(operands[operands.length - 1]);
            }
            if (i + shift >= operands.length - 1) {
                break;
            }
        }
        operands = refinedOperands;
    }

    // console.lg "refined operands --------"
    // for i in [0...refinedOperands.length]
    //  console.lg "refined operand " + i + " : " + refinedOperands[i]

    // console.lg "stack[tos-1]: " + stack[tos-1]

    // now rebuild the arguments, just using the
    // refined operands
    // console.lg "rebuilding the argument ----"

    if (operands.length === 0) {
        stack_push(SYMBOL_IDENTITY_MATRIX);
        return;
    }

    p1 = makeList(MATH_INNER, ...operands);

    p1 = cdr(p1);
    let result = $.valueOf(car(p1));
    if (is_cons(p1)) {
        result = p1.tail().reduce((acc: U, p: U) => $.inner(acc, $.valueOf(p)), result);
    }
    stack_push(result);
}

export function get_innerprod_factors(tree: U, factors_accumulator: U[]): void {
    // console.lg "extracting inner prod. factors from " + tree

    if (!is_cons(tree)) {
        add_factor_to_accumulator(tree, factors_accumulator);
        return;
    }

    if (NIL === cdr(tree)) {
        get_innerprod_factors(car(tree), factors_accumulator);
        return;
    }

    if (is_inner_or_dot(tree)) {
        // console.lg "there is inner at top, recursing on the operands"
        get_innerprod_factors(car(cdr(tree)), factors_accumulator);
        get_innerprod_factors(cdr(cdr(tree)), factors_accumulator);
        return;
    }

    add_factor_to_accumulator(tree, factors_accumulator);
}

function add_factor_to_accumulator(tree: U, factors_accumulator: U[]): void {
    if (NIL !== tree) {
        // console.lg ">> adding to factors_accumulator: " + tree
        factors_accumulator.push(tree);
    }
}
