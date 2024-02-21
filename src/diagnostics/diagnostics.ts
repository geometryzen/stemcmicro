import { Err } from "math-expression-atoms";
import { Atom, Cons, items_to_cons, U } from "math-expression-tree";

export class Localizable implements Atom {
    readonly name = 'Localizable';
    readonly type = 'Localizable';
    #refCount = 1;
    constructor(readonly message: DiagnosticMessage, readonly argList: Cons) {
        argList.addRef();
    }
    addRef(): void {
        this.#refCount++;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    contains(needle: U): boolean {
        throw new Error("Method not implemented.");
    }
    equals(other: U): boolean {
        if (this === other) {
            return true;
        }
        else if (is_localizable(other)) {
            if (this.message.key === other.message.key) {
                return this.argList.equals(other.argList);
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    get iscons(): boolean {
        return false;
    }
    get isnil(): boolean {
        return false;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount === 0) {
            this.argList.release();
        }
    }
    toString(): string {
        return `Localizable(${JSON.stringify(this.message)}, ${this.argList})`;
    }
    pos?: number | undefined;
    end?: number | undefined;
}

export function is_localizable(expr: U): expr is Localizable {
    return expr instanceof Localizable;
}

export interface Diagnostic {
    code: number;
}

export type DiagnosticArguments = U[];

export interface DiagnosticMessage {
    key: string;
    code: number;
    message: string;
}

function diag(code: number, key: string, message: string): DiagnosticMessage {
    return { code, key, message };
}

export const Diagnostics = {
    Hello_World: diag(0, "", ""),
    Operator_0_cannot_be_applied_to_types_1_and_2: diag(1000, "Operator_0_cannot_be_applied_to_types_1_and_2_1000", "Operator '{0}' cannot be applied to types '{1}' and '{2}'."),
    Poperty_0_does_not_exist_on_type_1: diag(1001, "Property_0_does_not_exist_on_type_1_1001", "Property '{0}' does not exist on type '{1}'.")
};

export function diagnostic(message: DiagnosticMessage, ...args: DiagnosticArguments): Err {
    const argList = items_to_cons(...args);
    try {
        const cause = new Localizable(message, argList);
        try {
            return new Err(cause);
        }
        finally {
            cause.release();
        }
    }
    finally {
        argList.release();
    }
} 