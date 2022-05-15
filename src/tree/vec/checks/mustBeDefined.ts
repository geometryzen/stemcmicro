
import { mustSatisfy } from './mustSatisfy';

function beDefined() {
    return "not be 'undefined'";
}

export function mustBeDefined(name: string, value: unknown, contextBuilder?: () => string): void {
    mustSatisfy(name, !!value, beDefined, contextBuilder);
}
