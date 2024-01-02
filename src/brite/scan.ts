/* eslint-disable no-console */
import { Native } from '../native/Native';
import { native_sym } from '../native/native_sym';
import { is_num } from '../operators/num/is_num';
import { is_rat } from '../operators/rat/rat_extension';
import { assert_sym } from '../operators/sym/assert_sym';
import {
    ASSIGN,
    FACTORIAL,
    QUOTE,
    TRANSPOSE,
    TRANSPOSE_CHAR_CODE
} from '../runtime/constants';
import { MATH_INNER, MATH_LCO, MATH_MUL, MATH_OUTER, MATH_POW, MATH_RCO } from '../runtime/ns_math';
import { create_boo } from '../tree/boo/Boo';
import { negOne, one } from '../tree/rat/Rat';
import { Tensor } from '../tree/tensor/Tensor';
import { items_to_cons, nil, U } from '../tree/tree';
import { assert_token_code } from './assert_token_code';
import { clone_symbol_using_info } from './clone_symbol_using_info';
import { T_ASTRX, T_ASTRX_ASTRX, T_BANG, T_CARET, T_COLON_EQ, T_COMMA, T_END, T_EQ, T_EQ_EQ, T_FLT, T_FUNCTION, T_FWDSLASH, T_GT, T_GTEQ, T_GTGT, T_INT, T_LPAR, T_LSQB, T_LT, T_LTEQ, T_LTLT, T_MIDDLE_DOT, T_MINUS, T_NTEQ, T_PLUS, T_RPAR, T_RSQB, T_STR, T_SYM, T_VBAR } from './codes';
import { create_tensor } from './create_tensor';
import { InputState } from './InputState';
import { one_divided_by } from './one_divided_by';
import { scanner_negate } from './scanner_negate';
import { TokenCode } from './Token';

export const COMPONENT = native_sym(Native.component);

export interface ScanOptions {
    /**
     * Use '^' or '**' for exponentiation.
     */
    useCaretForExponentiation: boolean;
    /**
     * Use "(" and ")" otherwise "[" and "]".
     */
    useParenForTensors: boolean;
    explicitAssocAdd: boolean;
    explicitAssocMul: boolean;
}

/**
 * Scans the input string, s, leaving the expression on the stack.
 * Returns zero when there is nothing left to scan.
 * @param sourceText The input string.
 * @returns The number of characters scanned.
 */
export function scan(sourceText: string, options: ScanOptions): [scanned: number, tree: U] {
    // console.lg(`scan(sourceText = ${JSON.stringify(sourceText)})`);

    const state = new InputState(sourceText);

    state.get_token_skip_newlines();

    if (state.code === T_END) {
        return [0, nil];
    }

    const expr = scan_assignment_stmt(state, options);

    return [state.scanned, expr];
}

export function scan_meta(sourceText: string, options: ScanOptions): U {
    const state = new InputState(sourceText);
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
function is_quote_assign(code: TokenCode): boolean {
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
function is_assign(code: TokenCode): boolean {
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
    return is_quote_assign(code) || is_assign(code);
}

function scan_assignment_stmt(state: InputState, options: ScanOptions): U {
    // console.lg(`scan_assignment_stmt(state.code.text=${state.code.text})`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`scan_stmt => ${retval} @ ${description}`);
        return retval;
    };

    let result = scan_relational_expr(state, options);

    if (is_assignment_operator(state.code)) {

        // Keep the scanning information for the operator so that we can add it to the tree.
        const { pos, end } = state.tokenToSym();
        const was_quote_assign = is_quote_assign(state.code);

        state.get_token_skip_newlines();

        let rhs = scan_relational_expr(state, options);

        // if it's a := then add a quote
        if (was_quote_assign) {
            rhs = items_to_cons(QUOTE.clone(pos, end), rhs);
        }

        result = items_to_cons(ASSIGN.clone(pos, end), result, rhs);
    }

    return hook(result, "A");
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
function scan_relational_expr(state: InputState, options: ScanOptions): U {
    // console.lg(`scan_relational_expr(state.code.text=${state.code.text})`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`scan_relational => ${retval} @ ${description}`);
        return retval;
    };

    const result = scan_additive_expr(state, options);

    if (is_relational(state.code)) {
        const opr = state.tokenToSym();
        state.get_token_skip_newlines();
        const rhs = scan_additive_expr(state, options);
        return hook(items_to_cons(opr, result, rhs), "A");
    }

    return hook(result, "B");
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
function scan_additive_expr(state: InputState, options: ScanOptions): U {
    // console.lg(`scan_additive_expr(state.code.text=${state.code.text})`);
    if (options.explicitAssocAdd) {
        return scan_additive_expr_explicit(state, options);
    }
    else {
        return scan_additive_expr_implicit(state, options);
    }
}

/**
 * 
 */
function scan_additive_expr_implicit(state: InputState, options: ScanOptions): U {
    // console.lg(`scan_additive_expr_imp(state.code.text=${state.code.text})`);
    // TODO: We could cache the symbol.
    const terms: U[] = [native_sym(Native.add)];

    switch (state.code) {
        case T_PLUS:
            state.get_token_skip_newlines();
            terms.push(scan_multiplicative_expr(state, options));
            break;
        case T_MINUS:
            state.get_token_skip_newlines();
            terms.push(negate(scan_multiplicative_expr(state, options)));
            break;
        default:
            terms.push(scan_multiplicative_expr(state, options));
    }

    while (state.code === T_PLUS || state.code === T_MINUS) {
        if (state.code === T_PLUS) {
            state.get_token_skip_newlines();
            terms.push(scan_multiplicative_expr(state, options));
        }
        else {
            state.get_token_skip_newlines();
            terms.push(negate(scan_multiplicative_expr(state, options)));
        }
    }

    if (terms.length === 2) {
        return terms[1];
    }
    return items_to_cons(...terms);
}

function negate(expr: U): U {
    if (is_num(expr)) {
        return expr.neg();
    }
    else {
        return items_to_cons(MATH_MUL, expr, negOne);
    }
}

function scan_additive_expr_explicit(state: InputState, options: ScanOptions): U {
    // console.lg(`scan_additive_expr_exp(state.code.text=${state.code.text})`);
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
export function scan_multiplicative_expr(state: InputState, options: ScanOptions): U {
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
export function scan_multiplicative_expr_implicit(state: InputState, options: ScanOptions): U {
    // console.lg(`scan_multiplicative_expr_imp(state.code.text=${state.code.text})`);
    const results = [scan_outer_expr(state, options)];
    /*
    if (parse_time_simplifications) {
        simplify_1_in_products(results);
    }
    */

    while (is_multiplicative_operator_or_factor_pending(state.code)) {
        if (state.code === T_ASTRX) {
            state.get_token_skip_newlines();
            results.push(scan_outer_expr(state, options));
        }
        else if (state.code === T_FWDSLASH) {
            // in case of 1/... then
            // we scanned the 1, we get rid
            // of it because otherwise it becomes
            // an extra factor that wasn't there and
            // things like
            // 1/(2*a) become 1*(1/(2*a))
            simplify_1_in_products(results);
            state.get_token_skip_newlines();
            results.push(one_divided_by(scan_outer_expr(state, options)));
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
            results.push(scan_outer_expr(state, options));
        }
        /*
        if (parse_time_simplifications) {
            multiply_consecutive_constants(results);
            simplify_1_in_products(results);
        }
        */
    }

    if (results.length === 0) {
        return one;
    }
    else if (results.length == 1) {
        return results[0];
    }
    return items_to_cons(MATH_MUL, ...results);
}

function simplify_1_in_products(factors: U[]): void {
    if (factors.length > 0) {
        const factor = factors[factors.length - 1];
        if (is_rat(factor) && factor.isOne()) {
            factors.pop();
        }
    }
}


/**
 * Corresponds to scan_term
 */
export function scan_multiplicative_expr_explicit(state: InputState, options: ScanOptions): U {
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
                    result = one_divided_by(scan_outer_expr(state, options));
                }
                else {
                    const mulOp = clone_symbol_using_info(MATH_MUL, state.tokenToSym());
                    state.get_token();
                    result = items_to_cons(mulOp, result, one_divided_by(scan_outer_expr(state, options)));
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

function scan_outer_expr(state: InputState, options: ScanOptions): U {
    // console.lg(`scan_outer_expr(state.code.text=${state.code.text})`);

    let result = scan_inner_expr(state, options);

    while (is_outer(state.code, options.useCaretForExponentiation)) {
        const opr = clone_symbol_using_info(MATH_OUTER, state.tokenToSym());
        state.get_token();
        result = items_to_cons(opr, result, scan_inner_expr(state, options));
    }

    return result;
}

/**
 * ! newline && ('<<' || '>>' || Vbar || 'middle-dot')
 */
function is_inner_or_contraction(code: TokenCode): boolean {
    return code === T_LTLT || code === T_GTGT || code === T_VBAR || code === T_MIDDLE_DOT;
}

function scan_inner_expr(state: InputState, options: ScanOptions): U {
    // console.lg(`scan_inner_expr(state.code.text=${state.code.text})`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`results (INNER) => ${retval} @ ${description}`);
        return retval;
    };

    let result = scan_power_expr(state, options);

    while (is_inner_or_contraction(state.code)) {
        switch (state.code) {
            case T_LTLT: {
                const opr = clone_symbol_using_info(MATH_LCO, state.tokenToSym());
                state.get_token();
                result = items_to_cons(opr, result, scan_power_expr(state, options));
                break;
            }
            case T_GTGT: {
                const opr = clone_symbol_using_info(MATH_RCO, state.tokenToSym());
                state.get_token();
                result = items_to_cons(opr, result, scan_power_expr(state, options));
                break;
            }
            case T_VBAR: {
                const opr = clone_symbol_using_info(MATH_INNER, state.tokenToSym());
                state.get_token();
                result = items_to_cons(opr, result, scan_power_expr(state, options));
                break;
            }
            default: {
                state.expect(T_MIDDLE_DOT);
                const opr = clone_symbol_using_info(MATH_INNER, state.tokenToSym());
                state.get_token();
                result = items_to_cons(opr, result, scan_power_expr(state, options));
                break;
            }
        }
    }
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

function scan_power_expr(state: InputState, options: ScanOptions): U {
    // console.lg(`scan_power_expr(state.code.text=${state.code.text})`);
    // Using a stack because exponentiation is right-associative.
    // We'll push the operands as well in order to retain scanning location information.
    const stack: U[] = [];
    stack.push(scan_unary_expr(state, options));

    while (is_power(state.code, options.useCaretForExponentiation)) {
        stack.push(state.tokenToSym());
        state.get_token();
        stack.push(scan_unary_expr(state, options));
    }

    while (stack.length > 0) {
        const rhs = stack.pop() as U;
        if (stack.length > 0) {
            const opr = assert_sym(stack.pop() as U);
            const lhs = stack.pop() as U;
            stack.push(items_to_cons(clone_symbol_using_info(MATH_POW, opr), lhs, rhs));
        }
        else {
            return rhs;
        }
    }
    throw new Error();
}

function scan_unary_expr(state: InputState, options: ScanOptions): U {
    // console.lg(`scan_unary_expr(state.code.text=${state.code.text})`);
    const code = state.code;
    switch (code) {
        case T_PLUS: {
            state.get_token();
            return scan_unary_expr(state, options);
        }
        case T_MINUS: {
            state.get_token();
            return scanner_negate(scan_unary_expr(state, options));
        }
        default: {
            return scan_grouping_expr(state, options);
        }
    }
}

function scan_grouping_expr(state: InputState, options: ScanOptions): U {
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
function scan_atom(state: InputState, options: ScanOptions): [is_num: boolean, expr: U] {
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
            const value = create_boo(true);
            state.get_token();
            return [false, value];
        }
        else if (state.text === 'false') {
            const value = create_boo(false);
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

function scan_factor(state: InputState, options: ScanOptions): U {
    // console.lg(`scan_factor(state.code.text=${state.code.text} ${state.code.code})`);
    const ff = scan_atom(state, options);
    const ff_is_num = ff[0];
    let result = ff[1];

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
        }
        else if (state.code === T_LPAR) {
            // console.lg "( as function call without function name "
            result = scan_function_call_without_function_name(result, state, options);
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

    return result;
}

function scan_index(indexable: U, state: InputState, options: ScanOptions): U {
    state.expect(T_LSQB);
    state.get_token();
    const items: U[] = [COMPONENT, indexable];
    if (state.code !== T_RSQB) {
        items.push(scan_additive_expr(state, options));
        while (state.code === T_COMMA) {
            state.get_token();
            items.push(scan_additive_expr(state, options));
        }
    }
    state.expect(T_RSQB);
    state.get_token();

    return items_to_cons(...items);
}

function scan_symbol(state: InputState): U {
    // console.lg(`scan_symbol(state.code.text=${state.code.text})`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`scan_symbol => ${retval} @ ${description}`);
        return retval;
    };
    state.expect(T_SYM);
    const sym = state.tokenToSym();

    // if we were looking at the right part of an assignment while we
    // found the symbol, then add it to the "symbolsRightOfAssignment"
    // set (we check for duplications)
    state.get_token();
    return hook(sym, "A");
}

function scan_function_call(state: InputState, options: ScanOptions): U {
    // console.lg(`scan_function_call(pos=${state.pos}, end=${state.end})`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`scan_function_call => ${retval} @ ${description}`);
        return retval;
    };
    state.expect(T_FUNCTION);

    const name = state.tokenToSym();
    const fcall: U[] = [name];

    state.get_token(); // open parens
    // console.lg(`LPAR is at (pos=${state.pos}, end=${state.end})`);
    state.expect(T_LPAR);
    state.get_token(); // 1st parameter or closing paren.
    if (state.code !== T_RPAR) {
        fcall.push(scan_assignment_stmt(state, options));
        while (state.code === T_COMMA) {
            state.get_token();

            fcall.push(scan_assignment_stmt(state, options));
        }
    }

    state.expect(T_RPAR);
    // console.lg(`RPAR is at (pos=${state.pos}, end=${state.end})`);
    state.get_token();
    // console.lg(`Next is at (pos=${state.pos}, end=${state.end})`);

    // console.lg('-- scan_function_call_with_function_name end');
    return hook(items_to_cons(...fcall), "A");
}

function scan_function_call_without_function_name(lhs: U, state: InputState, options: ScanOptions): U {
    state.expect(T_LPAR);

    // const func = makeList(EVAL, lhs); // original code added an EVAL. Don't know why.
    const func = lhs;

    const fcall: U[] = [func];
    assert_token_code(state.code, T_LPAR);
    state.get_token(); // left paren
    if (state.code !== T_RPAR) {
        fcall.push(scan_assignment_stmt(state, options));
        while (state.code === T_COMMA) {
            state.get_token();
            fcall.push(scan_assignment_stmt(state, options));
        }
    }

    state.expect(T_RPAR);
    state.get_token();

    return items_to_cons(...fcall);
}

/**
 * An expression that is enclosed in parentheses.
 */
function scan_grouping(state: InputState, options: ScanOptions): U {
    // console.lg(`scan_grouping(state.code.text=${state.code.text})`);
    state.expect(T_LPAR);
    state.get_token();
    const result = scan_assignment_stmt(state, options);
    state.expect(T_RPAR);
    state.get_token();
    return result;
}

function scan_tensor(state: InputState, options: ScanOptions): Tensor {
    // console.lg(`scan_tensor(state.code.text=${state.code.text})`);

    if (options.useParenForTensors) {
        state.expect(T_LPAR);
    }
    else {
        state.expect(T_LSQB);
    }
    state.get_token();

    const element = scan_assignment_stmt(state, options);

    const elements: U[] = [element];

    while (state.code === T_COMMA) {
        state.get_token();
        elements.push(scan_assignment_stmt(state, options));
    }

    const M = create_tensor(elements);

    if (options.useParenForTensors) {
        state.expect(T_RPAR);
    }
    else {
        state.expect(T_RSQB);
    }
    state.get_token();

    return M;
}
