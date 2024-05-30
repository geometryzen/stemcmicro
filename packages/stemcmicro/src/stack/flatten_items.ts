import { is_sym, Sym } from "@stemcmicro/atoms";
import { is_atom, is_cons, U } from "@stemcmicro/tree";
import { list } from "../eigenmath/eigenmath";
import { ProgramStack } from "../eigenmath/ProgramStack";
import { ProgrammingError } from "../programming/ProgrammingError";

/**
 * [..., v1, v2, ..., vn] => [..., x1, x2, ..., xm]
 *
 * @param start The starting position on the stack.
 */
export function flatten_items(start: number, opr: Sym, _: ProgramStack): void {
    //                              // [..., v1, v2, ..., vn]
    const vs: U[] = [];
    const end = _.length;
    const n = end - start;
    for (let i = 0; i < n; i++) {
        const v = _.pop();
        vs.push(v);
    }
    vs.reverse(); // [...], v1 contains [v1, v2, ..., vn] with reference counts incremented by pops.

    for (let i = 0; i < n; i++) {
        const vi = vs[i];
        try {
            flatten_item_recursive(_, vi, opr, opr);
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
                    list(n, stack);
                }
            } else {
                throw new ProgrammingError();
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
