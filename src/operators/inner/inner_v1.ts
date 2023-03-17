import { ExtensionEnv } from '../../env/ExtensionEnv';
import { inv } from '../../inv';
import { items_to_cons } from '../../makeList';
import { is_negative } from '../../predicates/is_negative';
import { SYMBOL_IDENTITY_MATRIX } from '../../runtime/constants';
import { is_add, is_inner_or_dot, is_num_or_tensor_or_identity_matrix } from '../../runtime/helpers';
import { MATH_INNER } from '../../runtime/ns_math';
import { other_x_tensor, tensor_x_other } from '../../tensor';
import { zero } from '../../tree/rat/Rat';
import { car, cdr, U } from '../../tree/tree';
import { is_blade } from '../../tree/vec/createAlgebra';
import { is_num } from '../num/is_num';
import { is_tensor } from '../tensor/is_tensor';
import { inner_tensor_tensor } from './inner_tensor_tensor';

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
    if (is_negative(p2) && is_negative(p1)) {
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
    // we could maybe use testeq here but this seems to suffice?
    if (SYMBOL_IDENTITY_MATRIX.equals(p1)) {
        return hook(p2, "A");
    }
    else if (SYMBOL_IDENTITY_MATRIX.equals(p2)) {
        return hook(p1, "B");
    }

    if (is_tensor(p1)) {
        if (is_tensor(p2)) {
            return hook(inner_tensor_tensor(p1, p2, $), "C");
        }
        else if (is_blade(p2)) {
            // TODO: We really would like to have this raise an error rather than be an acceptable expresssion
            return hook(items_to_cons(MATH_INNER, p1, p2), "D");
        }
        else {
            // simple check if the two consecutive elements are one the (symbolic) inv
            // of the other. If they are, the answer is the identity matrix
            if (!(is_num_or_tensor_or_identity_matrix(p1) || is_num_or_tensor_or_identity_matrix(p2))) {
                const subtractionResult = $.subtract(p1, inv(p2, $));
                if ($.is_zero(subtractionResult)) {
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
                return hook(items_to_cons(MATH_INNER, p1, p2), "J");
            }
        }
    }
    else if (is_blade(p1)) {
        if (is_tensor(p2)) {
            // TODO: We really would like to have this raise an error rather than be an acceptable expresssion
            return hook(items_to_cons(MATH_INNER, p1, p2), "K");
        }
        else if (is_blade(p2)) {
            return hook($.valueOf(p1.scp(p2)), "L");
        }
        else {
            // simple check if the two consecutive elements are one the (symbolic) inv
            // of the other. If they are, the answer is the identity matrix
            if (!(is_num_or_tensor_or_identity_matrix(p1) || is_num_or_tensor_or_identity_matrix(p2))) {
                const subtractionResult = $.subtract(p1, inv(p2, $));
                if ($.is_zero(subtractionResult)) {
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
                return hook(items_to_cons(MATH_INNER, p1, p2), "P");
            }
        }
    }
    else {
        // simple check if the two consecutive elements are one the (symbolic) inv
        // of the other. If they are, the answer is the identity matrix
        if (!(is_num_or_tensor_or_identity_matrix(p1) || is_num_or_tensor_or_identity_matrix(p2))) {
            const subtractionResult = $.subtract(p1, inv(p2, $));
            if ($.is_zero(subtractionResult)) {
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
