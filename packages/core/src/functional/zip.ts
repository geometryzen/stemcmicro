import { StackU } from "@stemcmicro/stack";
import { Cons, is_cons, is_nil, nil, U } from "@stemcmicro/tree";
import { ProgrammingError } from "../programming/ProgrammingError";

function assert_cons_or_nil(expr: U): Cons {
    if (is_cons(expr)) {
        return expr;
    } else if (is_nil(expr)) {
        return nil;
    } else {
        throw new ProgrammingError();
    }
}

export function zip(a: Cons, b: Cons): Cons {
    let p1 = a;
    let p2 = b;
    p1.addRef();
    p2.addRef();
    try {
        const stack = new StackU();
        try {
            const h = stack.tos;
            while (is_cons(p1) || is_cons(p2)) {
                const head1 = p1.head;
                const head2 = p2.head;
                try {
                    stack.push(head1);
                    stack.push(head2);

                    p1.release();
                    p1 = p1.cdr;

                    p2.release();
                    p2 = p2.cdr;
                } finally {
                    head1.release();
                    head2.release();
                }
            }

            stack.list(stack.tos - h);

            return assert_cons_or_nil(stack.pop());
        } finally {
            stack.release();
        }
    } finally {
        p1.release();
        p2.release();
    }
}
