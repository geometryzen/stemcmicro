import { SyntaxKind } from "../parser/parser";
import { Directive, FEATURE, Predicates } from "./ExtensionEnv";

export interface EnvConfig {
    assumes: { [name: string]: Partial<Predicates> };
    dependencies: FEATURE[];
    enable: Directive[];
    disable: Directive[];
    noOptimize: boolean;
    useCaretForExponentiation: boolean;
    useIntegersForPredicates: boolean;
    useParenForTensors: boolean;
    syntaxKind: SyntaxKind;
}
