import { LocalizableMessage } from "./localizable";

export const Diagnostics = {
    Hello_World: diag(0, "", ""),
    Operator_0_cannot_be_applied_to_types_1_and_2: diag(1000, "Operator_0_cannot_be_applied_to_types_1_and_2_1000", "Operator '{0}' cannot be applied to types '{1}' and '{2}'."),
    Property_0_does_not_exist_on_type_1: diag(1001, "Property_0_does_not_exist_on_type_1_1001", "Property '{0}' does not exist on type '{1}'."),
    Division_by_zero: diag(1002, "Division_by_zero_1002", "Division by zero.")
};

function diag(code: number, key: string, text: string): LocalizableMessage {
    return { code, key, text };
}
