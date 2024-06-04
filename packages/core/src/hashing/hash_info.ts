import { booT, Cell, CellHost, create_flt, create_int, create_str, create_sym, create_tensor, epsilon, et, imu, is_keyword, is_rat, is_str, is_sym, Map, Sym } from "@stemcmicro/atoms";
import { Lambda } from "@stemcmicro/context";
import { Atom, Cons, is_atom, is_cons, is_nil, nil, U } from "@stemcmicro/tree";
import { hook_create_err } from "../hooks/hook_create_err";
import { create_uom } from "../operators/uom/uom";

const KIND_NIL = 0;
const KIND_CONS = 1;
const KIND_ATOM = 2;
type KIND = typeof KIND_NIL | typeof KIND_CONS | typeof KIND_ATOM;
type INFO = { kind: KIND; parts: string[] };

// The following constants should be synchronized by the atom's name property in the case of concrete atoms.
// A convenient way to do this, and maintain integrity, is to create an exemplar atom and then read off its name.
// TODO: How do we make this extensible with respect to atoms?
// The hash of an atom is just the Atom.name property.
/**
 *
 */

/**
 * Computes the hash for an atom.
 * The atom argument MUST satisfy is_atom(atom).
 * @param atom An exemplar atom for which the hash string is required.
 */
export function hash_for_atom(atom: Atom): string | never {
    if (is_atom(atom)) {
        return atom.type;
    } else {
        throw new Error(`${atom} is not an atom`);
    }
}

class QuietCellHost implements CellHost {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reaction(expression: U, target: Cell): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reset(from: U, to: U, atom: Cell): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deref(value: U, atom: Cell): void {}
}
const noopHost = new QuietCellHost();
const darkCell = new Cell(nil, noopHost);
function dummyLambdaExpr() {
    return nil;
}

export const HASH_BLADE = hash_for_atom(et);
export const HASH_BOO = hash_for_atom(booT);
export const HASH_CELL = hash_for_atom(darkCell);
export const HASH_DICTIONARY = hash_for_atom(new Map([]));
export const HASH_ERR = hash_for_atom(hook_create_err(nil));
export const HASH_FLT = hash_for_atom(create_flt(1));
export const HASH_HYP = hash_for_atom(epsilon);
export const HASH_IMU = hash_for_atom(imu);
export const HASH_LAMBDA = hash_for_atom(new Lambda(dummyLambdaExpr, "???"));
export const HASH_RAT = hash_for_atom(create_int(1));
export const HASH_STR = hash_for_atom(create_str("") as Atom); // JsString is currently an alias for Str.
export const HASH_SYM = hash_for_atom(create_sym("x"));
export const HASH_TENSOR = hash_for_atom(create_tensor([]));
export const HASH_UOM = hash_for_atom(create_uom("kilogram"));
/**
 * A special wildcard hash that matches any item.
 */
export const HASH_ANY = "U";
export const HASH_ATOM = "Atom";
export const HASH_NIL = "Nil";

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

export function hash_target(opr: Sym, target: Cons): string[] {
    if (is_nil(target)) {
        return [hash_nonop_cons(opr)];
    } else {
        return hash_info(target);
    }
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
            return `(${info.parts.join(" ")})`;
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
            } else if (is_rat(expr.head)) {
                return { kind: KIND_CONS, parts: [hash_arg(expr.head)] };
            } else {
                throw new Error(`${expr}`);
            }
        } else {
            return { kind: KIND_CONS, parts: [hash_arg(expr.opr)] };
        }
    }
    if (is_atom(expr)) {
        return { kind: KIND_ATOM, parts: [hash_for_atom(expr)] };
    }
    if (is_nil(expr)) {
        return { kind: KIND_NIL, parts: [HASH_NIL] };
    }
    throw new Error(`hash_string(${expr})`);
}

/**
 * Note: This is starting to look a lot like the hash_from_match function, except in that case it is a pattern.
 */
function hash_arg(arg: U): string {
    if (is_sym(arg)) {
        return arg.key();
    } else if (is_rat(arg)) {
        return hash_for_atom(arg);
    } else if (is_keyword(arg)) {
        return arg.toString();
    } else if (is_str(arg)) {
        return hash_for_atom(arg);
    } else {
        throw new Error(`hash_arg(arg=${arg})`);
    }
}
