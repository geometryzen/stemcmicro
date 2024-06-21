import { create_rat, create_sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons } from "@stemcmicro/tree";
import { Stepper } from "../src/Stepper";
describe("stepper", () => {
    it("00010", () => {
        const module = items_to_cons(create_sym("module"));
        const stepper = new Stepper(module);
        const retval = stepper.run();
        expect(retval).toBe(false);
    });
    it("00020", () => {
        const a_equals_2 = items_to_cons(native_sym(Native.assign), create_sym("a"), create_rat(2));
        const b_equals_3 = items_to_cons(native_sym(Native.assign), create_sym("b"), create_rat(3));
        const a_add_b = items_to_cons(native_sym(Native.add), create_sym("a"), create_sym("b"));
        const module = items_to_cons(create_sym("module"), a_equals_2, b_equals_3, a_add_b);
        const stepper = new Stepper(module);
        const pending = stepper.run();
        expect(pending).toBe(false);
        const retval = stepper.stack.top.value;
        expect(`${retval}`).toBe("(+ (2 (3 ())))");
    });
});
