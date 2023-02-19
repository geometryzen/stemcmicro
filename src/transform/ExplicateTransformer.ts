import { ExtensionEnv, MODE_EXPLICATE } from '../env/ExtensionEnv';
import { transform } from '../runtime/execute';
import { U } from '../tree/tree';
import { TreeTransformer } from './Transformer';

export class ExplicateTransformer implements TreeTransformer {
    transform(tree: U, $: ExtensionEnv): U {
        const phase = $.getMode();
        $.setFocus(MODE_EXPLICATE);
        try {
            return transform(tree, $);
        }
        finally {
            $.setFocus(phase);
        }
    }
}
