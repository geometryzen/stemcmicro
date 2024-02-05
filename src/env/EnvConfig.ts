import { UndeclaredVars } from "../api/api";
import { SyntaxKind } from "../parser/parser";
import { Directive, FEATURE, Predicates } from "./ExtensionEnv";

export interface EnvConfig {
    allowUndeclaredVars: UndeclaredVars;
    assumes: { [name: string]: Partial<Predicates> };
    dependencies: FEATURE[];
    enable: Directive[];
    disable: Directive[];
    noOptimize: boolean;
    useCaretForExponentiation: boolean;
    useDerivativeShorthandLowerD: boolean;
    useIntegersForPredicates: boolean;
    useParenForTensors: boolean;
    syntaxKind?: SyntaxKind;
}
