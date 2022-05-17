import { CostTable } from "../../env/CostTable";
import { Extension, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { U } from "../../tree/tree";

/**
 * A poor-mans way of implementing an OperatorBuilder is to take an existing Extension
 * and wrap it. That's what this class does. Use it for existing extensions, migrating
 * to a first-class implementation of OperatorBuilder.
 */
export class ExtensionOperatorBuilder<T extends U> implements OperatorBuilder<T> {
    /**
     * 
     * @param extensionProvider A function that takes an extension environment and produces an Extension.
     */
    constructor(private readonly extensionProvider: ($: ExtensionEnv) => Extension<T>) {
        // Nothing to see here.
    }
    create($: ExtensionEnv): Operator<T> {
        return new ExtensionOperator(this.extensionProvider($), $);
    }
}

/**
 * In general, we delegate to a method on the Extension with the same name and with an additional
 * $: ExtensionEnv parameter. Anything different is a code smell.
 */
class ExtensionOperator<T extends U> implements Operator<T> {
    constructor(private readonly extension: Extension<T>, private readonly $: ExtensionEnv) {
        // Nothing going on here because this is a crude adaption of the Extension.
        // This would be a good place to cache symbols that will be needed later.
    }
    cost(expr: T, costs: CostTable, depth: number): number {
        return this.extension.cost(expr, costs, depth, this.$);
    }
    get key(): string | undefined {
        return this.extension.key;
    }
    get hash(): string | undefined {
        return this.extension.hash;
    }
    get name(): string {
        return this.extension.name;
    }
    get phases(): number | undefined {
        return this.extension.phases;
    }
    isImag(expr: T): boolean {
        return this.extension.isImag(expr, this.$);
    }
    isKind(arg: U): boolean {
        return this.extension.isKind(arg, this.$);
    }
    isMinusOne(expr: T): boolean {
        return this.extension.isMinusOne(expr, this.$);
    }
    isOne(expr: T): boolean {
        return this.extension.isOne(expr, this.$);
    }
    isReal(expr: T): boolean {
        return this.extension.isReal(expr, this.$);
    }
    isScalar(expr: T): boolean {
        return this.extension.isScalar(expr, this.$);
    }
    isVector(expr: T): boolean {
        return this.extension.isVector(expr, this.$);
    }
    isZero(expr: T): boolean {
        return this.extension.isZero(expr, this.$);
    }
    valueOf(expr: T): U {
        return this.extension.transform(expr, this.$)[1];
    }
    subst(expr: T, oldExpr: U, newExpr: U): U {
        return this.extension.subst(expr, oldExpr, newExpr, this.$);
    }
    toInfixString(expr: T): string {
        return this.extension.toInfixString(expr, this.$);
    }
    toListString(expr: T): string {
        return this.extension.toListString(expr, this.$);
    }
    transform(expr: U): [TFLAGS, U] {
        return this.extension.transform(expr, this.$);
    }
}