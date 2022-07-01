import { divide_numbers, invert_number } from "../bignum";
import { binop } from "../calculators/binop";
import { yyfactorpoly } from "../factorpoly";
import { hash_info } from "../hashing/hash_info";
import { is_poly_expanded_form } from "../is";
import { makeList } from "../makeList";
import { useCaretForExponentiation } from "../modes/modes";
import { yyarg } from "../operators/arg/arg";
import { is_blade } from "../operators/blade/is_blade";
import { is_boo } from "../operators/boo/is_boo";
import { denominator } from "../operators/denominator/denominator";
import { derivative_wrt } from "../operators/derivative/derivative_wrt";
import { is_err } from "../operators/err/is_err";
import { is_flt } from "../operators/flt/is_flt";
import { associative_explicator } from "../operators/helpers/associative_explicator";
import { associative_implicator } from "../operators/helpers/associative_implicator";
import { is_hyp } from "../operators/hyp/is_hyp";
import { is_imu } from "../operators/imu/is_imu";
import { is_num } from "../operators/num/is_num";
import { numerator } from "../operators/numerator/numerator";
import { is_rat } from "../operators/rat/is_rat";
import { is_str } from "../operators/str/is_str";
import { is_sym } from "../operators/sym/is_sym";
import { is_tensor } from "../operators/tensor/is_tensor";
import { is_uom } from "../operators/uom/is_uom";
import { render_as_infix } from "../print/print";
import { FUNCTION } from "../runtime/constants";
import { implicate } from "../runtime/execute";
import { MATH_ADD, MATH_E, MATH_IMU, MATH_INNER, MATH_LCO, MATH_MUL, MATH_NIL, MATH_OUTER, MATH_PI, MATH_POW, MATH_RCO } from "../runtime/ns_math";
import { createSymTab, SymTab } from "../runtime/symtab";
import { SystemError } from "../runtime/SystemError";
import { negOne, Rat, zero } from "../tree/rat/Rat";
import { Sym } from "../tree/sym/Sym";
import { is_cons, is_nil, U } from "../tree/tree";
import { Eval_user_function } from "../userfunc";
import { diffFlag, ExtensionEnv, FEATURE, haltFlag, MODE, Operator, OperatorBuilder, PHASE_EXPANDING, PHASE_EXPLICATE, PHASE_FACTORING, PHASE_FLAGS_ALL, PHASE_IMPLICATE, PHASE_SEQUENCE, TFLAGS, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "./ExtensionEnv";

export interface EnvOptions {
    assocs?: { sym: Sym, dir: 'L' | 'R' }[];
    dependencies?: FEATURE[]
    treatAsVectors?: string[];
    useCaretForExponentiation?: boolean;
    useDefinitions?: boolean;
}

interface EnvConfig {
    assocs: { sym: Sym, dir: 'L' | 'R' }[];
    dependencies: FEATURE[];
    treatAsVectors: string[]
    useCaretForExponentiation: boolean;
    useDefinitions: boolean;
}

function config_from_options(options: EnvOptions | undefined): EnvConfig {
    if (options) {
        const config: EnvConfig = {
            assocs: Array.isArray(options.assocs) ? options.assocs : [],
            dependencies: Array.isArray(options.dependencies) ? options.dependencies : [],
            treatAsVectors: Array.isArray(options.treatAsVectors) ? options.treatAsVectors : [],
            useCaretForExponentiation: typeof options.useCaretForExponentiation === 'boolean' ? options.useCaretForExponentiation : false,
            useDefinitions: typeof options.useDefinitions === 'boolean' ? options.useDefinitions : false
        };
        return config;
    }
    else {
        const config: EnvConfig = {
            assocs: [],
            dependencies: [],
            treatAsVectors: [],
            useCaretForExponentiation: false,
            useDefinitions: false
        };
        return config;
    }
}

interface Assoc {
    lhs: boolean;
    rhs: boolean;
}

export function create_env(options?: EnvOptions): ExtensionEnv {

    const config = config_from_options(options);

    // console.lg(`config: ${JSON.stringify(config, null, 2)}`);

    const symTab: SymTab = createSymTab();

    const builders: OperatorBuilder<U>[] = [];
    /**
     * The operators in buckets that are determined by the phase and operator.
     */
    const ops_by_phase: { [key: string]: Operator<U>[] }[] = [];
    for (const phase of PHASE_SEQUENCE) {
        ops_by_phase[phase] = {};
    }
    const assocs: { [key: string]: Assoc } = {};

    let current_focus: number = PHASE_EXPANDING;

    let fieldKind: 'R' | undefined = 'R';

    /**
     * Modes flags of the environment.
     */
    const mode_flag: { [mode: string]: boolean } = {};
    /**
     * Override tokens for symbols used during rendering.
     */
    const sym_token: { [key: string]: string } = {};

    function currentOps(): { [key: string]: Operator<U>[] } {
        switch (current_focus) {
            case PHASE_EXPLICATE:
            case PHASE_EXPANDING:
            case PHASE_FACTORING:
            case PHASE_IMPLICATE: {
                const ops = ops_by_phase[current_focus];
                if (typeof ops === 'undefined') {
                    throw new Error(`currentOps(${current_focus})`);
                }
                return ops;
            }
            default: {
                return {};
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function reverseAssocs() {
        const keys = Object.keys(assocs);
        for (const key of keys) {
            const assoc = assocs[key];
            assoc.lhs = !assoc.lhs;
            assoc.rhs = !assoc.rhs;
        }
    }

    function selectOperator(key: string, expr: U): Operator<U> {
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
            throw new SystemError(`No operators for key ${key} in phase ${current_focus}`);
        }
    }

    /**
     * The environment return value and environment for callbacks.
     */
    const $: ExtensionEnv = {
        setField(kind: 'R' | undefined): void {
            fieldKind = kind;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        treatAsReal(sym: Sym): boolean {
            if ($.treatAsVector(sym)) {
                return false;
            }
            if (fieldKind === 'R') {
                return true;
            }
            else {
                return false;
            }
        },
        treatAsScalar(sym: Sym): boolean {
            // console.lg(`treatAsScalar ${sym}`);
            return !$.treatAsVector(sym);
        },
        treatAsVector(sym: Sym): boolean {
            // TODO: In a strict debugging mode we might check that the symbol has no binding.
            return config.treatAsVectors.indexOf(sym.ln) >= 0;
        },
        add(lhs: U, rhs: U): U {
            if (is_num(lhs)) {
                if (lhs.isZero()) {
                    return rhs;
                }
            }
            if (is_num(rhs)) {
                if (rhs.isZero()) {
                    return lhs;
                }
            }
            return binop(MATH_ADD, lhs, rhs, $);
        },
        arg(expr: U): U {
            const A = numerator(expr, $);
            // console.lg(`numer=${render_as_infix(A, $)}`);
            const B = denominator(expr, $);
            // console.lg(`denom=${render_as_infix(B, $)}`);
            const C = yyarg(A, $);
            // console.lg(`arg_numer=${render_as_infix(C, $)}`);
            const D = yyarg(B, $);
            // console.lg(`arg_denom=${render_as_infix(D, $)}`);
            return $.subtract(C, D);
        },
        beginSpecial(): void {
            symTab.beginSpecial();
        },
        clearOperators(): void {
            builders.length = 0;
            for (const phase of PHASE_SEQUENCE) {
                const ops = ops_by_phase[phase];
                for (const key in ops) {
                    ops[key] = [];
                }
            }
        },
        resetSymTab(): void {
            symTab.reset();
        },
        defineOperator(builder: OperatorBuilder<U>): void {
            builders.push(builder);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defineAssociative(opr: Sym, id: Rat): void {
            // These operators should only be needed for the initial phase to
            // get expressions into either Left- or Right-Associated form.
            // The expressions from the scanner should be in the associated
            // form. However, we implicate expressions prior to pretty.
            // With a smarter serializer this would not be needed.
            $.defineOperator(associative_explicator(opr, id));
            $.defineOperator(associative_implicator(opr));
        },
        clearBindings(): void {
            symTab.clearBindings();
        },
        clearRenamed(): void {
            symTab.clearRenamed();
        },
        defineKey(sym: Sym): Sym {
            return symTab.defineKey(sym);
        },
        derivative(expr: U, wrt: U): U {
            return derivative_wrt(expr, wrt, $);
        },
        divide(lhs: U, rhs: U): U {
            if (is_num(lhs) && is_num(rhs)) {
                return divide_numbers(lhs, rhs);
            }
            else {
                const inverse_rhs = $.inverse(rhs);
                return $.multiply(lhs, inverse_rhs);
            }
        },
        endSpecial(): void {
            symTab.endSpecial();
        },
        getBinding(sym: Sym): U {
            const value = symTab.getBinding(sym);
            // console.lg(`getBinding(sym = ${$.toInfixString(sym)}) => binding = ${$.toInfixString(value)})`);
            return value;
        },
        getBindings() {
            return symTab.getBindings();
        },
        getFocus(): number {
            return current_focus;
        },
        buildOperators(): void {
            for (const builder of builders) {
                const op = builder.create($);
                if (dependencies_satisfied(op.dependencies, config.dependencies)) {
                    // No problem.
                }
                else {
                    // console.lg(`Ignoring ${op.name} which depends on ${JSON.stringify(op.dependencies)}`);
                    continue;
                }
                // If an operator does not restrict the phases to which it applies then it applies to all phases.
                const phaseFlags = typeof op.phases === 'number' ? op.phases : PHASE_FLAGS_ALL;
                for (const phase of PHASE_SEQUENCE) {
                    if (phaseFlags & phase) {
                        const ops = ops_by_phase[phase];
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
        inverse(expr: U): U {
            // console.lg(`inverse(expr: ${atomType(expr)} => ${expr})`);
            if (is_num(expr)) {
                return invert_number(expr);
            }
            else {
                return binop(MATH_POW, expr, negOne, $);
            }
        },
        isAssocL(opr: Sym): boolean {
            const entry = assocs[opr.key()];
            if (entry) {
                return entry.lhs;
            }
            else {
                throw new SystemError(`isAssocL(${opr})`);
            }
        },
        isAssocR(opr: Sym): boolean {
            const entry = assocs[opr.key()];
            if (entry) {
                return entry.rhs;
            }
            else {
                throw new SystemError(`isAssocR(${opr})`);
            }
        },
        isExplicating(): boolean {
            return current_focus == PHASE_EXPLICATE;
        },
        isExpanding(): boolean {
            return current_focus == PHASE_EXPANDING;
        },
        isFactoring(): boolean {
            return current_focus === PHASE_FACTORING;
        },
        isImplicating(): boolean {
            return current_focus == PHASE_IMPLICATE;
        },
        get explicateMode(): boolean {
            return current_focus === PHASE_EXPLICATE;
        },
        get implicateMode(): boolean {
            return current_focus === PHASE_IMPLICATE;
        },
        isImag(expr: U): boolean {
            const op = $.operatorFor(expr);
            const retval = op.isImag(expr);
            // console.log(`${op.name} isImag ${render_as_infix(expr, $)} => ${retval}`);
            return retval;
        },
        isMinusOne(expr: U): boolean {
            return $.operatorFor(expr).isMinusOne(expr);
        },
        isOne(expr: U): boolean {
            return $.operatorFor(expr).isOne(expr);
        },
        isReal(expr: U): boolean {
            const op = $.operatorFor(expr);
            const retval = op.isReal(expr);
            // console.log(`${op.name} isReal ${render_as_infix(expr, $)} => ${retval}`);
            return retval;
        },
        isScalar(expr: U): boolean {
            // console.lg(`isScalar ${expr}`);
            return $.operatorFor(expr).isScalar(expr);
        },
        isVector(expr: U): boolean {
            // console.lg(`isVector ${expr}`);
            return $.operatorFor(expr).isVector(expr);
        },
        isZero(expr: U): boolean {
            const op = $.operatorFor(expr);
            const retval = op.isZero(expr);
            // console.lg(`${op.name} isZero ${expr} => ${retval}`);
            return retval;
        },
        equals(lhs: U, rhs: U): boolean {
            return lhs.equals(rhs);
        },
        factorize(p: U, x: U): U {
            // console.lg(`factorize p=${print_expr(p, $)} in variable ${print_expr(x, $)}`);
            if (!p.contains(x)) {
                return p;
            }

            if (!is_poly_expanded_form(implicate(p, $), x, $)) {
                // console.lg(`Giving up b/c the polynomial is not in expanded form.`);
                return p;
            }

            if (!is_sym(x)) {
                return p;
            }

            return yyfactorpoly(p, x, $);
        },
        getModeFlag(mode: MODE): boolean {
            return !!mode_flag[mode];
        },
        getSymbolToken(sym: Sym): string {
            return sym_token[sym.key()];
        },
        inner(lhs: U, rhs: U): U {
            // console.lg(`inner lhs=${print_list(lhs, $)} rhs=${print_list(rhs, $)} `);
            const value_lhs = $.valueOf(lhs);
            const value_rhs = $.valueOf(rhs);
            const inner_lhs_rhs = makeList(MATH_INNER, value_lhs, value_rhs);
            const value_inner_lhs_rhs = $.valueOf(inner_lhs_rhs);
            return value_inner_lhs_rhs;
        },
        multiply(lhs: U, rhs: U): U {
            if (is_num(lhs)) {
                if (lhs.isZero()) {
                    return zero;
                }
                if (lhs.isOne()) {
                    return rhs;
                }
            }
            if (is_num(rhs)) {
                if (rhs.isZero()) {
                    return zero;
                }
                if (rhs.isOne()) {
                    return lhs;
                }
            }
            return binop(MATH_MUL, lhs, rhs, $);
        },
        /**
         * The universal unary minus function meaning multiplication by -1.
         */
        negate(x: U): U {
            return binop(MATH_MUL, negOne, x, $);
        },
        operatorFor(expr: U): Operator<U> {
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
                                return op;
                            }
                        }
                    }
                }
                throw new SystemError(`${expr}, current_phase = ${current_focus} ${JSON.stringify(keys)}`);
            }
            else if (is_num(expr)) {
                return selectOperator(expr.name, expr);
            }
            else if (is_sym(expr)) {
                return selectOperator(expr.name, expr);
            }
            else if (is_blade(expr)) {
                return selectOperator(expr.name, expr);
            }
            else if (is_imu(expr)) {
                return selectOperator(expr.name, expr);
            }
            else if (is_tensor(expr)) {
                return selectOperator(expr.name, expr);
            }
            else if (is_uom(expr)) {
                return selectOperator(expr.name, expr);
            }
            else if (is_nil(expr)) {
                return selectOperator(expr.name, expr);
            }
            else if (is_str(expr)) {
                return selectOperator(expr.name, expr);
            }
            else if (is_boo(expr)) {
                return selectOperator(expr.name, expr);
            }
            else if (is_hyp(expr)) {
                return selectOperator(expr.name, expr);
            }
            else if (is_err(expr)) {
                return selectOperator(expr.name, expr);
            }
            else {
                throw new SystemError(`operatorFor ${render_as_infix(expr, $)}`);
            }
        },
        outer(lhs: U, rhs: U): U {
            return binop(MATH_OUTER, lhs, rhs, $);
        },
        power(base: U, exponent: U): U {
            return binop(MATH_POW, base, exponent, $);
        },
        remove(varName: Sym): void {
            symTab.remove(varName);
        },
        setAssocL(opr: Sym, assocL: boolean): void {
            const assoc = assocs[opr.key()];
            if (assoc) {
                assoc.lhs = assocL;
            }
            else {
                assocs[opr.key()] = { lhs: assocL, rhs: false };
            }
            if (assocL) {
                $.setAssocR(opr, false);
            }
        },
        setAssocR(opr: Sym, assocR: boolean): void {
            const assoc = assocs[opr.key()];
            if (assoc) {
                assoc.rhs = assocR;
            }
            else {
                assocs[opr.key()] = { lhs: false, rhs: assocR };
            }
            if (assocR) {
                $.setAssocL(opr, false);
            }
        },
        setBinding(sym: Sym, binding: U): void {
            symTab.setBinding(sym, binding);
        },
        setFocus(focus: number): void {
            current_focus = focus;
        },
        setModeFlag(mode: MODE, value: boolean): void {
            mode_flag[mode] = value;
        },
        setSymbolToken(sym: Sym, token: string): void {
            sym_token[sym.key()] = token;
        },
        subtract(lhs: U, rhs: U): U {
            const A = $.negate(rhs);
            const B = binop(MATH_ADD, lhs, A, $);
            return B;
        },
        toInfixString(expr: U): string {
            const op = $.operatorFor(expr);
            return op.toInfixString(expr);
        },
        toLatexString(expr: U): string {
            const op = $.operatorFor(expr);
            return op.toLatexString(expr);
        },
        toSExprString(expr: U): string {
            const op = $.operatorFor(expr);
            return op.toListString(expr);
        },
        transform(expr: U): [TFLAGS, U] {
            if (expr.meta === TFLAG_HALT) {
                return [TFLAG_HALT, expr];
            }
            // We short-circuit some expressions in order to improve performance.
            if (is_imu(expr)) {
                expr.meta |= TFLAG_HALT;
                return [TFLAG_NONE, expr];
            }
            else if (is_cons(expr)) {
                // let changedExpr = false;
                let outFlags = TFLAG_NONE;
                let curExpr: U = expr;
                let doneWithExpr = false;
                const pops = currentOps();
                while (!doneWithExpr) {
                    doneWithExpr = true;
                    // keys are the buckets we should look in for operators from specific to generic.
                    const keys = hash_info(curExpr);
                    for (const key of keys) {
                        let doneWithCurExpr = false;
                        const ops = pops[key];
                        // console.lg(`Looking for key: ${JSON.stringify(key)} curExpr: ${curExpr} choices: ${Array.isArray(ops) ? ops.length : 'None'}`);
                        // Determine whether there are operators in the bucket.
                        if (Array.isArray(ops)) {
                            for (const op of ops) {
                                const [flags, newExpr] = op.transform(curExpr);
                                if (diffFlag(flags)) {
                                    outFlags |= TFLAG_DIFF;
                                    doneWithCurExpr = true;
                                    if (haltFlag(flags)) {
                                        // doneWithExpr remains true.
                                        outFlags |= TFLAG_HALT;
                                        // console.lg(`DIFF HALT: ${op.name} oldExpr: ${render_as_infix(curExpr, $)} newExpr: ${render_as_infix(newExpr, $)}`);
                                    }
                                    else {
                                        // console.log(`DIFF ....: ${op.name} oldExpr: ${render_as_infix(curExpr, $)} newExpr: ${render_as_infix(newExpr, $)}`);
                                        doneWithExpr = false;
                                    }
                                    curExpr = newExpr;
                                    break;
                                }
                                else if (haltFlag(flags)) {
                                    // console.lg(`.... HALT: ${op.name} oldExpr: ${print_expr(curExpr, $)} newExpr: ${print_expr(newExpr, $)}`);
                                    // TODO: We also need to break out of the loop on keys
                                    doneWithCurExpr = true;
                                    break;
                                }
                                else {
                                    // // console.lg(`NOFLAGS..: op.name=${op.name} op.hash=${op.hash} oldExpr: ${print_expr(curExpr, $)} newExpr: ${print_expr(newExpr, $)}`);
                                }
                            }
                        }
                        else {
                            // If there were no operators registered for the given key, look for a user-defined function.
                            if (is_cons(curExpr)) {
                                const opr = curExpr.opr;
                                if (is_sym(opr)) {
                                    const binding = $.getBinding(opr);
                                    if (!is_nil(binding)) {
                                        if (is_cons(binding) && FUNCTION.equals(binding.opr)) {
                                            const newExpr = Eval_user_function(curExpr, $);
                                            // // console.lg(`USER FUNC oldExpr: ${print_expr(curExpr, $)} newExpr: ${print_expr(newExpr, $)}`);
                                            return [TFLAG_DIFF, newExpr];
                                        }
                                    }
                                }
                            }
                        }
                        if (doneWithCurExpr) {
                            break;
                        }
                    }
                }
                // Once an expression has been transformed into a stable condition, it should not be transformed until a different phase.
                curExpr.meta = TFLAG_HALT;
                return [outFlags, curExpr];
            }
            else if (is_rat(expr)) {
                return [TFLAG_NONE, expr];
            }
            else if (is_flt(expr)) {
                return [TFLAG_NONE, expr];
            }
            else if (is_sym(expr)) {
                const retval = $.operatorFor(expr).transform(expr);
                return retval;
            }
            else if (is_blade(expr)) {
                return [TFLAG_NONE, expr];
            }
            else if (is_tensor(expr)) {
                const retval = $.operatorFor(expr).transform(expr);
                return retval;
            }
            else if (is_uom(expr)) {
                return [TFLAG_NONE, expr];
            }
            else if (is_nil(expr)) {
                return [TFLAG_NONE, expr];
            }
            else if (is_str(expr)) {
                return [TFLAG_NONE, expr];
            }
            else if (is_boo(expr)) {
                return [TFLAG_NONE, expr];
            }
            else if (is_hyp(expr)) {
                return [TFLAG_NONE, expr];
            }
            else if (is_err(expr)) {
                return [TFLAG_NONE, expr];
            }
            else {
                throw new SystemError(`transform ${render_as_infix(expr, $)}`);
            }
        },
        valueOf(expr: U): U {
            return $.transform(expr)[1];
        }
    };

    // TODO: Consistency in names used for symbols in symbolic expressions.
    $.setSymbolToken(MATH_ADD, '+');        // changing will break  82 cases.
    $.setSymbolToken(MATH_MUL, '*');        // changing will break 113 cases.
    $.setSymbolToken(MATH_POW, 'power');    // changing will break  22 cases.
    $.setSymbolToken(MATH_RCO, '>>');
    $.setSymbolToken(MATH_LCO, '<<');
    $.setSymbolToken(MATH_INNER, '|');
    $.setSymbolToken(MATH_OUTER, '^');

    $.setSymbolToken(MATH_E, 'e');
    $.setSymbolToken(MATH_PI, 'π');
    $.setSymbolToken(MATH_NIL, '()');
    $.setSymbolToken(MATH_IMU, 'i');

    // Backwards compatible, but we should simply set this to false, or leave undefined.
    $.setModeFlag(useCaretForExponentiation, config.useCaretForExponentiation);

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
