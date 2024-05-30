import { LocalizableMessage } from "./LocalizableMessage";
import { mustBeString } from "./mustBeString";

export function notImplemented(name: string): LocalizableMessage {
    mustBeString("name", name);
    const message: LocalizableMessage = {
        get message(): string {
            return `'${name}' method is not yet implemented.`;
        }
    };
    return message;
}
