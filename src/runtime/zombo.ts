import { ExtensionEnv } from '../env/ExtensionEnv';
import { Sym } from '../tree/sym/Sym';
import { U } from '../tree/tree';
import { hard_reset } from './defs';
import { multi_phase_transform } from './execute';
import { stack_list, stack_pop, stack_push } from './stack';
import { zombo_parse } from './zombo_parse';

/**
 * handles the running in JavaScript of all the script functions.
 * The function name is passed in "name" and the corresponding function is pushed at the top of the stack'
 * @param name 
 * @param argus 
 * @returns 
 */
export function zombo(name: string, $: ExtensionEnv, ...argus: (string | number | U)[]): U {

    const fn = $.getBinding(new Sym(name));
    stack_push(fn);

    for (const argu of Array.from(argus)) {
        zombo_parse(argu);
    }

    stack_list(1 + argus.length);

    const p1 = stack_pop();

    try {
        return multi_phase_transform(p1, $);
    }
    catch (error) {
        hard_reset();
        throw error;
    }
    finally {
        // Do nothing
    }
}
