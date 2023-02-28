import { ExtensionEnv, MODE_EXPANDING } from "../env/ExtensionEnv";
import { useCaretForExponentiation } from "../modes/modes";
import { clear_patterns } from '../pattern';
import { scan } from '../scanner/scan';
import { defs } from './defs';

/**
 * #deprecated
 */
export function soft_reset($: ExtensionEnv): void {
    clear_patterns();

    $.clearBindings();

    // We need to redo these...
    execute_std_definitions($);
}

/**
 * A bunch of strings that are scanned and evaluated, therby changing some bindings.
 * Concretely, the string "var = expr" becomes (set! var expr), where the expr has been evaluated.
 * This (set! var expr) is then evaluated and it becomes a binding of var to the expanded expression.
 */
const defn_strings = [
    'e=exp(1)',
    'i=sqrt(-1)',
    'pi=tau(1)/2',
    'autoexpand=1',
    // TODO: Is setting this to zero really respected?
    // The converse is that variables may be complex.
    // We really need a better way to specify the types of symbols.
    'assumeRealVariables=1',
    // TODO: remove these and make sure it still works when these are not bound.
    'last=0',
    'trace=0',
    'forceFixedPrintout=1',
    'maxFixedPrintoutDigits=6',
    'printLeaveEAlone=1',
    'printLeaveXAlone=0',
];

export function execute_std_definitions($: ExtensionEnv): void {
    // console.lg('execute_std_definitions()');
    const originalCodeGen = defs.codeGen;
    defs.codeGen = false;
    try {
        for (let i = 0; i < defn_strings.length; i++) {
            const defn_string = defn_strings[i];
            execute_definition(defn_string, $);
        }
    }
    finally {
        // restore the symbol dependencies as they were before.
        defs.codeGen = originalCodeGen;
    }
}

export function execute_definition(sourceText: string, $: ExtensionEnv): void {
    // console.lg(`execute_definition(${JSON.stringify(sourceText)})`);
    const originalCodeGen = defs.codeGen;
    defs.codeGen = false;
    try {
        const [scanned, tree] = scan(sourceText, {
            useCaretForExponentiation: $.getModeFlag(useCaretForExponentiation),
            implicitAddition: false,
            implicitMultiplication: true
        });
        try {
            if (scanned > 0) {
                // Evaluating the tree for the side-effect which is to establish a binding.
                $.setMode(MODE_EXPANDING);
                $.valueOf(tree);
            }
        }
        catch (e) {
            if (e instanceof Error) {
                throw new Error(`Unable to compute the value of definition ${JSON.stringify(sourceText)}. Cause: ${e.message}. Stack: ${e.stack}`);
            }
            else {
                throw new Error(`Unable to compute the value of definition ${JSON.stringify(sourceText)}. Cause: ${e}`);
            }
        }
    }
    finally {
        // restore the symbol dependencies as they were before.
        defs.codeGen = originalCodeGen;
    }
}
