import { Sym } from "@stemcmicro/atoms";
import { Cons, cons, Cons1, items_to_cons, nil, U } from "@stemcmicro/tree";
import { Native } from "./Native";
import { native_sym } from "./native_sym";

export { Native, NATIVE_MAX, NATIVE_MIN } from "./Native";
export { code_from_native_sym, is_native, is_native_sym, native_sym, ns_greek_alphabet, ns_mathematical_constants } from "./native_sym";

const ADD = native_sym(Native.add);
const ARG = native_sym(Native.arg);
const EXP = native_sym(Native.exp);
const IMAG = native_sym(Native.imag);
const INNER = native_sym(Native.inner);
const LOG = native_sym(Native.log);
const MULTIPLY = native_sym(Native.multiply);
const REAL = native_sym(Native.real);

function combination1<A extends U>(opr: Sym, a: A): Cons1<Sym, A> {
    const argList = cons(a, nil);
    try {
        return cons(opr, argList) as Cons1<Sym, A>;
    } finally {
        argList.release();
    }
}
/*
function combination2<A extends U, B extends U>(opr: Sym, a: A, b: B): Cons2<Sym, A, B> {
    const bList = cons(b, nil);
    try {
        const argList = cons(a, bList);
        try {
            return cons(opr, argList) as Cons2<Sym, A, B>;
        } finally {
            argList.release();
        }
    } finally {
        bList.release();
    }
}
*/

export function cons_add(...args: U[]): Cons {
    return items_to_cons(ADD, ...args);
}

export function cons_arg<A extends U>(arg: A): Cons1<Sym, A> {
    return combination1(ARG, arg);
}

export function cons_exp<A extends U>(arg: A): Cons1<Sym, A> {
    return combination1(EXP, arg);
}

export function cons_imag<A extends U>(arg: A): Cons1<Sym, A> {
    return combination1(IMAG, arg);
}

export function cons_inner(...args: U[]): Cons {
    return items_to_cons(INNER, ...args);
}

export function cons_log<A extends U>(arg: A): Cons1<Sym, A> {
    return combination1(LOG, arg);
}

export function cons_multiply(...args: U[]): Cons {
    return items_to_cons(MULTIPLY, ...args);
}

export function cons_real<A extends U>(arg: A): Cons1<Sym, A> {
    return combination1(REAL, arg);
}
