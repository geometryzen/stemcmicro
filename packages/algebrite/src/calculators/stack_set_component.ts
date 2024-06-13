import { is_tensor, Tensor } from "@stemcmicro/atoms";
import { num_to_number } from "@stemcmicro/helpers";
import { U } from "@stemcmicro/tree";
import { defs, halt, move_top_of_stack } from "../runtime/defs";
import { stack_push } from "../runtime/stack";

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
export function stack_set_component(n: number): void {
    if (n < 3) {
        halt("error in indexed assign");
    }

    const s = defs.tos - n;
    const rhs = defs.stack[s] as U;
    const lhs: Tensor = defs.stack[s + 1] as Tensor;

    if (!is_tensor(lhs)) {
        halt("error in indexed assign: assigning to something that is not a tensor");
    }

    const m = n - 2;

    if (m > lhs.ndim) {
        halt("error in indexed assign");
    }

    let k = 0;
    for (let i = 0; i < m; i++) {
        const t = num_to_number(defs.stack[s + i + 2] as U);
        if (t < 1 || t > lhs.dim(i)) {
            halt("error in indexed assign\n");
        }
        k = k * lhs.dim(i) + t - 1;
    }

    for (let i = m; i < lhs.ndim; i++) {
        k = k * lhs.dim(i) + 0;
    }

    const dims = lhs.copyDimensions();
    const elems = lhs.copyElements();

    if (lhs.ndim === m) {
        if (is_tensor(rhs)) {
            halt("error in indexed assign");
        }
        elems[k] = rhs as U;

        move_top_of_stack(defs.tos - n);
        stack_push(new Tensor(dims, elems));
        return;
    }

    // see if the rvalue matches
    if (!is_tensor(rhs)) {
        halt("error in indexed assign");
    }

    if (lhs.ndim - m !== rhs.ndim) {
        halt("error in indexed assign");
    }

    for (let i = 0; i < rhs.ndim; i++) {
        if (dims[m + i] !== rhs.dim(i)) {
            halt("error in indexed assign");
        }
    }

    // copy rvalue
    for (let i = 0; i < rhs.nelem; i++) {
        elems[k + i] = rhs.elem(i);
    }

    move_top_of_stack(defs.tos - n);

    stack_push(new Tensor(dims, elems));
}
