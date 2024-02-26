/* eslint-disable no-console */
import { assert_sym, Boo, create_keyword_ns, create_tensor, is_num, is_rat, Map, negOne, one, Tensor } from 'math-expression-atoms';
import { Native, native_sym } from 'math-expression-native';
import { items_to_cons, nil, pos_end_items_to_cons, U } from 'math-expression-tree';
import { ShareableStack } from '../env/Stack';
import {
    QUOTE,
    TRANSPOSE,
    TRANSPOSE_CHAR_CODE
} from '../runtime/constants';
import { assert_token_code } from './assert_token_code';
import { clone_symbol_using_info } from './clone_symbol_using_info';
import { T_ASTRX, T_ASTRX_ASTRX, T_BANG, T_CARET, T_COLON, T_COLON_EQ, T_COMMA, T_END, T_EQ, T_EQ_EQ, T_FLT, T_FUNCTION, T_FWDSLASH, T_GT, T_GTEQ, T_GTGT, T_INT, T_LCURLY, T_LPAR, T_LSQB, T_LT, T_LTEQ, T_LTLT, T_MIDDLE_DOT, T_MINUS, T_NTEQ, T_PLUS, T_RCURLY, T_RPAR, T_RSQB, T_STR, T_SYM, T_VBAR } from './codes';
import { InputState } from './InputState';
import { one_divided_by } from './one_divided_by';
import { scanner_negate } from './scanner_negate';
import { TokenCode } from './Token';

// TODO: Obtain ALL Sym constants from math-expression-native using native_sym(Native.xyz)
const ASSIGN = native_sym(Native.assign);
const FACTORIAL = native_sym(Native.factorial);
const MATH_INNER = native_sym(Native.inner);
const MATH_LCO = native_sym(Native.lco);
const MATH_MUL = native_sym(Native.multiply);
const MATH_OUTER = native_sym(Native.outer);
const MATH_POW = native_sym(Native.pow);
const MATH_RCO = native_sym(Native.rco);

function assert_pos(pos: number | undefined): number {
    if (typeof pos === 'number') {
        if (isNaN(pos)) {
            throw new Error(`pos ${pos} is not a number.`);
        }
        else {
            return pos;
        }
    }
    else {
        // TODO: Some work to be done here for explicit association of addition or multiplication.
        return Number.MAX_SAFE_INTEGER;
        // throw new Error(`pos ${pos} is not a number.`);
    }
}

function assert_end(end: number | undefined): number {
    if (typeof end === 'number') {
        if (isNaN(end)) {
            throw new Error(`end ${end} is not a number.`);
        }
        else {
            return end;
        }
    }
    else {
        // TODO: Some work to be done here for explicit association of addition or multiplication.
        return Number.MIN_SAFE_INTEGER;
        // throw new Error(`end ${end} is not a number.`);
    }
}

export const COMPONENT = native_sym(Native.component);

export interface ScanOptions {
    /**
     * Use '^' (caret) or '**' for exponentiation.
     */
    useCaretForExponentiation: boolean;
    /**
     * Use "(" and ")" otherwise "[" and "]".
     * 
     * This is used to emulate Eigenmath.
     */
    useParenForTensors: boolean;
    /**
     * Determines how the parser will return additive expressions.
     * 
     * "a + b + c" => (+ a b c)         explicitAssocAdd=false
     * "a + b + c" => (+ (+ a b) c)     explicitAssocAdd=true
     */
    explicitAssocAdd: boolean;
    /**
     * Determines how the parser will return multiplicative expressions.
     * 
     * "a * b * c" => (* a b c)         explicitAssocMul=false
     * "a * b * c" => (* (* a b) c)     explicitAssocMul=true
     */
    explicitAssocMul: boolean;
    /**
     * Determines how the parser will return exterior product expressions.
     * 
     * "a ^ b ^ c" => (^ a b c)         explicitAssocExt=false
     * "a ^ b ^ c" => (^ (^ a b) c)     explicitAssocExt=true
     */
    explicitAssocExt: boolean;

    // TODO: Consider replacing these by something more general (Sym,boolean) pairs?
}

/**
 * Scans the input string, s, leaving the expression on the stack.
 * Returns zero when there is nothing left to scan.
 * @param sourceText The input string.
 * @param offset The number which must be added to all (pos,end) pairs to make positions.
 * @returns The number of characters scanned.
 */
export function scan(sourceText: string, offset: number, options: Readonly<ScanOptions>): [scanned: number, tree: U] {

    const state = new InputState(sourceText, 0, offset);

    state.get_token_skip_newlines();

    if (state.code === T_END) {
        return [0, nil];
    }

    const expr = scan_assignment_stmt(state, options);

    return [state.scanned, expr];
}

export function scan_meta(sourceText: string, options: Readonly<ScanOptions>): U {
    const state = new InputState(sourceText, 0, 0);
    state.meta_mode = true;
    state.get_token();
    if (state.code === T_END) {
        return nil;
    }
    return scan_assignment_stmt(state, options);
}

/**
 * ':='
 */
function is_colon_equals(code: TokenCode): boolean {
    switch (code) {
        case T_COLON_EQ: {
            return true;
        }
        default: {
            return false;
        }
    }
}

/**
 * '='
 */
function is_equals(code: TokenCode): boolean {
    switch (code) {
        case T_EQ: {
            return true;
        }
        default: {
            return false;
        }
    }
}

/**
 * ':=' | '='
 */
function is_assignment_operator(code: TokenCode): boolean {
    // console.lg("is_stmt", code);
    return is_colon_equals(code) || is_equals(code);
}

function scan_assignment_stmt(state: InputState, options: Readonly<ScanOptions>): U {
    // console.lg(`scan_assignment_stmt(state.code.text=${state.code.text})`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`scan_stmt => ${retval} @ ${description}`);
        return retval;
    };

    let pos: number = Number.MAX_SAFE_INTEGER;
    let end: number = Number.MIN_SAFE_INTEGER;

    const lhs = scan_relational_expr(state, options);
    pos = Math.min(assert_pos(lhs.pos), pos);
    end = Math.max(assert_end(lhs.end), end);

    if (is_assignment_operator(state.code)) {

        // Keep the scanning information for the operator so that we can add it to the tree.
        const op = state.tokenToSym();
        pos = Math.min(assert_pos(op.pos), pos);
        end = Math.max(assert_end(op.end), pos);
        const was_quote_assign = is_colon_equals(state.code);

        state.get_token_skip_newlines();

        const rhs = scan_relational_expr(state, options);
        pos = Math.min(assert_pos(rhs.pos), pos);
        end = Math.max(assert_end(rhs.end), end);

        // if it's a := then add a quote
        if (was_quote_assign) {
            const quoteExpr = items_to_cons(QUOTE.clone(op.pos, op.end), rhs);
            // TODO: Do we need to save off the op.pos and op.end earlier b/c mutable?
            const x = pos_end_items_to_cons(pos, end, ASSIGN.clone(op.pos, op.end), lhs, quoteExpr);
            return hook(x, "A1");
        }
        else {
            // TODO: Do we need to save off the op.pos and op.end earlier b/c mutable?
            const x = pos_end_items_to_cons(pos, end, ASSIGN.clone(op.pos, op.end), lhs, rhs);
            return hook(x, "A2");
        }
    }
    else {
        return hook(lhs, "A3");
    }

}

/**
 * '==' | '!=' | '<=' | '>=' | '<' | '>' 
 */
function is_relational(code: TokenCode): boolean {
    switch (code) {
        case T_EQ_EQ:
        case T_NTEQ:
        case T_LTEQ:
        case T_GTEQ:
        case T_LT:
        case T_GT: {
            return true;
        }
        default: {
            return false;
        }
    }
}

/**
 * relational ::= add [REL add]?
 */
function scan_relational_expr(state: InputState, options: Readonly<ScanOptions>): U {
    // console.lg(`scan_relational_expr(state.code.text=${state.code.text})`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`scan_relational => ${retval} @ ${description}`);
        return retval;
    };

    let pos: number = Number.MAX_SAFE_INTEGER;
    let end: number = Number.MIN_SAFE_INTEGER;

    const lhs = scan_additive_expr(state, options);
    pos = Math.min(assert_pos(lhs.pos), pos);
    end = Math.max(assert_end(lhs.end), end);

    if (is_relational(state.code)) {

        const opr = state.tokenToSym();
        pos = Math.min(assert_pos(opr.pos), pos);
        end = Math.max(assert_end(opr.end), end);

        state.get_token_skip_newlines();

        const rhs = scan_additive_expr(state, options);
        pos = Math.min(assert_pos(rhs.pos), pos);
        end = Math.max(assert_end(rhs.end), end);

        const x = pos_end_items_to_cons(pos, end, opr, lhs, rhs);
        return hook(x, "B1");
    }
    else {
        return hook(lhs, "B2");
    }

}

/**
 * '+' || '-'
 */
function is_additive_operator(code: TokenCode): boolean {
    switch (code) {
        case T_PLUS:
        case T_MINUS: {
            return true;
        }
        default: {
            return false;
        }
    }
}
function scan_additive_expr(state: InputState, options: Readonly<ScanOptions>): U {
    // console.lg(`scan_additive_expr(state.code.text=${state.code.text})`);
    // console.lg("explicitAssocAdd", options.explicitAssocAdd);
    if (options.explicitAssocAdd) {
        return scan_additive_expr_explicit(state, options);
    }
    else {
        return scan_additive_expr_implicit(state, options);
    }
}

/**
 * a + b + c => (+ a b c)
 */
function scan_additive_expr_implicit(state: InputState, options: Readonly<ScanOptions>): U {
    const terms: U[] = [native_sym(Native.add)];

    let pos: number = Number.MAX_SAFE_INTEGER;
    let end: number = Number.MIN_SAFE_INTEGER;

    switch (state.code) {
        case T_PLUS: {
            const plus = state.tokenToSym();
            pos = Math.min(assert_pos(plus.pos), pos);
            end = Math.max(assert_end(plus.end), end);

            state.get_token_skip_newlines();

            const term = scan_multiplicative_expr(state, options);
            pos = Math.min(assert_pos(term.pos), pos);
            end = Math.max(assert_end(term.end), end);

            terms.push(term);
            break;
        }
        case T_MINUS: {
            const minus = state.tokenToSym();
            pos = Math.min(assert_pos(minus.pos), pos);
            end = Math.max(assert_end(minus.end), end);

            state.get_token_skip_newlines();

            const term = scan_multiplicative_expr(state, options);
            pos = Math.min(assert_pos(term.pos), pos);
            end = Math.max(assert_end(term.end), end);

            const neg = negate(term);
            neg.pos = assert_pos(term.pos);
            neg.end = assert_pos(term.end);

            terms.push(neg);
            break;
        }
        default: {
            const term = scan_multiplicative_expr(state, options);
            pos = Math.min(assert_pos(term.pos), pos);
            end = Math.max(assert_end(term.end), end);
            terms.push(term);
        }
    }

    while (state.code === T_PLUS || state.code === T_MINUS) {
        if (state.code === T_PLUS) {
            const plus = state.tokenToSym();
            pos = Math.min(assert_pos(plus.pos), pos);
            end = Math.max(assert_end(plus.end), end);

            state.get_token_skip_newlines();

            const term = scan_multiplicative_expr(state, options);
            pos = Math.min(assert_pos(term.pos), pos);
            end = Math.max(assert_end(term.end), end);

            terms.push(term);
        }
        else {
            const minus = state.tokenToSym();
            pos = Math.min(assert_pos(minus.pos), pos);
            end = Math.max(assert_end(minus.end), end);

            state.get_token_skip_newlines();

            const term = scan_multiplicative_expr(state, options);
            pos = Math.min(assert_pos(term.pos), pos);
            end = Math.max(assert_end(term.end), end);

            terms.push(negate(term));
        }
    }

    if (terms.length === 2) {
        const x = terms[1];
        x.pos = assert_pos(pos);
        x.end = assert_end(end);
        return x;
    }
    else {
        return pos_end_items_to_cons(pos, end, ...terms);
    }
}

function negate(expr: U): U {
    if (is_num(expr)) {
        return expr.neg();
    }
    else {
        return pos_end_items_to_cons(assert_pos(expr.pos), assert_end(expr.end), MATH_MUL, expr, negOne);
    }
}

/**
 * a + b + c => (a + b) + c
 */
function scan_additive_expr_explicit(state: InputState, options: Readonly<ScanOptions>): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`scan_additive => ${retval} @ ${description}`);
        return retval;
    };

    let result = scan_multiplicative_expr(state, options);

    while (is_additive_operator(state.code)) {
        switch (state.code) {
            case T_PLUS: {
                const opr = clone_symbol_using_info(native_sym(Native.add), state.tokenToSym());
                state.get_token();
                result = items_to_cons(opr, result, scan_multiplicative_expr(state, options));
                break;
            }
            default: {
                // TODO: Remove this negate code and handle it in the engine.
                // Make sure to also add test for a-b-c = (a-b)-c
                assert_token_code(state.code, T_MINUS);
                const opr = clone_symbol_using_info(native_sym(Native.add), state.tokenToSym());
                state.get_token();
                result = items_to_cons(opr, result, scanner_negate(scan_multiplicative_expr(state, options)));
                break;
            }
        }
    }
    return hook(result, "A");
}

/**
 * '*' | '/' | '(' | 'Sym' | 'Function' | 'Int' | 'Flt' | 'Str'
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function is_multiplicative_operator_or_factor_pending(code: TokenCode): boolean {
    // console.lg(`is_multiplicative_operator code.text="${code.text}", code.code=${code.code}`);
    switch (code) {
        case T_ASTRX:
        case T_FWDSLASH: {
            return true;
        }
        // TOOD: Not sure if this belongs here anymore.
        // Probably used for juxtaposition as multiplication (implicit multiplication).
        // case T_LPAR:
        // case T_SYM: {
        //    return true;
        // }
        // case T_FUNCTION:
        // case T_INT:
        // case T_FLT:
        /*
        case T_STR: {
                return false;
                // implicit multiplication can't cross line
                // throw new Error("end <<<< pos");
                // state.end = state.pos; // better error display
                // return false;
        }
        */
    }
    return false;
}
export function scan_multiplicative_expr(state: InputState, options: Readonly<ScanOptions>): U {
    // console.lg(`scan_multiplicative_expr(state.code.text=${state.code.text})`);
    if (options.explicitAssocMul) {
        return scan_multiplicative_expr_explicit(state, options);
    }
    else {
        return scan_multiplicative_expr_implicit(state, options);
    }
}

/**
 * 
 */
export function scan_multiplicative_expr_implicit(state: InputState, options: Readonly<ScanOptions>): U {

    let pos: number = Number.MAX_SAFE_INTEGER;
    let end: number = Number.MIN_SAFE_INTEGER;

    const lhs = scan_outer_expr(state, options);
    try {
        pos = Math.min(assert_pos(lhs.pos), pos);
        end = Math.max(assert_end(lhs.end), end);
        const stack = new ShareableStack<U>();
        try {
            stack.push(lhs);
            /*
            if (parse_time_simplifications) {
                simplify_1_in_products(results);
            }
            */

            while (is_multiplicative_operator_or_factor_pending(state.code)) {
                if (state.code === T_ASTRX) {
                    state.get_token_skip_newlines();
                    const outer = scan_outer_expr(state, options);
                    try {
                        pos = Math.min(assert_pos(outer.pos), pos);
                        end = Math.max(assert_end(outer.end), end);
                        stack.push(outer);
                    }
                    finally {
                        outer.release();
                    }
                }
                else if (state.code === T_FWDSLASH) {
                    // in case of 1/... then
                    // we scanned the 1, we get rid
                    // of it because otherwise it becomes
                    // an extra factor that wasn't there and
                    // things like
                    // 1/(2*a) become 1*(1/(2*a))
                    // W
                    simplify_1_in_products(stack);
                    state.get_token_skip_newlines();
                    const outer = scan_outer_expr(state, options);
                    try {
                        pos = Math.min(assert_pos(outer.pos), pos);
                        end = Math.max(assert_end(outer.end), end);
                        const x = one_divided_by(outer);
                        stack.push(x);
                        x.release();
                    }
                    finally {
                        outer.release();
                    }
                }
                /*
                else if (tokenCharCode() === dotprod_unicode) {
                    state.advance();
                    results.push(items_to_cons(symbol(INNER), results.pop(), scan_factor()));
                }
                */
                else {
                    // This will be dead code unless perhaps if we allow juxtaposition.
                    // console.lg(`state.code.code=${state.code.code}, state.code.text=${state.code.text}`);
                    const outer = scan_outer_expr(state, options);
                    try {
                        pos = Math.min(assert_pos(outer.pos), pos);
                        end = Math.max(assert_end(outer.end), end);
                        stack.push(outer);
                    }
                    finally {
                        outer.release();
                    }
                }
                /*
                if (parse_time_simplifications) {
                    multiply_consecutive_constants(results);
                    simplify_1_in_products(results);
                }
                */
            }

            if (stack.length === 0) {
                return one;
            }
            else if (stack.length == 1) {
                const x = stack.pop();
                x.pos = assert_pos(pos);
                x.end = assert_end(end);
                return x;
            }
            else {
                const results: U[] = [];
                try {
                    while (stack.length > 0) {
                        const x = stack.pop();
                        results.push(x);
                    }
                    results.reverse();
                    return pos_end_items_to_cons(pos, end, MATH_MUL, ...results);
                }
                finally {
                    // release all the elements in results.
                    for (let i = 0; i < results.length; i++) {
                        results[i].release();
                    }
                    results.length = 0;
                }
            }
        }
        finally {
            stack.release();
        }
    }
    finally {
        lhs.release();
    }
}

function simplify_1_in_products(factors: ShareableStack<U>): void {
    if (factors.length > 0) {
        const factor = factors.peek(factors.length - 1);
        try {
            if (is_rat(factor) && factor.isOne()) {
                factors.pop().release();
            }
        }
        finally {
            factor.release();
        }
    }
}


/**
 * Corresponds to scan_term
 */
export function scan_multiplicative_expr_explicit(state: InputState, options: Readonly<ScanOptions>): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`scan_multiplicative => ${retval} @ ${description}`);
        return retval;
    };

    let result = scan_outer_expr(state, options);

    while (is_multiplicative_operator_or_factor_pending(state.code)) {
        switch (state.code) {
            case T_ASTRX: {
                const opr = clone_symbol_using_info(MATH_MUL, state.tokenToSym());
                state.get_token();
                result = items_to_cons(opr, result, scan_outer_expr(state, options));
                break;
            }
            case T_FWDSLASH: {
                // TODO: For now we leave this canonicalization in the scanner.
                // But I think it belongs in the transformations.
                // console.lg("result", JSON.stringify(result));
                if (is_rat(result) && result.isOne()) {
                    state.get_token();
                    const outer = scan_outer_expr(state, options);
                    try {
                        result = one_divided_by(outer);
                    }
                    finally {
                        outer.release();
                    }
                }
                else {
                    const mulOp = clone_symbol_using_info(MATH_MUL, state.tokenToSym());
                    state.get_token();
                    const outer = scan_outer_expr(state, options);
                    try {
                        const x = one_divided_by(outer);
                        result = items_to_cons(mulOp, result, x);
                        x.release();
                    }
                    finally {
                        outer.release();
                    }
                }
                break;
            }
            default: {
                throw new Error(`${JSON.stringify(state)}`);
                // result = makeList(opr, result, scan_outer(state));
                // factors.push(scan_outer(state));
            }
        }
    }
    return hook(result, "A");
}

/**
 * ! newline && '^'
 */
function is_outer(code: TokenCode, useCaretForExponentiation: boolean): boolean {
    if (code === T_CARET) {
        if (useCaretForExponentiation) {
            return false;
        }
        else {
            return true;
        }
    }
    return false;
}

function scan_outer_expr(state: InputState, options: Readonly<ScanOptions>): U {

    let pos: number = Number.MAX_SAFE_INTEGER;
    let end: number = Number.MIN_SAFE_INTEGER;

    let result = scan_inner_expr(state, options);
    pos = Math.min(assert_pos(result.pos), pos);
    end = Math.max(assert_end(result.end), end);

    while (is_outer(state.code, options.useCaretForExponentiation)) {
        const opr = clone_symbol_using_info(MATH_OUTER, state.tokenToSym());
        pos = Math.min(assert_pos(opr.pos), pos);
        end = Math.max(assert_end(opr.end), end);

        state.get_token();

        const inner = scan_inner_expr(state, options);
        pos = Math.min(assert_pos(inner.pos), pos);
        end = Math.max(assert_end(inner.end), end);

        result = items_to_cons(opr, result, inner);
        result.pos = assert_pos(pos);
        result.end = assert_end(end);
    }

    result.pos = assert_pos(pos);
    result.end = assert_end(end);
    return result;
}

/**
 * ! newline && ('<<' || '>>' || Vbar || 'middle-dot')
 */
function is_inner_or_contraction(code: TokenCode): boolean {
    return code === T_LTLT || code === T_GTGT || code === T_VBAR || code === T_MIDDLE_DOT;
}

function scan_inner_expr(state: InputState, options: Readonly<ScanOptions>): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`results (INNER) => ${retval} @ ${description}`);
        return retval;
    };

    let pos: number = Number.MAX_SAFE_INTEGER;
    let end: number = Number.MIN_SAFE_INTEGER;

    let result = scan_power_expr(state, options);
    pos = Math.min(assert_pos(result.pos), pos);
    end = Math.max(assert_end(result.end), end);

    while (is_inner_or_contraction(state.code)) {
        switch (state.code) {
            case T_LTLT: {
                const opr = clone_symbol_using_info(MATH_LCO, state.tokenToSym());
                state.get_token();
                const pow = scan_power_expr(state, options);
                pos = Math.min(assert_pos(pow.pos), pos);
                end = Math.max(assert_end(pow.end), end);
                result = items_to_cons(opr, result, pow);
                result.pos = assert_pos(pos);
                result.end = assert_end(end);
                break;
            }
            case T_GTGT: {
                const opr = clone_symbol_using_info(MATH_RCO, state.tokenToSym());
                state.get_token();
                const pow = scan_power_expr(state, options);
                pos = Math.min(assert_pos(pow.pos), pos);
                end = Math.max(assert_end(pow.end), end);
                result = items_to_cons(opr, result, pow);
                result.pos = assert_pos(pos);
                result.end = assert_end(end);
                break;
            }
            case T_VBAR: {
                const opr = clone_symbol_using_info(MATH_INNER, state.tokenToSym());
                state.get_token();
                const pow = scan_power_expr(state, options);
                pos = Math.min(assert_pos(pow.pos), pos);
                end = Math.max(assert_end(pow.end), end);
                result = items_to_cons(opr, result, pow);
                result.pos = assert_pos(pos);
                result.end = assert_end(end);
                break;
            }
            default: {
                state.expect(T_MIDDLE_DOT);
                const opr = clone_symbol_using_info(MATH_INNER, state.tokenToSym());
                state.get_token();
                const pow = scan_power_expr(state, options);
                pos = Math.min(assert_pos(pow.pos), pos);
                end = Math.max(assert_end(pow.end), end);
                result = items_to_cons(opr, result, pow);
                result.pos = assert_pos(pos);
                result.end = assert_end(end);
                break;
            }
        }
    }
    result.pos = assert_pos(pos);
    result.end = assert_end(end);
    return hook(result, "A");
}

/**
 * '^' | '**'
 * @param code
 * @param useCaretForExponentiation 
 * @returns 
 */
function is_power(code: TokenCode, useCaretForExponentiation: boolean): boolean {
    if (useCaretForExponentiation) {
        return code === T_CARET;
    }
    else {
        return code === T_ASTRX_ASTRX;
    }
}

function scan_power_expr(state: InputState, options: Readonly<ScanOptions>): U {
    // Using a stack because exponentiation is right-associative.
    // We'll push the operands as well in order to retain scanning location information.
    let pos: number = Number.MAX_SAFE_INTEGER;
    let end: number = Number.MIN_SAFE_INTEGER;

    const stack: U[] = [];
    const lhs = scan_unary_expr(state, options);
    pos = Math.min(assert_pos(lhs.pos), pos);
    end = Math.max(assert_end(lhs.end), end);

    stack.push(lhs);

    while (is_power(state.code, options.useCaretForExponentiation)) {
        stack.push(state.tokenToSym());
        state.get_token();
        const rhs = scan_unary_expr(state, options);
        pos = Math.min(assert_pos(rhs.pos), pos);
        end = Math.max(assert_end(rhs.end), end);
        stack.push(rhs);
    }

    while (stack.length > 0) {
        const rhs = stack.pop() as U;
        if (stack.length > 0) {
            const opr = assert_sym(stack.pop() as U);
            const lhs = stack.pop() as U;
            stack.push(items_to_cons(clone_symbol_using_info(MATH_POW, opr), lhs, rhs));
        }
        else {
            rhs.pos = assert_pos(pos);
            rhs.end = assert_end(end);
            return rhs;
        }
    }
    throw new Error();
}

function scan_unary_expr(state: InputState, options: Readonly<ScanOptions>): U {

    const code = state.code;
    switch (code) {
        case T_PLUS: {
            let pos: number = Number.MAX_SAFE_INTEGER;
            let end: number = Number.MIN_SAFE_INTEGER;

            const opr = state.tokenToSym();

            pos = Math.min(assert_pos(opr.pos), pos);
            end = Math.max(assert_end(opr.end), end);

            state.get_token();

            const x = scan_unary_expr(state, options);
            pos = Math.min(assert_pos(x.pos), pos);
            end = Math.max(assert_end(x.end), end);

            x.pos = assert_pos(pos);
            x.end = assert_end(end);
            return x;
        }
        case T_MINUS: {
            let pos: number = Number.MAX_SAFE_INTEGER;
            let end: number = Number.MIN_SAFE_INTEGER;

            const opr = state.tokenToSym();

            pos = Math.min(assert_pos(opr.pos), pos);
            end = Math.max(assert_end(opr.end), end);

            state.get_token();

            const x = scan_unary_expr(state, options);
            pos = Math.min(assert_pos(x.pos), pos);
            end = Math.max(assert_end(x.end), end);

            x.pos = assert_pos(pos);
            x.end = assert_end(end);
            return scanner_negate(x);
        }
        default: {
            return scan_grouping_expr(state, options);
        }
    }
}

function scan_grouping_expr(state: InputState, options: Readonly<ScanOptions>): U {
    // console.lg(`scan_grouping_expr(state.code.text=${state.code.text})`);
    const code = state.code;
    if (code === T_LPAR) {
        if (options.useParenForTensors) {
            return scan_tensor(state, options);
        }
        else {
            return scan_grouping(state, options);
        }
    }
    else {
        return scan_factor(state, options);
    }
}

/**
 *
 */
function scan_atom(state: InputState, options: Readonly<ScanOptions>): [is_num: boolean, expr: U] {
    // let pos: number = Number.MAX_SAFE_INTEGER;
    // let end: number = Number.MIN_SAFE_INTEGER;

    // console.lg(`scan_atom(state.code.text=${state.code.text})`);
    const code = state.code;
    // TODO: Convert this to a switch.
    if (code === T_LPAR) {
        if (options.useParenForTensors) {
            return [false, scan_tensor(state, options)];
        }
        else {
            return [false, scan_grouping(state, options)];
        }
    }
    else if (code === T_SYM) {
        // TODO: This code should probably be merged into scan_symbol.
        if (state.text === 'true') {
            state.pos;
            state.end;
            const value = new Boo(true, assert_pos(state.pos), assert_end(state.end));
            state.get_token();
            return [false, value];
        }
        else if (state.text === 'false') {
            const value = new Boo(false, assert_pos(state.pos), assert_end(state.end));
            state.get_token();
            return [false, value];
        }
        else {
            return [false, scan_symbol(state)];
        }
    }
    else if (code === T_FUNCTION) {
        return [false, scan_function_call(state, options)];
    }
    else if (code === T_LSQB && !options.useParenForTensors) {
        return [false, scan_tensor(state, options)];
    }
    else if (code === T_LCURLY) {
        return [false, scan_map(state, options)];
    }
    else if (code === T_INT) {
        return [true, scan_int(state)];
    }
    else if (code === T_FLT) {
        return [true, scan_flt(state)];
    }
    else if (code === T_STR) {
        return [false, scan_string(state)];
    }
    else {
        // We were probably expecting something.
        // console.lg(`code=${JSON.stringify(code)}`);
        state.scan_error(`Unexpected token ${JSON.stringify(code.text)}`);
    }
}

function scan_flt(state: InputState): U {
    const flt = state.tokenToFlt();
    state.get_token();
    return flt;
}

function scan_int(state: InputState): U {
    const int = state.tokenToInt();
    state.get_token();
    return int;
}

function scan_string(state: InputState): U {
    const str = state.tokenToStr();
    state.get_token();
    return str;
}

function scan_factor(state: InputState, options: Readonly<ScanOptions>): U {

    let pos: number = assert_pos(Number.MAX_SAFE_INTEGER);
    let end: number = assert_end(Number.MIN_SAFE_INTEGER);

    const ff = scan_atom(state, options);
    const ff_is_num = ff[0];
    let result = ff[1];
    pos = assert_pos(Math.min(assert_pos(result.pos), pos));
    end = assert_end(Math.max(assert_end(result.end), end));

    // after the main initial part of the factor that
    // we just scanned above,
    // we can get an arbitrary number of appendages
    // of the form ...[...](...)...
    // If the main part is not a number, then these are all, respectively,
    //  - index references (as opposed to tensor definition) and
    //  - function calls without an explicit function name
    //    (instead of subexpressions or parameters of function
    //    definitions or function calls with an explicit function
    //    name), respectively
    while (state.code === T_LSQB || (state.code === T_LPAR && !ff_is_num)) {
        if (state.code === T_LSQB) {
            result = scan_index(result, state, options);
            pos = Math.min(assert_pos(result.pos), pos);
            end = Math.max(assert_end(result.end), end);
        }
        else if (state.code === T_LPAR) {
            // console.lg "( as function call without function name "
            result = scan_function_call_without_function_name(result, state, options);
            pos = Math.min(assert_pos(result.pos), pos);
            end = Math.max(assert_end(result.end), end);
        }
    }

    while (state.code === T_BANG) {
        state.get_token();
        result = items_to_cons(FACTORIAL, result);
    }

    // in theory we could already count the
    // number of transposes and simplify them
    // away, but it's not that clean to have
    // multiple places where that happens, and
    // the parser is not the place.
    while (state.tokenCharCode() === TRANSPOSE_CHAR_CODE) {
        state.get_token();
        result = items_to_cons(TRANSPOSE, result);
    }

    result.pos = assert_pos(pos);
    result.end = assert_end(end);
    return result;
}

function scan_index(indexable: U, state: InputState, options: Readonly<ScanOptions>): U {

    let pos: number = Number.MAX_SAFE_INTEGER;
    let end: number = Number.MIN_SAFE_INTEGER;

    state.expect(T_LSQB);
    const lsqb = state.tokenToSym();
    pos = Math.min(assert_pos(lsqb.pos), pos);
    end = Math.max(assert_end(lsqb.end), end);
    state.get_token();

    const items: U[] = [COMPONENT, indexable];
    if (state.code !== T_RSQB) {

        const arg = scan_additive_expr(state, options);
        pos = Math.min(assert_pos(arg.pos), pos);
        end = Math.max(assert_end(arg.end), end);

        items.push(arg);
        while (state.code === T_COMMA) {
            state.expect(T_COMMA);
            const comma = state.tokenToSym();
            pos = Math.min(assert_pos(comma.pos), pos);
            end = Math.max(assert_end(comma.end), end);
            state.get_token();

            const more = scan_additive_expr(state, options);
            pos = Math.min(assert_pos(more.pos), pos);
            end = Math.max(assert_end(more.end), end);
            items.push(more);
        }
    }
    state.expect(T_RSQB);
    const rsqb = state.tokenToSym();
    pos = Math.min(assert_pos(rsqb.pos), pos);
    end = Math.max(assert_end(rsqb.end), end);
    state.get_token();

    return pos_end_items_to_cons(assert_pos(pos), assert_end(end), ...items);
}
/*
function scan_keyword(state: InputState): U {
    // console.lg(`scan_keyword(state.code.text=${state.code.text})`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`scan_symbol => ${retval} @ ${description}`);
        return retval;
    };
    state.expect(T_KEYWORD);
    const keyword = state.tokenToKeyword();

    // if we were looking at the right part of an assignment while we
    // found the symbol, then add it to the "symbolsRightOfAssignment"
    // set (we check for duplications)
    state.get_token();
    return hook(keyword, "A");
}
*/

function scan_symbol(state: InputState): U {
    // console.lg(`scan_symbol(state.code.text=${state.code.text})`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`scan_symbol => ${retval} @ ${description}`);
        return retval;
    };
    state.expect(T_SYM);
    const sym = state.tokenToSym();

    state.get_token();
    return hook(sym, "A");
}

function scan_function_call(state: InputState, options: Readonly<ScanOptions>): U {

    state.expect(T_FUNCTION);

    let pos: number = Number.MAX_SAFE_INTEGER;
    let end: number = Number.MIN_SAFE_INTEGER;

    const name = state.tokenToSym();
    pos = Math.min(assert_pos(name.pos), pos);
    end = Math.max(assert_end(name.end), end);

    const fcall: U[] = [name];

    state.get_token();

    state.expect(T_LPAR);
    const lpar = state.tokenToSym();
    pos = Math.min(assert_pos(lpar.pos), pos);
    end = Math.max(assert_end(lpar.end), end);
    state.get_token();

    if (state.code !== T_RPAR) {
        fcall.push(scan_assignment_stmt(state, options));
        while (state.code === T_COMMA) {

            state.expect(T_COMMA);
            const comma = state.tokenToSym();
            pos = Math.min(assert_pos(comma.pos), pos);
            end = Math.max(assert_end(comma.end), end);
            state.get_token();

            const x = scan_assignment_stmt(state, options);
            pos = Math.min(assert_pos(x.pos), pos);
            end = Math.max(assert_end(x.end), end);
            fcall.push(x);
        }
    }

    state.expect(T_RPAR);
    const rpar = state.tokenToSym();
    pos = Math.min(assert_pos(rpar.pos), pos);
    end = Math.max(assert_end(rpar.end), end);
    state.get_token();

    return pos_end_items_to_cons(assert_pos(pos), assert_end(end), ...fcall);
}

function scan_function_call_without_function_name(lhs: U, state: InputState, options: Readonly<ScanOptions>): U {

    let pos: number = Number.MAX_SAFE_INTEGER;
    let end: number = Number.MIN_SAFE_INTEGER;


    // const func = makeList(EVAL, lhs); // original code added an EVAL. Don't know why.
    const func = lhs;

    const fcall: U[] = [func];

    state.expect(T_LPAR);
    const lpar = state.tokenToSym();
    pos = Math.min(assert_pos(lpar.pos), pos);
    end = Math.max(assert_end(lpar.end), end);
    state.get_token();

    if (state.code !== T_RPAR) {
        const lhs = scan_assignment_stmt(state, options);
        pos = Math.min(assert_pos(lhs.pos), pos);
        end = Math.max(assert_end(lhs.end), end);
        fcall.push(lhs);
        while (state.code === T_COMMA) {

            state.expect(T_COMMA);
            const comma = state.tokenToSym();
            pos = Math.min(assert_pos(comma.pos), pos);
            end = Math.max(assert_end(comma.end), end);
            state.get_token();

            const rhs = scan_assignment_stmt(state, options);
            pos = Math.min(assert_pos(rhs.pos), pos);
            end = Math.max(assert_end(rhs.end), end);
            fcall.push(rhs);
        }
    }

    state.expect(T_RPAR);
    const rpar = state.tokenToSym();
    pos = Math.min(assert_pos(rpar.pos), pos);
    end = Math.max(assert_end(rpar.end), end);
    state.get_token();

    return pos_end_items_to_cons(assert_pos(pos), assert_pos(end), ...fcall);
}

/**
 * An expression that is enclosed in parentheses.
 */
function scan_grouping(state: InputState, options: Readonly<ScanOptions>): U {
    state.expect(T_LPAR);
    state.get_token();
    const result = scan_assignment_stmt(state, options);
    state.expect(T_RPAR);
    state.get_token();
    return result;
}

export const stuff = { a: 1, b: 2 };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function scan_map(state: InputState, options: Readonly<ScanOptions>): Map {
    let pos: number = Number.MAX_SAFE_INTEGER;
    let end: number = Number.MIN_SAFE_INTEGER;

    state.expect(T_LCURLY);
    const lcurly = state.tokenToSym();
    pos = Math.min(assert_pos(lcurly.pos), pos);
    end = Math.max(assert_end(lcurly.end), end);
    state.get_token();

    const elements: U[] = [];

    if (state.code != T_RCURLY) {

        const k1 = assert_sym(scan_symbol(state));
        pos = Math.min(assert_pos(k1.pos), pos);
        end = Math.max(assert_end(k1.end), end);
        elements.push(create_keyword_ns(k1.localName, k1.namespace, k1.pos, k1.end));

        state.expect(T_COLON);
        const colon = state.tokenToSym();
        pos = Math.min(assert_pos(colon.pos), pos);
        end = Math.max(assert_end(colon.end), end);
        state.get_token();

        const v1 = scan_assignment_stmt(state, options);
        pos = Math.min(assert_pos(v1.pos), pos);
        end = Math.max(assert_end(v1.end), end);
        elements.push(v1);

        while (state.code === T_COMMA) {

            state.expect(T_COMMA);
            const comma = state.tokenToSym();
            pos = Math.min(assert_pos(comma.pos), pos);
            end = Math.max(assert_end(comma.end), end);
            state.get_token();

            const k = assert_sym(scan_symbol(state));
            pos = Math.min(assert_pos(k.pos), pos);
            end = Math.max(assert_end(k.end), end);
            elements.push(create_keyword_ns(k.localName, k.namespace, k.pos, k.end));

            state.expect(T_COLON);
            const colon = state.tokenToSym();
            pos = Math.min(assert_pos(colon.pos), pos);
            end = Math.max(assert_end(colon.end), end);
            state.get_token();

            const v = scan_assignment_stmt(state, options);
            pos = Math.min(assert_pos(v.pos), pos);
            end = Math.max(assert_end(v.end), end);
            elements.push(v);
        }
    }
    else {
        // The map is empty.
    }

    state.expect(T_RCURLY);
    const rcurly = state.tokenToSym();
    pos = Math.min(assert_pos(rcurly.pos), pos);
    end = Math.max(assert_end(rcurly.end), end);
    state.get_token();

    const entries: [key: U, value: U][] = [];
    const n = elements.length / 2;
    for (let i = 0; i < n; i++) {
        const key = elements[2 * i];
        const value = elements[2 * i + 1];
        entries.push([key, value]);
    }
    return new Map(entries, assert_pos(pos), assert_end(end));
}

function scan_tensor(state: InputState, options: Readonly<ScanOptions>): Tensor {
    let pos: number = Number.MAX_SAFE_INTEGER;
    let end: number = Number.MIN_SAFE_INTEGER;

    if (options.useParenForTensors) {
        state.expect(T_LPAR);
    }
    else {
        state.expect(T_LSQB);
    }
    const lsqb = state.tokenToSym();
    pos = Math.min(assert_pos(lsqb.pos), pos);
    end = Math.max(assert_end(lsqb.end), end);

    state.get_token();

    const element = scan_assignment_stmt(state, options);
    pos = Math.min(assert_pos(element.pos), pos);
    end = Math.max(assert_end(element.end), end);

    const elements: U[] = [element];

    while (state.code === T_COMMA) {
        const comma = state.tokenToSym();
        pos = Math.min(assert_pos(comma.pos), pos);
        end = Math.max(assert_end(comma.end), end);

        state.get_token();

        const x = scan_assignment_stmt(state, options);
        pos = Math.min(assert_pos(x.pos), pos);
        end = Math.max(assert_end(x.end), end);
        elements.push(x);
    }

    if (options.useParenForTensors) {
        state.expect(T_RPAR);
    }
    else {
        state.expect(T_RSQB);
    }
    const rsqb = state.tokenToSym();
    pos = Math.min(assert_pos(rsqb.pos), pos);
    end = Math.max(assert_end(rsqb.end), end);

    state.get_token();

    return create_tensor(elements, assert_pos(pos), assert_end(end));
}
