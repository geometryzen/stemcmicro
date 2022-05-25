import { ExtensionEnv } from './env/ExtensionEnv';
import { inv } from './inv';
import { is_negative_term } from './is';
import { makeList } from './makeList';
import { is_num } from './predicates/is_num';
import { INNER, MAXDIM, SYMBOL_IDENTITY_MATRIX } from './runtime/constants';
import { halt } from './runtime/defs';
import { is_add, is_inner_or_dot, is_num_or_tensor_or_identity_matrix } from './runtime/helpers';
import { stack_push } from './runtime/stack';
import { other_x_tensor, tensor_x_other } from './tensor';
import { create_tensor_elements } from './tree/tensor/create_tensor_elements';
import { is_tensor } from './tree/tensor/is_tensor';
import { Tensor } from './tree/tensor/Tensor';
import { zero } from './tree/rat/Rat';
import { car, cdr, is_cons, NIL, U } from './tree/tree';
import { is_blade } from './tree/vec/Algebra';

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
            INNER,
            args[args.length - 2],
            args[args.length - 1]
        );
        for (let i = 2; i < args.length; i++) {
            temp = makeList(INNER, args[args.length - i - 1], temp);
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

    p1 = makeList(INNER, ...operands);

    p1 = cdr(p1);
    let result = $.valueOf(car(p1));
    if (is_cons(p1)) {
        result = p1.tail().reduce((acc: U, p: U) => $.inner(acc, $.valueOf(p)), result);
    }
    stack_push(result);
}

/**
 * Note: Eval_inner contains addition code such as converting (inner a1 a2 a3 ...) to binary form.
 */
export function inner_v1(p1: U, p2: U, $: ExtensionEnv): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`${msg_binop_infix('inner', p1, p2, $)} => ${$.toInfixString(retval)} (${description})`);
        return retval;
    };
    // console.lg(`inner(${p1},${p2})`);
    // more in general, when a and b are scalars, inner(a*M1, b*M2) is equal to
    // a*b*inner(M1,M2), but of course we can only "bring out" in a and b the
    // scalars, because it's the only commutative part. that's going to be
    // trickier to do in general  but let's start with just the signs.
    if (is_negative_term(p2) && is_negative_term(p1)) {
        p2 = $.negate(p2);
        p1 = $.negate(p1);
    }

    // since inner is associative, put it in a canonical form i.e.
    // inner(inner(a,b),c) -> inner(a,inner(b,c))
    // so that we can recognise when they are equal.
    if (is_inner_or_dot(p1)) {
        // switching the order of these two lines breaks "8: inv(a·b·c)" test
        p2 = $.inner(car(cdr(cdr(p1))), p2); // b, _
        p1 = car(cdr(p1)); //a
    }

    // Check if one of the operands is the identity matrix
    // we could maybe use Eval_testeq here but this seems to suffice?
    if (SYMBOL_IDENTITY_MATRIX.equals(p1)) {
        return hook(p2, "A");
    }
    else if (SYMBOL_IDENTITY_MATRIX.equals(p2)) {
        return hook(p1, "B");
    }

    if (is_tensor(p1)) {
        if (is_tensor(p2)) {
            return hook(inner_product_of_tensors(p1, p2, $), "C");
        }
        else if (is_blade(p2)) {
            // TODO: We really would like to have this raise an error rather than be an acceptable expresssion
            return hook(makeList(INNER, p1, p2), "D");
        }
        else {
            // simple check if the two consecutive elements are one the (symbolic) inv
            // of the other. If they are, the answer is the identity matrix
            if (!(is_num_or_tensor_or_identity_matrix(p1) || is_num_or_tensor_or_identity_matrix(p2))) {
                const subtractionResult = $.subtract(p1, inv(p2, $));
                if ($.isZero(subtractionResult)) {
                    return hook(SYMBOL_IDENTITY_MATRIX, "E");
                }
            }

            if ($.isExpanding() && is_add(p2)) {
                return hook(p2
                    .tail()
                    .reduce((a: U, b: U) => $.add(a, $.inner(p1, b)), zero), "F");
            }

            // Eventually this becomes generic, so we can start using the extensions now.
            // Until then it will look kinda cumbersome.
            if (is_tensor(p1) && is_num(p2)) {
                throw new Error("TODO: Matrix multiply");
            }
            else if (is_num(p1) && is_tensor(p2)) {
                throw new Error("TODO: Matrix multiply");
            }
            else if (is_num(p1) || is_num(p2)) {
                return hook($.multiply(p1, p2), "I");
            }
            else {
                return hook(makeList(INNER, p1, p2), "J");
            }
        }
    }
    else if (is_blade(p1)) {
        if (is_tensor(p2)) {
            // TODO: We really would like to have this raise an error rather than be an acceptable expresssion
            return hook(makeList(INNER, p1, p2), "K");
        }
        else if (is_blade(p2)) {
            return hook(p1.scp(p2), "L");
        }
        else {
            // simple check if the two consecutive elements are one the (symbolic) inv
            // of the other. If they are, the answer is the identity matrix
            if (!(is_num_or_tensor_or_identity_matrix(p1) || is_num_or_tensor_or_identity_matrix(p2))) {
                const subtractionResult = $.subtract(p1, inv(p2, $));
                if ($.isZero(subtractionResult)) {
                    return hook(SYMBOL_IDENTITY_MATRIX, "M");
                }
            }
            if ($.isExpanding() && is_add(p2)) {
                return hook(p2
                    .tail()
                    .reduce((a: U, b: U) => $.add(a, $.inner(p1, b)), zero), "N");
            }

            if (is_num(p1) || is_num(p2)) {
                // TODO: Why can't TypeScript figure out that p1 is a never here?
                return hook($.multiply(p1, p2), "O");
            }
            else {
                return hook(makeList(INNER, p1, p2), "P");
            }
        }
    }
    else {
        // simple check if the two consecutive elements are one the (symbolic) inv
        // of the other. If they are, the answer is the identity matrix
        if (!(is_num_or_tensor_or_identity_matrix(p1) || is_num_or_tensor_or_identity_matrix(p2))) {
            const subtractionResult = $.subtract(p1, inv(p2, $));
            if ($.isZero(subtractionResult)) {
                return hook(SYMBOL_IDENTITY_MATRIX, "Q");
            }
        }

        // if either operand is a sum then distribute (if we are in expanding mode)
        if ($.isExpanding() && is_add(p1)) {
            return hook(p1
                .tail()
                .reduce((a: U, b: U) => $.add(a, $.inner(b, p2)), zero), "R");
        }

        if ($.isExpanding() && is_add(p2)) {
            return hook(p2
                .tail()
                .reduce((a: U, b: U) => $.add(a, $.inner(p1, b)), zero), "S");
        }

        if (is_tensor(p1) && is_num(p2)) {
            return hook(tensor_x_other(p1, p2, $), "T");
        }
        else if (is_num(p1) && is_tensor(p2)) {
            return hook(other_x_tensor(p1, p2, $), "U");
        }
        else if (is_num(p1) || is_num(p2)) {
            return hook($.multiply(p1, p2), "V");
        }
        else {
            throw new Error(`inner_v1 can't do... ${$.toInfixString(p1)}, ${$.toInfixString(p2)}`);
            // return hook($.unsupportedBinOp(MATH_INNER, p1, p2), "W");
        }
    }
}

function inner_product_of_tensors(p1: Tensor, p2: Tensor, $: ExtensionEnv): U {
    const n = p1.dim(p1.ndim - 1);
    if (n !== p2.dim(0)) {
        halt('inner: tensor dimension check');
    }

    const ndim = p1.ndim + p2.ndim - 2;

    if (ndim > MAXDIM) {
        halt('inner: rank of result exceeds maximum');
    }

    //---------------------------------------------------------------------
    //
    //  ak is the number of rows in tensor A
    //
    //  bk is the number of columns in tensor B
    //
    //  Example:
    //
    //  A[3][3][4] B[4][4][3]
    //
    //    3  3        ak = 3 * 3 = 9
    //
    //    4  3        bk = 4 * 3 = 12
    //
    //---------------------------------------------------------------------
    const ak = p1.sliceDimensions(0, p1.ndim - 1).reduce((a, b) => a * b, 1);
    const bk = p2.sliceDimensions(1).reduce((a, b) => a * b, 1);

    const elems: U[] = create_tensor_elements(ak * bk, zero);

    // new method copied from ginac http://www.ginac.de/
    for (let i = 0; i < ak; i++) {
        for (let j = 0; j < n; j++) {
            if ($.isZero(p1.elem(i * n + j))) {
                continue;
            }
            for (let k = 0; k < bk; k++) {
                elems[i * bk + k] = $.add($.multiply(p1.elem(i * n + j), p2.elem(j * bk + k)), elems[i * bk + k]);
            }
        }
    }

    //---------------------------------------------------------------------
    //
    //  Note on understanding "k * bk + j"
    //
    //  k * bk because each element of a column is bk locations apart
    //
    //  + j because the beginnings of all columns are in the first bk
    //  locations
    //
    //  Example: n = 2, bk = 6
    //
    //  b111  <- 1st element of 1st column
    //  b112  <- 1st element of 2nd column
    //  b113  <- 1st element of 3rd column
    //  b121  <- 1st element of 4th column
    //  b122  <- 1st element of 5th column
    //  b123  <- 1st element of 6th column
    //
    //  b211  <- 2nd element of 1st column
    //  b212  <- 2nd element of 2nd column
    //  b213  <- 2nd element of 3rd column
    //  b221  <- 2nd element of 4th column
    //  b222  <- 2nd element of 5th column
    //  b223  <- 2nd element of 6th column
    //
    //---------------------------------------------------------------------
    if (ndim === 0) {
        return elems[0];
    }
    else {
        const dims = [...p1.sliceDimensions(0, p1.ndim - 1), ...p2.sliceDimensions(1, p2.ndim),];
        return new Tensor(dims, elems);
    }
}

function get_innerprod_factors(tree: U, factors_accumulator: U[]): void {
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
