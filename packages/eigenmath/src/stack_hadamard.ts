import { is_tensor } from "@stemcmicro/atoms";
import { ProgramControl, ProgramEnv, ProgramStack } from "@stemcmicro/stack";
import { Cons, is_cons } from "@stemcmicro/tree";
import { copy_tensor, multiply, stopf, value_of } from "./eigenmath";

export function stack_hadamard(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, _: ProgramStack): void {
    const argList = expr.argList;
    try {
        const head = argList.head;
        try {
            _.push(head);
            value_of(env, ctrl, _);
            let xs = argList.rest;
            try {
                while (is_cons(xs)) {
                    const x = xs.head;
                    try {
                        _.push(x);
                        value_of(env, ctrl, _);
                        hadamard(env, ctrl, _);
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

export function hadamard(env: ProgramEnv, ctrl: ProgramControl, _: ProgramStack): void {
    const rhs = _.pop();
    const lhs = _.pop();
    try {
        if (!is_tensor(lhs) || !is_tensor(rhs)) {
            _.push(lhs);
            _.push(rhs);
            multiply(env, ctrl, _);
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
                _.push(lhs.elems[i]);
                _.push(rhs.elems[i]);
                multiply(env, ctrl, _);
                H.elems[i] = _.pop();
            }

            _.push(H);
        } finally {
            H.release();
        }
    } finally {
        lhs.release();
        rhs.release();
    }
}
