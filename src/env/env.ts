import { LambdaExpr } from 'math-expression-context';
import { yyfactorpoly } from "../factorpoly";
import { hash_info } from "../hashing/hash_info";
import { is_poly_expanded_form } from "../is";
import { Native } from "../native/Native";
import { native_sym } from "../native/native_sym";
import { algebra } from "../operators/algebra/algebra";
import { is_boo } from "../operators/boo/is_boo";
import { is_flt } from "../operators/flt/is_flt";
import { is_lambda } from "../operators/lambda/is_lambda";
import { is_rat } from "../operators/rat/is_rat";
import { is_sym } from "../operators/sym/is_sym";
import { wrap_as_transform } from "../operators/wrap_as_transform";
import { SyntaxKind } from "../parser/parser";
import { FUNCTION } from "../runtime/constants";
import { createSymTab, SymTab } from "../runtime/symtab";
import { SystemError } from "../runtime/SystemError";
import { Lambda } from "../tree/lambda/Lambda";
import { negOne, Rat } from "../tree/rat/Rat";
import { create_sym, Sym } from "../tree/sym/Sym";
import { Tensor } from "../tree/tensor/Tensor";
import { cons, Cons, is_cons, is_nil, items_to_cons, U } from "../tree/tree";
import { Eval_function } from "../userfunc";
import { DirectiveStack } from "./DirectiveStack";
import { EnvConfig } from "./EnvConfig";
import { CompareFn, ConsExpr, Directive, ExprComparator, ExtensionEnv, FEATURE, KeywordRunner, MODE_EXPANDING, MODE_FACTORING, MODE_FLAGS_ALL, MODE_SEQUENCE, Operator, OperatorBuilder, Predicates, PrintHandler, Sign, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "./ExtensionEnv";
import { NoopPrintHandler } from "./NoopPrintHandler";
import { operator_from_keyword_runner } from "./operator_from_keyword_runner";
import { hash_from_match, operator_from_cons_expression, opr_from_match } from "./operator_from_legacy_transformer";
import { UnknownOperator } from "./UnknownOperator";

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
    assumes?: { [name: string]: Partial<Predicates> };
    dependencies?: FEATURE[];
    enable?: Directive[];
    disable?: Directive[];
    noOptimize?: boolean;
    useCaretForExponentiation?: boolean;
    useDefinitions?: boolean;
    useIntegersForPredicates?: boolean;
    useParenForTensors?: boolean;
    syntaxKind?: SyntaxKind;
}

function config_from_options(options: EnvOptions | undefined): EnvConfig {
    if (options) {
        const config: EnvConfig = {
            assumes: options.assumes ? options.assumes : {},
            dependencies: Array.isArray(options.dependencies) ? options.dependencies : [],
            enable: Array.isArray(options.enable) ? options.enable : [],
            disable: Array.isArray(options.disable) ? options.disable : [],
            noOptimize: typeof options.noOptimize === 'boolean' ? options.noOptimize : false,
            useCaretForExponentiation: typeof options.useCaretForExponentiation === 'boolean' ? options.useCaretForExponentiation : false,
            useDefinitions: typeof options.useDefinitions === 'boolean' ? options.useDefinitions : false,
            useIntegersForPredicates: typeof options.useIntegersForPredicates === 'boolean' ? options.useIntegersForPredicates : false,
            useParenForTensors: typeof options.useParenForTensors === 'boolean' ? options.useParenForTensors : false,
            syntaxKind: typeof options.syntaxKind !== 'undefined' ? options.syntaxKind : SyntaxKind.Native,
        };
        return config;
    }
    else {
        const config: EnvConfig = {
            assumes: {},
            dependencies: [],
            enable: [],
            disable: [],
            noOptimize: false,
            useCaretForExponentiation: false,
            useDefinitions: false,
            useIntegersForPredicates: false,
            useParenForTensors: false,
            syntaxKind: SyntaxKind.Native
        };
        return config;
    }
}

export function create_env(options?: EnvOptions): ExtensionEnv {

    const config: EnvConfig = config_from_options(options);

    // console.lg(`config: ${JSON.stringify(config, null, 2)}`);

    const symTab: SymTab = createSymTab();

    const builders: OperatorBuilder<U>[] = [];
    /**
     * The operators in buckets that are determined by the phase and operator.
     */
    const ops_by_mode: { [key: string]: Operator<U>[] }[] = [];
    for (const mode of MODE_SEQUENCE) {
        ops_by_mode[mode] = {};
    }

    let printHandler: PrintHandler = new NoopPrintHandler();

    const native_directives = new DirectiveStack();
    const custom_directives: { [directive: string]: boolean } = {};

    /**
     * Override printname(s) for symbols used during rendering.
     */
    const sym_key_to_printname: { [key: string]: string } = {};

    const sym_order: Record<string, ExprComparator> = {};

    function currentOps(): { [key: string]: Operator<U>[] } {
        if (native_directives.get(Directive.expanding)) {
            const ops = ops_by_mode[MODE_EXPANDING];
            if (typeof ops === 'undefined') {
                throw new Error(`currentOps(${MODE_EXPANDING})`);
            }
            return ops;
        }
        if (native_directives.get(Directive.factoring)) {
            const ops = ops_by_mode[MODE_FACTORING];
            if (typeof ops === 'undefined') {
                throw new Error(`currentOps(${MODE_FACTORING})`);
            }
            return ops;
        }
        return {};
    }

    function selectOperator(key: string, expr: U): Operator<U> | undefined {
        const ops = currentOps()[key];
        if (Array.isArray(ops) && ops.length > 0) {
            for (const op of ops) {
                if (op.isKind(expr)) {
                    return op;
                }
            }
            throw new SystemError(`No matching operator for key ${key}`);
        }
        else {
            return void 0;
        }
    }

    /**
     * The environment return value and environment for callbacks.
     */
    const $: ExtensionEnv = {
        getBinding(printname: string): U {
            return $.getSymbolBinding(printname);
        },
        setBinding(printname: string, binding: U): void {
            return $.setSymbolBinding(printname, binding);
        },
        getUsrFunc(printname: string): U {
            return $.getSymbolUsrFunc(printname);
        },
        setUsrFunc(printname: string, usrfunc: U): void {
            return $.setSymbolUsrFunc(printname, usrfunc);
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
            for (const phase of MODE_SEQUENCE) {
                const ops = ops_by_mode[phase];
                for (const key in ops) {
                    ops[key] = [];
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
            $.setSymbolBinding(opr, new Lambda(impl, hash));
        },
        defineKeyword(sym: Sym, runner: KeywordRunner): void {
            $.defineOperator(operator_from_keyword_runner(sym, runner));
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
        evaluate(opr: Native, ...args: U[]): U {
            const argList = items_to_cons(...args);
            const expr = cons(native_sym(opr), argList);
            return $.valueOf(expr);
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
        getSymbolPredicates(sym: Sym | string): Predicates {
            return symTab.getProps(sym);
        },
        getSymbolBinding(sym: Sym | string): U {
            return symTab.getBinding(sym);
        },
        getSymbolUsrFunc(sym: Sym | string): U {
            return symTab.getUsrFunc(sym);
        },
        getSymbolsInfo() {
            return symTab.entries();
        },
        buildOperators(): void {
            for (const builder of builders) {
                const op = builder.create($, config);
                if (dependencies_satisfied(op.dependencies, config.dependencies)) {
                    // No problem.
                }
                else {
                    // console.lg(`Ignoring ${op.name} which depends on ${JSON.stringify(op.dependencies)}`);
                    continue;
                }
                // If an operator does not restrict the modes to which it applies then it applies to all modes.
                const phaseFlags = typeof op.phases === 'number' ? op.phases : MODE_FLAGS_ALL;
                for (const phase of MODE_SEQUENCE) {
                    if (phaseFlags & phase) {
                        const ops = ops_by_mode[phase];
                        if (op.hash) {
                            if (!Array.isArray(ops[op.hash])) {
                                ops[op.hash] = [op];
                            }
                            else {
                                ops[op.hash].push(op);
                            }
                        }
                        else {
                            if (op.key) {
                                if (!Array.isArray(ops[op.key])) {
                                    ops[op.key] = [op];
                                }
                                else {
                                    ops[op.key].push(op);
                                }
                            }
                            else {
                                throw new SystemError(`${op.name} has no key and nohash`);
                            }
                        }

                    }
                }
            }
            // Inspect which operators are assigned to which buckets...
            /*
            for (const key in keydOps) {
                const ops = keydOps[key];
                console.lg(`${key} ${ops.length}`);
                if (ops.length > 5) {
                    for (const op of ops) {
                        console.lg(`${key} ${op.name}  <<<<<<<`);
                    }
                }
            }
            */
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
            /*
            if (is_imu(expr)) {
                // This is not good 
                return selectOperator(MATH_POW.key());
            }
            */
            if (is_cons(expr)) {
                const keys = hash_info(expr);
                for (const key of keys) {
                    const ops = currentOps()[key];
                    if (Array.isArray(ops)) {
                        for (const op of ops) {
                            if (op.isKind(expr)) {
                                // console.lg("op", render_as_infix(expr, $), op.name);
                                return op;
                            }
                        }
                    }
                }
                return new UnknownOperator(expr, $);
                // We can end up here for user-defined functions.
                // The consumer is trying to answer a question
                // throw new SystemError(`${expr}, current_phase = ${current_focus} keys = ${JSON.stringify(keys)}`);
            }
            else {
                return selectOperator(expr.name, expr);
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
        setSymbolBinding(sym: string | Sym, binding: U): void {
            if (typeof sym === 'string') {
                symTab.setBinding(create_sym(sym), binding);
            }
            else {
                symTab.setBinding(sym, binding);
            }
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
        toSExprString(expr: U): string {
            const op = $.operatorFor(expr);
            if (op) {
                return op.toListString(expr);
            }
            else {
                return `${expr}`;
            }
        },
        transform(expr: U): [TFLAGS, U] {
            // console.lg("transform", expr.toString(), "is_sym", is_sym(expr));
            // We short-circuit some expressions in order to improve performance.
            if (is_cons(expr)) {
                // TODO: As an evaluation technique, I should be able to pick any item in the list and operate
                // to the left or right. This implies that I have distinct right and left evaluations.
                const head = expr.head;
                if (is_sym(head)) {
                    // The generalization here is that a symbol may have multiple bindings that we need to disambiguate.
                    const value = $.getSymbolBinding(head);
                    if (is_lambda(value)) {
                        return wrap_as_transform(value.evaluate(expr.argList, $), expr);
                    }
                }
                else if (is_rat(head)) {
                    // We know that the key and hash are both 'Rat'
                    const ops: Operator<U>[] = currentOps()['Rat'];
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
                const pops = currentOps();
                // keys are the buckets we should look in for operators from specific to generic.
                const keys = hash_info(expr);
                // console.lg("keys", JSON.stringify(keys));
                for (const key of keys) {
                    const ops = pops[key];
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
                                const binding = $.getSymbolBinding(opr);
                                if (!is_nil(binding)) {
                                    if (is_cons(binding) && FUNCTION.equals(binding.opr)) {
                                        const newExpr = Eval_function(expr, $);
                                        // console.lg(`USER FUNC oldExpr: ${render_as_infix(curExpr, $)} newExpr: ${render_as_infix(newExpr, $)}`);
                                        return [TFLAG_DIFF, newExpr];
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
            return $.transform(expr)[1];
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

