import { defs, hard_reset } from "../runtime/defs";
import { check_stack } from "../runtime/execute";
import { normalize_unicode_dots } from "../runtime/normalize_dots";
import { U } from "../tree/tree";
import { scan } from "./scan";

export interface ScanOptions {
    useCaretForExponentiation?: boolean;
}

interface ScanConfig {
    useCaretForExponentiation: boolean;
}

function config_from_options(options: ScanOptions | undefined): ScanConfig {
    if (options) {
        return {
            useCaretForExponentiation: !!options.useCaretForExponentiation
        };
    }
    else {
        return { useCaretForExponentiation: false };
    }
}

/**
 * Each line of a multiline source text creates a tree in the array of trees.
 * @param sourceText The source text. May contain embedded newline characters.
 * @param options Determine how the scanning behaves.
 */
export function create_source_trees(sourceText: string, options?: ScanOptions): { trees: U[], errors: Error[] } {
    // console.lg(`scan(sourceText = ${JSON.stringify(sourceText)})`);

    const config = config_from_options(options);

    const normalizedScript = normalize_unicode_dots(sourceText);

    let scanned = 0;
    let tree: U | undefined;
    let index_of_part_remaining_to_be_parsed = 0;

    const trees: U[] = [];
    const errors: Error[] = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // while we can keep scanning commands out of the
        // passed input AND we can execute them...
        try {
            defs.errorMessage = '';
            check_stack();
            // TODO: Will the scan ever not return zero?
            [scanned, tree] = scan(normalizedScript.substring(index_of_part_remaining_to_be_parsed), { useCaretForExponentiation: config.useCaretForExponentiation });
            if (scanned > 0) {
                trees.push(tree);
            }
            check_stack();
        }
        catch (error) {
            if (error instanceof Error) {
                // We should be returning user errors rather than throwing them.
                // Then the only errors being thrown should be SystemError, which we don't want to catch.
                // eslint-disable-next-line no-console
                console.log(error.stack);
                errors.push(error);
            }
            else {
                errors.push(new Error(`${error}`));
            }
            hard_reset();

            break;
        }

        if (scanned === 0) {
            break;
        }
        if (scanned === sourceText.length) {
            break;
        }

        index_of_part_remaining_to_be_parsed += scanned;
    }

    return { trees, errors };
}
