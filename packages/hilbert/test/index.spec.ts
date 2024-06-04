import { create_rat, is_rat, is_tensor, Sym, Tensor } from "@stemcmicro/atoms";
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
    });
    it("hilbert(1)", () => {
        const argList = items_to_cons(create_rat(1));
        const $ = new MockExprContext();
        const H1 = hilbert(argList, $);
        expect(H1 instanceof Tensor).toBe(true);
        if (is_tensor(H1)) {
            expect(H1.dims.length).toBe(2);
            expect(H1.dims[0]).toBe(1);
            expect(H1.dims[1]).toBe(1);
            expect(H1.elems.length).toBe(1);
            const h11 = H1.elems[0];
            expect(is_rat(h11)).toBe(true);
        }
    });
    it("hilbert(2)", () => {
        const argList = items_to_cons(create_rat(2));
        const $ = new MockExprContext();
        const H1 = hilbert(argList, $);
        expect(H1 instanceof Tensor).toBe(true);
        if (is_tensor(H1)) {
            expect(H1.dims.length).toBe(2);
            expect(H1.dims[0]).toBe(2);
            expect(H1.dims[1]).toBe(2);
            expect(H1.elems.length).toBe(4);
            const h11 = H1.elems[0];
            const h12 = H1.elems[1];
            const h21 = H1.elems[2];
            const h22 = H1.elems[3];
            expect(is_rat(h11)).toBe(true);
            expect(is_rat(h12)).toBe(true);
            expect(is_rat(h21)).toBe(true);
            expect(is_rat(h22)).toBe(true);
            expect(h11.equals(create_rat(1, 1))).toBe(true);
            expect(h12.equals(create_rat(1, 2))).toBe(true);
            expect(h21.equals(create_rat(1, 2))).toBe(true);
            expect(h22.equals(create_rat(1, 3))).toBe(true);
        }
    });
});
