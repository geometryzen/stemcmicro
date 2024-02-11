import { Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { U } from "math-expression-tree";
import { value_of } from "../eigenmath/eigenmath";
import { ProgramControl } from "../eigenmath/ProgramControl";
import { ProgramEnv } from "../eigenmath/ProgramEnv";
import { ProgramStack } from "../eigenmath/ProgramStack";

export class ExprContextAdapter implements ExprContext {
    constructor(readonly env: ProgramEnv, readonly ctrl: ProgramControl, readonly $: ProgramStack) {
        // Nothing to see here.
    }
    clearBindings(): void {
        this.env.clearBindings();
    }
    executeProlog(script: string[]): void {
        this.env.executeProlog(script);
    }
    getDirective(directive: number): number {
        return this.ctrl.getDirective(directive);
    }
    pushDirective(directive: number, value: number): void {
        this.ctrl.pushDirective(directive, value);
    }
    popDirective(): void {
        this.ctrl.popDirective();
    }
    hasBinding(name: Sym): boolean {
        return this.env.hasBinding(name);
    }
    getBinding(name: Sym): U {
        return this.env.getBinding(name);
    }
    setBinding(name: Sym, binding: U): void {
        this.env.setBinding(name, binding);
    }
    hasUserFunction(name: Sym): boolean {
        return this.env.hasUserFunction(name);
    }
    getUserFunction(name: Sym): U {
        return this.env.getUserFunction(name);
    }
    setUserFunction(name: Sym, userfunc: U): void {
        this.env.setUserFunction(name, userfunc);
    }
    defineUserSymbol(name: Sym): void {
        this.env.defineUserSymbol(name);
    }
    valueOf(expr: U): U {
        this.$.push(expr);
        value_of(this.env, this.ctrl, this.$);
        return this.$.pop();
    }
}
