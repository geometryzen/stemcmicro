import { is_atom, is_cons, U } from "math-expression-tree";
import { ProgrammingError } from "../programming/ProgrammingError";

function is_cons_or_atom(expr: U): boolean {
    return is_cons(expr) || is_atom(expr);
}

function assert_cons_or_atom(expr: U): U {
    if (is_cons_or_atom(expr)) {
        return expr;
    }
    else {
        throw new ProgrammingError();
    }
}

export class Vector {
    #elements: U[] = [];
    #refCount = 1;
    constructor() {
        // Nothing to see here.
    }
    addRef(): void {
        this.#refCount++;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount == 0) {
            for (let i = 0; i < this.#elements.length; i++) {
                this.#elements[i].release();
            }
        }
    }
    push(x: U): void {
        assert_cons_or_atom(x);
        x.addRef();
        this.#elements.push(x);
    }
    get elements(): U[] {
        return this.#elements.map(x => {
            x.addRef();
            return x;
        });
    }
}