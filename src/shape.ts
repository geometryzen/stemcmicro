import { ExtensionEnv } from './env/ExtensionEnv';
import { halt } from './runtime/defs';
import { stack_push } from './runtime/stack';
import { cadr } from './tree/helpers';
import { is_tensor } from './tree/tensor/is_tensor';
import { Tensor } from './tree/tensor/Tensor';
import { integer, zero } from './tree/rat/Rat';
import { U } from './tree/tree';

// shape of tensor
export function Eval_shape(p1: U, $: ExtensionEnv): void {
  const result = shape($.valueOf(cadr(p1)), $);
  stack_push(result);
}

function shape(M: U, $: ExtensionEnv): U {
  if (!is_tensor(M)) {
    if (!$.isZero(M)) {
      halt('transpose: tensor expected, 1st arg is not a tensor');
    }
    return zero;
  }

  const { ndim } = M;

  const elems = new Array<U>(ndim);

  const dims = [ndim];
  for (let i = 0; i < ndim; i++) {
    elems[i] = integer(M.dim(i));
  }

  return new Tensor(dims, elems);
}
