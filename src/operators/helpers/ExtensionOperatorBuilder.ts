import { Sym } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";
import { Extension, ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";

/**
 * @deprecated Migrate to ExtensionBuilder. 
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
 * @deprecated Migrate from Operator<U> to Extension<U>
 */
class ExtensionOperator<T extends U> implements Operator<T> {
    constructor(private readonly extension: Extension<T>, private readonly $: ExtensionEnv) {
        // Nothing going on here because this is a crude adaption of the Extension.
        // This would be a good place to cache symbols that will be needed later.
    }
    test(expr: T, opr: Sym): boolean {
        return this.extension.test(expr, opr, this.$);
    }
    iscons(): boolean {
        return this.extension.iscons();
    }
    operator(): Sym {
        return this.extension.operator();
    }
    get hash(): string {
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
    isKind(expr: U): expr is T {
        return this.extension.isKind(expr, this.$);
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
    transform(expr: T): [TFLAGS, U] {
        return this.extension.transform(expr, this.$);
    }
}