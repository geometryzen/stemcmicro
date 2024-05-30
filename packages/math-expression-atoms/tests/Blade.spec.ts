/* eslint-disable @typescript-eslint/no-unused-vars */
import { is_atom } from "math-expression-tree";
import { et, ex, ey, ez } from "../src/blade/spacetime";

test("Blade", function () {
    expect(et.name).toBe("Blade");
    expect(et.type).toBe("blade");
    expect(et.toInfixString()).toBe("et");
    expect(is_atom(et)).toBe(true);

    expect(ex.name).toBe("Blade");
    expect(ex.type).toBe("blade");
    expect(ex.toInfixString()).toBe("ex");
    expect(is_atom(ex)).toBe(true);

    expect(ey.name).toBe("Blade");
    expect(ey.type).toBe("blade");
    expect(ey.toInfixString()).toBe("ey");
    expect(is_atom(ey)).toBe(true);

    expect(ez.name).toBe("Blade");
    expect(ez.type).toBe("blade");
    expect(ez.toInfixString()).toBe("ez");
    expect(is_atom(ez)).toBe(true);
});
