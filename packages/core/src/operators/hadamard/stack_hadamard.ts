import { Cons, is_cons } from "@stemcmicro/tree";
import { copy_tensor, istensor, multiply, stopf, value_of } from "../../eigenmath/eigenmath";
import { ProgramControl } from "../../eigenmath/ProgramControl";
import { ProgramEnv } from "../../eigenmath/ProgramEnv";
import { ProgramStack } from "../../eigenmath/ProgramStack";

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
        if (!istensor(lhs) || !istensor(rhs)) {
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
