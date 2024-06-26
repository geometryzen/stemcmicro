import { Interpreter } from "../src/index";

test("index", function () {
    const sourceText = [`2+3`, `4+5`].join("\n");
    const runner = new Interpreter(sourceText);
    const value = runner.run();
    expect(true).toBe(true);
    expect(`${value}`).toBe("(5 (9 ()))");
});
