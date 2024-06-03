import { Directive, FEATURE, Predicates } from "./ExtensionEnv";

export interface EnvConfig {
    allowUndeclaredVars: "Err" | "Nil";
    assumes: { [name: string]: Partial<Predicates> };
    dependencies: FEATURE[];
    enable: Directive[];
    disable: Directive[];
    noOptimize: boolean;
    useCaretForExponentiation: boolean;
    useDerivativeShorthandLowerD: boolean;
    useIntegersForPredicates: boolean;
    useParenForTensors: boolean;
}
