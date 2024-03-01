/* eslint-disable @typescript-eslint/no-unused-vars */
import { assert_sym, Boo, Cell, CellHost, create_sym, Flt, is_boo, is_cell, is_flt, is_lambda, is_rat, is_sym, Keyword, Lambda, Map as JsMap, negOne, Rat, Str, Sym, Tag, Tensor } from 'math-expression-atoms';
import { ExprContext, ExprHandler, LambdaExpr } from 'math-expression-context';
import { is_native, Native, native_sym } from 'math-expression-native';
import { Atom, cons, Cons, is_atom, is_cons, is_nil, items_to_cons, nil, Shareable, U } from 'math-expression-tree';
import { ExprEngineListener } from '../..';
import { ExtensionEnvFromExprContext } from '../adapters/ExtensionEnvFromExprContext';
import { make_eval } from '../adapters/make_eval';
import { StackFunction } from '../adapters/StackFunction';
import { AtomListener, UndeclaredVars } from '../api/api';
import { ProgramStack } from '../eigenmath/ProgramStack';
import { eval_function } from "../eval_function";
import { yyfactorpoly } from "../factorpoly";
import { hash_for_atom, hash_info, hash_nonop_cons, hash_target } from "../hashing/hash_info";
import { hook_create_err } from '../hooks/hook_create_err';
import { is_poly_expanded_form } from "../is";
import { algebra } from "../operators/algebra/algebra";
import { eval_lambda_in_fn_syntax } from '../operators/fn/eval_fn';
import { wrap_as_transform } from "../operators/wrap_as_transform";
import { SyntaxKind } from "../parser/parser";
import { ProgrammingError } from '../programming/ProgrammingError';
import { FN, FUNCTION } from "../runtime/constants";
import { execute_definitions } from '../runtime/init';
import { createSymTab, SymTab } from "../runtime/symtab";
import { SystemError } from "../runtime/SystemError";
import { ShareableMap } from '../shareable/ShareableMap';
import { visit } from '../visitor/visit';
import { Visitor } from '../visitor/Visitor';
import { DerivedEnv } from './DerivedEnv';
import { DirectiveStack } from "./DirectiveStack";
import { EnvConfig } from "./EnvConfig";
import { CompareFn, Directive, directive_from_flag, EvalFunction, ExprComparator, Extension, ExtensionBuilder, ExtensionEnv, FEATURE, KeywordRunner, MODE_EXPANDING, MODE_FACTORING, MODE_FLAGS_ALL, MODE_SEQUENCE, Predicates, PrintHandler, Sign, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "./ExtensionEnv";
import { NoopPrintHandler } from "./NoopPrintHandler";
import { extension_builder_from_keyword_runner } from "./operator_from_keyword_runner";
import { extension_builder_from_cons_expression, hash_from_match, opr_from_match } from "./operator_from_legacy_transformer";
import { UnknownAtomExtension } from './UnknownAtomExtension';
import { UnknownConsExtension } from "./UnknownConsExtension";

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
        const binding = $.getBinding(sym, nil);
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
            useParenForTensors: typeof options.useParenForTensors === 'boolean' ? options.useParenForTensors : false
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
            useParenForTensors: false
        };
        // console.lg(`EnvConfig: ${config.allowUndeclaredVars}`);
        return config;
    }
}

class Reaction {
    constructor(readonly expr: U, readonly scope: ExtensionEnv, readonly target: Cell) {

    }
}

class ReactionVisitor implements Visitor {
    #scope: ExtensionEnv;
    readonly sources: Cell[] = [];
    constructor(scope: ExtensionEnv) {
        this.#scope = scope;
    }
    atom(atom: U): void {
        throw new Error('atom method not implemented.');
    }
    beginCons(expr: Cons): void {
        const opr = expr.opr;
        try {
            if (is_sym(opr) && is_native(opr, Native.deref)) {
                const arg = expr.arg;
                const source = this.#scope.valueOf(arg);
                if (is_cell(source)) {
                    this.sources.push(source);
                }
            }
        }
        finally {
            opr.release();
        }
    }
    endCons(expr: Cons): void {
    }
    beginTensor(tensor: Tensor<U>): void {
    }
    endTensor(tensor: Tensor<U>): void {
    }
    beginMap(map: JsMap): void {
    }
    endMap(map: JsMap): void {
    }
    boo(boo: Boo): void {
    }
    flt(flt: Flt): void {
    }
    keyword(keyword: Keyword): void {
    }
    rat(rat: Rat): void {
    }
    str(str: Str): void {
    }
    sym(sym: Sym): void {
    }
    tag(tag: Tag): void {
    }
    nil(expr: U): void {
    }
}

class ReactiveHost implements CellHost {
    #dependencies: Map<string, Reaction[]> = new Map();
    #scope: ExtensionEnv | undefined;
    #subscribers: AtomListener[] = [];
    constructor() {

    }
    addAtomListener(subscriber: AtomListener): void {
        this.#subscribers.push(subscriber);
    }
    removeAtomListener(subscriber: AtomListener): void {
        const index = this.#subscribers.indexOf(subscriber);
        if (index > -1) {
            this.#subscribers.splice(index, 1);
        }
    }
    setScope(scope: ExtensionEnv): void {
        this.#scope = scope;
    }
    reaction(expr: U, target: Cell): void {
        const visitor = new ReactionVisitor(this.#scope!);
        visit(expr, visitor);
        const sources = visitor.sources;
        for (let i = 0; i < sources.length; i++) {
            const source = sources[i];
            const reaction = new Reaction(expr, this.#scope!, target);
            if (this.#dependencies.has(source.id)) {
                this.#dependencies.get(source.id)?.push(reaction);
            }
            else {
                this.#dependencies.set(source.id, [reaction]);
            }
        }
    }
    reset(from: U, to: U, source: Cell): void {

        for (let i = 0; i < this.#subscribers.length; i++) {
            const subscriber: AtomListener = this.#subscribers[i];
            try {
                subscriber.reset(from, to, source);
            }
            catch (e) {
                // Ignore
            }
        }

        const sourceId = source.id;
        if (this.#dependencies.has(sourceId)) {
            const reactions = this.#dependencies.get(sourceId)!;
            for (let i = 0; i < reactions.length; i++) {
                const reaction = reactions[i];
                const expr = reaction.expr;
                const scope = reaction.scope;
                const target = reaction.target;
                const data = scope.valueOf(expr);
                target.reset(data);
            }
        }
    }
    deref(value: U, atom: Cell): void {
        // Nothing to see here.
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

    const builders: ExtensionBuilder<U>[] = [];
    /**
     * The operators in buckets that are determined by the phase and operator hash.
     */
    const extensions_by_mode: { [hash: string]: Extension<U>[] }[] = [];
    for (const mode of MODE_SEQUENCE) {
        extensions_by_mode[mode] = {};
    }
    /**
     * The cons operators in buckets determined by the phase and operator key.
     */
    const cons_extensions_by_mode: { [key: string]: Extension<Cons>[] }[] = [];
    for (const mode of MODE_SEQUENCE) {
        cons_extensions_by_mode[mode] = {};
    }

    let printHandler: PrintHandler = new NoopPrintHandler();

    const native_directives = new DirectiveStack();

    /**
     * Override printname(s) for symbols used during rendering.
     */
    const sym_key_to_printname: { [key: string]: string } = {};

    const sym_order: Record<string, ExprComparator> = {};

    function currentOpsByHash(): { [hash: string]: Extension<U>[] } {
        if (native_directives.get(Directive.expanding)) {
            const ops = extensions_by_mode[MODE_EXPANDING];
            if (typeof ops === 'undefined') {
                throw new ProgrammingError();
            }
            return ops;
        }
        if (native_directives.get(Directive.factoring)) {
            const ops = extensions_by_mode[MODE_FACTORING];
            if (typeof ops === 'undefined') {
                throw new ProgrammingError();
            }
            return ops;
        }
        return {};
    }

    function currentConsByOperator(): { [operator: string]: Extension<Cons>[] } {
        if (native_directives.get(Directive.expanding)) {
            const cons = cons_extensions_by_mode[MODE_EXPANDING];
            if (cons) {
                return cons;
            }
            else {
                throw new ProgrammingError();
            }
        }
        if (native_directives.get(Directive.factoring)) {
            const cons = cons_extensions_by_mode[MODE_FACTORING];
            if (cons) {
                return cons;
            }
            else {
                throw new ProgrammingError();
            }
        }
        return {};
    }

    function select_atom_extension<A extends Atom>(atom: A): Extension<A> | undefined {
        // console.lg("select_atom_extension", `${atom}`);
        const hash = hash_for_atom(atom);
        // console.lg("hash", `${hash}`);
        const ops = currentOpsByHash()[hash] as Extension<A>[];
        if (Array.isArray(ops) && ops.length > 0) {
            for (const op of ops) {
                if (op.isKind(atom, $)) {
                    return op;
                }
            }
            throw new SystemError(`No matching operator for hash ${hash}`);
        }
        else {
            // Go along with the request in order to see WHY it was requested.
            return new UnknownAtomExtension(atom);
        }
    }

    function select_nil_extension(): Extension<U> | undefined {
        // We could simply create a Nil operator and cache it.
        // How many do you need?
        // TODO: DRY. What is the hash for Nil?
        const hash = nil.name;
        const ops = currentOpsByHash()[hash];
        if (Array.isArray(ops) && ops.length > 0) {
            for (const op of ops) {
                if (op.isKind(nil, $)) {
                    return op;
                }
            }
            throw new SystemError(`No matching operator for hash ${hash}`);
        }
        else {
            return void 0;
        }
    }

    const cellHost = new ReactiveHost();
    const subscribers: ExprEngineListener[] = [];
    const stateMap = new ShareableMap<string, Shareable>();
    let refCount = 1;

    /**
     * The environment return value and environment for callbacks.
     */
    const $: ExtensionEnv = {
        get listeners(): ExprEngineListener[] {
            return subscribers;
        },
        addRef(): void {
            refCount++;
        },
        release(): void {
            refCount--;
            if (refCount === 0) {
                stateMap.release();
            }
        },
        hasState(key: string): boolean {
            return stateMap.has(key);
        },
        getState(key: string): Shareable {
            return stateMap.get(key);
        },
        setState(key: string, value: Shareable): void {
            stateMap.set(key, value);
        },
        addAtomListener(subscriber: AtomListener): void {
            cellHost.addAtomListener(subscriber);
        },
        removeAtomListener(subscriber: AtomListener): void {
            cellHost.removeAtomListener(subscriber);
        },
        getCellHost(): CellHost {
            // We either do this or lazily create.
            cellHost.setScope($);
            return cellHost;
        },
        setCellHost(host: CellHost): void {
            throw new ProgrammingError();
        },
        getBinding(name: Sym, target: Cons): U {
            // console.lg("ExtensionEnv.getBinding", `${name}`, `${target}`);
            assert_sym(name);
            if (symTab.hasBinding(name)) {
                return symTab.getBinding(name);
            }
            else {
                const currents: { [operator: string]: Extension<U>[] } = currentConsByOperator();
                const extensions: Extension<U>[] = currents[name.key()];
                if (Array.isArray(extensions) && extensions.length > 0) {
                    // We may not match because available are (opr Rat) and (opr U), but this hash_nonop_cons gives (opr). 
                    const hashes = hash_target(name, target);
                    for (let h = 0; h < hashes.length; h++) {
                        const hash = hashes[h];
                        // console.lg("looking for: ", hash);
                        for (let i = 0; i < extensions.length; i++) {
                            if (extensions[i].hash === hash) {
                                const extension = extensions[i];
                                const bodyExpr = make_lambda_expr_from_extension(name, target, extension);
                                // console.lg("found: ", extension.hash, "name", extension.name);
                                return new Lambda(bodyExpr, hash);
                            }
                            else {
                                // console.lg("mismatch: ", extensions[i].hash, "name", extensions[i].name);
                            }
                        }
                        // console.lg(`No matching operators for ${name}`);
                    }
                }
                else {
                    // console.lg(`No operators for ${name}`);
                }
                // console.lg(`config.allowUndeclaredVars => ${config.allowUndeclaredVars}`);
                switch (config.allowUndeclaredVars) {
                    case UndeclaredVars.Err: {
                        return hook_create_err(new Str(`Use of undeclared Var ${name.key()}.`));
                    }
                    case UndeclaredVars.Nil: {
                        return name;
                        // return nil;
                    }
                    default: {
                        throw new Error(`Unexpected config.allowUndeclaredVars`);
                    }
                }
            }
        },
        hasBinding(name: Sym): boolean {
            if (symTab.hasBinding(name)) {
                return true;
            }
            else {
                const currents: { [operator: string]: Extension<U>[] } = currentConsByOperator();
                const cons: Extension<U>[] = currents[name.key()];
                if (Array.isArray(cons) && cons.length > 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
        },
        setBinding(sym: Sym, binding: U): void {
            // console.lg("ExprContext.setBinding", `${sym}`, `${binding}`);
            symTab.setBinding(sym, binding);
        },
        getUserFunction(sym: Sym): U {
            return $.getSymbolUsrFunc(sym);
        },
        hasUserFunction(sym: Sym): boolean {
            return userSymbols.has(sym.key());
        },
        setUserFunction(sym: Sym, usrfunc: U): void {
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
                const ops = extensions_by_mode[mode];
                for (const hash in ops) {
                    ops[hash] = [];
                }
                const cons = cons_extensions_by_mode[mode];
                for (const key in cons) {
                    cons[key] = [];
                }
            }
        },
        defineEvalFunction(opr: Sym, evalFunction: EvalFunction): void {
            $.defineExtension(extension_builder_from_cons_expression(opr, evalFunction), false);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defineFunction(match: U, impl: LambdaExpr): void {
            const opr = opr_from_match(match);
            const hash = hash_from_match(match);
            $.setBinding(opr, new Lambda(impl, hash));
        },
        defineStackFunction(opr: Sym, stackFunction: StackFunction): void {
            $.defineExtension(extension_builder_from_cons_expression(opr, make_eval(stackFunction)), false);
        },
        defineKeyword(sym: Sym, runner: KeywordRunner): void {
            $.defineExtension(extension_builder_from_keyword_runner(sym, runner), false);
        },
        defineUserSymbol(name: Sym, immediate = false): void {
            // The most important thing to do is to keep track of which symbols are user symbols.
            // This will allow us to report back correctly later in hasUserFunction(sym), which is used for SVG rendering.
            userSymbols.set(name.key(), name);

            // Given that we already have an Extension for Sym installed,
            // which has the same (standard) implementation of valueOf as the user symbol runner,
            // there's really no value in adding the following operator.
            // Leaving it for now as it does no harm and may have utility later.
            $.defineKeyword(name, make_user_symbol_runner(name));
            if (immediate) {
                $.buildOperators();
            }
        },
        defineExtension(builder: ExtensionBuilder<U>, immediate = false): void {
            builders.push(builder);
            // Building the operators after every bulder is defined really slows things down.
            // It may be caused by some of the checking.
            if (immediate) {
                $.buildOperators();
            }
        },
        divide(lhs: U, rhs: U): U {
            return $.multiply(lhs, $.power(rhs, negOne));
        },
        clearBindings(): void {
            symTab.clear();
        },
        compareFn(opr: Sym): CompareFn {
            const order = sym_order[opr.key()];
            if (order) {
                // TODO: Cache
                return function (lhs: U, rhs: U): Sign {
                    return order.compare(lhs, rhs, $);
                };
            }
            else {
                throw new ProgrammingError(`${opr} missing compareFn`);
                return function (lhs: U, rhs: U): Sign {
                    return new StableExprComparator(opr).compare(lhs, rhs, $);
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
            return new DerivedEnv(this, config);
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
            return symTab.getUserFunction(sym);
        },
        getSymbolsInfo() {
            return symTab.entries();
        },
        buildOperators(): void {
            for (const builder of builders) {
                const op: Extension<U> = builder.create(config);
                if (dependencies_satisfied(op.dependencies, config.dependencies)) {
                    // If an operator does not restrict the modes to which it applies then it applies to all modes.
                    const phaseFlags = typeof op.phases === 'number' ? op.phases : MODE_FLAGS_ALL;
                    for (const mode of MODE_SEQUENCE) {
                        if (phaseFlags & mode) {
                            if (op.hash) {
                                const ops = extensions_by_mode[mode];
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
                                const opr: Sym = op.operator();
                                try {
                                    const key: string = opr.key();
                                    const cons = cons_extensions_by_mode[mode];
                                    if (!Array.isArray(cons[key])) {
                                        cons[key] = [op];
                                    }
                                    else {
                                        cons[key].push(op);
                                    }
                                }
                                finally {
                                    opr.release();
                                }
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
                // console.lg("----------------------------------------");
                const cons = cons_extensions_by_mode[mode];
                for (const key in cons) {
                    const cons_operators = cons[key];
                    const symbols = new Map<string, Sym>();
                    for (let i = 0; i < cons_operators.length; i++) {
                        const cons_operator = cons_operators[i];
                        const opr: Sym = cons_operator.operator();
                        if (!symbols.has(key)) {
                            symbols.set(key, opr);
                        }
                    }
                    symbols.forEach(function (opr: Sym, key: string) {
                        if (Array.isArray(cons_operators) && cons_operators.length > 0) {
                            // We may not match because available are (opr Rat) and (opr U), but this hash_nonop_cons gives (opr). 
                            const hash = hash_nonop_cons(opr);
                            // console.lg("looking for: ", hash);
                            let found = false;
                            for (let i = 0; i < cons_operators.length; i++) {
                                if (cons_operators[i].hash === hash) {
                                    found = true;
                                }
                                else {
                                    // console.lg("mismatch: ", cons_operators[i].hash, "name", cons_operators[i].name);
                                }
                            }
                            if (!found) {
                                // These are potential problems because getBinding could fail to find an operator for a cons expression.
                                // console.lg(`No matching nonop cons operator for ${opr}`);
                            }
                        }
                        else {
                            throw new ProgrammingError();
                        }
                    });
                }
                const ops = extensions_by_mode[mode];
                for (const hash in ops) {
                    const candidates: Extension<U>[] = ops[hash];
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
            // Predicates can return Boo or Rat according to Directive.useIntegersForPredicates.
            if (is_boo(response)) {
                return response.isTrue();
            }
            else if (is_rat(response)) {
                return response.isOne();
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
            return native_directives.get(Directive.expanding) > 0;
        },
        isFactoring(): boolean {
            return native_directives.get(Directive.factoring) > 0;
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
            if (expr.isnil) {
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
            // console.lg("ExtensionEnv.iszero", `${expr}`);
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

            if (!is_poly_expanded_form(p, x)) {
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
        getDirective(directive: number): number {
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
            return $.evaluate(Native.imag, expr);
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
        handlerFor<T extends U>(expr: T): ExprHandler<T> {
            if (is_atom(expr)) {
                return select_atom_extension(expr)!;
            }
            else {
                throw new ProgrammingError();
            }
        },
        extensionFor(expr: U): Extension<U> | undefined {
            if (is_cons(expr)) {
                const head = expr.head;
                try {
                    if (is_cons(head)) {
                        throw new Error(`${expr}`);
                    }
                    // if (is_sym(head)) {
                    // console.lg("head", `${head}`);
                    const hashes = hash_info(expr);
                    for (const hash of hashes) {
                        const ops = currentOpsByHash()[hash];
                        if (Array.isArray(ops)) {
                            for (const op of ops) {
                                if (op.isKind(expr, $)) {
                                    // console.lg("op", render_as_infix(expr, $), op.name);
                                    return op;
                                }
                            }
                        }
                    }
                    return new UnknownConsExtension($);
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
                return select_atom_extension(expr);
            }
            else if (is_nil(expr)) {
                return select_nil_extension();
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
            return $.evaluate(Native.real, expr);
        },
        rect(expr: U): U {
            return $.evaluate(Native.rect, expr);
        },
        remove(varName: Sym): void {
            symTab.delete(varName);
        },
        pushDirective(directive: number, value: number): void {
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
                symTab.setUserFunction(create_sym(sym), usrfunc);
            }
            else {
                symTab.setUserFunction(sym, usrfunc);
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
            // console.lg(`ExtensionEnv.toInfixString ${expr}`);
            const op = $.extensionFor(expr);
            if (op) {
                return op.toInfixString(expr, $);
            }
            else {
                return `${expr}`;
            }
        },
        toLatexString(expr: U): string {
            const op = $.extensionFor(expr);
            if (op) {
                return op.toLatexString(expr, $);
            }
            else {
                return `${expr}`;
            }
        },
        toSExprString(x: U): string {
            const op = $.extensionFor(x);
            if (op) {
                return op.toListString(x, $);
            }
            else {
                throw new Error(`No operator found for expression with name ${JSON.stringify(x.name)}`);
            }
        },
        transform(expr: U): [TFLAGS, U] {
            // console.lg("ExtensionEnv.trnsfrm", `${expr}`);
            // We short-circuit some expressions in order to improve performance.
            if (is_cons(expr)) {
                // TODO: As an evaluation technique, I should be able to pick any item in the list and operate
                // to the left or right. This implies that I have distinct right and left evaluations.
                const opr = expr.opr;
                if (is_cons(opr)) {
                    // This is non-standard stuff, the operator (leftmost element) in a combination will usually be a symbol.
                    const head_opr = opr.opr;
                    try {
                        if (head_opr.equals(FN)) {
                            const newExpr = eval_lambda_in_fn_syntax(expr, $);
                            return [TFLAG_DIFF, newExpr];
                        }
                        else {
                            // eslint-disable-next-line no-console
                            console.warn("head", `${opr}`);
                            // eslint-disable-next-line no-console
                            console.warn("expr", `${expr}`);
                            throw new ProgrammingError();
                        }
                    }
                    finally {
                        head_opr.release();
                    }
                }
                else if (is_sym(opr)) {
                    // We're handling the case here of an operator that is shadowed by a binding.
                    // The generalization here is that a symbol may have multiple bindings that we need to disambiguate.
                    if (symTab.hasBinding(opr)) {
                        // FIXME: I think we should be calling on the symTab, not $.
                        const value = $.getBinding(opr, expr);
                        if (is_lambda(value)) {
                            return wrap_as_transform(value.body(expr.argList, $), expr);
                        }
                        else {
                            // And if it is not we fall through to the operator stuff.
                        }
                    }
                    else {
                        // we fall through to look for the operator symbol using the built-in extensions.
                    }
                }
                else if (is_rat(opr)) {
                    // Why do we have a special case for rat?
                    // We know that the key and hash are both 'Rat'
                    // const hash = head.name;
                    const ops: Extension<U>[] = currentOpsByHash()['Rat'];
                    // TODO: The operator will be acting on the argList, not the entire expression.
                    const op = unambiguous_extension(expr.argList, ops, $);
                    if (op) {
                        // console.lg(`We found the ${op.name} operator!`);
                        return op.evaluate(opr, expr.argList, $);
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
                // console.lg("hashes", JSON.stringify(hashes));
                for (const hash of hashes) {
                    const ops = hash_to_ops[hash];
                    // console.lg(`Looking for hash: ${JSON.stringify(hash)} expr: ${expr} choices: ${Array.isArray(ops) ? ops.length : 'None'}`);
                    // Determine whether there are handlers in the bucket.
                    if (Array.isArray(ops)) {
                        const op = unambiguous_extension(expr, ops, $);
                        if (op) {
                            const composite = op.transform(expr, $);
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
                                    const binding = $.getBinding(opr, expr);
                                    if (!is_nil(binding)) {
                                        if (is_cons(binding)) {
                                            // TODO: Install as a normal Extension...
                                            if (binding.opr.equals(FN)) {
                                                const newExpr = eval_lambda_in_fn_syntax(expr, $);
                                                return [TFLAG_DIFF, newExpr];
                                            }
                                            else if (binding.opr.equals(FUNCTION)) {
                                                const newExpr = eval_function(expr, $);
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
                if (is_sym(opr)) {
                    const arg = expr.arg;
                    try {
                        if (is_atom(arg)) {
                            const handler = $.handlerFor(arg);
                            const retval = handler.dispatch(arg, opr, nil, $);
                            try {
                                return wrap_as_transform(retval, expr);
                            }
                            finally {
                                retval.release();
                            }
                        }
                        // TODO: Generalize this delegation approach for handling cons and nil.
                        // By doing so, we'll get error messages rather than unevaluated combinations. 
                    }
                    finally {
                        arg.release();
                    }
                }
                return [TFLAG_NONE, expr];
            }
            else if (is_nil(expr)) {
                return [TFLAG_NONE, expr];
            }
            else {
                // If it's not a list or nil, then it's an atom.
                const op = $.extensionFor(expr);
                if (op) {
                    return op.transform(expr, $);
                }
                else {
                    return [TFLAG_NONE, expr];
                }
            }
        },
        valueOf(expr: U, stack?: Pick<ProgramStack, 'push'>): U {
            // console.lg("ExtensionEnv.valueOf", `${expr}`);
            // TOOD: We'd like to do this the newWay = !oldWay.
            // This flag makes it easier to switch back and forth.
            const oldWay = true;
            if (oldWay) {
                const retval = $.transform(expr)[1];
                if (stack) {
                    try {
                        stack.push(retval);
                        return nil;
                    }
                    finally {
                        retval.release();
                    }
                }
                else {
                    return retval;
                }
            }
            // console.lg("transform", expr.toString(), "is_sym", is_sym(expr));
            // We short-circuit some expressions in order to improve performance.
            if (is_cons(expr)) {
                // TODO: As an evaluation technique, I should be able to pick any item in the list and operate
                // to the left or right. This implies that I have distinct right and left evaluations.
                const opr = expr.opr;
                if (is_sym(opr)) {
                    // The generalization here is that a symbol may have multiple bindings that we need to disambiguate.
                    const value = $.getBinding(opr, expr);
                    if (is_lambda(value)) {
                        const retval = value.body(expr.argList, $);
                        if (stack) {
                            try {
                                stack.push(retval);
                                return nil;
                            }
                            finally {
                                retval.release();
                            }
                        }
                        else {
                            return retval;
                        }
                    }
                }
                else if (is_rat(opr)) {
                    // Why do we have a special case for rat?
                    // We know that the key and hash are both 'Rat'
                    // const hash = head.name;
                    const ops: Extension<U>[] = currentOpsByHash()['Rat'];
                    // TODO: The operator will be acting on the argList, not the entire expression.
                    const op = unambiguous_extension(expr.argList, ops, $);
                    if (op) {
                        // console.lg(`We found the ${op.name} operator!`);
                        const retval = op.valueOf(opr, $);
                        if (stack) {
                            try {
                                stack.push(retval);
                                return nil;
                            }
                            finally {
                                retval.release();
                            }
                        }
                        else {
                            return retval;
                        }
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
                        const op = unambiguous_extension(expr, ops, $);
                        if (op) {
                            const retval = op.valueOf(expr, $);
                            // console.lg(`${op.name} ${$.toSExprString(expr)} => ${$.toSExprString(retval)}`);
                            // console.lg(`${op.name} ${$.toInfixString(expr)} => ${$.toInfixString(retval)}`);
                            if (stack) {
                                try {
                                    stack.push(retval);
                                    return nil;
                                }
                                finally {
                                    retval.release();
                                }
                            }
                            else {
                                return retval;
                            }
                        }
                    }
                    else {
                        // If there were no handlers registered for the given key, look for a user-defined function.
                        if (is_cons(expr)) {
                            if (is_sym(opr)) {
                                const binding = $.getBinding(opr, expr);
                                if (!is_nil(binding)) {
                                    if (is_cons(binding)) {
                                        // TOOD: Install as a normal Extension.
                                        if (binding.opr.equals(FN)) {
                                            throw new Error("TODO B");
                                            // console.lg(`USER FUNC oldExpr: ${render_as_infix(curExpr, $)} newExpr: ${render_as_infix(newExpr, $)}`);
                                            // return newExpr;
                                        }
                                        else if (binding.opr.equals(FUNCTION)) {
                                            const retval = eval_function(expr, $);
                                            if (stack) {
                                                try {
                                                    stack.push(retval);
                                                    return nil;
                                                }
                                                finally {
                                                    retval.release();
                                                }
                                            }
                                            else {
                                                return retval;
                                            }
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
                if (stack) {
                    stack.push(expr);
                    return nil;
                }
                else {
                    return expr;
                }
            }
            else if (is_nil(expr)) {
                if (stack) {
                    stack.push(expr);
                    return nil;
                }
                else {
                    return expr;
                }
            }
            else {
                // If it's not a list or nil, then it's an atom.
                const op = $.extensionFor(expr);
                if (op) {
                    const retval = op.valueOf(expr, $);
                    if (stack) {
                        try {
                            stack.push(retval);
                            return nil;
                        }
                        finally {
                            retval.release();
                        }
                    }
                    else {
                        return retval;
                    }
                }
                else {
                    if (stack) {
                        stack.push(expr);
                        return nil;
                    }
                    else {
                        return expr;
                    }
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
    if ($.getDirective(Directive.useCaretForExponentiation) !== directive_from_flag(config.useCaretForExponentiation)) {
        $.pushDirective(Directive.useCaretForExponentiation, directive_from_flag(config.useCaretForExponentiation));
    }
    if ($.getDirective(Directive.useIntegersForPredicates) !== directive_from_flag(config.useIntegersForPredicates)) {
        $.pushDirective(Directive.useIntegersForPredicates, directive_from_flag(config.useIntegersForPredicates));
    }
    if ($.getDirective(Directive.useParenForTensors) !== directive_from_flag(config.useParenForTensors)) {
        $.pushDirective(Directive.useParenForTensors, directive_from_flag(config.useParenForTensors));
    }
    for (const directive of config.enable) {
        if ($.getDirective(directive) !== 1) {
            $.pushDirective(directive, 1);
        }
    }
    for (const directive of config.disable) {
        if ($.getDirective(directive) !== 0) {
            $.pushDirective(directive, 0);
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
function unambiguous_extension(expr: Cons, ops: Extension<U>[], $: ExtensionEnv): Extension<U> | undefined {
    // console.lg(`unambiguous_operator for ${$.toInfixString(expr)} from ${ops.length} choice(s).`);
    const candidates: Extension<U>[] = [];
    for (const op of ops) {
        if (op.isKind(expr, $)) {
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

/**
 * 
 */
function make_lambda_expr_from_extension(name: Sym, target: Cons, extension: Extension<U>): LambdaExpr {
    return (argList: Cons, ctxt: ExprContext): U => {
        const $ = new ExtensionEnvFromExprContext(ctxt);
        // console.lg("make_lambda", "name", `${name}`, "argList", `${argList}`, "target", `${target}`, extension.name);
        if (is_nil(target)) {
            return extension.valueOf(cons(name, argList), $);

        }
        else {
            return extension.valueOf(target, $);
        }
    };
}

