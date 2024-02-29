import { Atom, Cons, U } from "math-expression-tree";

export class Localizable implements Atom {
    readonly name = 'Localizable';
    readonly type = 'localizable';
    #refCount = 1;
    constructor(readonly message: LocalizableMessage, readonly argList: Cons) {
        argList.addRef();
    }
    addRef(): void {
        this.#refCount++;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount === 0) {
            this.argList.release();
        }
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
    toString(): string {
        return `Localizable(${JSON.stringify(this.message)}, ${this.argList})`;
    }
    pos?: number | undefined;
    end?: number | undefined;
}

export function is_localizable(expr: U): expr is Localizable {
    return expr instanceof Localizable;
}

export interface LocalizableMessage {
    key: string;
    code: number;
    text: string;
}
