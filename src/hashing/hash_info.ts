import { is_blade } from "../operators/blade/is_blade";
import { is_boo } from "../operators/boo/is_boo";
import { is_err } from "../operators/err/is_err";
import { is_flt } from "../operators/flt/is_flt";
import { is_hyp } from "../operators/hyp/is_hyp";
import { is_imu } from "../operators/imu/is_imu";
import { is_rat } from "../operators/rat/is_rat";
import { is_str } from "../operators/str/is_str";
import { is_sym } from "../operators/sym/is_sym";
import { is_tensor } from "../operators/tensor/is_tensor";
import { is_uom } from "../operators/uom/is_uom";
import { Sym } from "../tree/sym/Sym";
import { is_cons, is_nil, U } from "../tree/tree";

const KIND_NIL = 0;
const KIND_CONS = 1;
const KIND_ATOM = 2;
type KIND = typeof KIND_NIL | typeof KIND_CONS | typeof KIND_ATOM;
type INFO = { kind: KIND, parts: string[] };

export const HASH_BLADE = 'Blade';
export const HASH_BOO = 'Boo';
export const HASH_ERR = 'Err';
export const HASH_FLT = 'Flt';
export const HASH_HYP = 'Hyp';
export const HASH_IMU = 'Imu';
export const HASH_RAT = 'Rat';
export const HASH_STR = 'Str';
export const HASH_SYM = 'Sym';
export const HASH_TENSOR = 'Tensor';
export const HASH_UOM = 'Uom';
export const HASH_ANY = 'U';
export const HASH_NIL = 'Nil';

export function hash_binop_atom_atom(opr: Sym, lhs: string, rhs: string): string {
    return `(${opr.key()} ${lhs} ${rhs})`;
}

export function hash_binop_atom_cons(opr: Sym, lhs: string, rhs: Sym): string {
    return `(${opr.key()} ${lhs} (${rhs.key()}))`;
}

export function hash_binop_cons_atom(opr: Sym, lhs: Sym, rhs: string): string {
    return `(${opr.key()} (${lhs.key()}) ${rhs})`;
}

export function hash_binop_cons_cons(opr: Sym, lhs: Sym, rhs: Sym): string {
    return `(${opr.key()} (${lhs.key()}) (${rhs.key()}))`;
}

export function hash_unaop_atom(opr: Sym, arg: string): string {
    return `(${opr.key()} ${arg})`;
}

/**
 * '(' opr '(' arg ')' ')'
 */
export function hash_unaop_cons(opr: Sym, arg: Sym): string {
    return `(${opr.key()} (${arg.key()}))`;
}

/**
 * '(' opr ')'
 */
export function hash_nonop_cons(opr: Sym): string {
    return `(${opr.key()})`;
}

export function hash_info(expr: U): string[] {
    const protos: string[] = [];
    const info = hash_info_at_level(expr, 0);
    protos.push(compress(info));
    switch (info.kind) {
        case KIND_CONS: {
            if (info.parts.length === 3) {
                protos.push(compress({ kind: KIND_CONS, parts: [info.parts[0], info.parts[1], HASH_ANY] }));
                protos.push(compress({ kind: KIND_CONS, parts: [info.parts[0], HASH_ANY, info.parts[2]] }));
                protos.push(compress({ kind: KIND_CONS, parts: [info.parts[0], HASH_ANY, HASH_ANY] }));
                protos.push(compress({ kind: KIND_CONS, parts: [info.parts[0]] }));
            }
            if (info.parts.length === 2) {
                protos.push(compress({ kind: KIND_CONS, parts: [info.parts[0], HASH_ANY] }));
                protos.push(compress({ kind: KIND_CONS, parts: [info.parts[0]] }));
            }
            break;
        }
        default: {
            // Do nothing;
        }
    }
    return protos;
}

function compress(info: INFO): string {
    switch (info.kind) {
        case KIND_CONS: {
            return `(${info.parts.join(' ')})`;
        }
        case KIND_ATOM: {
            return info.parts[0];
        }
        default: {
            return HASH_NIL;
        }
    }
}

function hash_info_at_level(expr: U, level: number): INFO {
    if (is_cons(expr)) {
        if (level === 0) {
            if (expr.length === 3) {
                const opr = expr.opr;
                const lhs = expr.lhs;
                const rhs = expr.rhs;
                return { kind: KIND_CONS, parts: [hash_arg(opr), compress(hash_info_at_level(lhs, level + 1)), compress(hash_info_at_level(rhs, level + 1))] };
            }
            if (expr.length === 2) {
                const opr = expr.opr;
                const arg = expr.arg;
                return { kind: KIND_CONS, parts: [hash_arg(opr), compress(hash_info_at_level(arg, level + 1))] };
            }
            if (is_sym(expr.head)) {
                return { kind: KIND_CONS, parts: [hash_arg(expr.head)] };
            }
            else if (is_rat(expr.head)) {
                return { kind: KIND_CONS, parts: [hash_arg(expr.head)] };
            }
            else {
                throw new Error(`${expr}`);
            }
        }
        else {
            return { kind: KIND_CONS, parts: [hash_arg(expr.opr)] };
        }
    }
    if (is_sym(expr)) {
        return { kind: KIND_ATOM, parts: [HASH_SYM] };
    }
    if (is_rat(expr)) {
        return { kind: KIND_ATOM, parts: [HASH_RAT] };
    }
    if (is_blade(expr)) {
        return { kind: KIND_ATOM, parts: [HASH_BLADE] };
    }
    if (is_imu(expr)) {
        return { kind: KIND_ATOM, parts: [HASH_IMU] };
    }
    if (is_tensor(expr)) {
        return { kind: KIND_ATOM, parts: [HASH_TENSOR] };
    }
    if (is_uom(expr)) {
        return { kind: KIND_ATOM, parts: [HASH_UOM] };
    }
    if (is_flt(expr)) {
        return { kind: KIND_ATOM, parts: [HASH_FLT] };
    }
    if (is_nil(expr)) {
        return { kind: KIND_NIL, parts: [HASH_NIL] };
    }
    if (is_str(expr)) {
        return { kind: KIND_ATOM, parts: [HASH_STR] };
    }
    if (is_boo(expr)) {
        return { kind: KIND_ATOM, parts: [HASH_BOO] };
    }
    if (is_hyp(expr)) {
        return { kind: KIND_ATOM, parts: [HASH_HYP] };
    }
    if (is_err(expr)) {
        return { kind: KIND_ATOM, parts: [HASH_ERR] };
    }
    throw new Error(`hash_string(${expr})`);
}

/**
 * Note: This is starting to look a lot like the hash_from_match function, except in that case it is a pattern.
 */
function hash_arg(arg: U): string {
    if (is_sym(arg)) {
        // For a symbol, what distinguishes it is the text of the symbol.
        return arg.key();
    }
    else if (is_rat(arg)) {
        // We know that this is 'Rat' and is the same as the hash.
        return arg.name;
    }
    else {
        throw new Error(`hash_arg(arg=${arg})`);
    }
}