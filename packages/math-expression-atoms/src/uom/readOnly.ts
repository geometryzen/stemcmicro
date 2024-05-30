import { LocalizableMessage } from "./LocalizableMessage";
import { mustBeString } from "./mustBeString";

export function readOnly(name: string): LocalizableMessage {
    mustBeString("name", name);
    const message: LocalizableMessage = {
        get message(): string {
            return "Property `" + name + "` is readonly.";
        }
    };
    return message;
}
