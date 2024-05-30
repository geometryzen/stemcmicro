import { Err } from "@stemcmicro/atoms";
import { items_to_cons, U } from "@stemcmicro/tree";
import { hook_create_err } from "../hooks/hook_create_err";
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
            return hook_create_err(msg);
        } finally {
            msg.release();
        }
    } finally {
        argList.release();
    }
}
