import { parseModule } from "@geometryzen/esprima";
import { FltExtension, RatExtension } from "@stemcmicro/algebrite";
import { Sym } from "@stemcmicro/atoms";
import { CompareFn, ExprHandler } from "@stemcmicro/context";
import { Stack } from "@stemcmicro/stack";
import { Atom, Cons, is_atom, Shareable, U } from "@stemcmicro/tree";
import { Scope } from "./Scope";
import { State } from "./State";
import { StepFunction } from "./StepFunction";
import { step_binary_expression } from "./step_binary_expression";
import { step_expression_statement } from "./step_expression_statement";
import { step_literal } from "./step_literal";
import { step_program } from "./step_program";

class GlobalScope implements Scope {
    readonly #atomHandlers: Map<string, ExprHandler<Atom>> = new Map();
    constructor() {
        this.#atomHandlers.set("Flt", new FltExtension());
        this.#atomHandlers.set("Rat", new RatExtension());
    }
    clearBindings(): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    compareFn(opr: Sym): CompareFn {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(expr: U): U {
        throw new Error("Method not implemented.");
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
    handlerFor<T extends U>(expr: T): ExprHandler<T> {
        if (is_atom(expr)) {
            if (this.#atomHandlers.has(expr.name)) {
                return this.#atomHandlers.get(expr.name) as unknown as ExprHandler<T>;
            }
        }
        throw new Error(`GlobalScope.handlerFor ${expr.name} Method not implemented.`);
    }
}

export class Interpreter {
    #stack: Stack<State> = new Stack();
    #steppers: Map<string, StepFunction> = new Map();
    #globalScope: Scope = new GlobalScope();
    constructor(sourceText: string) {
        this.#initStepFunctions();
        // The lowest position in the stack holds the return value.
        this.#stack.push(new State(null, null));
        const m = parseModule(sourceText);
        const state = new State(m, this.#globalScope);
        this.#stack.push(state);
    }
    run(): U {
        while (this.next()) {
            // Do nothing.
        }
        if (this.#stack.length) {
            return this.#stack.top.value;
        } else {
            throw new Error();
        }
    }
    next(): boolean {
        // Recall that the lowest position in the stack holds the return value.
        if (this.#stack.length > 1) {
            const state = this.#stack.top;
            if (state) {
                const node = state.node;
                if (this.#steppers.has(node.type)) {
                    const stepper = this.#steppers.get(node.type);
                    const nextState = stepper(this.#stack, state);
                    if (nextState) {
                        this.#stack.push(nextState);
                    }
                    return true;
                } else {
                    throw new Error(`${node.type}`);
                }
                // const scope = state.scope;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    /*
    #module(m: Module): void {
        for (const node of m.body) {
            if (is_expression_statement(node)) {
                const expr = node.expression
                if (is_binary_expression(expr)) {
                    const lhs = expr.left
                    if (is_literal(lhs)) {
                        throw new Error(`${lhs.value}`);
                    }
                    throw new Error(lhs.type);
                    // expr.operator
                    // const rhs = expr.right
                }
                switch (expr.type) {
                    default: {
                        throw new Error(expr.type);
                    }
                }
            }
            switch (node.type) {

                default: {
                    throw new Error(node.type);
                }
            }
        }
    }
    */
    #initStepFunctions(): void {
        this.#steppers.set("Program", step_program);
        this.#steppers.set("ExpressionStatement", step_expression_statement);
        this.#steppers.set("BinaryExpression", step_binary_expression);
        this.#steppers.set("Literal", step_literal);
    }
}
