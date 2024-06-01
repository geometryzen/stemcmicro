import { Err } from "@stemcmicro/atoms";
import { items_to_cons, U } from "@stemcmicro/tree";
import { Localizable, LocalizableMessage } from "./localizable";

export interface Diagnostic {
    code: number;
}

export type DiagnosticArguments = U[];

export function diagnostic(message: LocalizableMessage, ...args: DiagnosticArguments): Err {
    const argList = items_to_cons(...args);
    try {
        const msg = new Localizable(message, argList);
        try {
            return new Err(msg);
        } finally {
            msg.release();
        }
    } finally {
        argList.release();
    }
}
