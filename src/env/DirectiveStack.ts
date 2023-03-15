import { Directive } from "./ExtensionEnv";
import { Stack } from "./Stack";

type Directives = { [directive: number]: boolean };

export class DirectiveStack {
    readonly #data = new Stack<Directives>();
    constructor() {
        this.#data.push(initial_directives());
    }
    push(directive: Directive, value: boolean): void {
        const directives = copy_directives(this.#data.peek());
        update_directives(directives, directive, value);
        const frozen = Object.freeze(directives);
        this.#data.push(frozen);
    }
    pop(): void {
        this.#data.pop();
    }
    get(directive: Directive): boolean {
        const directives = this.#data.peek();
        const value = directives[directive];
        return value;
    }
}

function copy_directives(directives: Directives): Directives {
    return { ...directives };
}

function update_directives(directives: Directives, directive: Directive, value: boolean): void {
    switch (directive) {
        case Directive.expand: {
            if (value) {
                directives[Directive.factor] = false;
            }
            else {
                directives[Directive.factor] = true;
            }
            break;
        }
        case Directive.factor: {
            if (value) {
                directives[Directive.expand] = false;
            }
            else {
                directives[Directive.expand] = true;
            }
            break;
        }
    }
    directives[directive] = value;
}

function initial_directives(): Directives {
    const directives: Directives = {};
    update_directives(directives, Directive.evaluatingAsClock, false);
    update_directives(directives, Directive.evaluatingAsFloat, false);
    update_directives(directives, Directive.evaluatingAsPolar, false);
    update_directives(directives, Directive.evaluatingTrigAsExp, false);
    update_directives(directives, Directive.expand, true);
    update_directives(directives, Directive.expandPowerSum, true);
    update_directives(directives, Directive.factor, false);
    update_directives(directives, Directive.keepZeroTermsInSums, false);
    // TODO: These two don't seem like Directive(s).
    update_directives(directives, Directive.renderFloatAsEcmaScript, false);
    update_directives(directives, Directive.useCaretForExponentiation, false);
    return Object.freeze(directives);
}