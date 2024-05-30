import { LocalizableMessage } from "./LocalizableMessage";
import { mustBeString } from "./mustBeString";

export function notSupported(name: string): LocalizableMessage {
    mustBeString("name", name);
    const message: LocalizableMessage = {
        get message(): string {
            return "Method `" + name + "` is not supported.";
        }
    };
    return message;
}
