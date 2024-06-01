import { is_atom } from "@stemcmicro/tree";
import { create_int, create_rat } from "../src/rat/Rat";

test("create_int", function () {
    expect(create_int(1).toNumber()).toBe(1);
    expect(is_atom(create_int(1))).toBe(true);
});
test("isEven", function () {
    expect(create_int(0).isEven()).toBe(true);
    expect(create_int(1).isEven()).toBe(false);
    expect(create_int(2).isEven()).toBe(true);
    expect(create_int(-1).isEven()).toBe(false);
    expect(create_int(-2).isEven()).toBe(true);
    expect(create_rat(1, 2).isEven()).toBe(false);
});
test("isOdd", function () {
    expect(create_int(0).isOdd()).toBe(false);
    expect(create_int(1).isOdd()).toBe(true);
    expect(create_int(2).isOdd()).toBe(false);
    expect(create_int(-1).isOdd()).toBe(true);
    expect(create_int(-2).isOdd()).toBe(false);
    expect(create_rat(1, 2).isOdd()).toBe(false);
});
test("toString", function () {
    expect(create_int(2).toString()).toBe("2");
    expect(create_rat(1, 2).toString()).toBe("1/2");
});
