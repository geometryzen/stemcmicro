import { defs, hard_reset } from "../runtime/defs";
import { normalize_unicode_dots } from "../runtime/normalize_dots";
import { U } from "../tree/tree";
import { scan } from "./scan";

export interface ParseScriptOptions {
    /**
     * Determines whether the caret symbol '^' is used to denote exponentiation.
     * The alternative is to use '**', which frees the caret symbol to denote the outer product.
     */
    useCaretForExponentiation?: boolean;
    /**
     * Determines whether the parser makes associativity explicit or implicit in additive expressions.
     */
    explicitAssocAdd?: boolean;
    /**
     * Determines whether the parser makes associativity explicit or implicit in multiplicative expressions.
     */
    explicitAssocMul?: boolean;
}

interface ScanConfig {
    useCaretForExponentiation: boolean;
    explicitAssocAdd: boolean;
    explicitAssocMul: boolean;
}

function config_from_options(options: ParseScriptOptions | undefined): ScanConfig {
    if (options) {
        return {
            useCaretForExponentiation: !!options.useCaretForExponentiation,
            explicitAssocAdd: !!options.explicitAssocAdd,
            explicitAssocMul: !!options.explicitAssocMul
        };
    }
    else {
        return {
            useCaretForExponentiation: false,
            explicitAssocAdd: false,
            explicitAssocMul: false
        };
    }
}

/**
 * Each line of a multiline source text creates a tree in the array of trees.
 * @param sourceText The source text. May contain embedded newline characters.
 * @param options Determine how the parsing behaves.
 */
export function parse_script(sourceText: string, options?: ParseScriptOptions): { trees: U[], errors: Error[] } {
    // console.lg(`scan(sourceText = ${JSON.stringify(sourceText)})`);

    const config: ScanConfig = config_from_options(options);

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
            // TODO: Will the scan ever not return zero?
            [scanned, tree] = scan(normalizedScript.substring(index_of_part_remaining_to_be_parsed), {
                useCaretForExponentiation: config.useCaretForExponentiation,
                explicitAssocAdd: config.explicitAssocAdd,
                explicitAssocMul: config.explicitAssocMul
            });
            if (scanned > 0) {
                trees.push(tree);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                // We should be returning user errors rather than throwing them.
                // Then the only errors being thrown should be SystemError, which we don't want to catch.
                // eslint-disable-next-line no-console
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
