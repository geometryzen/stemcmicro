import { Directive, FEATURE, SymbolProps } from "./ExtensionEnv";

export interface EnvConfig {
    assumes: { [name: string]: Partial<SymbolProps> };
    dependencies: FEATURE[];
    enable: Directive[];
    disable: Directive[];
    noOptimize: boolean;
    useCaretForExponentiation: boolean;
    useDefinitions: boolean;
    useIntegersForPredicates: boolean;
}
