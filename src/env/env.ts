/* eslint-disable @typescript-eslint/no-unused-vars */
import { is_keyword, is_map, is_str, is_tensor, Str } from 'math-expression-atoms';
import { LambdaExpr } from 'math-expression-context';
import { is_native } from 'math-expression-native';
import { is_atom, nil } from 'math-expression-tree';
import { UndeclaredVars } from '../api';
import { assert_sym_any_any } from '../clojurescript/runtime/eval_setq';
import { Eval_function } from "../Eval_function";
import { yyfactorpoly } from "../factorpoly";
import { hash_for_atom, hash_info } from "../hashing/hash_info";
import { is_poly_expanded_form } from "../is";
import { Native } from "../native/Native";
import { native_sym } from "../native/native_sym";
import { algebra } from "../operators/algebra/algebra";
import { setq } from '../operators/assign/assign_any_any';
import { is_boo } from "../operators/boo/is_boo";
import { is_flt } from "../operators/flt/is_flt";
import { Eval_lambda_in_fn_syntax } from '../operators/fn/Eval_fn';
import { is_lambda } from "../operators/lambda/is_lambda";
import { Eval_let } from '../operators/let/Eval_let';
import { is_rat } from "../operators/rat/is_rat";
import { assert_sym } from '../operators/sym/assert_sym';
import { is_sym } from "../operators/sym/is_sym";
import { wrap_as_transform } from "../operators/wrap_as_transform";
import { SyntaxKind } from "../parser/parser";
import { ProgrammingError } from '../programming/ProgrammingError';
import { ALGEBRA, ASSIGN, COMPONENT, FN, FUNCTION, INNER, LCO, LET, OUTER } from "../runtime/constants";
import { execute_definitions } from '../runtime/init';
import { createSymTab, SymTab } from "../runtime/symtab";
import { SystemError } from "../runtime/SystemError";
import { Err } from '../tree/err/Err';
import { Lambda } from "../tree/lambda/Lambda";
import { negOne, Rat } from "../tree/rat/Rat";
import { create_sym, Sym } from "../tree/sym/Sym";
import { Tensor } from "../tree/tensor/Tensor";
import { cons, Cons, is_cons, is_nil, items_to_cons, U } from "../tree/tree";
import { DirectiveStack } from "./DirectiveStack";
import { EnvConfig } from "./EnvConfig";
import { CompareFn, ConsExpr, Directive, ExprComparator, ExtensionEnv, FEATURE, KeywordRunner, MODE_EXPANDING, MODE_FACTORING, MODE_FLAGS_ALL, MODE_SEQUENCE, Operator, OperatorBuilder, Predicates, PrintHandler, Sign, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "./ExtensionEnv";
import { NoopPrintHandler } from "./NoopPrintHandler";
import { operator_from_keyword_runner } from "./operator_from_keyword_runner";
import { hash_from_match, operator_from_cons_expression, opr_from_match } from "./operator_from_legacy_transformer";
import { UnknownConsOperator } from "./UnknownOperator";

const ADD = native_sym(Native.add);
const MULTIPLY = native_sym(Native.multiply);
const POW = native_sym(Native.pow);
const ISCOMPLEX = native_sym(Native.iscomplex);
const ISIMAG = native_sym(Native.isimag);
const ISINFINITE = native_sym(Native.isinfinite);
const ISINFINITESIMAL = native_sym(Native.isinfinitesimal);
const ISNEGATIVE = native_sym(Native.isnegative);
const ISPOSITIVE = native_sym(Native.ispositive);
const ISREAL = native_sym(Native.isreal);
const ISZERO = native_sym(Native.iszero);

function make_user_symbol_runner(sym: Sym) {
    return ($: ExtensionEnv) => {
        const binding = $.getBinding(sym);
        if (is_nil(binding) || sym.equals(binding)) {
            return sym;
        }
        else {
            return $.valueOf(binding);
        }
    };
}

class StableExprComparator implements ExprComparator {
    constructor(private readonly opr: Sym) {
        // 
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    compare(lhs: U, rhs: U, $: ExtensionEnv): Sign {
        throw new Error(`(compare ${this.opr} ${lhs} ${rhs})`);
        // return SIGN_EQ;
    }
}

export interface EnvOptions {
    // TODO: Make this optional
    allowUndeclaredVars: UndeclaredVars,
    assumes?: { [name: string]: Partial<Predicates> };
    dependencies?: FEATURE[];
    enable?: Directive[];
    disable?: Directive[];
    noOptimize?: boolean;
    useCaretForExponentiation?: boolean;
    useDerivativeShorthandLowerD?: boolean;
    useIntegersForPredicates?: boolean;
    useParenForTensors?: boolean;
    syntaxKind?: SyntaxKind;
}

function config_from_options(options: EnvOptions | undefined): EnvConfig {
    if (options) {
        // console.lg(`EnvOptions: ${options.allowUndeclaredVars} ${typeof options.allowUndeclaredVars}`);
        const config: EnvConfig = {
            // Be careful here. enum(s) have the 'number' type.
            allowUndeclaredVars: typeof options.allowUndeclaredVars === 'number' ? options.allowUndeclaredVars : UndeclaredVars.Nil,
            assumes: options.assumes ? options.assumes : {},
            dependencies: Array.isArray(options.dependencies) ? options.dependencies : [],
            enable: Array.isArray(options.enable) ? options.enable : [],
            disable: Array.isArray(options.disable) ? options.disable : [],
            noOptimize: typeof options.noOptimize === 'boolean' ? options.noOptimize : false,
            useCaretForExponentiation: typeof options.useCaretForExponentiation === 'boolean' ? options.useCaretForExponentiation : false,
            useDerivativeShorthandLowerD: typeof options.useDerivativeShorthandLowerD === 'boolean' ? options.useDerivativeShorthandLowerD : false,
            useIntegersForPredicates: typeof options.useIntegersForPredicates === 'boolean' ? options.useIntegersForPredicates : false,
            useParenForTensors: typeof options.useParenForTensors === 'boolean' ? options.useParenForTensors : false,
            syntaxKind: typeof options.syntaxKind !== 'undefined' ? options.syntaxKind : SyntaxKind.Algebrite,
        };
        // console.lg(`EnvConfig: ${config.allowUndeclaredVars}`);
        return config;
    }
    else {
        const config: EnvConfig = {
            allowUndeclaredVars: UndeclaredVars.Nil,
            assumes: {},
            dependencies: [],
            enable: [],
            disable: [],
            noOptimize: false,
            useCaretForExponentiation: false,
            useDerivativeShorthandLowerD: false,
            useIntegersForPredicates: false,
            useParenForTensors: false,
            syntaxKind: SyntaxKind.Algebrite
        };
        // console.lg(`EnvConfig: ${config.allowUndeclaredVars}`);
        return config;
    }
}

/**
 * Evaluates each item in the `argList` and returns (opr ...), 
 */
function evaluate_args(opr: Sym, argList: Cons, $: ExtensionEnv): Cons {
    // We must evaluate all the operands in this scope before letting the base to the gruntwork of multiplication
    // const values = argList.map(x=>$.valueOf(x));
    // cons(opr, values);
    const args = [...argList].map(x => $.valueOf(x));
    return items_to_cons(opr, ...args);
}

/**
 * The ExtensionEnv was originally implemented for a scripting language with a single global scope.
 * By using this DerivedEnv over the create_env function we can incrementally migrate to an architecture
 * that supports nested scopes.
 */
export class DerivedEnv implements ExtensionEnv {
    readonly #baseEnv: ExtensionEnv;
    readonly #bindings: Map<string, U> = new Map();
    readonly #userfunc: Map<string, U> = new Map();
    constructor(baseEnv: ExtensionEnv) {
        this.#baseEnv = baseEnv;
    }
    getProlog(): readonly string[] {
        throw new Error('getProlog method not implemented.');
    }
    getPrintHandler(): PrintHandler {
        return this.#baseEnv.getPrintHandler();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setPrintHandler(handler: PrintHandler): void {
        this.#baseEnv.setPrintHandler(handler);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    abs(expr: U): U {
        throw new Error('abs method not implemented.');
    }
    algebra(metric: Tensor<U>, labels: Tensor<U>): Tensor<U> {
        throw new Error('algebra method not implemented.');
    }
    add(...args: U[]): U {
        throw new Error('add method not implemented.');
    }
    arccos(expr: U): U {
        throw new Error('arccos method not implemented.');
    }
    arcsin(expr: U): U {
        throw new Error('arcsin method not implemented.');
    }
    arctan(expr: U): U {
        throw new Error('arctan method not implemented.');
    }
    arg(expr: U): U {
        throw new Error('arg method not implemented.');
    }
    clock(expr: U): U {
        throw new Error('clock method not implemented.');
    }
    conj(expr: U): U {
        throw new Error('conj method not implemented.');
    }
    cos(expr: U): U {
        throw new Error('cos method not implemented.');
    }
    clearBindings(): void {
        this.#bindings.clear();
        this.#baseEnv.clearBindings();
    }
    clearOperators(): void {
        this.#baseEnv.clearOperators();
    }
    compareFn(sym: Sym): CompareFn {
        throw new Error('compareFn method not implemented.');
    }
    component(tensor: Tensor<U>, indices: U): U {
        throw new Error('component method not implemented.');
    }
    defineConsTransformer(opr: Sym, consExpr: ConsExpr): void {
        this.#baseEnv.defineConsTransformer(opr, consExpr);
    }
    defineFunction(match: U, lambda: LambdaExpr): void {
        throw new Error('defineFunction method not implemented.');
    }
    defineKeyword(sym: Sym, runner: KeywordRunner): void {
        this.#baseEnv.defineKeyword(sym, runner);
    }
    defineOperator(builder: OperatorBuilder<U>): void {
        this.#baseEnv.defineOperator(builder);
    }
    defineAssociative(opr: Sym, id: Rat): void {
        this.#baseEnv.defineAssociative(opr, id);
    }
    defineUserSymbol(sym: Sym): void {
        this.#baseEnv.defineUserSymbol(sym);
    }
    derivedEnv(): ExtensionEnv {
        return new DerivedEnv(this);
    }
    divide(lhs: U, rhs: U): U {
        throw new Error('divide method not implemented.');
    }
    equals(lhs: U, rhs: U): boolean {
        throw new Error('equals method not implemented.');
    }
    evaluate(opr: Native, ...args: U[]): U {
        throw new Error('evaluate method not implemented.');
    }
    executeProlog(prolog: readonly string[]): void {
        throw new Error('executeProlog method not implemented.');
    }
    exp(expr: U): U {
        throw new Error('exp method not implemented.');
    }
    factor(expr: U): U {
        throw new Error('factor method not implemented.');
    }
    factorize(poly: U, x: U): U {
        throw new Error('factorize method not implemented.');
    }
    float(expr: U): U {
        throw new Error('float method not implemented.');
    }
    getCustomDirective(directive: string): boolean {
        throw new Error('getCustomDirective method not implemented.');
    }
    getDirective(directive: Directive): boolean {
        return this.#baseEnv.getDirective(directive);
    }
    getSymbolPredicates(sym: Sym): Predicates {
        throw new Error('getSymbolPredicates method not implemented.');
    }
    getSymbolPrintName(sym: Sym): string {
        return this.#baseEnv.getSymbolPrintName(sym);
    }
    getSymbolUsrFunc(sym: Sym): U {
        throw new Error('getSymbolYsrFunc method not implemented.');
    }
    getSymbolsInfo(): { sym: Sym; value: U; }[] {
        // TODO: Symbols in the bindings?
        return this.#baseEnv.getSymbolsInfo();
    }
    buildOperators(): void {
        this.#baseEnv.buildOperators();
    }
    im(expr: U): U {
        throw new Error('im method not implemented.');
    }
    inner(lhs: U, rhs: U): U {
        throw new Error('inner method not implemented.');
    }
    is(predicate: Sym, expr: U): boolean {
        throw new Error('is method not implemented.');
    }
    iscomplex(expr: U): boolean {
        throw new Error('iscomplex method not implemented.');
    }
    isExpanding(): boolean {
        throw new Error('isExpanding method not implemented.');
    }
    isFactoring(): boolean {
        throw new Error('isFactorin method not implemented.');
    }
    isimag(expr: U): boolean {
        throw new Error('isimag method not implemented.');
    }
    isinfinite(expr: U): boolean {
        throw new Error('isinfinite method not implemented.');
    }
    isinfinitesimal(expr: U): boolean {
        throw new Error('isinfinitesimal method not implemented.');
    }
    isminusone(expr: U): boolean {
        throw new Error('isminusone method not implemented.');
    }
    isnegative(expr: U): boolean {
        throw new Error('isnegative method not implemented.');
    }
    isone(expr: U): boolean {
        if (is_nil(expr)) {
            return false;
        }
        throw new Error(`isone ${expr} method not implemented.`);
    }
    ispositive(expr: U): boolean {
        throw new Error('ispositive method not implemented.');
    }
    isreal(expr: U): boolean {
        throw new Error('isreal method not implemented.');
    }
    isscalar(expr: U): boolean {
        throw new Error('iscalar method not implemented.');
    }
    iszero(expr: U): boolean {
        if (is_flt(expr)) {
            return expr.isZero();
        }
        else if (is_nil(expr)) {
            return false;
        }
        throw new Error(`iszero ${expr} method not implemented.`);
    }
    log(expr: U): U {
        throw new Error('log method not implemented.');
    }
    multiply(...args: U[]): U {
        throw new Error('multiply method not implemented.');
    }
    negate(expr: U): U {
        throw new Error('negate method not implemented.');
    }
    operatorFor(expr: U): Operator<U> | undefined {
        throw new Error('operatorFor method not implemented.');
    }
    outer(...args: U[]): U {
        throw new Error('outer method not implemented.');
    }
    polar(expr: U): U {
        throw new Error('polar method not implemented.');
    }
    power(base: U, expo: U): U {
        throw new Error('power method not implemented.');
    }
    re(expr: U): U {
        throw new Error('re method not implemented.');
    }
    rect(expr: U): U {
        throw new Error('rect method not implemented.');
    }
    remove(varName: Sym): void {
        throw new Error('remove method not implemented.');
    }
    setCustomDirective(directive: string, value: boolean): void {
        throw new Error('setCustomDirective method not implemented.');
    }
    pushDirective(directive: Directive, value: boolean): void {
        this.#baseEnv.pushDirective(directive, value);
    }
    popDirective(): void {
        this.#baseEnv.popDirective();
    }
    setSymbolOrder(sym: Sym, order: ExprComparator): void {
        this.#baseEnv.setSymbolOrder(sym, order);
    }
    setSymbolPredicates(sym: Sym, predicates: Partial<Predicates>): void {
        throw new Error('setSymbolPredicates method not implemented.');
    }
    setSymbolPrintName(sym: Sym, printName: string): void {
        throw new Error('setSymbolPrintName method not implemented.');
    }
    setSymbolUsrFunc(sym: Sym, usrfunc: U): void {
        this.#userfunc.set(sym.key(), usrfunc);
    }
    simplify(expr: U): U {
        throw new Error('simplify method not implemented.');
    }
    sin(expr: U): U {
        throw new Error('sin method not implemented.');
    }
    sqrt(expr: U): U {
        throw new Error('sqrt method not implemented.');
    }
    st(expr: U): U {
        throw new Error('st method not implemented.');
    }
    subst(newExpr: U, oldExpr: U, expr: U): U {
        throw new Error('subst method not implemented.');
    }
    subtract(lhs: U, rhs: U): U {
        throw new Error('subtract method not implemented.');
    }
    toInfixString(expr: U): string {
        return this.#baseEnv.toInfixString(expr);
    }
    toLatexString(expr: U): string {
        return this.#baseEnv.toLatexString(expr);
    }
    toSExprString(expr: U): string {
        return this.#baseEnv.toSExprString(expr);
    }
    transform(expr: U): [number, U] {
        const value = this.valueOf(expr);
        try {
            if (value.equals(expr)) {
                expr.addRef();
                return [TFLAG_NONE, expr];
            }
            else {
                value.addRef();
                return [TFLAG_DIFF, value];
            }
        }
        finally {
            value.release();
        }
    }
    valueOf(expr: U): U {
        if (is_cons(expr)) {
            const opr = expr.opr;
            try {
                if (is_sym(opr)) {
                    // The startegy is to evaluate arguments in the current scope then delegate to the base environment to do the operator gruntwork.
                    // This should work for most operators but how should we handle Special Forms?
                    if (opr.equals(ASSIGN)) {
                        return setq(expr.lhs, expr.rhs, assert_sym_any_any(expr), this);
                    }
                    else if (opr.equals(COMPONENT)) {
                        return this.#baseEnv.valueOf(expr);
                    }
                    else if (opr.equals(LET)) {
                        return Eval_let(expr, this);
                    }
                    else {
                        return this.#baseEnv.valueOf(evaluate_args(opr, expr.argList, this));
                    }
                }
            }
            finally {
                opr.release();
            }
        }
        else if (is_boo(expr)) {
            return expr;
        }
        else if (is_flt(expr)) {
            return expr;
        }
        else if (is_keyword(expr)) {
            return expr;
        }
        else if (is_map(expr)) {
            return this.#baseEnv.valueOf(expr);
        }
        else if (is_rat(expr)) {
            return expr;
        }
        else if (is_str(expr)) {
            return expr;
        }
        else if (is_sym(expr)) {
            const key = expr.key();
            if (this.#bindings.has(key)) {
                return this.#bindings.get(key)!;
            }
            else {
                return this.#baseEnv.valueOf(expr);
            }
        }
        else if (is_tensor(expr)) {
            return this.#baseEnv.valueOf(expr);
        }
        throw new Error(`valueOf ${expr} method not implemented.`);
    }
    getBinding(sym: Sym): U {
        const key = sym.key();
        if (this.#bindings.has(key)) {
            return this.#bindings.get(key)!;
        }
        else {
            return this.#baseEnv.getBinding(sym);
        }
    }

    getUsrFunc(sym: Sym): U {
        throw new Error('getUsrFunc method not implemented.');
    }
    isConsSymbol(sym: Sym): boolean {
        return this.#baseEnv.isConsSymbol(sym);
    }
    isUserSymbol(sym: Sym): boolean {
        if (this.#userfunc.has(sym.key())) {
            return true;
        }
        else {
            return this.#baseEnv.isUserSymbol(sym);
        }
    }
    setBinding(sym: Sym, binding: U): void {
        // console.lg("DerivedEnv.setBinding", `${sym}`, `${binding}`);
        this.#bindings.set(sym.key(), binding);
    }
    setUsrFunc(sym: Sym, usrfunc: U): void {
        this.#userfunc.set(sym.key(), usrfunc);
    }
}

export function create_env(options?: EnvOptions): ExtensionEnv {

    const config: EnvConfig = config_from_options(options);
    const prolog: string[] = [];

    // console.lg(`config: ${JSON.stringify(config, null, 2)}`);

    const symTab: SymTab = createSymTab();

    /**
     * Keep track of which symbols are user symbols.
     */
    const userSymbols: Map<string, Sym> = new Map();

    const builders: OperatorBuilder<U>[] = [];
    /**
     * The operators in buckets that are determined by the phase and operator hash.
     */
    const ops_by_mode: { [hash: string]: Operator<U>[] }[] = [];
    for (const mode of MODE_SEQUENCE) {
        ops_by_mode[mode] = {};
    }
    /**
     * The cons operators in buckets determined by the phase and operator key.
     */
    const cons_by_mode: { [key: string]: Operator<Cons>[] }[] = [];
    for (const mode of MODE_SEQUENCE) {
        cons_by_mode[mode] = {};
    }

    let printHandler: PrintHandler = new NoopPrintHandler();

    const native_directives = new DirectiveStack();
    const custom_directives: { [directive: string]: boolean } = {};

    /**
     * Override printname(s) for symbols used during rendering.
     */
    const sym_key_to_printname: { [key: string]: string } = {};

    const sym_order: Record<string, ExprComparator> = {};

    function currentOpsByHash(): { [hash: string]: Operator<U>[] } {
        if (native_directives.get(Directive.expanding)) {
            const ops = ops_by_mode[MODE_EXPANDING];
            if (typeof ops === 'undefined') {
                throw new ProgrammingError();
            }
            return ops;
        }
        if (native_directives.get(Directive.factoring)) {
            const ops = ops_by_mode[MODE_FACTORING];
            if (typeof ops === 'undefined') {
                throw new ProgrammingError();
            }
            return ops;
        }
        return {};
    }

    function currentConsByOperator(): { [operator: string]: Operator<Cons>[] } {
        if (native_directives.get(Directive.expanding)) {
            const cons = cons_by_mode[MODE_EXPANDING];
            if (cons) {
                return cons;
            }
            else {
                throw new ProgrammingError();
            }
        }
        if (native_directives.get(Directive.factoring)) {
            const cons = cons_by_mode[MODE_FACTORING];
            if (cons) {
                return cons;
            }
            else {
                throw new ProgrammingError();
            }
        }
        return {};
    }

    /**
     * TODO: It should be possible to separate ConsOperator and AtomOperator?
     * @param atom The expression is the atom.
     * @returns The operator for the atom.
     */
    function selectAtomOperator(atom: U): Operator<U> | undefined {
        const hash = hash_for_atom(atom);
        const ops = currentOpsByHash()[hash];
        if (Array.isArray(ops) && ops.length > 0) {
            for (const op of ops) {
                if (op.isKind(atom)) {
                    return op;
                }
            }
            throw new SystemError(`No matching operator for hash ${hash}`);
        }
        else {
            return void 0;
        }
    }

    /**
     * TODO: The NilExtension is actually typed as Operator<Cons>
     */
    function selectNilOperator(): Operator<U> | undefined {
        // We could simply create a Nil operator and cache it.
        // How many do you need?
        // TODO: DRY. What is the hash for Nil?
        const hash = nil.name;
        const ops = currentOpsByHash()[hash];
        if (Array.isArray(ops) && ops.length > 0) {
            for (const op of ops) {
                if (op.isKind(nil)) {
                    return op;
                }
            }
            throw new SystemError(`No matching operator for hash ${hash}`);
        }
        else {
            return void 0;
        }
    }

    /**
     * The environment return value and environment for callbacks.
     */
    const $: ExtensionEnv = {
        getBinding(sym: Sym): U {
            assert_sym(sym);
            if (symTab.hasBinding(sym)) {
                return symTab.getBinding(sym);
            }
            else {
                // console.lg(`config.allowUndeclaredVars => ${config.allowUndeclaredVars}`);
                switch (config.allowUndeclaredVars) {
                    case UndeclaredVars.Err: {
                        // console.lg("getBinding", `${sym}`);
                        // throw new ProgrammingError();// TEMP
                        return new Err(new Str(`Use of undeclared Var ${sym.key()}.`));
                    }
                    case UndeclaredVars.Nil: {
                        return sym;
                        // return nil;
                    }
                    default: {
                        throw new Error(`Unexpected config.allowUndeclaredVars`);
                    }
                }
            }
        },
        getUsrFunc(sym: Sym): U {
            return $.getSymbolUsrFunc(sym);
        },
        isConsSymbol(sym: Sym): boolean {
            const currents: { [operator: string]: Operator<U>[] } = currentConsByOperator();
            const cons: Operator<U>[] = currents[sym.key()];
            if (Array.isArray(cons) && cons.length > 0) {
                return true;
            }
            else {
                // TODO: May need to adjust the ordering.
                // Do we check the symTab first?
                return symTab.hasBinding(sym);
            }
        },
        isUserSymbol(sym: Sym): boolean {
            return userSymbols.has(sym.key());
        },
        setBinding(sym: Sym, binding: U): void {
            // console.lg("ExprContext.setBinding", `${sym}`, `${binding}`);
            symTab.setBinding(sym, binding);
        },
        setUsrFunc(sym: Sym, usrfunc: U): void {
            return $.setSymbolUsrFunc(sym, usrfunc);
        },
        getPrintHandler(): PrintHandler {
            return printHandler;
        },
        setPrintHandler(handler: PrintHandler): void {
            if (handler) {
                printHandler = handler;
            }
            else {
                printHandler = new NoopPrintHandler();
            }
        },
        abs(expr: U): U {
            return $.evaluate(Native.abs, expr);
        },
        algebra(metric: Tensor<U>, labels: Tensor<U>): Tensor<U> {
            return algebra(metric, labels, $);
        },
        add(...args: U[]): U {
            return $.evaluate(Native.add, ...args);
        },
        arccos(expr: U): U {
            return $.evaluate(Native.arccos, expr);
        },
        arcsin(expr: U): U {
            return $.evaluate(Native.arcsin, expr);
        },
        arctan(expr: U): U {
            return $.evaluate(Native.arctan, expr);
        },
        arg(expr: U): U {
            return $.evaluate(Native.arg, expr);
        },
        clearOperators(): void {
            builders.length = 0;
            for (const mode of MODE_SEQUENCE) {
                const ops = ops_by_mode[mode];
                for (const hash in ops) {
                    ops[hash] = [];
                }
                const cons = cons_by_mode[mode];
                for (const key in cons) {
                    cons[key] = [];
                }
            }
        },
        defineConsTransformer(opr: Sym, consExpr: ConsExpr): void {
            $.defineOperator(operator_from_cons_expression(opr, consExpr));
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defineFunction(match: U, impl: LambdaExpr): void {
            // $.defineOperator(operator_from_modern_transformer(match, impl));
            const opr = opr_from_match(match);
            const hash = hash_from_match(match);
            $.setBinding(opr, new Lambda(impl, hash));
        },
        defineKeyword(sym: Sym, runner: KeywordRunner): void {
            $.defineOperator(operator_from_keyword_runner(sym, runner));
        },
        defineUserSymbol(sym: Sym): void {
            // The most important thing to do is to keep track of which symbols are user symbols.
            // This will allow us to report back correctly later in isUserSymbol(sym), which is used for SVG rendering.
            userSymbols.set(sym.key(), sym);

            // Given that we already have an Operator for Sym installed,
            // which has the same (standard) implementation of valueOf as the user symbol runner,
            // there's really no value in adding the following operator.
            // Leaving it for now as it does no harm and may have utility later.
            $.defineKeyword(sym, make_user_symbol_runner(sym));
            $.buildOperators();
        },
        defineOperator(builder: OperatorBuilder<U>): void {
            builders.push(builder);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defineAssociative(opr: Sym, id: Rat): void {
            // Do nothing.
        },
        divide(lhs: U, rhs: U): U {
            return $.multiply(lhs, $.power(rhs, negOne));
        },
        clearBindings(): void {
            symTab.clear();
        },
        compareFn(sym: Sym): CompareFn {
            const order = sym_order[sym.key()];
            if (order) {
                // TODO: Cache
                return function (lhs: U, rhs: U): Sign {
                    return order.compare(lhs, rhs, $);
                };
            }
            else {
                return function (lhs: U, rhs: U): Sign {
                    return new StableExprComparator(sym).compare(lhs, rhs, $);
                };
            }
        },
        component(tensor: Tensor<U>, indices: U): U {
            return $.evaluate(Native.component, tensor, indices);
        },
        clock(expr: U): U {
            return $.evaluate(Native.clock, expr);
        },
        conj(expr: U): U {
            return $.evaluate(Native.conj, expr);
        },
        cos(expr: U): U {
            return $.evaluate(Native.cos, expr);
        },
        derivedEnv(): ExtensionEnv {
            return new DerivedEnv(this);
        },
        evaluate(opr: Native, ...args: U[]): U {
            const argList = items_to_cons(...args);
            const expr = cons(native_sym(opr), argList);
            return $.valueOf(expr);
        },
        executeProlog(prolog: readonly string[]): void {
            execute_definitions(prolog, $);
        },
        exp(expr: U): U {
            return $.evaluate(Native.exp, expr);
        },
        factor(expr: U): U {
            return $.evaluate(Native.factor, expr);
        },
        float(expr: U): U {
            return $.evaluate(Native.float, expr);
        },
        getSymbolPredicates(sym: Sym): Predicates {
            return symTab.getProps(sym);
        },
        getSymbolUsrFunc(sym: Sym): U {
            return symTab.getUsrFunc(sym);
        },
        getSymbolsInfo() {
            return symTab.entries();
        },
        buildOperators(): void {
            for (const builder of builders) {
                const op: Operator<U> = builder.create($, config);
                if (dependencies_satisfied(op.dependencies, config.dependencies)) {
                    // No problem.
                }
                else {
                    // console.lg(`Ignoring ${op.name} which depends on ${JSON.stringify(op.dependencies)}`);
                    continue;
                }
                // If an operator does not restrict the modes to which it applies then it applies to all modes.
                const phaseFlags = typeof op.phases === 'number' ? op.phases : MODE_FLAGS_ALL;
                for (const mode of MODE_SEQUENCE) {
                    if (phaseFlags & mode) {
                        if (op.hash) {
                            const ops = ops_by_mode[mode];
                            if (!Array.isArray(ops[op.hash])) {
                                ops[op.hash] = [op];
                            }
                            else {
                                ops[op.hash].push(op);
                            }
                        }
                        else {
                            throw new SystemError(`operator MUST have a 'hash' property.`);
                        }
                        if (op.iscons()) {
                            // The generic ConsExtension is unable to provide an operator. 
                            const operator: string = op.operator().key();
                            const cons = cons_by_mode[mode];
                            if (!Array.isArray(cons[operator])) {
                                cons[operator] = [op];
                            }
                            else {
                                cons[operator].push(op);
                            }
                        }
                    }
                }
            }
            // Make the building idempotent?
            // Is there a case where we need to re-start.
            builders.length = 0;
            // Inspect which operators are assigned to which buckets...
            for (const mode of MODE_SEQUENCE) {
                const ops = ops_by_mode[mode];
                for (const hash in ops) {
                    const candidates: Operator<U>[] = ops[hash];
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    for (const candidate of candidates) {
                        // console.lg(`${hash} is implemented by "${candidate.name}" in mode ${JSON.stringify(decodeMode(mode))}.`);
                    }
                }
            }
        },
        is(predicate: Sym, expr: U): boolean {
            // In the new way we don't require every operator to provide the answer.
            const question = items_to_cons(predicate, expr);
            const response = $.valueOf(question);
            if (is_boo(response)) {
                return response.isTrue();
            }
            else {
                return false;
                // throw new Error(`Unable to determine ${$.toInfixString(predicate)}(${$.toInfixString(expr)})`);
            }
        },
        iscomplex(expr: U): boolean {
            return $.is(ISCOMPLEX, expr);
        },
        isExpanding(): boolean {
            return native_directives.get(Directive.expanding);
        },
        isFactoring(): boolean {
            return native_directives.get(Directive.factoring);
        },
        isimag(expr: U): boolean {
            if (is_nil(expr)) {
                return false;
            }
            else if (is_rat(expr)) {
                return false;
            }
            else if (is_flt(expr)) {
                return false;
            }
            else {
                return $.is(ISIMAG, expr);
            }
        },
        isinfinite(expr: U): boolean {
            return $.is(ISINFINITE, expr);
        },
        isinfinitesimal(expr: U): boolean {
            return $.is(ISINFINITESIMAL, expr);
        },
        isminusone(expr: U): boolean {
            if (is_nil(expr)) {
                return false;
            }
            else if (is_rat(expr)) {
                return expr.isMinusOne();
            }
            else if (is_flt(expr)) {
                return expr.isMinusOne();
            }
            else {
                return false;
            }
        },
        isnegative(expr: U): boolean {
            return $.is(ISNEGATIVE, expr);
        },
        isone(expr: U): boolean {
            if (is_nil(expr)) {
                return false;
            }
            else if (is_rat(expr)) {
                return expr.isOne();
            }
            else if (is_flt(expr)) {
                return expr.isOne();
            }
            else {
                return false;
            }
        },
        ispositive(expr: U): boolean {
            return $.is(ISPOSITIVE, expr);
        },
        isreal(expr: U): boolean {
            return $.is(ISREAL, expr);
        },
        isscalar(expr: U): boolean {
            if (is_nil(expr)) {
                return false;
            }
            else if (is_rat(expr)) {
                return true;
            }
            else if (is_flt(expr)) {
                return true;
            }
            else if (is_sym(expr)) {
                return true;
            }
            else {
                return false;
            }
        },
        iszero(expr: U): boolean {
            return $.is(ISZERO, expr);
        },
        equals(lhs: U, rhs: U): boolean {
            return lhs.equals(rhs);
        },
        factorize(p: U, x: U): U {
            // console.lg(`factorize p=${render_as_infix(p, $)} in variable ${render_as_infix(x, $)}`);
            if (!p.contains(x)) {
                // console.lg(`Giving up b/c the polynomial does not contain the variable.`);
                return p;
            }

            if (!is_poly_expanded_form(p, x, $)) {
                // console.lg(`Giving up b/c the polynomial is not in expanded form.`);
                return p;
            }

            if (is_sym(x)) {
                return yyfactorpoly(p, x, $);
            }
            else {
                // console.lg(`Giving up b/c the variable is not a symbol.`);
                return p;
            }
        },
        getCustomDirective(directive: string): boolean {
            return !!custom_directives[directive];
        },
        getDirective(directive: Directive): boolean {
            return native_directives.get(directive);
        },
        getSymbolPrintName(sym: Sym): string {
            const token = sym_key_to_printname[sym.key()];
            if (typeof token === 'string') {
                return token;
            }
            else {
                return sym.key();
            }
        },
        im(expr: U): U {
            return $.evaluate(Native.im, expr);
        },
        inner(lhs: U, rhs: U): U {
            // console.lg(`inner lhs=${print_list(lhs, $)} rhs=${print_list(rhs, $)} `);
            const value_lhs = $.valueOf(lhs);
            const value_rhs = $.valueOf(rhs);
            const inner_lhs_rhs = items_to_cons(native_sym(Native.inner), value_lhs, value_rhs);
            const value_inner_lhs_rhs = $.valueOf(inner_lhs_rhs);
            return value_inner_lhs_rhs;
        },
        log(expr: U): U {
            return $.evaluate(Native.log, expr);
        },
        multiply(...args: U[]): U {
            return $.evaluate(Native.multiply, ...args);
        },
        /**
         * The universal unary minus function meaning multiplication by -1.
         */
        negate(x: U): U {
            return $.multiply(negOne, x);
        },
        operatorFor(expr: U): Operator<U> | undefined {
            if (is_cons(expr)) {
                const head = expr.head;
                try {
                    if (is_cons(head)) {
                        throw new Error("!!!!!!!!!!!!!!!!!!!!!!!!");
                    }
                    // if (is_sym(head)) {
                    // console.lg("head", `${head}`);
                    const hashes = hash_info(expr);
                    for (const hash of hashes) {
                        const ops = currentOpsByHash()[hash];
                        if (Array.isArray(ops)) {
                            for (const op of ops) {
                                if (op.isKind(expr)) {
                                    // console.lg("op", render_as_infix(expr, $), op.name);
                                    return op;
                                }
                            }
                        }
                    }
                    return new UnknownConsOperator($);
                    // We can end up here for user-defined functions.
                    // The consumer is trying to answer a question
                    // throw new SystemError(`${expr}, current_phase = ${current_focus} keys = ${JSON.stringify(keys)}`);
                    //}
                    //else {

                    //}
                }
                finally {
                    head.release();
                }
            }
            else if (is_atom(expr)) {
                return selectAtomOperator(expr);
            }
            else if (is_nil(expr)) {
                return selectNilOperator();
            }
            else {
                throw new ProgrammingError();
            }
        },
        outer(...args: U[]): U {
            return $.evaluate(Native.outer, ...args);
        },
        polar(expr: U): U {
            return $.evaluate(Native.polar, expr);
        },
        power(base: U, expo: U): U {
            return $.evaluate(Native.pow, base, expo);
        },
        getProlog(): readonly string[] {
            // Do we make a defensive copy?
            return prolog;
        },
        re(expr: U): U {
            return $.evaluate(Native.re, expr);
        },
        rect(expr: U): U {
            return $.evaluate(Native.rect, expr);
        },
        remove(varName: Sym): void {
            symTab.delete(varName);
        },
        setCustomDirective(directive: string, value: boolean): void {
            custom_directives[directive] = value;
        },
        pushDirective(directive: Directive, value: boolean): void {
            native_directives.push(directive, value);
        },
        popDirective(): void {
            native_directives.pop();
        },
        setSymbolOrder(sym: Sym, order: ExprComparator): void {
            sym_order[sym.key()] = order;
        },
        setSymbolPredicates(sym: Sym, predicates: Partial<Predicates>): void {
            symTab.setProps(sym, predicates);
        },
        setSymbolPrintName(sym: Sym, printname: string): void {
            sym_key_to_printname[sym.key()] = printname;
        },
        setSymbolUsrFunc(sym: string | Sym, usrfunc: U): void {
            if (typeof sym === 'string') {
                symTab.setUsrFunc(create_sym(sym), usrfunc);
            }
            else {
                symTab.setUsrFunc(sym, usrfunc);
            }
        },
        simplify(expr: U): U {
            return $.evaluate(Native.simplify, expr);
        },
        sin(expr: U): U {
            return $.evaluate(Native.sin, expr);
        },
        sqrt(expr: U): U {
            return $.evaluate(Native.sqrt, expr);
        },
        st(expr: U): U {
            return $.evaluate(Native.st, expr);
        },
        subst(newExpr: U, oldExpr: U, expr: U): U {
            return $.evaluate(Native.subst, newExpr, oldExpr, expr);
        },
        subtract(lhs: U, rhs: U): U {
            return $.add(lhs, $.negate(rhs));
        },
        toInfixString(expr: U): string {
            const op = $.operatorFor(expr);
            if (op) {
                return op.toInfixString(expr);
            }
            else {
                return `${expr}`;
            }
        },
        toLatexString(expr: U): string {
            const op = $.operatorFor(expr);
            if (op) {
                return op.toLatexString(expr);
            }
            else {
                return `${expr}`;
            }
        },
        toSExprString(x: U): string {
            const op = $.operatorFor(x);
            if (op) {
                return op.toListString(x);
            }
            else {
                throw new Error(`No operator found for expression of type ${JSON.stringify(x.name)}`);
            }
        },
        transform(expr: U): [TFLAGS, U] {
            // console.lg("transform", `${expr}`);
            // We short-circuit some expressions in order to improve performance.
            if (is_cons(expr)) {
                // TODO: As an evaluation technique, I should be able to pick any item in the list and operate
                // to the left or right. This implies that I have distinct right and left evaluations.
                const head = expr.head;
                if (is_cons(head)) {
                    const opr = head.opr;
                    try {
                        if (opr.equals(FN)) {
                            const newExpr = Eval_lambda_in_fn_syntax(expr, $);
                            return [TFLAG_DIFF, newExpr];
                        }
                        else {
                            throw new ProgrammingError();
                        }
                    }
                    finally {
                        opr.release();
                    }
                }
                else if (is_sym(head)) {
                    // The generalization here is that a symbol may have multiple bindings that we need to disambiguate.
                    if (symTab.hasBinding(head)) {
                        const value = $.getBinding(head);
                        if (is_lambda(value)) {
                            return wrap_as_transform(value.evaluate(expr.argList, $), expr);
                        }
                        else {
                            // And if it is not we fall through to the operator stuff.
                        }
                    }
                }
                else if (is_rat(head)) {
                    // Why do we have a special case for rat?
                    // We know that the key and hash are both 'Rat'
                    // const hash = head.name;
                    const ops: Operator<U>[] = currentOpsByHash()['Rat'];
                    // TODO: The operator will be acting on the argList, not the entire expression.
                    const op = unambiguous_operator(expr.argList, ops, $);
                    if (op) {
                        // console.lg(`We found the ${op.name} operator!`);
                        return op.evaluate(head, expr.argList);
                    }
                    else {
                        // eslint-disable-next-line no-console
                        console.warn(`No unique operators found for Rat from ${ops.length} choice(s).`);
                    }
                }
                // let changedExpr = false;
                const hash_to_ops = currentOpsByHash();
                // hashes are the buckets we should look in for operators from specific to generic.
                const hashes: string[] = hash_info(expr);
                // console.lg("keys", JSON.stringify(keys));
                for (const hash of hashes) {
                    const ops = hash_to_ops[hash];
                    // console.lg(`Looking for key: ${JSON.stringify(key)} expr: ${expr} choices: ${Array.isArray(ops) ? ops.length : 'None'}`);
                    // Determine whether there are handlers in the bucket.
                    if (Array.isArray(ops)) {
                        const op = unambiguous_operator(expr, ops, $);
                        if (op) {
                            const composite = op.transform(expr);
                            // console.lg(`${op.name} ${$.toSExprString(expr)} => ${$.toSExprString(composite[1])} flags: ${composite[0]}`);
                            // console.lg(`${op.name} ${$.toInfixString(expr)} => ${$.toInfixString(composite[1])} flags: ${composite[0]}`);
                            return composite;
                        }
                    }
                    else {
                        // If there were no handlers registered for the given key, look for a user-defined function.
                        if (is_cons(expr)) {
                            const opr = expr.opr;
                            if (is_sym(opr)) {
                                if (symTab.hasBinding(opr)) {
                                    const binding = $.getBinding(opr);
                                    if (!is_nil(binding)) {
                                        if (is_cons(binding)) {
                                            // TODO: Install as a normal Operator...
                                            if (binding.opr.equals(FN)) {
                                                const newExpr = Eval_lambda_in_fn_syntax(expr, $);
                                                return [TFLAG_DIFF, newExpr];
                                            }
                                            else if (binding.opr.equals(FUNCTION)) {
                                                const newExpr = Eval_function(expr, $);
                                                return [TFLAG_DIFF, newExpr];
                                            }
                                        }
                                        else {
                                            // If it's not a (function body paramList) expression.
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                // Once an expression has been transformed into a stable condition, it should not be transformed until a different phase.
                return [TFLAG_NONE, expr];
            }
            else if (is_nil(expr)) {
                return [TFLAG_NONE, expr];
            }
            else {
                // If it's not a list or nil, then it's an atom.
                const op = $.operatorFor(expr);
                if (op) {
                    return op.transform(expr);
                }
                else {
                    return [TFLAG_NONE, expr];
                }
            }
        },
        valueOf(expr: U): U {
            // TOOD: We'd like to do this the newWay = !oldWay.
            // This flag makes it easier to switch back and forth.
            const oldWay = true;
            if (oldWay) {
                return $.transform(expr)[1];
            }
            // console.lg("transform", expr.toString(), "is_sym", is_sym(expr));
            // We short-circuit some expressions in order to improve performance.
            if (is_cons(expr)) {
                // TODO: As an evaluation technique, I should be able to pick any item in the list and operate
                // to the left or right. This implies that I have distinct right and left evaluations.
                const head = expr.head;
                if (is_sym(head)) {
                    // The generalization here is that a symbol may have multiple bindings that we need to disambiguate.
                    const value = $.getBinding(head);
                    if (is_lambda(value)) {
                        return value.evaluate(expr.argList, $);
                    }
                }
                else if (is_rat(head)) {
                    // Why do we have a special case for rat?
                    // We know that the key and hash are both 'Rat'
                    // const hash = head.name;
                    const ops: Operator<U>[] = currentOpsByHash()['Rat'];
                    // TODO: The operator will be acting on the argList, not the entire expression.
                    const op = unambiguous_operator(expr.argList, ops, $);
                    if (op) {
                        // console.lg(`We found the ${op.name} operator!`);
                        return op.valueOf(head);
                    }
                    else {
                        // eslint-disable-next-line no-console
                        console.warn(`No unique operators found for Rat from ${ops.length} choice(s).`);
                    }
                }
                // let changedExpr = false;
                const hash_to_ops = currentOpsByHash();
                // hashes are the buckets we should look in for operators from specific to generic.
                const hashes: string[] = hash_info(expr);
                // console.lg("keys", JSON.stringify(keys));
                for (const hash of hashes) {
                    const ops = hash_to_ops[hash];
                    // console.lg(`Looking for key: ${JSON.stringify(key)} expr: ${expr} choices: ${Array.isArray(ops) ? ops.length : 'None'}`);
                    // Determine whether there are handlers in the bucket.
                    if (Array.isArray(ops)) {
                        const op = unambiguous_operator(expr, ops, $);
                        if (op) {
                            const composite = op.valueOf(expr);
                            // console.lg(`${op.name} ${$.toSExprString(expr)} => ${$.toSExprString(composite[1])} flags: ${composite[0]}`);
                            // console.lg(`${op.name} ${$.toInfixString(expr)} => ${$.toInfixString(composite[1])} flags: ${composite[0]}`);
                            return composite;
                        }
                    }
                    else {
                        // If there were no handlers registered for the given key, look for a user-defined function.
                        if (is_cons(expr)) {
                            const opr = expr.opr;
                            if (is_sym(opr)) {
                                const binding = $.getBinding(opr);
                                if (!is_nil(binding)) {
                                    if (is_cons(binding)) {
                                        // TOOD: Install as a normal Operator.
                                        if (binding.opr.equals(FN)) {
                                            throw new Error("TODO B");
                                            // const newExpr = Eval_function(expr, $);
                                            // console.lg(`USER FUNC oldExpr: ${render_as_infix(curExpr, $)} newExpr: ${render_as_infix(newExpr, $)}`);
                                            // return newExpr;
                                        }
                                        else if (binding.opr.equals(FUNCTION)) {
                                            const newExpr = Eval_function(expr, $);
                                            // console.lg(`USER FUNC oldExpr: ${render_as_infix(curExpr, $)} newExpr: ${render_as_infix(newExpr, $)}`);
                                            return newExpr;
                                        }
                                    }
                                    else {
                                        // If it's not a (function body paramList) expression.
                                    }
                                }
                            }
                        }
                    }
                }
                // Once an expression has been transformed into a stable condition, it should not be transformed until a different phase.
                return expr;
            }
            else if (is_nil(expr)) {
                return expr;
            }
            else {
                // If it's not a list or nil, then it's an atom.
                const op = $.operatorFor(expr);
                if (op) {
                    return op.valueOf(expr);
                }
                else {
                    return expr;
                }
            }
        }
    };

    // TODO: Consistency in names used for symbols in symbolic expressions.
    $.setSymbolPrintName(ADD, '+');        // changing will break  82 cases.
    $.setSymbolPrintName(MULTIPLY, '*');  // changing will break 113 cases.
    $.setSymbolPrintName(POW, 'pow');
    $.setSymbolPrintName(native_sym(Native.rco), '>>');
    $.setSymbolPrintName(native_sym(Native.lco), '<<');
    $.setSymbolPrintName(native_sym(Native.inner), '|');
    $.setSymbolPrintName(native_sym(Native.outer), '^');
    $.setSymbolPrintName(native_sym(Native.abs), 'abs');

    $.setSymbolPrintName(native_sym(Native.E), 'e');
    $.setSymbolPrintName(native_sym(Native.PI), 'pi');
    $.setSymbolPrintName(native_sym(Native.NIL), '()');
    $.setSymbolPrintName(native_sym(Native.IMU), 'i');
    $.setSymbolPrintName(native_sym(Native.exp), 'exp');

    // Backwards compatible, but we should simply set this to false, or leave undefined.
    if ($.getDirective(Directive.useCaretForExponentiation) !== config.useCaretForExponentiation) {
        $.pushDirective(Directive.useCaretForExponentiation, config.useCaretForExponentiation);
    }
    if ($.getDirective(Directive.useIntegersForPredicates) !== config.useIntegersForPredicates) {
        $.pushDirective(Directive.useIntegersForPredicates, config.useIntegersForPredicates);
    }
    if ($.getDirective(Directive.useParenForTensors) !== config.useParenForTensors) {
        $.pushDirective(Directive.useParenForTensors, config.useParenForTensors);
    }
    for (const directive of config.enable) {
        if ($.getDirective(directive) !== true) {
            $.pushDirective(directive, true);
        }
    }
    for (const directive of config.disable) {
        if ($.getDirective(directive) !== false) {
            $.pushDirective(directive, false);
        }
    }
    // Here we could wrap in the DerivedEnv as a way to test nested scopes.
    return $;
}

function dependencies_satisfied(deps: FEATURE[] | undefined, includes: FEATURE[]): boolean {
    if (Array.isArray(deps)) {
        for (const dep of deps) {
            if (dep.startsWith('~')) {
                const s = dep.substring(1) as FEATURE;
                if (includes.indexOf(s) >= 0) {
                    return false;
                }
            }
            else {
                if (includes.indexOf(dep) < 0) {
                    return false;
                }
            }
        }
        return true;
    }
    else {
        return true;
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function unambiguous_operator(expr: Cons, ops: Operator<U>[], $: ExtensionEnv): Operator<U> | undefined {
    // console.lg(`unambiguous_operator for ${$.toInfixString(expr)} from ${ops.length} choice(s).`);
    const candidates: Operator<U>[] = [];
    for (const op of ops) {
        if (op.isKind(expr)) {
            candidates.push(op);
        }
    }
    if (candidates.length === 1) {
        return candidates[0];
    }
    else if (candidates.length > 0) {
        // The alternative here is that the first operator wins.
        // eslint-disable-next-line no-console
        // console.warn(`Ambiguous operators for expression ${$.toInfixString(expr)} ${JSON.stringify(candidates.map((candidate) => candidate.name))}`);
        const using = candidates[0];
        // eslint-disable-next-line no-console
        // console.warn(`Using ${JSON.stringify(using.name)}`);
        return using;
    }
    else {
        return void 0;
    }
}
