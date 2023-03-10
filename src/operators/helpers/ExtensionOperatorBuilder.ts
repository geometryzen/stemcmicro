import { Extension, ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Cons, U } from "../../tree/tree";

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
    get dependencies(): FEATURE[] | undefined {
        return this.extension.dependencies;
    }
    isImag(expr: T): boolean {
        return this.extension.isImag(expr, this.$);
    }
    isKind(expr: U): expr is T {
        return this.extension.isKind(expr, this.$);
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
    toLatexString(expr: T): string {
        return this.extension.toLatexString(expr, this.$);
    }
    toListString(expr: T): string {
        return this.extension.toListString(expr, this.$);
    }
    evaluate(expr: T, argList: Cons): [TFLAGS, U] {
        return this.extension.evaluate(expr, argList, this.$);
    }
    transform(expr: U): [TFLAGS, U] {
        return this.extension.transform(expr, this.$);
    }
}