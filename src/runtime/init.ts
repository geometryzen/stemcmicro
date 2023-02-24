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

/* cross =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept, script_defined

Parameters
----------
u,v

General description
-------------------
Returns the cross product of vectors u and v.

*/

/* curl =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept, script_defined

Parameters
----------
u

General description
-------------------
Returns the curl of vector u.

*/
/**
 * A bunch of strings that are scanned and evaluated, therby changing some bindings.
 * Concretely, the string "var = expr" becomes (set! var expr), where the expr has been evaluated.
 * This (set! var expr) is then evaluated and it becomes a binding of var to the expanded expression.
 * 
 */
const defn_strings = [
    'e=exp(1)',
    'i=sqrt(-1)',
    'autoexpand=1',
    // TODO: Is setting this to zero really respected?
    'assumeRealVariables=1',
    'pi=tau(1)/2',
    'trange=[-pi,pi]',
    'xrange=[-10,10]',
    'yrange=[-10,10]',
    // TODO: remove these and make sure it still works when these are not bound.
    'last=0',
    'trace=0',
    'forceFixedPrintout=1',
    'maxFixedPrintoutDigits=6',
    'printLeaveEAlone=1',
    'printLeaveXAlone=0',
    // cross definition
    // 'cross(u,v)=[u[2]*v[3]-u[3]*v[2],u[3]*v[1]-u[1]*v[3],u[1]*v[2]-u[2]*v[1]]',
    // curl definition
    // 'curl(v)=[d(v[3],y)-d(v[2],z),d(v[1],z)-d(v[3],x),d(v[2],x)-d(v[1],y)]',
    // div definition
    // 'div(v)=d(v[1],x)+d(v[2],y)+d(v[3],z)',
    // Note that we use the mathematics / Javascript / Mathematica
    // convention that "log" is indeed the natural logarithm.
    //
    // In engineering, biology, astronomy, "log" can stand instead
    // for the "common" logarithm i.e. base 10. Also note that Google
    // calculations use log for the common logarithm.
    // 'ln(x)=log(x)',
];

export function execute_std_definitions($: ExtensionEnv): void {
    // console.lg('execute_std_definitions()');
    const originalCodeGen = defs.codeGen;
    defs.codeGen = false;
    try {
        for (let i = 0; i < defn_strings.length; i++) {
            const defn_string = defn_strings[i];
            const [scanned, tree] = scan(defn_string, { useCaretForExponentiation: $.getModeFlag(useCaretForExponentiation) });
            try {
                if (scanned > 0) {
                    // Evaluating the tree for the side-effect which is to establish a binding.
                    $.setMode(MODE_EXPANDING);
                    $.valueOf(tree);
                }
            }
            catch (e) {
                if (e instanceof Error) {
                    throw new Error(`Unable to compute the value of definition ${JSON.stringify(defn_string)}. Cause: ${e.message}. Stack: ${e.stack}`);
                }
                else {
                    throw new Error(`Unable to compute the value of definition ${JSON.stringify(defn_string)}. Cause: ${e}`);
                }
            }
        }
    }
    finally {
        // restore the symbol dependencies as they were before.
        defs.codeGen = originalCodeGen;
    }
}
