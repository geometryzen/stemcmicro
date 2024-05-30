import { run_test } from "../test-harness";

run_test([
    "1.0",
    "1.0",

    "1111 * 1111.0",
    "1234321.0",

    "1111.0 * 1111",
    "1234321.0",

    "1111.0 * 1111.0",
    "1234321.0",

    "11111111 * 11111111.0",
    "123456787654321.0",

    "11111111.0 * 11111111",
    "123456787654321.0",

    "11111111.0 * 11111111.0",
    "123456787654321.0",

    // unfortunately using Numbers
    // at some point we hit the precision
    "111111111 * 111111111.0",
    "12345678987654320.0",

    // unfortunately using Numbers
    // at some point we hit the precision
    "111111111.0 * 111111111",
    "12345678987654320.0",

    // unfortunately using Numbers
    // at some point we hit the precision
    "111111111.0 * 111111111.0",
    "12345678987654320.0",

    "1.0*10^(-6)",
    "0.000001",

    // check that this doesn't return 0.0
    "1.0*10^(-7)",
    "0.000000...",

    // ------------------------------------------
    "maxFixedPrintoutDigits",
    "6",

    "maxFixedPrintoutDigits=20",
    "",

    "maxFixedPrintoutDigits",
    "20",

    "1.0*10^(-15)",
    "0.000000000000001",

    "printhuman",
    "0.000000000000001",

    "printinfix",
    "0.000000000000001",

    "printlatex",
    "0.000000000000001",

    "printsexpr",
    "0.000000000000001",

    "printascii",
    "0.000000000000001",

    "forceFixedPrintout=0",
    "",

    "1.0*10^(-15)",
    "1.0*10^(-15)",

    "printhuman",
    "1.0*10^(-15)",

    "printinfix",
    "1.0*10^(-15)",

    "printlatex",
    "1.0\\mathrm{e}{-15}",

    "printsexpr",
    "1.0*10^(-15)",

    "printascii",
    "1.0*10^(-15)",

    "forceFixedPrintout=1",
    "",

    "maxFixedPrintoutDigits=6",
    "",

    // ------------------------------------------

    "float(pi)",
    "3.141593...",

    'print("hello")',
    '"hello"',

    "-sqrt(2)/2",
    "-1/2*2^(1/2)",

    // we can't get rid of the multiplication sign
    // in general, because expressions like
    // (x+1)(x-1) actually represent a function call
    // We could get rid of the multiplication sign
    // in these special cases where there are numeric
    // constants but we don't do that yet.
    "printhuman",
    "-1/2 2^(1/2)",

    "printinfix",
    "-1/2*2^(1/2)",

    "printlatex",
    "-\\frac{\\sqrt{2}}{2}",

    "printsexpr",
    "(* -1/2 (pow 2 1/2))",

    "printsexpr(a+b)\nprintsexpr(c+d)",
    "(+ a b)(+ c d)",

    "printascii",
    "   1   1/2\n- --- 2\n   2",

    "last2dasciiprint",
    '"   1   1/2\n- --- 2\n   2"',

    // checks that no extra newlines are inserted
    "x=0\ny=2\nfor(do(x=sqrt(2+x),y=2*y/x,printinfix(y)),k,1,2)",
    "2*2^(1/2)4*2^(1/2)/((2+2^(1/2))^(1/2))",

    "clearall",
    "",

    "prindascii([[a,b],[c,d]])",
    "a   b\n\nc   d",

    "printascii(x^(1/a))",
    " 1/a\nx",

    "printascii(x^(a/b))",
    " a/b\nx",

    "printascii(x^(1/(a+b)))",
    " 1/(a + b)\nx",

    "printascii(-sqrt(2)/2)",
    "   1   1/2\n- --- 2\n   2",

    "printascii(1/sqrt(-15))",
    "        1/2\n    (-1)\n- -----------\n    1/2  1/2\n   3    5",

    "printascii(x^(a/2))",
    " 1/2 a\nx",

    // ------------------------------------------

    "(5/3)!",
    "(5/3)!",

    "printhuman",
    "(5/3)!",

    "printinfix",
    "(5/3)!",

    "printlatex",
    "(\\frac{5}{3})!",

    "printsexpr",
    "(factorial 5/3)",

    "printascii",
    "  5\n(---)!\n  3",

    // bug #106 ---------------------------------
    // printing terms that are not "normalised"
    // following an eval, one can't assume that
    // the numbers are all leading, hence some
    // checks had to be refined when printing
    // the signs

    "clearall",
    "",

    "print(quote(k*(-2)))",
    "k*(-2)",

    "print(quote(k*(-1/2)))",
    "k*(-1/2)",

    "print(quote(k*2))",
    "k*2",

    "print(quote(k*1/2))",
    "k*1/2",

    "print(k*(-2))",
    "-2*k",

    "print(k*(-1/2))",
    "-1/2*k",

    "print(k*2)",
    "2*k",

    "print(k*1/2)",
    "1/2*k"
]);
