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
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function munge(sourceText: string, options: Partial<MungeConfig>): U {
    const { trees, errors } = em_parse(sourceText);
    if (errors.length === 0) {
        const engine = create_engine();
        engine.defineFunction(create_sym("hilbert"), hilbert);
        return engine.valueOf(trees[0]);
    } else {
        throw errors[0];
    }
}
