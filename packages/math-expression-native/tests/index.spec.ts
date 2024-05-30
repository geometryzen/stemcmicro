import { create_sym, create_sym_ns } from "math-expression-atoms";
import { code_from_native_sym, is_native, is_native_sym, Native, NATIVE_MAX, NATIVE_MIN, native_sym, ns_greek_alphabet, ns_mathematical_constants } from "../src/index";

test("NATIVE_MIN", function () {
    expect(NATIVE_MIN).toBe(0);
});

test("NATIVE_MAX", function () {
    expect(NATIVE_MAX).toBe(185);
});

test("is_native", function () {
    expect(is_native(create_sym("bogus"), Native.E)).toBe(false);
    expect(is_native(create_sym_ns("e", ns_mathematical_constants), Native.E)).toBe(true);
    expect(is_native(native_sym(Native.E), Native.E)).toBe(true);
    expect(is_native(native_sym(Native.PI), Native.E)).toBe(false);
    expect(is_native(create_sym_ns("x", ns_mathematical_constants), Native.E)).toBe(false);
    expect(is_native(create_sym_ns("e", ns_greek_alphabet), Native.E)).toBe(false);
});

test("code_from_native_sym", function () {
    expect(code_from_native_sym(native_sym(Native.E))).toBe(Native.E);
    expect(code_from_native_sym(create_sym("bogus"))).toBe(-1);
});

test("if", function () {
    expect(native_sym(Native.E).id).toBe(Native.E);
});

test("mathematical constant Pi", function () {
    const Pi = native_sym(Native.PI);
    expect(is_native_sym(Pi)).toBe(true);
    expect(Pi.key()).toBe("Math/Pi");
});

test("Greek uppercase letter Pi", function () {
    const PI = native_sym(Native.greek_uppercase_letter_Pi);
    expect(is_native_sym(PI)).toBe(true);
    expect(PI.key()).toBe("Greek/PI");
});

test("Greek lowercase letter Pi", function () {
    const pi = native_sym(Native.greek_lowercase_letter_Pi);
    expect(is_native_sym(pi)).toBe(true);
    expect(pi.key()).toBe("Greek/pi");
});

test("caching", function () {
    const PI_1 = native_sym(Native.greek_uppercase_letter_Pi);
    const PI_2 = native_sym(Native.greek_uppercase_letter_Pi);
    expect(PI_1 === PI_2).toBe(true);
});

test("foo is NOT native", function () {
    const foo = create_sym("foo");
    expect(is_native_sym(foo)).toBe(false);
    expect(foo.key()).toBe("foo");
});

test("Euler's number", function () {
    const sym = native_sym(Native.E);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("Math/e");
});
test("add", function () {
    const sym = native_sym(Native.add);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("+");
});
test("arccos", function () {
    const sym = native_sym(Native.arccos);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("arccos");
});
test("arccosh", function () {
    const sym = native_sym(Native.arccosh);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("arccosh");
});
test("arcsin", function () {
    const sym = native_sym(Native.arcsin);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("arcsin");
});
test("arcsinh", function () {
    const sym = native_sym(Native.arcsinh);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("arcsinh");
});
test("arctan", function () {
    const sym = native_sym(Native.arctan);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("arctan");
});
test("arctanh", function () {
    const sym = native_sym(Native.arctanh);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("arctanh");
});
test("atom", function () {
    const sym = native_sym(Native.atom);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("atom");
});
test("cos", function () {
    const sym = native_sym(Native.cos);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("cos");
});
test("cosh", function () {
    const sym = native_sym(Native.cosh);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("cosh");
});
test("def", function () {
    const sym = native_sym(Native.def);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("def");
});
test("defn", function () {
    const sym = native_sym(Native.defn);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("defn");
});
test("deref", function () {
    const sym = native_sym(Native.deref);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("deref");
});
test("exp", function () {
    const sym = native_sym(Native.exp);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("exp");
});
test("fn", function () {
    const sym = native_sym(Native.fn);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("fn");
});
test("function", function () {
    const sym = native_sym(Native.function);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("function");
});
test("let", function () {
    const sym = native_sym(Native.let);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("let");
});
test("multiply", function () {
    const sym = native_sym(Native.multiply);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("*");
});
test("pow", function () {
    const sym = native_sym(Native.pow);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("pow");
});
test("sin", function () {
    const sym = native_sym(Native.sin);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("sin");
});
test("sinh", function () {
    const sym = native_sym(Native.sinh);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("sinh");
});
test("tan", function () {
    const sym = native_sym(Native.tan);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("tan");
});
test("tanh", function () {
    const sym = native_sym(Native.tanh);
    expect(is_native_sym(sym)).toBe(true);
    expect(sym.key()).toBe("tanh");
});
