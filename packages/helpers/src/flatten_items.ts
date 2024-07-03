import { is_sym, Sym } from "@stemcmicro/atoms";
import { ProgramStack } from "@stemcmicro/stack";
import { is_atom, is_cons, U } from "@stemcmicro/tree";
import { stack_items_to_cons } from "./stack_items_to_cons";

/**
 * Used to "remove the parenthesis" when there is an associative operator.
 *
 * [..., v1, v2, ..., vn] => [..., x1, x2, ..., xm]
 *
 * @param start The starting position on the stack. The end is considered to be the length of the stack. So start = end - n
 * @param opr Either ADD or MULTIPLY or some other associative operator.
 */
export function flatten_items(start: number, opr: Sym, $: ProgramStack): void {
    //                              // [..., v1, v2, ..., vn]
    const vs: U[] = [];
    const end = $.length;
    const n = end - start;
    for (let i = 0; i < n; i++) {
        const v = $.pop();
        vs.push(v);
    }
    vs.reverse(); // [...], v1 contains [v1, v2, ..., vn] with reference counts incremented by pops.

    for (let i = 0; i < n; i++) {
        const vi = vs[i];
        try {
            flatten_item_recursive($, vi, opr, opr);
        } finally {
            vi.release();
        }
    }
}

/**
 * The stack starts out empty.
 * We peel away items from the term and push them onto the stack.
 * This preserves ordering.
 * The operator will not be on the stack.
 */
function flatten_item_recursive(stack: ProgramStack, expr: U, opr: Sym, parent: Sym): void {
    // console.lg("fir", `${expr}`, "parent", `${parent}`);
    if (is_cons(expr)) {
        const head = expr.head;
        const rest = expr.rest;
        try {
            if (is_sym(head)) {
                if (head.equalsSym(opr) && head.equalsSym(parent)) {
                    // head is not wanted because we are flattening.
                    const ts = expr.tail();
                    for (let i = 0; i < ts.length; i++) {
                        const t = ts[i];
                        try {
                            flatten_item_recursive(stack, t, opr, head);
                        } finally {
                            t.release();
                        }
                    }
                } else {
                    // We are either some other operator or we are sitting under
                    const Li = stack.length;
                    flatten_item_recursive(stack, head, opr, head);
                    const ts = expr.tail();
                    for (let i = 0; i < ts.length; i++) {
                        const t = ts[i];
                        try {
                            flatten_item_recursive(stack, t, opr, head);
                        } finally {
                            t.release();
                        }
                    }
                    const Lf = stack.length;
                    const n = Lf - Li;
                    // TODO: Would be nice if list were a
                    stack_items_to_cons(n, stack);
                }
            } else {
                throw new Error();
            }
        } finally {
            head.release();
            rest.release();
        }
    } else if (is_atom(expr)) {
        stack.push(expr);
    } else {
        // It's nil, we don't want it.
    }
}
