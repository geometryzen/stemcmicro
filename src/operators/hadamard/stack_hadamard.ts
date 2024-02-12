import { Cons, is_cons } from "math-expression-tree";
import { copy_tensor, istensor, multiply, pop, push, stopf, value_of } from "../../eigenmath/eigenmath";
import { ProgramControl } from "../../eigenmath/ProgramControl";
import { ProgramEnv } from "../../eigenmath/ProgramEnv";
import { ProgramStack } from "../../eigenmath/ProgramStack";

export function stack_hadamard(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const argList = expr.argList;
    try {
        const head = argList.head;
        try {
            push(head, $);
            value_of(env, ctrl, $);
            let xs = argList.rest;
            try {
                while (is_cons(xs)) {
                    const x = xs.head;
                    try {
                        push(x, $);
                        value_of(env, ctrl, $);
                        hadamard(env, ctrl, $);
                        const rest = xs.rest;
                        xs.release();
                        xs = rest;
                    }
                    finally {
                        x.release();
                    }
                }
            }
            finally {
                xs.release();
            }
        }
        finally {
            head.release();
        }
    }
    finally {
        argList.release();
    }
}

export function hadamard(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {

    const rhs = pop($);
    const lhs = pop($);
    try {
        if (!istensor(lhs) || !istensor(rhs)) {
            push(lhs, $);
            push(rhs, $);
            multiply(env, ctrl, $);
            return;
        }

        if (lhs.ndim !== rhs.ndim) {
            stopf("hadamard");
        }

        const ndim = lhs.ndim;

        for (let i = 0; i < ndim; i++) {
            if (lhs.dims[i] !== rhs.dims[i]) {
                stopf("hadamard");
            }
        }

        const H = copy_tensor(lhs);
        try {
            const nelem = H.nelem;

            for (let i = 0; i < nelem; i++) {
                push(lhs.elems[i], $);
                push(rhs.elems[i], $);
                multiply(env, ctrl, $);
                H.elems[i] = pop($);
            }

            push(H, $);
        }
        finally {
            H.release();
        }
    }
    finally {
        lhs.release();
        rhs.release();
    }
}
