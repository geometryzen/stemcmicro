import { ExtensionEnv, PHASE_IMPLICATE } from '../env/ExtensionEnv';
import { transform } from '../runtime/execute';
import { U } from '../tree/tree';
import { TreeTransformer } from './Transformer';

export class ImplicateTransformer implements TreeTransformer {
    transform(tree: U, $: ExtensionEnv): U {
        const phase = $.getFocus();
        $.setFocus(PHASE_IMPLICATE);
        try {

            return transform(tree, $);
        }
        finally {
            $.setFocus(phase);
        }
    }
}
