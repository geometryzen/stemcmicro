import { Directive, ExtensionEnv } from '../env/ExtensionEnv';
import { transform } from '../runtime/execute';
import { U } from '../tree/tree';
import { TreeTransformer } from './Transformer';

export class ExpandingTransformer implements TreeTransformer {
    transform(tree: U, $: ExtensionEnv): U {
        $.pushDirective(Directive.expanding, true);
        try {

            return transform(tree, $);
        }
        finally {
            $.popDirective();
        }
    }
}
