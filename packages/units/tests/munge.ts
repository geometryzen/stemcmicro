// import assert from 'assert';
import { create_sym } from "@stemcmicro/atoms";
import { em_parse } from "@stemcmicro/em-parse";
import { create_engine } from "@stemcmicro/engine";
import { hilbert } from "@stemcmicro/hilbert";
import { U } from "@stemcmicro/tree";

/*
class TestListener implements ExprEngineListener {
    readonly outputs: string[] = [];
    output(output: string): void {
        this.outputs.push(output);
    }
}
*/
export interface MungeConfig {
    allowUndeclaredVars: "Err" | "Nil";
    useCaretForExponentiation?: boolean;
    useDerivativeShorthandLowerD?: boolean;
    useIntegersForPredicates?: boolean;
}

/**
 * Parse and evaluate the sourceText using the specified options.
 */
export function munge(sourceText: string, options: Partial<MungeConfig> = {}): U {
    const { trees, errors } = em_parse(sourceText);
    if (errors.length === 0) {
        const engine = create_engine({
            allowUndeclaredVars: options.allowUndeclaredVars,
            useCaretForExponentiation: options.useCaretForExponentiation,
            useDerivativeShorthandLowerD: options.useDerivativeShorthandLowerD,
            useIntegersForPredicates: options.useIntegersForPredicates
        });
        engine.defineFunction(create_sym("hilbert"), hilbert);
        return engine.valueOf(trees[0]);
    } else {
        throw errors[0];
    }
}
