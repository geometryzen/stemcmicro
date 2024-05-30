import { create_flt } from "../src/flt/Flt";

test("toString", function () {
    expect(create_flt(123.456).toString()).toBe("123.5");
    expect(create_flt(0.004).toString()).toBe("0.004000");
    expect(create_flt(1.23e5).toString()).toBe("1.230e+5");
    expect(create_flt(2).toString()).toBe("2.000");
    expect(create_flt(Math.PI).toString()).toBe("3.142");
    expect(create_flt(Math.E).toString()).toBe("2.718");
});
