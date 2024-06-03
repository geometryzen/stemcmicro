import { create_rat, is_rat, Sym, Tensor } from "@stemcmicro/atoms";
import { CompareFn, ExprContext, ExprHandler } from "@stemcmicro/context";
import { Cons, items_to_cons, Shareable, U } from "@stemcmicro/tree";
import { hilbert } from "../src/hilbert";

class MockExprContext implements ExprContext {
    clearBindings(): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    compareFn(opr: Sym): CompareFn {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handlerFor<T extends U>(expr: T): ExprHandler<T> {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasBinding(opr: Sym, target: Cons): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getBinding(opr: Sym, target: Cons): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setBinding(opr: Sym, binding: U): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasUserFunction(name: Sym): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getUserFunction(name: Sym): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setUserFunction(name: Sym, usrfunc: U): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defineUserSymbol(name: Sym): void {
        throw new Error("Method not implemented.");
    }
    valueOf(expr: U): U {
        if (is_rat(expr)) {
            return expr;
        } else {
            throw new Error(JSON.stringify(expr, null, 2));
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getDirective(directive: number): number {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pushDirective(directive: number, value: number): void {
        throw new Error("Method not implemented.");
    }
    popDirective(): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getSymbolPrintName(sym: Sym): string {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasState(key: string): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getState(key: string): Shareable {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setState(key: string, value: Shareable): void {
        throw new Error("Method not implemented.");
    }
    addRef(): void {
        throw new Error("Method not implemented.");
    }
    release(): void {
        throw new Error("Method not implemented.");
    }
}

describe("index", () => {
    it("hilbert", () => {
        expect(typeof hilbert === "function").toBe(true);
        const one = create_rat(1);
        const argList = items_to_cons(one);
        const $ = new MockExprContext();
        const H1 = hilbert(argList, $);
        expect(H1 instanceof Tensor).toBe(true);
    });
});
