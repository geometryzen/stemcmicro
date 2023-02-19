import { ExtensionEnv, PHASE_EXPANDING } from '../env/ExtensionEnv';
import { transform } from '../runtime/execute';
import { U } from '../tree/tree';
import { TreeTransformer } from './Transformer';

export class ExpandingTransformer implements TreeTransformer {
    transform(tree: U, $: ExtensionEnv): U {
        const phase = $.getFocus();
        $.setFocus(PHASE_EXPANDING);
        try {

            return transform(tree, $);
        }
        finally {
            $.setFocus(phase);
        }
    }
}
