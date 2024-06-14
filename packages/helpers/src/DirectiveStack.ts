import { Directive } from "@stemcmicro/directive";
import { Stack } from "@stemcmicro/stack";

type Directives = { [directive: number]: number };

export class DirectiveStack {
    readonly #data = new Stack<Directives>();
    constructor() {
        this.#data.push(initial_directives());
    }
    push(directive: number, value: number): void {
        const directives = copy_directives(this.#data.top);
        update_directives(directives, directive, value);
        const frozen = Object.freeze(directives);
        this.#data.push(frozen);
    }
    pop(): void {
        this.#data.pop();
    }
    get(directive: number): number {
        const directives = this.#data.top;
        const value = directives[directive];
        return value;
    }
}

function copy_directives(directives: Directives): Directives {
    return { ...directives };
}

function update_directives(directives: Directives, directive: number, value: number): void {
    switch (directive) {
        case Directive.canonicalize: {
            if (value) {
                directives[Directive.familiarize] = 0;
            }
            break;
        }
        case Directive.familiarize: {
            if (value) {
                directives[Directive.canonicalize] = 0;
            }
            break;
        }
        case Directive.expanding: {
            if (value) {
                directives[Directive.factoring] = 0;
            } else {
                // console.lg("Directive.expand has been set to false, Directive.factor becoming true");
                directives[Directive.factoring] = 1;
            }
            break;
        }
        case Directive.factoring: {
            if (value) {
                directives[Directive.expanding] = 0;
            } else {
                // console.lg("Directive.factor has been set to false, Directive.expand becoming true");
                directives[Directive.expanding] = 1;
            }
            break;
        }
        case Directive.complexAsClock: {
            if (value) {
                update_directives(directives, Directive.complexAsPolar, 0);
                update_directives(directives, Directive.complexAsRectangular, 0);
            }
            break;
        }
        case Directive.complexAsPolar: {
            if (value) {
                update_directives(directives, Directive.complexAsClock, 0);
                update_directives(directives, Directive.complexAsRectangular, 0);
                directives[Directive.convertExpToTrig] = 0;
            }
            break;
        }
        case Directive.complexAsRectangular: {
            if (value) {
                update_directives(directives, Directive.complexAsClock, 0);
                update_directives(directives, Directive.complexAsPolar, 0);
            }
            break;
        }
        case Directive.convertCosToSin: {
            if (value) {
                directives[Directive.convertSinToCos] = 0;
            }
            break;
        }
        case Directive.convertSinToCos: {
            if (value) {
                directives[Directive.convertCosToSin] = 0;
            }
            break;
        }
        case Directive.convertExpToTrig: {
            if (value) {
                directives[Directive.convertTrigToExp] = 0;
                directives[Directive.complexAsPolar] = 0;
            }
            break;
        }
        case Directive.convertTrigToExp: {
            if (value) {
                directives[Directive.convertExpToTrig] = 0;
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
    update_directives(directives, Directive.complexAsClock, 0);
    update_directives(directives, Directive.complexAsPolar, 0);
    update_directives(directives, Directive.complexAsRectangular, 0);
    update_directives(directives, Directive.convertExpToTrig, 0);
    update_directives(directives, Directive.convertTrigToExp, 0);
    update_directives(directives, Directive.evaluatingAsFloat, 0);
    update_directives(directives, Directive.expanding, 1);
    update_directives(directives, Directive.expandAbsSum, 0);
    update_directives(directives, Directive.expandCosSum, 0);
    update_directives(directives, Directive.expandPowSum, 1);
    update_directives(directives, Directive.expandSinSum, 0);
    update_directives(directives, Directive.factoring, 0);
    update_directives(directives, Directive.keepZeroTermsInSums, 0);
    update_directives(directives, Directive.renderFloatAsEcmaScript, 0);
    update_directives(directives, Directive.useCaretForExponentiation, 0);
    update_directives(directives, Directive.useParenForTensors, 0);
    update_directives(directives, Directive.depth, 0);
    update_directives(directives, Directive.drawing, 0);
    update_directives(directives, Directive.nonstop, 0);
    update_directives(directives, Directive.forceFixedPrintout, 1);
    update_directives(directives, Directive.maxFixedPrintoutDigits, 6);
    update_directives(directives, Directive.printMode, 1);
    update_directives(directives, Directive.codeGen, 0);
    return Object.freeze(directives);
}
