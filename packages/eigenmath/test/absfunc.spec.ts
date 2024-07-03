import { assert_rat, create_rat, create_sym, imu, is_imu, is_rat, is_sym, Sym } from "@stemcmicro/atoms";
import { CompareFn, ExprContext, ExprHandler, Lambda, LambdaExpr } from "@stemcmicro/context";
import { compare_factors, compare_terms, DirectiveStack, ImuHandler, RatHandler, SymHandler } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { ProgramStack, StackU } from "@stemcmicro/stack";
import { Cons, is_atom, items_to_cons, Shareable, U } from "@stemcmicro/tree";
import { absfunc } from "../src/eigenmath";

const ADD = native_sym(Native.add);
const MULTIPLY = native_sym(Native.multiply);
const POWER = native_sym(Native.pow);

class MockExprContext implements ExprContext {
    #directives = new DirectiveStack();
    constructor() {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    compareFn(opr: Sym): CompareFn {
        if (ADD.equalsSym(opr)) {
            return compare_terms;
        } else if (MULTIPLY.equalsSym(opr)) {
            return compare_factors;
        }
        throw new Error(`MockExprContext.compareFn ${opr}`);
    }
    getDirective(directive: number): number {
        return this.#directives.get(directive);
    }
    pushDirective(directive: number, value: number): void {
        this.#directives.push(directive, value);
    }
    popDirective(): void {
        this.#directives.pop();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getSymbolPrintName(sym: Sym): string {
        throw new Error("Method not implemented.");
    }
    clearBindings(): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getBinding(opr: Sym, target: Cons): U {
        if (opr.equalsSym(ADD)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const body: LambdaExpr = (argList: Cons, $: ExprContext): U => {
                return items_to_cons(ADD, ...argList);
            };
            return new Lambda(body, "???");
        } else if (opr.equalsSym(POWER)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const body: LambdaExpr = (argList: Cons, $: ExprContext): U => {
                return items_to_cons(POWER, ...argList);
            };
            return new Lambda(body, "???");
        }
        throw new Error(`MockProgramEnv.getBinding ${opr} ${target}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getUserFunction(name: Sym): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasBinding(opr: Sym, target: Cons): boolean {
        if (opr.equalsSym(ADD)) {
            return true;
        } else if (opr.equalsSym(POWER)) {
            return true;
        } else {
            throw new Error(`MockProgramEnv.hasBinding ${opr} ${target}`);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasUserFunction(name: Sym): boolean {
        if (name.equalsSym(ADD)) {
            return false;
        } else if (name.equalsSym(POWER)) {
            return false;
        } else {
            throw new Error(`MockProgramEnv.hasUserFunction ${name}`);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setBinding(opr: Sym, binding: U): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setUserFunction(name: Sym, userfunc: U): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defineUserSymbol(name: Sym): void {
        throw new Error("Method not implemented.");
    }
    handlerFor(expr: U): ExprHandler<U> {
        if (is_atom(expr)) {
            if (is_rat(expr)) {
                return new RatHandler();
            } else if (is_sym(expr)) {
                return new SymHandler();
            } else if (is_imu(expr)) {
                return new ImuHandler();
            } else {
                throw new Error(`${expr.type} Method not implemented.`);
            }
        } else {
            throw new Error("Method not implemented.");
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(expr: U, stack?: Pick<ProgramStack, "push">): U {
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
    addRef(): void {}
    release(): void {}
}

xdescribe("absfunc", () => {
    it("Rat(1)", () => {
        const env = new MockExprContext();
        const $ = new StackU();
        $.push(create_rat(1, 1));
        absfunc(env, $);
        const actual = $.pop();
        try {
            const x = assert_rat(actual);
            expect(x.isOne()).toBe(true);
        } finally {
            actual.release();
        }
    });
    it("x + i * y", () => {
        const env = new MockExprContext();
        const $ = new StackU();
        const x = create_sym("x");
        const y = create_sym("y");
        const iy = items_to_cons(MULTIPLY, imu, y);
        const z = items_to_cons(ADD, x, iy);
        $.push(z);
        absfunc(env, $);
        const actual = $.pop();
        try {
            // TODO
            expect(true).toBe(true);
        } finally {
            actual.release();
        }
    });
});
