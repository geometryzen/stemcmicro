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
        case Directive.canonicalize: {
            if (value) {
                directives[Directive.familiarize] = false;
            }
            break;
        }
        case Directive.familiarize: {
            if (value) {
                directives[Directive.canonicalize] = false;
            }
            break;
        }
        case Directive.expand: {
            if (value) {
                directives[Directive.factor] = false;
            }
            else {
                // console.lg("Directive.expand has been set to false, Directive.factor becoming true");
                directives[Directive.factor] = true;
            }
            break;
        }
        case Directive.factor: {
            if (value) {
                directives[Directive.expand] = false;
            }
            else {
                // console.lg("Directive.factor has been set to false, Directive.expand becoming true");
                directives[Directive.expand] = true;
            }
            break;
        }
        case Directive.convertCosToSin: {
            if (value) {
                directives[Directive.convertSinToCos] = false;
            }
            break;
        }
        case Directive.convertSinToCos: {
            if (value) {
                directives[Directive.convertCosToSin] = false;
            }
            break;
        }
        case Directive.convertExpToTrig: {
            if (value) {
                directives[Directive.convertTrigToExp] = false;
            }
            break;
        }
        case Directive.convertTrigToExp: {
            if (value) {
                directives[Directive.convertExpToTrig] = false;
            }
            break;
        }
    }
    directives[directive] = value;
}

// TODO: Table-drive approach to declaring which expressions are mutually exclusive.
/*
function mutex(directives: Directives, value: boolean, a: Directive, b: Directive): void {
    if (value) {
        directives[Directive.convertCosToSin] = false;
    }
}
*/

function initial_directives(): Directives {
    const directives: Directives = {};
    update_directives(directives, Directive.complexAsClock, false);
    update_directives(directives, Directive.complexAsPolar, false);
    update_directives(directives, Directive.evaluatingAsFloat, false);
    update_directives(directives, Directive.convertExpToTrig, false);
    update_directives(directives, Directive.convertTrigToExp, false);
    update_directives(directives, Directive.expand, false);
    update_directives(directives, Directive.expandAbsSum, true);
    update_directives(directives, Directive.expandCosSum, false);
    update_directives(directives, Directive.expandPowSum, true);
    update_directives(directives, Directive.expandSinSum, false);
    update_directives(directives, Directive.factor, false);
    update_directives(directives, Directive.keepZeroTermsInSums, false);
    // TODO: These two don't seem like Directive(s).
    update_directives(directives, Directive.renderFloatAsEcmaScript, false);
    update_directives(directives, Directive.useCaretForExponentiation, false);
    return Object.freeze(directives);
}