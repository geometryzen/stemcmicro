import { is_rat, is_str, is_sym } from "math-expression-atoms";
import { Dictionary } from "../clojurescript/atoms/Dictionary";
import { is_keyword } from "../clojurescript/atoms/Keyword";
import { Sym } from "../tree/sym/Sym";
import { is_atom, is_cons, is_nil, U } from "../tree/tree";

const KIND_NIL = 0;
const KIND_CONS = 1;
const KIND_ATOM = 2;
type KIND = typeof KIND_NIL | typeof KIND_CONS | typeof KIND_ATOM;
type INFO = { kind: KIND, parts: string[] };

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
export function hash_for_atom(atom: U): string | never {
    if (is_atom(atom)) {
        return atom.name;
    }
    else {
        throw new Error(`${atom} is not an atom`);
    }
}
export const HASH_BLADE = 'Blade';
export const HASH_BOO = 'Boo';
export const HASH_DICTIONARY = new Dictionary([]).name;
export const HASH_ERR = 'Err';
export const HASH_FLT = 'Flt';
export const HASH_HYP = 'Hyp';
export const HASH_IMU = 'Imu';
export const HASH_RAT = 'Rat';
export const HASH_STR = 'Str';
export const HASH_SYM = 'Sym';
export const HASH_TENSOR = 'Tensor';
export const HASH_UOM = 'Uom';
/**
 * A special wildcard hash that matches any item.
 */
export const HASH_ANY = 'U';
export const HASH_ATOM = 'Atom';
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
    if (is_atom(expr)) {
        return { kind: KIND_ATOM, parts: [expr.name] };
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
    }
    else if (is_rat(arg)) {
        return arg.name;
    }
    else if (is_keyword(arg)) {
        return arg.toString();
    }
    else if (is_str(arg)) {
        return arg.name;
    }
    else {
        throw new Error(`hash_arg(arg=${arg})`);
    }
}