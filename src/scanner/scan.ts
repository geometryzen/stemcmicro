import { is_rat } from '../operators/rat/rat_extension';
import { assert_sym } from '../operators/sym/assert_sym';
import { is_tensor } from '../operators/tensor/is_tensor';
import {
    ASSIGN, FACTORIAL, PATTERN,
    predefinedSymbolsInGlobalScope_doNotTrackInDependencies,
    QUOTE,
    TRANSPOSE,
    TRANSPOSE_CHAR_CODE
} from '../runtime/constants';
import { defs } from '../runtime/defs';
import { MATH_ADD, MATH_COMPONENT, MATH_INNER, MATH_LCO, MATH_MUL, MATH_OUTER, MATH_POW, MATH_RCO } from '../runtime/ns_math';
import { Boo } from '../tree/boo/Boo';
import { Sym } from '../tree/sym/Sym';
import { Tensor } from '../tree/tensor/Tensor';
import { items_to_cons, NIL, U } from '../tree/tree';
import { assert_token_code } from './assert_token_code';
import { clone_symbol_using_info } from './clone_symbol_using_info';
import { AsteriskToken, CaretToken, T_ASTRX_ASTRX, T_COLON_EQ, T_COMMA, T_END, T_EQ, T_EQ_EQ, T_FLT, T_FUNCTION, T_FWDSLASH, T_GT, T_GTEQ, T_GTGT, T_INT, T_LPAR, T_LSQB, T_LT, T_LTEQ, T_LTLT, T_MIDDLE_DOT, T_MINUS, T_NTEQ, T_PLUS, T_RPAR, T_RSQB, T_STR, T_SYM, T_VBAR } from './codes';
import { InputState } from './InputState';
import { inverse } from './inverse';
import { scanner_negate } from './scanner_negate';
import { TokenCode } from './Token';

export interface ScanOptions {
    useCaretForExponentiation: boolean;
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

    state.lastFoundSymbol = null;
    state.symbolsRightOfAssignment = [];
    state.symbolsLeftOfAssignment = [];
    state.isSymbolLeftOfAssignment = true;
    state.scanningParameters = [];
    state.functionInvokationsScanningStack = [''];
    state.assignmentFound = false;
    state.useCaretForExponentiation = options.useCaretForExponentiation;

    state.advance();
    if (state.code === T_END) {
        return [0, NIL];
    }
    const expr = scan_stmt(state);
    if (!state.assignmentFound) {
        defs.symbolsInExpressionsWithoutAssignments = defs.symbolsInExpressionsWithoutAssignments.concat(state.symbolsLeftOfAssignment);
    }
    return [state.scanned, expr];
}

export function scan_meta(sourceText: string): U {
    const state = new InputState(sourceText);
    state.meta_mode = true;
    state.advance();
    if (state.code === T_END) {
        return NIL;
    }
    return scan_stmt(state);
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
function is_stmt(code: TokenCode): boolean {
    return is_quote_assign(code) || is_assign(code);
}

function scan_stmt(state: InputState): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`scan_stmt => ${retval} @ ${description}`);
        return retval;
    };

    let result = scan_relational_expr(state);

    if (is_stmt(state.code)) {
        const symbolLeft = state.lastFoundSymbol;

        state.assignmentFound = true;
        state.isSymbolLeftOfAssignment = false;

        // Keep the scanning information for the operator so that we can add it to the tree.
        const { pos, end } = state.tokenToSym();
        const was_quote_assign = is_quote_assign(state.code);

        state.advance();

        let rhs = scan_relational_expr(state);

        // if it's a := then add a quote
        if (was_quote_assign) {
            rhs = items_to_cons(QUOTE.clone(pos, end), rhs);
        }

        result = items_to_cons(ASSIGN.clone(pos, end), result, rhs);

        state.isSymbolLeftOfAssignment = true;

        if (defs.codeGen) {
            // in case of re-assignment, the symbol on the
            // left will also be in the set of the symbols
            // on the right. In that case just remove it from
            // the symbols on the right.
            if (symbolLeft) {
                const i = state.symbolsRightOfAssignment.indexOf(symbolLeft);
                if (i !== -1) {
                    state.symbolsRightOfAssignment.splice(i, 1);
                    defs.symbolsHavingReassignments.push(symbolLeft);
                }
            }

            // print out the immediate dependencies
            // eslint-disable-next-line no-console
            // console.lg(`locally, ${symbolLeftOfAssignment} depends on: `);
            // for (const i of Array.from(symbolsRightOfAssignment)) {
            // eslint-disable-next-line no-console
            // console.lg(`  ${i}`);
            // }

            // ok add the local dependencies to the existing
            // dependencies of this left-value symbol

            // create the exiting dependencies list if it doesn't exist
            if (symbolLeft) {
                if (defs.symbolsDependencies[symbolLeft] == null) {
                    defs.symbolsDependencies[symbolLeft] = [];
                }
                const existingDependencies = defs.symbolsDependencies[symbolLeft];

                // copy over the new dependencies to the existing
                // dependencies avoiding repetitions
                for (const i of Array.from(state.symbolsRightOfAssignment)) {
                    if (existingDependencies.indexOf(i) === -1) {
                        existingDependencies.push(i);
                    }
                }
            }

            state.symbolsRightOfAssignment = [];
        }
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
function scan_relational_expr(state: InputState): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`scan_relational => ${retval} @ ${description}`);
        return retval;
    };

    const result = scan_additive_expr(state);

    if (is_relational(state.code)) {
        const opr = state.tokenToSym();
        state.advance();
        const rhs = scan_additive_expr(state);
        return hook(items_to_cons(opr, result, rhs), "A");
    }

    return hook(result, "B");
}

/**
 * !newLine && ('+' || '-')
 */
function is_additive(code: TokenCode, newLine: boolean): boolean {
    // console.lg(`is_additive_expression(state = ${JSON.stringify(micro(state))})`);
    if (!newLine) {
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
    else {
        return false;
    }
}

function scan_additive_expr(state: InputState): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`scan_additive => ${retval} @ ${description}`);
        return retval;
    };

    let result = scan_multiplicative_expr(state);

    while (is_additive(state.code, state.newLine)) {
        switch (state.code) {
            case T_PLUS: {
                const opr = clone_symbol_using_info(MATH_ADD, state.tokenToSym());
                state.advance();
                result = items_to_cons(opr, result, scan_multiplicative_expr(state));
                break;
            }
            default: {
                // TODO: Remove this negate code and handle it in the engine.
                // Make sure to also add test for a-b-c = (a-b)-c
                assert_token_code(state.code, T_MINUS);
                const opr = clone_symbol_using_info(MATH_ADD, state.tokenToSym());
                state.advance();
                result = items_to_cons(opr, result, scanner_negate(scan_multiplicative_expr(state)));
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
function is_multiplicative(code: TokenCode, newLine: boolean): boolean {
    switch (code) {
        case AsteriskToken:
        case T_FWDSLASH: {
            return true;
        }
        // TOOD: Not sure if this belongs here anymore.
        // case T_LPAR:
        // case T_SYM:
        // case T_FUNCTION:
        // case T_INT:
        // case T_FLT:
        /*
        case T_STR: {
            if (newLine) {
                return false;
                // implicit mul can't cross line
                // throw new Error("end <<<< pos");
                // state.end = state.pos; // better error display
                // return false;
            }
            else {
                return true;
            }
        }
        */
    }
    return false;
}

/**
 * Corresponds to scan_term
 */
function scan_multiplicative_expr(state: InputState): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`scan_multiplicative => ${retval} @ ${description}`);
        return retval;
    };

    let result = scan_outer_expr(state);

    while (is_multiplicative(state.code, state.newLine)) {
        switch (state.code) {
            case AsteriskToken: {
                const opr = clone_symbol_using_info(MATH_MUL, state.tokenToSym());
                state.advance();
                result = items_to_cons(opr, result, scan_outer_expr(state));
                break;
            }
            case T_FWDSLASH: {
                // TODO: For now we leave this canonicalization in the scanner.
                // But I think it belongs in the transformations.
                // console.lg("result", JSON.stringify(result));
                if (is_rat(result) && result.isOne()) {
                    state.advance();
                    result = inverse(scan_outer_expr(state));
                }
                else {
                    const mulOp = clone_symbol_using_info(MATH_MUL, state.tokenToSym());
                    state.advance();
                    result = items_to_cons(mulOp, result, inverse(scan_outer_expr(state)));
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
function is_outer(code: TokenCode, newline_flag: boolean, useCaretForExponentiation: boolean): boolean {
    if (!newline_flag) {
        if (code === CaretToken) {
            if (useCaretForExponentiation) {
                return false;
            }
            else {
                return true;
            }
        }
    }
    return false;
}

function scan_outer_expr(state: InputState): U {

    let result = scan_inner_expr(state);

    while (is_outer(state.code, state.newLine, state.useCaretForExponentiation)) {
        const opr = clone_symbol_using_info(MATH_OUTER, state.tokenToSym());
        state.advance();
        result = items_to_cons(opr, result, scan_inner_expr(state));
    }

    return result;
}

/**
 * ! newline && ('<<' || '>>' || Vbar || 'middle-dot')
 */
function is_inner_or_contraction(code: TokenCode, newline_flag: boolean): boolean {
    return !newline_flag && (code === T_LTLT || code === T_GTGT || code === T_VBAR || code === T_MIDDLE_DOT);
}

function scan_inner_expr(state: InputState): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`results (INNER) => ${retval} @ ${description}`);
        return retval;
    };

    let result = scan_power_expr(state);

    while (is_inner_or_contraction(state.code, state.newLine)) {
        switch (state.code) {
            case T_LTLT: {
                const opr = clone_symbol_using_info(MATH_LCO, state.tokenToSym());
                state.advance();
                result = items_to_cons(opr, result, scan_power_expr(state));
                break;
            }
            case T_GTGT: {
                const opr = clone_symbol_using_info(MATH_RCO, state.tokenToSym());
                state.advance();
                result = items_to_cons(opr, result, scan_power_expr(state));
                break;
            }
            case T_VBAR: {
                const opr = clone_symbol_using_info(MATH_INNER, state.tokenToSym());
                state.advance();
                result = items_to_cons(opr, result, scan_power_expr(state));
                break;
            }
            default: {
                state.expect(T_MIDDLE_DOT);
                const opr = clone_symbol_using_info(MATH_INNER, state.tokenToSym());
                state.advance();
                result = items_to_cons(opr, result, scan_power_expr(state));
                break;
            }
        }
    }
    return hook(result, "A");
}

function is_power(code: TokenCode, newLine: boolean, useCaretForExponentiation: boolean): boolean {
    // console.lg(`is_power ${JSON.stringify(code)} useCaret: ${useCaretForExponentiation}`);
    if (newLine) {
        return false;
    }
    if (useCaretForExponentiation) {
        return code === CaretToken;
    }
    else {
        return code === T_ASTRX_ASTRX;
    }
}

function scan_power_expr(state: InputState): U {
    // Using a stack because exponentiation is right-associative.
    // We'll push the operands as well in order to retain scanning location information.
    const stack: U[] = [];
    stack.push(scan_unary_expr(state));

    while (is_power(state.code, state.newLine, state.useCaretForExponentiation)) {
        stack.push(state.tokenToSym());
        state.advance();
        stack.push(scan_unary_expr(state));
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

function scan_unary_expr(state: InputState): U {
    const code = state.code;
    switch (code) {
        case T_PLUS: {
            state.advance();
            return scan_unary_expr(state);
        }
        case T_MINUS: {
            state.advance();
            return scanner_negate(scan_unary_expr(state));
        }
        default: {
            return scan_grouping_expr(state);
        }
    }
}

function scan_grouping_expr(state: InputState): U {
    const code = state.code;
    if (code === T_LPAR) {
        return scan_grouping(state);
    }
    else {
        return scan_factor(state);
    }
}

/**
 *
 */
function scan_first_factor(state: InputState): [is_num: boolean, expr: U] {
    const code = state.code;
    // TODO: Convert this to a switch.
    if (code === T_LPAR) {
        return [false, scan_grouping(state)];
    }
    else if (code === T_SYM) {
        // TODO: This code should probablt be merged into scan_symbol.
        if (state.text === 'true') {
            const value = new Boo(true, state.pos, state.end);
            state.advance();
            return [false, value];
        }
        else if (state.text === 'false') {
            const value = new Boo(false, state.pos, state.end);
            state.advance();
            return [false, value];
        }
        else {
            return [false, scan_symbol(state)];
        }
    }
    else if (code === T_FUNCTION) {
        return [false, scan_function_call_with_function_name(state)];
    }
    else if (code === T_LSQB) {
        return [false, scan_tensor(state)];
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
        state.scan_error('syntax error');
    }
}

function scan_flt(state: InputState): U {
    const flt = state.tokenToFlt();
    state.advance();
    return flt;
}

function scan_int(state: InputState): U {
    const int = state.tokenToInt();
    state.advance();
    return int;
}

function scan_string(state: InputState): U {
    const str = state.tokenToStr();
    state.advance();
    return str;
}

function scan_factor(state: InputState): U {
    const ff = scan_first_factor(state);
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
    while (state.code === T_LSQB || (state.code === T_LPAR && !state.newLine && !ff_is_num)) {
        if (state.code === T_LSQB) {
            result = scan_index(result, state);
        }
        else if (state.code === T_LPAR) {
            // console.lg "( as function call without function name "
            result = scan_function_call_without_function_name(result, state);
        }
    }

    while (state.text === '!') {
        state.advance();
        result = items_to_cons(FACTORIAL, result);
    }

    // in theory we could already count the
    // number of transposes and simplify them
    // away, but it's not that clean to have
    // multiple places where that happens, and
    // the parser is not the place.
    while (state.tokenCharCode() === TRANSPOSE_CHAR_CODE) {
        state.advance();
        result = items_to_cons(TRANSPOSE, result);
    }

    return result;
}

function scan_index(indexable: U, state: InputState): U {
    state.expect(T_LSQB);
    state.advance();
    const items: U[] = [MATH_COMPONENT, indexable];
    if (state.code !== T_RSQB) {
        items.push(scan_additive_expr(state));
        while (state.code === T_COMMA) {
            state.advance();
            items.push(scan_additive_expr(state));
        }
    }
    state.expect(T_RSQB);
    state.advance();

    return items_to_cons(...items);
}

function addSymbolRightOfAssignment(state: InputState, theSymbol: string): void {
    if (
        predefinedSymbolsInGlobalScope_doNotTrackInDependencies.indexOf(theSymbol) === -1 &&
        state.symbolsRightOfAssignment.indexOf(theSymbol) === -1 &&
        state.symbolsRightOfAssignment.indexOf("'" + theSymbol) === -1 &&
        !state.skipRootVariableToBeSolved
    ) {
        // console.lg(`... adding symbol: ${theSymbol} to the set of the symbols right of assignment`);
        let prefixVar = '';
        for (let i = 1; i < state.functionInvokationsScanningStack.length; i++) {
            if (state.functionInvokationsScanningStack[i] !== '') {
                prefixVar += state.functionInvokationsScanningStack[i] + '_' + i + '_';
            }
        }

        theSymbol = prefixVar + theSymbol;
        state.symbolsRightOfAssignment.push(theSymbol);
    }
}

function addSymbolLeftOfAssignment(state: InputState, theSymbol: string): void {
    if (
        predefinedSymbolsInGlobalScope_doNotTrackInDependencies.indexOf(
            theSymbol
        ) === -1 &&
        state.symbolsLeftOfAssignment.indexOf(theSymbol) === -1 &&
        state.symbolsLeftOfAssignment.indexOf("'" + theSymbol) === -1 &&
        !state.skipRootVariableToBeSolved
    ) {
        // console.lg(`... adding symbol: ${theSymbol} to the set of the symbols left of assignment`);
        let prefixVar = '';
        for (let i = 1; i < state.functionInvokationsScanningStack.length; i++) {
            if (state.functionInvokationsScanningStack[i] !== '') {
                prefixVar += state.functionInvokationsScanningStack[i] + '_' + i + '_';
            }
        }

        theSymbol = prefixVar + theSymbol;
        state.symbolsLeftOfAssignment.push(theSymbol);
    }
}
function scan_symbol(state: InputState): U {
    state.expect(T_SYM);
    const sym = state.tokenToSym();
    // The text should be the same as  
    // const text = sym.text;
    if (state.scanningParameters.length === 0) {
        // TODO: Why don't we just store the actual symbol here?
        state.lastFoundSymbol = state.text;
        if (state.isSymbolLeftOfAssignment) {
            addSymbolLeftOfAssignment(state, state.text);
        }
    }
    else {
        if (state.isSymbolLeftOfAssignment) {
            addSymbolRightOfAssignment(state, "'" + state.text);
        }
    }

    // if we were looking at the right part of an assignment while we
    // found the symbol, then add it to the "symbolsRightOfAssignment"
    // set (we check for duplications)
    if (!state.isSymbolLeftOfAssignment) {
        addSymbolRightOfAssignment(state, state.text);
    }
    state.advance();
    return sym;
}

function is_special_function(name: string): boolean {
    switch (name) {
        case 'defint':
        case 'for':
        case 'product':
        case 'roots':
        case 'sum': {
            return true;
        }
        default: {
            return false;
        }
    }
}

function scan_function_call_with_function_name(state: InputState): U {
    state.expect(T_FUNCTION);
    let n = 1; // the parameter number as we scan parameters

    const p = state.tokenToSym();
    const fcall: U[] = [p];
    const functionName = state.text;
    if (is_special_function(functionName)) {
        state.functionInvokationsScanningStack.push(state.text);
    }
    state.lastFoundSymbol = state.text;
    if (!state.isSymbolLeftOfAssignment) {
        addSymbolRightOfAssignment(state, state.text);
    }

    state.advance(); // open parens
    state.advance(); // 1st parameter
    state.scanningParameters.push(true);
    if (state.code !== T_RPAR) {
        fcall.push(scan_stmt(state));
        n++;
        while (state.code === T_COMMA) {
            state.advance();
            // roots' disappearing variable, if there, is the second one
            if (n === 2 && state.functionInvokationsScanningStack[state.functionInvokationsScanningStack.length - 1].indexOf('roots') !== -1) {
                state.symbolsRightOfAssignment = state.symbolsRightOfAssignment.filter(
                    (x) =>
                        !new RegExp(
                            'roots_' +
                            (state.functionInvokationsScanningStack.length - 1) +
                            '_' +
                            state.text
                        ).test(x)
                );
                state.skipRootVariableToBeSolved = true;
            }
            // sums' disappearing variable, is alsways the second one
            if (n === 2 && state.functionInvokationsScanningStack[state.functionInvokationsScanningStack.length - 1].indexOf('sum') !== -1) {
                state.symbolsRightOfAssignment = state.symbolsRightOfAssignment.filter(
                    (x) =>
                        !new RegExp(
                            'sum_' +
                            (state.functionInvokationsScanningStack.length - 1) +
                            '_' +
                            state.text
                        ).test(x)
                );
                state.skipRootVariableToBeSolved = true;
            }
            // product's disappearing variable, is alsways the second one
            if (n === 2 && state.functionInvokationsScanningStack[state.functionInvokationsScanningStack.length - 1].indexOf('product') !== -1) {
                state.symbolsRightOfAssignment = state.symbolsRightOfAssignment.filter(
                    (x) =>
                        !new RegExp(
                            'product_' +
                            (state.functionInvokationsScanningStack.length - 1) +
                            '_' +
                            state.text
                        ).test(x)
                );
                state.skipRootVariableToBeSolved = true;
            }
            // for's disappearing variable, is alsways the second one
            if (n === 2 && state.functionInvokationsScanningStack[state.functionInvokationsScanningStack.length - 1].indexOf('for') !== -1) {
                state.symbolsRightOfAssignment = state.symbolsRightOfAssignment.filter(
                    (x) =>
                        !new RegExp(
                            'for_' +
                            (state.functionInvokationsScanningStack.length - 1) +
                            '_' +
                            state.text
                        ).test(x)
                );
                state.skipRootVariableToBeSolved = true;
            }
            // defint's disappearing variables can be in positions 2,5,8...
            if (state.functionInvokationsScanningStack[state.functionInvokationsScanningStack.length - 1].indexOf('defint') !== -1 && (n === 2 || (n > 2 && (n - 2) % 3 === 0))) {
                state.symbolsRightOfAssignment = state.symbolsRightOfAssignment.filter(
                    (x) =>
                        !new RegExp(
                            'defint_' +
                            (state.functionInvokationsScanningStack.length - 1) +
                            '_' +
                            state.text
                        ).test(x)
                );
                state.skipRootVariableToBeSolved = true;
            }

            fcall.push(scan_stmt(state));
            state.skipRootVariableToBeSolved = false;
            n++;
        }

        // todo refactor this, there are two copies
        // this catches the case where the "roots" variable is not specified
        if (n === 2 &&
            state.functionInvokationsScanningStack[state.functionInvokationsScanningStack.length - 1].indexOf('roots') !== -1) {
            state.symbolsRightOfAssignment = state.symbolsRightOfAssignment.filter(
                (x) =>
                    !new RegExp(
                        'roots_' + (state.functionInvokationsScanningStack.length - 1) + '_' + 'x'
                    ).test(x)
            );
        }
    }

    state.scanningParameters.pop();

    for (let i = 0; i <= state.symbolsRightOfAssignment.length; i++) {
        if (state.symbolsRightOfAssignment[i] != null) {
            if (functionName === 'roots') {
                state.symbolsRightOfAssignment[i] = state.symbolsRightOfAssignment[i].replace(
                    new RegExp(
                        'roots_' + (state.functionInvokationsScanningStack.length - 1) + '_'
                    ),
                    ''
                );
            }
            if (functionName === 'defint') {
                state.symbolsRightOfAssignment[i] = state.symbolsRightOfAssignment[i].replace(
                    new RegExp(
                        'defint_' + (state.functionInvokationsScanningStack.length - 1) + '_'
                    ),
                    ''
                );
            }
            if (functionName === 'sum') {
                state.symbolsRightOfAssignment[i] = state.symbolsRightOfAssignment[i].replace(
                    new RegExp(
                        'sum_' + (state.functionInvokationsScanningStack.length - 1) + '_'
                    ),
                    ''
                );
            }
            if (functionName === 'product') {
                state.symbolsRightOfAssignment[i] = state.symbolsRightOfAssignment[i].replace(
                    new RegExp(
                        'product_' + (state.functionInvokationsScanningStack.length - 1) + '_'
                    ),
                    ''
                );
            }
            if (functionName === 'for') {
                state.symbolsRightOfAssignment[i] = state.symbolsRightOfAssignment[i].replace(
                    new RegExp(
                        'for_' + (state.functionInvokationsScanningStack.length - 1) + '_'
                    ),
                    ''
                );
            }
        }
    }

    state.expect(T_RPAR);
    state.advance();

    if (is_special_function(functionName)) {
        state.functionInvokationsScanningStack.pop();
    }

    if (PATTERN.equals(new Sym(functionName))) {
        defs.patternHasBeenFound = true;
    }

    // console.lg('-- scan_function_call_with_function_name end');
    return items_to_cons(...fcall);
}

function scan_function_call_without_function_name(lhs: U, state: InputState): U {
    state.expect(T_LPAR);

    // const func = makeList(EVAL, lhs); // original code added an EVAL. Don't know why.
    const func = lhs;

    const fcall: U[] = [func];
    assert_token_code(state.code, T_LPAR);
    state.advance(); // left paren
    state.scanningParameters.push(true);
    try {
        if (state.code !== T_RPAR) {
            fcall.push(scan_stmt(state));
            while (state.code === T_COMMA) {
                state.advance();
                fcall.push(scan_stmt(state));
            }
        }
    }
    finally {
        state.scanningParameters.pop();
    }

    state.expect(T_RPAR);
    state.advance();

    return items_to_cons(...fcall);
}

/**
 * An expression that is enclosed in parentheses.
 */
function scan_grouping(state: InputState): U {
    state.expect(T_LPAR);
    state.advance();
    const result = scan_stmt(state);
    state.expect(T_RPAR);
    state.advance();
    return result;
}

function scan_tensor(state: InputState): Tensor {

    state.expect(T_LSQB);
    state.advance();

    const element = scan_stmt(state);

    const elements: U[] = [element];

    while (state.code === T_COMMA) {
        state.advance();
        elements.push(scan_stmt(state));
    }

    const M = create_tensor(elements);

    state.expect(T_RSQB);
    state.advance();

    return M;
}

/**
 * Creates a Tensor from an array of elements. If the elements themselves are tensors,
 * then that elements must be flattened, but the dimensionality recorded and incorporated
 * into the created Tensor.
 */
function create_tensor(elements: U[]): Tensor {
    if (elements.length > 0) {
        // The dimensions of the new tensor.
        const dims: number[] = [elements.length];
        /**
         * The elements of the new tensor.
         */
        const elems: U[] = [];
        let seenTensor = false;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (is_tensor(element)) {
                const M = element;
                if (seenTensor) {
                    // Does this tensor have the same dimesions as the previous one?
                }
                else {
                    for (let j = 0; j < M.rank; j++) {
                        dims[j + 1] = M.dim(j);
                    }
                    seenTensor = true;
                }
                for (let j = 0; j < M.nelem; j++) {
                    elems.push(M.elem(j));
                }
            }
            else {
                elems.push(element);
            }

        }
        return new Tensor(dims, elems);
    }
    else {
        return new Tensor([0], []);
    }
}
