import { ExtensionEnv } from '../env/ExtensionEnv';
import { U } from '../tree/tree';
import { TreeTransformer } from './Transformer';

export class NoopTransformer implements TreeTransformer {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(tree: U, $: ExtensionEnv): U {
        return tree;
    }
}