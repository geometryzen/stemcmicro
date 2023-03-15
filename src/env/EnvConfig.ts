import { FEATURE, SymbolProps } from "./ExtensionEnv";

export interface EnvConfig {
    assumes: { [name: string]: Partial<SymbolProps> };
    dependencies: FEATURE[];
    disable: ('expand' | 'factor')[];
    noOptimize: boolean;
    useCaretForExponentiation: boolean;
    useDefinitions: boolean;
    useIntegersForPredicates: boolean;
}
