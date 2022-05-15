import { rat_to_flt } from '../../bignum';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { makeList } from '../../makeList';
import { is_base_of_natural_logarithm } from '../../predicates/is_base_of_natural_logarithm';
import { PI } from '../../runtime/constants';
import { evalFloats } from '../../runtime/defs';
import { stack_push } from '../../runtime/stack';
import { eAsDouble, piAsDouble } from '../../tree/flt/Flt';
import { cadr } from '../../tree/helpers';
import { is_tensor } from '../../tree/tensor/is_tensor';
import { is_rat } from '../../tree/rat/is_rat';
import { Cons, is_cons, U } from '../../tree/tree';

export function Eval_float(expr: Cons, $: ExtensionEnv): void {
    // console.lg(`Eval_floats ${$.toListString(expr)}`);
    evalFloats(() => {
        const A = cadr(expr);
        // console.lg(`Eval_floats A => ${$.toListString(A)}`);
        const B = $.valueOf(A);
        // console.lg(`Eval_floats B => ${$.toListString(B)}`);
        const C = yyfloat(B, $);
        // console.lg(`Eval_floats C => ${$.toListString(C)}`);
        const D = $.valueOf(C);
        // console.lg(`Eval_floats D => ${$.toListString(D)}`);
        stack_push(D);
    });
}
/*
function checkFloatHasWorkedOutCompletely(nodeToCheck: U, $: ExtensionEnv) {
  const numberOfPowers = countOccurrencesOfSymbol(POWER, nodeToCheck, $);
  const numberOfPIs = countOccurrencesOfSymbol(PI, nodeToCheck, $);
  const numberOfEs = countOccurrencesOfSymbol(MATH_E, nodeToCheck, $);
  const numberOfMults = countOccurrencesOfSymbol(MULTIPLY, nodeToCheck, $);
  const numberOfSums = countOccurrencesOfSymbol(ADD, nodeToCheck, $);
  console.lg(`     ... numberOfPowers: ${numberOfPowers}`);
  console.lg(`     ... numberOfPIs: ${numberOfPIs}`);
  console.lg(`     ... numberOfEs: ${numberOfEs}`);
  console.lg(`     ... numberOfMults: ${numberOfMults}`);
  console.lg(`     ... numberOfSums: ${numberOfSums}`);
  if (numberOfPowers > 1 || numberOfPIs > 0 || numberOfEs > 0 || numberOfMults > 1 || numberOfSums > 1) {
    throw new Error('float: some unevalued parts in ' + nodeToCheck);
  }
}
*/

export function zzfloat(p1: U, $: ExtensionEnv): U {
    return evalFloats(function () {
        return $.valueOf(yyfloat($.valueOf(p1), $));
    });
}
// zzfloat doesn't necessarily result in a double
// , for example if there are variables. But
// in many of the tests there should be indeed
// a float, this line comes handy to highlight
// when that doesn't happen for those tests.
// checkFloatHasWorkedOutCompletely(defs.stack[defs.tos-1],$)

export function yyfloat(p1: U, $: ExtensionEnv): U {
    return evalFloats(yyfloat_, p1, $);
}

function yyfloat_(expr: U, $: ExtensionEnv): U {
    if (is_cons(expr)) {
        return makeList(...expr.map(function (x) {
            return yyfloat_(x, $);
        }));
    }
    if (is_tensor(expr)) {
        return expr.map(function (x) {
            return yyfloat_(x, $);
        });
    }
    if (is_rat(expr)) {
        return rat_to_flt(expr);
    }
    if (PI.equals(expr)) {
        return piAsDouble;
    }
    if (is_base_of_natural_logarithm(expr)) {
        return eAsDouble;
    }
    return expr;
}
