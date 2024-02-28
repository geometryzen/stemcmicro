import { scan } from '../algebrite/scan';
import { Directive, ExtensionEnv, flag_from_directive } from "../env/ExtensionEnv";

/**
 * #deprecated
 */
export function soft_reset($: ExtensionEnv): void {

    $.clearBindings();

    $.executeProlog($.getProlog());
}

/**
 * A prolog for use in tests which defines e, i, pi, and a few other things.
 */
export const stemc_prolog = [
    'e=exp(1)',
    'i=sqrt(-1)',
    'pi=tau(1)/2',
    'autoexpand=1',
    // TODO: remove these and make sure it still works when these are not bound.
    'last=0',
    'trace=0',
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
    for (let i = 0; i < definitions.length; i++) {
        const line = definitions[i];
        execute_definition(line, $);
    }
}

export function execute_definition(sourceText: string, $: ExtensionEnv): void {
    const [scanned, tree] = scan(sourceText, 0, {
        useCaretForExponentiation: flag_from_directive($.getDirective(Directive.useCaretForExponentiation)),
        useParenForTensors: flag_from_directive($.getDirective(Directive.useParenForTensors)),
        explicitAssocAdd: false,
        explicitAssocMul: false,
        explicitAssocExt: false
    });
    try {
        if (scanned > 0) {
            // Evaluating the tree for the side-effect which is to establish a binding.
            $.pushDirective(Directive.expanding, 1);
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
