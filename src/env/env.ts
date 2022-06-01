import { divide_numbers, invert_number } from "../bignum";
import { binop } from "../calculators/binop";
import { yyfactorpoly } from "../factorpoly";
import { hash_info } from "../hashing/hash_info";
import { is_poly_expanded_form } from "../is";
import { makeList } from "../makeList";
import { yyarg } from "../operators/arg/arg";
import { is_blade } from "../operators/blade/BladeExtension";
import { cosine_of_angle } from "../operators/cos/cosine_of_angle";
import { cosine_of_angle_sum } from "../operators/cos/cosine_of_angle_sum";
import { denominator } from "../operators/denominator/denominator";
import { derivative_wrt } from "../operators/derivative/derivative_wrt";
import { is_err } from "../operators/err/is_err";
import { associative_explicator } from "../operators/helpers/associative_explicator";
import { associative_implicator } from "../operators/helpers/associative_implicator";
import { is_hyp } from "../operators/hyp/is_hyp";
import { numerator } from "../operators/numerator/numerator";
import { is_sym } from "../operators/sym/is_sym";
import { SymPattern } from "../operators/sym/SymPattern";
import { Pattern } from "../patterns/Pattern";
import { is_imu } from "../predicates/is_imu";
import { is_num } from "../predicates/is_num";
import { print_expr } from "../print";
import { implicate } from "../runtime/execute";
import { is_add } from "../runtime/helpers";
import { MATH_ADD, MATH_INNER, MATH_MUL, MATH_OUTER, MATH_POW } from "../runtime/ns_math";
import { createSymTab, SymTab } from "../runtime/symtab";
import { SystemError } from "../runtime/SystemError";
import { VERSION_LATEST } from "../runtime/version";
import { is_boo } from "../tree/boo/is_boo";
import { is_flt } from "../tree/flt/is_flt";
import { is_rat } from "../tree/rat/is_rat";
import { negOne, Rat, zero } from "../tree/rat/Rat";
import { is_str } from "../tree/str/is_str";
import { Sym } from "../tree/sym/Sym";
import { is_tensor } from "../tree/tensor/is_tensor";
import { is_cons, is_nil, U } from "../tree/tree";
import { is_uom } from "../tree/uom/is_uom";
import { CostTable } from "./CostTable";
import { diffFlag, ExtensionEnv, FEATURE, haltFlag, NOFLAGS, Operator, OperatorBuilder, phases, PHASE_COSMETICS, PHASE_EXPANDING, PHASE_EXPLICATE, PHASE_FACTORING, PHASE_FLAGS_ALL, PHASE_IMPLICATE, Sign, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "./ExtensionEnv";

export interface EnvOptions {
    assocs?: { sym: Sym, dir: 'L' | 'R' }[];
    includes?: FEATURE[]
    treatAsVectors?: string[];
    useCaretForExponentiation?: boolean;
    useDefinitions?: boolean;
    version?: number;
}

interface EnvConfig {
    assocs: { sym: Sym, dir: 'L' | 'R' }[];
    includes: FEATURE[];
    treatAsVectors: string[]
    useCaretForExponentiation: boolean;
    useDefinitions: boolean;
    version: number;
}

function config_from_options(options: EnvOptions | undefined): EnvConfig {
    if (options) {
        const config: EnvConfig = {
            assocs: Array.isArray(options.assocs) ? options.assocs : [],
            includes: Array.isArray(options.includes) ? options.includes : [],
            treatAsVectors: Array.isArray(options.treatAsVectors) ? options.treatAsVectors : [],
            useCaretForExponentiation: typeof options.useCaretForExponentiation === 'boolean' ? options.useCaretForExponentiation : false,
            useDefinitions: typeof options.useDefinitions === 'boolean' ? options.useDefinitions : false,
            version: typeof options.version === 'number' ? options.version : VERSION_LATEST
        };
        return config;
    }
    else {
        const config: EnvConfig = {
            assocs: [],
            includes: [],
            treatAsVectors: [],
            useCaretForExponentiation: false,
            useDefinitions: false,
            version: VERSION_LATEST
        };
        return config;
    }
}

interface Assoc {
    lhs: boolean;
    rhs: boolean;
}

export function createEnv(options?: EnvOptions): ExtensionEnv {

    const config = config_from_options(options);

    // console.log(`config: ${JSON.stringify(config, null, 2)}`);

    const symTab: SymTab = createSymTab();

    const costTable = new CostTable();

    const builders: OperatorBuilder<U>[] = [];
    /**
     * The operators in buckets that are determined by the phase and operator.
     */
    const ops_by_phase: { [key: string]: Operator<U>[] }[] = [];
    for (const phase of phases) {
        ops_by_phase[phase] = {};
    }
    const assocs: { [key: string]: Assoc } = {};

    let current_phase: number = PHASE_EXPANDING;

    let fieldKind: 'R' | undefined = 'R';

    function currentOps(): { [key: string]: Operator<U>[] } {
        const ops = ops_by_phase[current_phase];
        if (typeof ops === 'undefined') {
            throw new Error(`currentOps(${current_phase})`);
        }
        return ops;
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
            throw new SystemError(`No operators for key ${key} in phase ${current_phase}`);
        }
    }

    /**
     * The environment return value and environment for callbacks.
     */
    const $: ExtensionEnv = {
        addCost(pattern: Pattern, value: number): void {
            costTable.addCost(pattern, value);
        },
        setCost(sym: Sym, cost: number): void {
            costTable.addCost(new SymPattern(sym), cost);
        },
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
            // console.log(`treatAsScalar ${sym}`);
            return !$.treatAsVector(sym);
        },
        treatAsVector(sym: Sym): boolean {
            // TODO: In a strict debugging mode we might check that the symbol has no binding.
            return config.treatAsVectors.indexOf(sym.ln) >= 0;
        },
        get useCaretForExponentiation(): boolean {
            return config.useCaretForExponentiation;
        },
        get version(): number {
            return config.version;
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
            const B = denominator(expr, $);
            const C = yyarg(A, $);
            const D = yyarg(B, $);
            return $.subtract(C, D);
        },
        beginSpecial(): void {
            symTab.beginSpecial();
        },
        reset(): void {
            builders.length = 0;
            for (const phase of phases) {
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
        compare(lhs: U, rhs: U): Sign {
            // TODO: What is this?
            return this.compare(lhs, rhs);
        },
        cos(x: U): U {
            // TODO: This should just build then evaluate.
            // In which case it need not be here.
            if (is_cons(x) && is_add(x)) {
                return cosine_of_angle_sum(x, $);
            }
            else {
                return cosine_of_angle(x, $);
            }
        },
        cost(expr: U, depth: number): number {
            return $.operatorFor(expr).cost(expr, costTable, depth);
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
        getPhase(): number {
            return current_phase;
        },
        initialize(): void {
            // This tells us which features to allow.
            config.includes;
            for (const builder of builders) {
                const op = builder.create($);
                if (dependencies_satisfied(op.dependencies, config.includes)) {
                    // No problem.
                }
                else {
                    // console.log(`Ignoring ${op.name} which depends on ${JSON.stringify(op.dependencies)}`);
                    continue;
                }
                // If an operator does not restrict the phases to which it applies then it applies to all phases.
                const phaseFlags = typeof op.phases === 'number' ? op.phases : PHASE_FLAGS_ALL;
                for (const phase of phases) {
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
                console.log(`${key} ${ops.length}`);
                if (ops.length > 5) {
                    for (const op of ops) {
                        console.log(`${key} ${op.name}  <<<<<<<`);
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
        isExpanding(): boolean {
            return current_phase == PHASE_EXPANDING;
        },
        isFactoring(): boolean {
            return current_phase === PHASE_FACTORING;
        },
        get explicateMode(): boolean {
            return current_phase === PHASE_EXPLICATE;
        },
        get prettyfmtMode(): boolean {
            return current_phase === PHASE_COSMETICS;
        },
        get implicateMode(): boolean {
            return current_phase === PHASE_IMPLICATE;
        },
        isImag(expr: U): boolean {
            const op = $.operatorFor(expr);
            const retval = op.isImag(expr);
            // console.log(`${op.name} isImag ${expr} => ${retval}`);
            return retval;
        },
        isMinusOne(expr: U): boolean {
            return $.operatorFor(expr).isMinusOne(expr);
        },
        isOne(expr: U): boolean {
            return $.operatorFor(expr).isOne(expr);
        },
        isReal(expr: U): boolean {
            return $.operatorFor(expr).isReal(expr);
        },
        isScalar(expr: U): boolean {
            // console.log(`isScalar ${expr}`);
            return $.operatorFor(expr).isScalar(expr);
        },
        isVector(expr: U): boolean {
            // console.log(`isVector ${expr}`);
            return $.operatorFor(expr).isVector(expr);
        },
        isZero(expr: U): boolean {
            const op = $.operatorFor(expr);
            const retval = op.isZero(expr);
            // console.log(`${op.name} isZero ${expr} => ${retval}`);
            return retval;
        },
        equals(lhs: U, rhs: U): boolean {
            return lhs.equals(rhs);
        },
        factorize(p: U, x: U): U {
            // console.log(`factorize p=${print_expr(p, $)} in variable ${print_expr(x, $)}`);
            if (!p.contains(x)) {
                return p;
            }

            if (!is_poly_expanded_form(implicate(p, $), x, $)) {
                // console.log(`Giving up b/c the polynomial is not in expanded form.`);
                return p;
            }

            if (!is_sym(x)) {
                return p;
            }

            return yyfactorpoly(p, x, $);
        },
        inner(lhs: U, rhs: U): U {
            // console.log(`inner lhs=${print_list(lhs, $)} rhs=${print_list(rhs, $)} `);
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
                throw new SystemError(`${expr}, current_phase = ${current_phase} ${JSON.stringify(keys)}`);
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
                throw new SystemError(`operatorFor ${print_expr(expr, $)}`);
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
        setPhase(phase: number): void {
            current_phase = phase;
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
        toListString(expr: U): string {
            const op = $.operatorFor(expr);
            return op.toListString(expr);
        },
        transform(expr: U): [TFLAGS, U] {
            if (typeof expr.meta === 'number') {
                if ((expr.meta & TFLAG_HALT) > 0) {
                    return [TFLAG_HALT, expr];
                }
                if (expr.meta === NOFLAGS) {
                    // Do nothing yet.
                }
                else {
                    throw new Error(`${expr} meta must be NOFLAGS`);
                }
            }
            else {
                throw new Error(`${expr} meta must be a number.`);
            }
            // We short-circuit some expressions in order to improve performance.
            if (is_imu(expr)) {
                expr.meta |= TFLAG_HALT;
                return [NOFLAGS, expr];
            }
            else if (is_cons(expr)) {
                // let changedExpr = false;
                let outFlags = NOFLAGS;
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
                        // console.log(`Looking for key: ${JSON.stringify(key)} curExpr: ${print_expr(curExpr, $)} choices: ${Array.isArray(ops) ? ops.length : 'None'}`);
                        // Determine whether there are operators in the bucket.
                        if (Array.isArray(ops)) {
                            for (const op of ops) {
                                const [flags, newExpr] = op.transform(curExpr);
                                if (diffFlag(flags)) {
                                    outFlags |= TFLAG_DIFF;
                                    doneWithCurExpr = true;
                                    newExpr.meta |= TFLAG_HALT;
                                    if (haltFlag(flags)) {
                                        // doneWithExpr remains true.
                                        outFlags |= TFLAG_HALT;
                                        // console.log(`DIFF HALT: ${op.name} oldExpr: ${print_expr(curExpr, $)} newExpr: ${print_expr(newExpr, $)}`);
                                    }
                                    else {
                                        // console.log(`DIFF ....: ${op.name} oldExpr: ${print_expr(curExpr, $)} newExpr: ${print_expr(newExpr, $)}`);
                                        doneWithExpr = false;
                                    }
                                    curExpr = newExpr;
                                    break;
                                }
                                else if (haltFlag(flags)) {
                                    // console.log(`.... HALT: ${op.name} oldExpr: ${print_expr(curExpr, $)} newExpr: ${print_expr(newExpr, $)}`);
                                    // TODO: We also need to break out of the loop on keys
                                    doneWithCurExpr = true;
                                    newExpr.meta |= TFLAG_HALT;
                                    break;
                                }
                                else {
                                    // console.log(`NOFLAGS..: ${op.name} oldExpr: ${print_expr(curExpr, $)} newExpr: ${print_expr(newExpr, $)}`);
                                }
                            }
                        }
                        if (doneWithCurExpr) {
                            break;
                        }
                    }
                }
                return [outFlags, curExpr];
            }
            else if (is_rat(expr)) {
                expr.meta |= TFLAG_HALT;
                return [NOFLAGS, expr];
            }
            else if (is_flt(expr)) {
                expr.meta |= TFLAG_HALT;
                return [NOFLAGS, expr];
            }
            else if (is_sym(expr)) {
                const retval = $.operatorFor(expr).transform(expr);
                retval[1].meta |= TFLAG_HALT;
                return retval;
            }
            else if (is_blade(expr)) {
                expr.meta |= TFLAG_HALT;
                return [NOFLAGS, expr];
            }
            else if (is_tensor(expr)) {
                const retval = $.operatorFor(expr).transform(expr);
                retval[1].meta |= TFLAG_HALT;
                return retval;
            }
            else if (is_uom(expr)) {
                expr.meta |= TFLAG_HALT;
                return [NOFLAGS, expr];
            }
            else if (is_nil(expr)) {
                expr.meta |= TFLAG_HALT;
                return [NOFLAGS, expr];
            }
            else if (is_str(expr)) {
                expr.meta |= TFLAG_HALT;
                return [NOFLAGS, expr];
            }
            else if (is_boo(expr)) {
                expr.meta |= TFLAG_HALT;
                return [NOFLAGS, expr];
            }
            else if (is_hyp(expr)) {
                expr.meta |= TFLAG_HALT;
                return [NOFLAGS, expr];
            }
            else if (is_err(expr)) {
                expr.meta |= TFLAG_HALT;
                return [NOFLAGS, expr];
            }
            else {
                throw new SystemError(`transform ${print_expr(expr, $)}`);
            }
        },
        valueOf(expr: U): U {
            return $.transform(expr)[1];
        }
    };
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
