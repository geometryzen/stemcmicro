import { Directive, FEATURE, SymbolProps } from "./ExtensionEnv";

export interface EnvConfig {
    assumes: { [name: string]: Partial<SymbolProps> };
    dependencies: FEATURE[];
    enables: Directive[];
    disables: Directive[];
    noOptimize: boolean;
    useCaretForExponentiation: boolean;
    useDefinitions: boolean;
    useIntegersForPredicates: boolean;
}
