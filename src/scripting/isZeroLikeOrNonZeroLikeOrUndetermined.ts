// This is a key routine to try to determine whether
// the argument looks like zero/false, or non-zero/true,
// or undetermined.
// This is useful in two instances:
//  * to determine if a predicate is true/false
//  * to determine if particular quantity is zero
// Note that if one wants to check if we have a simple
// zero atom or tensor in our hands, then the isZeroAtomOrTensor

import { ExtensionEnv } from "../env/ExtensionEnv";
import { imu } from "../env/imu";
import { zzfloat } from "../operators/float/float";
import { Eval_predicate } from "../operators/predicate/predicate";
import { is_num_or_tensor_or_identity_matrix } from "../runtime/helpers";
import { U } from "../tree/tree";
import { float_eval_abs_eval } from "./float_eval_abs_eval";

// routine is sufficient.
export function isZeroLikeOrNonZeroLikeOrUndetermined(valueOrPredicate: U, $: ExtensionEnv): boolean | null {
    // just like Eval but turns assignments into equality checks
    let evalledArgument = Eval_predicate(valueOrPredicate, $);

    // OK first check if we already have
    // a simple zero (or simple zero tensor)
    if ($.isZero(evalledArgument)) {
        return false;
    }

    // also check if we have a simple numeric value, or a tensor
    // full of simple numeric values (i.e. straight doubles or fractions).
    // In such cases, since we
    // just excluded they are zero, then we take it as
    // a "true"
    if (is_num_or_tensor_or_identity_matrix(evalledArgument)) {
        return true;
    }

    // if we are here we are in the case of value that
    // is not a zero and not a simple numeric value.
    // e.g. stuff like
    // 'sqrt(2)', or 'sin(45)' or '1+i', or 'a'
    // so in such cases let's try to do a float()
    // so we might get down to a simple numeric value
    // in some of those cases
    evalledArgument = zzfloat(evalledArgument, $);

    // anything that could be calculated down to a simple
    // numeric value is now indeed either a
    // double OR a double with an imaginary component
    // e.g. 2.0 or 2.4 + i*5.6
    // (Everything else are things that don't have a numeric
    // value e.g. 'a+b')

    // So, let's take care of the case where we have
    // a simple numeric value with NO imaginary component,
    // things like sqrt(2) or sin(PI)
    // by doing the simple numeric
    // values checks again

    if ($.isZero(evalledArgument)) {
        return false;
    }

    if (is_num_or_tensor_or_identity_matrix(evalledArgument)) {
        return true;
    }

    // here we still have cases of simple numeric values
    // WITH an imaginary component e.g. '1+i',
    // or things that don't have a numeric value e.g. 'a'

    // so now let's take care of the imaginary numbers:
    // since we JUST have to spot "zeros" we can just
    // calculate the absolute value and re-do all the checks
    // we just did

    if (evalledArgument.contains(imu)) {
        evalledArgument = Eval_predicate(float_eval_abs_eval(evalledArgument, $), $);

        // re-do the simple-number checks...

        if ($.isZero(evalledArgument)) {
            return false;
        }

        if (is_num_or_tensor_or_identity_matrix(evalledArgument)) {
            return true;
        }
    }

    // here we have stuff that is not reconducible to any
    // numeric value (or tensor with numeric values) e.g.
    // 'a+b', so it just means that we just don't know the
    // truth value, so we have
    // to leave the whole thing unevalled
    return null;
}
