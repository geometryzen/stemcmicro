import { is_blade } from "../operators/blade/is_blade";
import { is_err } from "../operators/err/is_err";
import { is_hyp } from "../operators/hyp/is_hyp";
import { is_sym } from "../operators/sym/is_sym";
import { is_imu } from "../operators/imu/is_imu";
import { is_boo } from "../operators/boo/is_boo";
import { is_flt } from "../operators/flt/is_flt";
import { is_rat } from "../operators/rat/is_rat";
import { is_str } from "../operators/str/is_str";
import { Sym } from "../tree/sym/Sym";
import { is_tensor } from "../operators/tensor/is_tensor";
import { is_cons, is_nil, U } from "../tree/tree";
import { is_uom } from "../operators/uom/is_uom";

const NIL = 0;
const CONS = 1;
const ATOM = 2;
type KIND = typeof NIL | typeof CONS | typeof ATOM;
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

export function hash_unaop_cons(opr: Sym, arg: Sym): string {
    return `(${opr.key()} (${arg.key()}))`;
}

export function hash_nonop_cons(opr: Sym): string {
    return `(${opr.key()})`;
}

export function hash_info(expr: U): string[] {
    const protos: string[] = [];
    const info = hash_info_at_level(expr, 0);
    protos.push(compress(info));
    switch (info.kind) {
        case CONS: {
            if (info.parts.length === 3) {
                protos.push(compress({ kind: CONS, parts: [info.parts[0], info.parts[1], HASH_ANY] }));
                protos.push(compress({ kind: CONS, parts: [info.parts[0], HASH_ANY, info.parts[2]] }));
                protos.push(compress({ kind: CONS, parts: [info.parts[0], HASH_ANY, HASH_ANY] }));
                protos.push(compress({ kind: CONS, parts: [info.parts[0]] }));
            }
            if (info.parts.length === 2) {
                protos.push(compress({ kind: CONS, parts: [info.parts[0], HASH_ANY] }));
                protos.push(compress({ kind: CONS, parts: [info.parts[0]] }));
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
        case CONS: {
            return `(${info.parts.join(' ')})`;
        }
        case ATOM: {
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
                return { kind: CONS, parts: [hash_opr(opr), compress(hash_info_at_level(lhs, level + 1)), compress(hash_info_at_level(rhs, level + 1))] };
            }
            if (expr.length === 2) {
                const opr = expr.opr;
                const arg = expr.arg;
                return { kind: CONS, parts: [hash_opr(opr), compress(hash_info_at_level(arg, level + 1))] };
            }
            if (is_sym(expr.opr)) {
                return { kind: CONS, parts: [hash_opr(expr.opr)] };
            }
            else {
                throw new Error(`${expr}`);
            }
        }
        else {
            return { kind: CONS, parts: [hash_opr(expr.opr)] };
        }
    }
    if (is_sym(expr)) {
        return { kind: ATOM, parts: [HASH_SYM] };
    }
    if (is_rat(expr)) {
        return { kind: ATOM, parts: [HASH_RAT] };
    }
    if (is_blade(expr)) {
        return { kind: ATOM, parts: [HASH_BLADE] };
    }
    if (is_imu(expr)) {
        return { kind: ATOM, parts: [HASH_IMU] };
    }
    if (is_tensor(expr)) {
        return { kind: ATOM, parts: [HASH_TENSOR] };
    }
    if (is_uom(expr)) {
        return { kind: ATOM, parts: [HASH_UOM] };
    }
    if (is_flt(expr)) {
        return { kind: ATOM, parts: [HASH_FLT] };
    }
    if (is_nil(expr)) {
        return { kind: NIL, parts: [HASH_NIL] };
    }
    if (is_str(expr)) {
        return { kind: ATOM, parts: [HASH_STR] };
    }
    if (is_boo(expr)) {
        return { kind: ATOM, parts: [HASH_BOO] };
    }
    if (is_hyp(expr)) {
        return { kind: ATOM, parts: [HASH_HYP] };
    }
    if (is_err(expr)) {
        return { kind: ATOM, parts: [HASH_ERR] };
    }
    throw new Error(`hash_string(${expr})`);
}

function hash_opr(opr: U): string {
    if (is_sym(opr)) {
        return opr.key();
    }
    else {
        throw new Error(`hash_opr(opr=${opr})`);
    }
}