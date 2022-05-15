import { ExtensionEnv } from './env/ExtensionEnv';
import { makeList } from './makeList';
import { ARCSINH, SINH } from './runtime/constants';
import { stack_push } from './runtime/stack';
import { flt } from './tree/flt/Flt';
import { is_flt } from './tree/flt/is_flt';
import { cadr } from './tree/helpers';
import { zero } from './tree/rat/Rat';
import { car, U } from './tree/tree';

//            exp(x) - exp(-x)
//  sinh(x) = ----------------
//                   2
export function Eval_sinh(p1: U, $: ExtensionEnv): void {
  const result = ysinh($.valueOf(cadr(p1)), $);
  stack_push(result);
}

export function ysinh(p1: U, $: ExtensionEnv): U {
  if (car(p1) === ARCSINH) {
    return cadr(p1);
  }
  if (is_flt(p1)) {
    let d = Math.sinh(p1.d);
    if (Math.abs(d) < 1e-10) {
      d = 0.0;
    }
    return flt(d);
  }
  if ($.isZero(p1)) {
    return zero;
  }
  return makeList(SINH, p1);
}
