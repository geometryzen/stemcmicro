import { nativeInt } from '../nativeInt';
import { is_tensor } from '../operators/tensor/is_tensor';
import { defs, halt, move_top_of_stack } from '../runtime/defs';
import { stack_push } from '../runtime/stack';
import { Tensor } from '../tree/tensor/Tensor';
import { U } from '../tree/tree';

//-----------------------------------------------------------------------------
//
//  Input:    n    Number of args on stack
//
//      tos-n    Right-hand value
//
//      tos-n+1    Left-hand value
//
//      tos-n+2    First index
//
//      .
//      .
//      .
//
//      tos-1    Last index
//
//  Output:    Result on stack
//
//-----------------------------------------------------------------------------
export function set_component(n: number): void {
    if (n < 3) {
        halt('error in indexed assign');
    }

    const s = defs.tos - n;
    const RVALUE = defs.stack[s] as U;
    const lhs: Tensor = defs.stack[s + 1] as Tensor;

    if (!is_tensor(lhs)) {
        halt(
            'error in indexed assign: assigning to something that is not a tensor'
        );
    }

    const m = n - 2;

    if (m > lhs.ndim) {
        halt('error in indexed assign');
    }

    let k = 0;
    for (let i = 0; i < m; i++) {
        const t = nativeInt(defs.stack[s + i + 2] as U);
        if (t < 1 || t > lhs.dim(i)) {
            halt('error in indexed assign\n');
        }
        k = k * lhs.dim(i) + t - 1;
    }

    for (let i = m; i < lhs.ndim; i++) {
        k = k * lhs.dim(i) + 0;
    }

    const dims = lhs.copyDimensions();
    const elems = lhs.copyElements();


    if (lhs.ndim === m) {
        if (is_tensor(RVALUE)) {
            halt('error in indexed assign');
        }
        elems[k] = RVALUE as U;

        move_top_of_stack(defs.tos - n);
        stack_push(new Tensor(dims, elems));
        return;
    }

    // see if the rvalue matches
    if (!is_tensor(RVALUE)) {
        halt('error in indexed assign');
    }

    if (lhs.ndim - m !== RVALUE.ndim) {
        halt('error in indexed assign');
    }

    for (let i = 0; i < RVALUE.ndim; i++) {
        if (dims[m + i] !== RVALUE.dim(i)) {
            halt('error in indexed assign');
        }
    }

    // copy rvalue
    for (let i = 0; i < RVALUE.nelem; i++) {
        elems[k + i] = RVALUE.elem(i);
    }

    move_top_of_stack(defs.tos - n);

    stack_push(new Tensor(dims, elems));
}
