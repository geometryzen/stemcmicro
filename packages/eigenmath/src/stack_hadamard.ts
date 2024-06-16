import { is_tensor } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { copy_tensor } from "@stemcmicro/helpers";
import { ProgramStack } from "@stemcmicro/stack";
import { Cons, is_cons } from "@stemcmicro/tree";
import { multiply, stopf, value_of } from "./eigenmath";

export function stack_hadamard(expr: Cons, env: ExprContext, $: ProgramStack): void {
    const argList = expr.argList;
    try {
        const head = argList.head;
        try {
            $.push(head);
            value_of(env, $);
            let xs = argList.rest;
            try {
                while (is_cons(xs)) {
                    const x = xs.head;
                    try {
                        $.push(x);
                        value_of(env, $);
                        hadamard(env, $);
                        const rest = xs.rest;
                        xs.release();
                        xs = rest;
                    } finally {
                        x.release();
                    }
                }
            } finally {
                xs.release();
            }
        } finally {
            head.release();
        }
    } finally {
        argList.release();
    }
}

export function hadamard(env: ExprContext, $: ProgramStack): void {
    const rhs = $.pop();
    const lhs = $.pop();
    try {
        if (!is_tensor(lhs) || !is_tensor(rhs)) {
            $.push(lhs);
            $.push(rhs);
            multiply(env, $);
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
                $.push(lhs.elems[i]);
                $.push(rhs.elems[i]);
                multiply(env, $);
                H.elems[i] = $.pop();
            }

            $.push(H);
        } finally {
            H.release();
        }
    } finally {
        lhs.release();
        rhs.release();
    }
}
