import { is_boo, is_err } from "math-expression-atoms";
import { assert_cons_or_nil, car, cdr, cons, is_atom, is_cons, nil, U } from "math-expression-tree";
import { ProgramStack } from "../eigenmath/ProgramStack";
import { ProgrammingError } from "../programming/ProgrammingError";
import { Stack } from "./Stack";

/**
 * A stack of expressions that can be used to support evaluation.
 */
export class StackU implements ProgramStack {
    readonly #stack: Stack<U>;
    #refCount = 1;
    constructor(elements: U[] = []) {
        const n = elements.length;
        for (let i = 0; i < n; i++) {
            elements[i].addRef();
        }
        this.#stack = new Stack(elements);
    }
    dupl(): void {
        const x = this.pop();
        try {
            this.push(x);
            this.push(x);
        } finally {
            x.release();
        }
    }
    head(): void {
        const expr = this.pop();
        try {
            const head = car(expr);
            try {
                this.push(head);
            } finally {
                head.release();
            }
        } finally {
            expr.release();
        }
    }
    rest(): void {
        const expr = this.pop();
        try {
            const rest = cdr(expr);
            try {
                this.push(rest);
            } finally {
                rest.release();
            }
        } finally {
            expr.release();
        }
    }
    rotateL(n: number): void {
        this.#stack.rotateL(n);
    }
    rotateR(n: number): void {
        this.#stack.rotateR(n);
    }
    swap(): void {
        this.#stack.swap();
    }
    concat(exprs: U[]): void {
        for (let i = 0; i < exprs.length; i++) {
            this.#stack.push(exprs[i]);
        }
    }
    getAt(i: number): U {
        return this.#stack.getAt(i);
    }
    setAt(i: number, expr: U): void {
        this.#stack.setAt(i, expr);
    }
    splice(start: number, deleteCount?: number): U[] {
        if (typeof deleteCount === "number") {
            return this.#stack.splice(start, deleteCount);
        } else {
            return this.#stack.splice(start);
        }
    }
    get length(): number {
        return this.#stack.length;
    }
    set length(length: number) {
        this.#stack.length = length;
    }
    get isatom(): boolean {
        return is_atom(this.#stack.top);
    }
    get iscons(): boolean {
        return is_cons(this.#stack.top);
    }
    get istrue(): boolean {
        const top = this.#stack.top;
        if (is_boo(top)) {
            return top.isTrue();
        } else if (is_err(top)) {
            throw top;
        } else {
            throw new ProgrammingError();
        }
    }
    list(n: number): void {
        this.#stack.push(nil);
        for (let i = 0; i < n; i++) {
            const arg2 = assert_cons_or_nil(this.#stack.pop());
            const arg1 = this.#stack.pop();
            this.#stack.push(cons(arg1, arg2));
        }
    }
    push(element: U): void {
        element.addRef();
        this.#stack.push(element);
    }
    peek(): U {
        const x = this.pop();
        this.push(x);
        return x;
    }
    pop(): U {
        return this.#stack.pop();
    }
    addRef(): void {
        this.#refCount++;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount === 0) {
            const n = this.#stack.length;
            const elements = this.#stack.popItems(n);
            for (let i = 0; i < n; i++) {
                elements[i].release();
            }
        }
    }
    get refCount(): number {
        return this.#refCount;
    }
    get tos(): number {
        return this.#stack.tos;
    }
}
