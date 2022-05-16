import { yyarg } from "../arg";
import { divide_numbers, invert_number } from "../bignum";
import { binop } from "../calculators/binop";
import { compare_factors } from "../calculators/compare/compare_factors";
import { compare_terms } from "../calculators/compare/compare_terms";
import { denominator } from "../denominator";
import { d_scalar_scalar } from "../derivative";
import { yyfactorpoly } from "../factorpoly";
import { hash_info } from "../hashing/hash_info";
import { is_poly_expanded_form } from "../is";
import { makeList } from "../makeList";
import { numerator } from "../numerator";
import { is_blade } from "../operators/blade/BladeExtension";
import { cosine_of_angle } from "../operators/cos/cosine_of_angle";
import { cosine_of_angle_sum } from "../operators/cos/cosine_of_angle_sum";
import { is_err } from "../operators/err/is_err";
import { is_sym } from "../operators/sym/is_sym";
import { SymPattern } from "../operators/sym/SymPattern";
import { Pattern } from "../patterns/Pattern";
import { is_imu } from "../predicates/is_imu";
import { is_num } from "../predicates/is_num";
import { print_expr } from "../print";
import { is_add } from "../runtime/helpers";
import { MATH_ADD, MATH_INNER, MATH_MUL, MATH_OUTER, MATH_POW } from "../runtime/ns_math";
import { createSymTab, SymTab } from "../runtime/symtab";
import { SystemError } from "../runtime/SystemError";
import { VERSION_LATEST } from "../runtime/version";
import { d_scalar_tensor, d_tensor_scalar, d_tensor_tensor } from "../tensor";
import { negOne, zero } from "../tree/rat/Rat";
import { is_str } from "../tree/str/is_str";
import { Sym } from "../tree/sym/Sym";
import { is_tensor } from "../tree/tensor/is_tensor";
import { is_cons, is_nil, U } from "../tree/tree";
import { is_uom } from "../tree/uom/is_uom";
import { CostTable } from "./CostTable";
import { CHANGED, changedFlag, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, Sign, stableFlag, TFLAGS } from "./ExtensionEnv";

export interface EnvOptions {
    assocs?: { sym: Sym, dir: 'L' | 'R' }[];
    treatAsVectors?: string[];
    useCaretForExponentiation?: boolean;
    useDefinitions?: boolean;
    version?: number;
}

interface EnvConfig {
    assocs: { sym: Sym, dir: 'L' | 'R' }[];
    treatAsVectors: string[]
    useCaretForExponentiation: boolean;
    useDefinitions: boolean;
    version: number;
}

function config_from_options(options: EnvOptions | undefined): EnvConfig {
    if (options) {
        const config: EnvConfig = {
            assocs: Array.isArray(options.assocs) ? options.assocs : [],
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

    const symTab: SymTab = createSymTab();

    const costTable = new CostTable();

    const builders: OperatorBuilder<U>[] = [];
    /**
     * The operators in buckets that are determined by the operator.
     */
    const keydOps: { [key: string]: Operator<U>[] } = {};
    const assocs: { [key: string]: Assoc } = {};
    // const keydHash: { [hash: string]: number } = {};

    // The following two properties are mutually exclusive.
    let is_expanding_enabled = true;
    let is_factoring_enabled = false;

    // The following two properties are mutually exclusive.
    let explicate_mode = true;
    let implicate_mode = false;

    let prettyfmt_mode = false;

    let fieldKind: 'R' | undefined = 'R';

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
        const ops = keydOps[key];
        if (Array.isArray(ops) && ops.length > 0) {
            for (const op of ops) {
                if (op.isKind(expr)) {
                    return op;
                }
            }
            throw new SystemError(`No matching operator for key ${key}`);
        }
        else {
            throw new SystemError(`No operators for key ${key}`);
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
            for (const key in keydOps) {
                keydOps[key] = [];
            }
        },
        resetSymTab(): void {
            symTab.reset();
        },
        defineOperator(builder: OperatorBuilder<U>): void {
            builders.push(builder);
        },
        clearBindings(): void {
            symTab.clearBindings();
        },
        clearRenamed(): void {
            symTab.clearRenamed();
        },
        compare(lhs: U, rhs: U): Sign {
            return this.compare(lhs, rhs);
        },
        compareFactors(lhs: U, rhs: U): Sign {
            return compare_factors(lhs, rhs, $);
        },
        compareTerms(lhs: U, rhs: U): Sign {
            return compare_terms(lhs, rhs);
        },
        cos(x: U): U {
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
            if (is_num(wrt)) {
                throw new SystemError('undefined function');
            }
            if (is_tensor(expr)) {
                if (is_tensor(wrt)) {
                    return d_tensor_tensor(expr, wrt, $);
                }
                else {
                    return d_tensor_scalar(expr, wrt, $);
                }
            }
            else {
                if (is_tensor(wrt)) {
                    return d_scalar_tensor(expr, wrt, $);
                }
                else {
                    return d_scalar_scalar(expr, wrt, $);
                }
            }
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
        initialize(): void {
            for (const builder of builders) {
                const op = builder.create($);
                if (op.hash) {
                    if (!Array.isArray(keydOps[op.hash])) {
                        keydOps[op.hash] = [op];
                    }
                    else {
                        keydOps[op.hash].push(op);
                    }
                }
                else {
                    if (op.key) {
                        if (!Array.isArray(keydOps[op.key])) {
                            keydOps[op.key] = [op];
                        }
                        else {
                            keydOps[op.key].push(op);
                        }
                    }
                    else {
                        throw new SystemError(`${op.name} has no key and nohash`);
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
            return is_expanding_enabled;
        },
        isFactoring(): boolean {
            return is_factoring_enabled;
        },
        get explicateMode(): boolean {
            return explicate_mode;
        },
        get prettyfmtMode(): boolean {
            return prettyfmt_mode;
        },
        get implicateMode(): boolean {
            return implicate_mode;
        },
        isImag(expr: U): boolean {
            return $.operatorFor(expr).isImag(expr);
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
            return $.operatorFor(expr).isScalar(expr);
        },
        isVector(expr: U): boolean {
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
            if (!p.contains(x)) {
                return p;
            }

            if (!is_poly_expanded_form(p, x)) {
                return p;
            }

            if (!is_sym(x)) {
                return p;
            }

            return yyfactorpoly(p, x, $);
        },
        inner(lhs: U, rhs: U): U {
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
                    const ops = keydOps[key];
                    if (Array.isArray(ops)) {
                        for (const op of ops) {
                            if (op.isKind(expr)) {
                                return op;
                            }
                        }
                    }
                }
                throw new SystemError(`${expr}`);
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
        setExpanding(expanding: boolean): void {
            is_expanding_enabled = expanding;
            if (expanding) {
                is_factoring_enabled = false;
            }
        },
        setFactoring(factoring: boolean): void {
            is_factoring_enabled = factoring;
            if (factoring) {
                is_expanding_enabled = false;
            }
        },
        setExplicate(explicate: boolean): void {
            explicate_mode = explicate;
            if (explicate) {
                implicate_mode = false;
                prettyfmt_mode = false;
            }
        },
        setImplicate(implicate: boolean): void {
            implicate_mode = implicate;
            if (implicate) {
                explicate_mode = false;
                prettyfmt_mode = false;
            }
        },
        setPrettyFmt(prettying: boolean): void {
            prettyfmt_mode = prettying;
            if (prettying) {
                explicate_mode = false;
                implicate_mode = false;
            }
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
            // We short-circuit some expressions in order to improve performance.
            if (is_imu(expr)) {
                return [NOFLAGS, expr];
            }
            else if (is_cons(expr)) {
                let changedExpr = false;
                let curExpr: U = expr;
                let doneWithExpr = false;
                while (!doneWithExpr) {
                    doneWithExpr = true;
                    // keys are the buckets we should look in for operators from specific to generic.
                    const keys = hash_info(curExpr);
                    for (const key of keys) {
                        let doneWithKey = false;
                        const ops = keydOps[key];
                        // console.log(`Looking for key: ${JSON.stringify(key)} curExpr: ${print_expr(curExpr, $)} choices: ${Array.isArray(ops) ? ops.length : -1}`);
                        // Determine whether there are operators in the bucket.
                        if (Array.isArray(ops)) {
                            for (const op of ops) {
                                const [flags, newExpr] = op.transform(curExpr);
                                if (changedFlag(flags)) {
                                    // console.log(`CHANGED: ${op.name} oldExpr: ${print_expr(curExpr, $)} newExpr: ${print_expr(newExpr, $)}`);
                                    curExpr = newExpr;
                                    changedExpr = true;
                                    // if (typeof op.hash !== 'string') {
                                    // console.log(`CHANGED ${op.name} key=${JSON.stringify(key)} op.key=${JSON.stringify(op.key)} hash=${op.hash}`);
                                    // }
                                    doneWithExpr = false;
                                    doneWithKey = true;
                                    break;
                                }
                                else if (stableFlag(flags)) {
                                    // console.log(`STABLE ${op.name} key=${JSON.stringify(key)} op.key=${JSON.stringify(op.key)} hash=${op.hash}`);
                                    // TODO: We also need to break out of the loop on keys
                                    doneWithKey = true;
                                    break;
                                }
                                else {
                                    // console.log(`NOFLAGS ${op.name} key=${JSON.stringify(key)} op.key=${JSON.stringify(op.key)} hash=${op.hash}`);
                                }
                            }
                        }
                        if (doneWithKey) {
                            break;
                        }
                    }
                }
                return [changedExpr ? CHANGED : NOFLAGS, curExpr];
            }
            else if (is_num(expr)) {
                return [NOFLAGS, expr];
            }
            else if (is_sym(expr)) {
                return $.operatorFor(expr).transform(expr);
            }
            else if (is_blade(expr)) {
                return [NOFLAGS, expr];
            }
            else if (is_tensor(expr)) {
                return $.operatorFor(expr).transform(expr);
            }
            else if (is_uom(expr)) {
                return [NOFLAGS, expr];
            }
            else if (is_nil(expr)) {
                return [NOFLAGS, expr];
            }
            else if (is_str(expr)) {
                return [NOFLAGS, expr];
            }
            else if (is_err(expr)) {
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
