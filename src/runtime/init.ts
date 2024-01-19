import { scan } from '../algebrite/scan';
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

    $.executeProlog($.getProlog());
}

/**
 * These should only be used in tests as a convenience.
 */
export const algebrite_prolog = [
    'e=exp(1)',
    'i=sqrt(-1)',
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

export function execute_definitions(definitions: readonly string[], $: ExtensionEnv): void {
    const originalCodeGen = defs.codeGen;
    defs.codeGen = false;
    try {
        for (let i = 0; i < definitions.length; i++) {
            const line = definitions[i];
            execute_definition(line, $);
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
        const [scanned, tree] = scan(sourceText, 0, {
            useCaretForExponentiation: $.getDirective(Directive.useCaretForExponentiation),
            useParenForTensors: $.getDirective(Directive.useParenForTensors),
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
