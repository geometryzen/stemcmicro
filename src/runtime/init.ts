import { scan } from '../brite/scan';
import { Directive, ExtensionEnv } from "../env/ExtensionEnv";
import { clear_patterns } from '../pattern';
import { DEFAULT_MAX_FIXED_PRINTOUT_DIGITS, VARNAME_MAX_FIXED_PRINTOUT_DIGITS } from "./constants";
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
    'i=sqrt(-1)',   // TODO: This is ambiguous when blades are considered.
    'pi=tau(1)/2',
    'autoexpand=1',
    // TODO: remove these and make sure it still works when these are not bound.
    'last=0',
    'trace=0',
    'forceFixedPrintout=1',
    `${VARNAME_MAX_FIXED_PRINTOUT_DIGITS}=${DEFAULT_MAX_FIXED_PRINTOUT_DIGITS}`,
    'printLeaveEAlone=1',
    'printLeaveXAlone=0',
    // TODO: Function definitions here will mask the standard operators.
    // cross definition
    // 'cross(u,v)=[u[2]*v[3]-u[3]*v[2],u[3]*v[1]-u[1]*v[3],u[1]*v[2]-u[2]*v[1]]',
    // curl definition
    // 'curl(v)=[d(v[3],y)-d(v[2],z),d(v[1],z)-d(v[3],x),d(v[2],x)-d(v[1],y)]',
    // div definition
    // 'div(v)=d(v[1],x)+d(v[2],y)+d(v[3],z)'
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
            useCaretForExponentiation: $.getDirective(Directive.useCaretForExponentiation),
            explicitAssocAdd: false,
            explicitAssocMul: false
        });
        try {
            if (scanned > 0) {
                // Evaluating the tree for the side-effect which is to establish a binding.
                $.pushDirective(Directive.expanding, true);
                try {
                    $.valueOf(tree);
                }
                finally {
                    $.popDirective();
                }
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
