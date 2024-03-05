import { PrecedenceOperator } from "@geometryzen/esprima";

/**
 * Customized operator precedence to support Geometric Algebra.
 */
export function geometric_algebra_operator_precedence(operator: PrecedenceOperator): number | undefined {
    switch (operator) {
        case ')': return 0;
        case ';': return 0;
        case ',': return 0;
        case '=': return 0;
        case ']': return 0;
        case '??': return 5;
        case '||': return 6;
        case '&&': return 7;
        // | moved down to bind more tightly (interior or scalar product).
        // ^ moved down to bind more tightly (exterior or wedge product).
        case '&': return 10;
        case '==': return 11;
        case '!=': return 11;
        case '===': return 11;
        case '!==': return 11;
        case '<': return 12;
        case '>': return 12;
        case '<=': return 12;
        case '>=': return 12;
        // << moved down to bind more tightly (left contraction).
        // >> moved down to bind more tightly (right contraction).
        case '>>>': return 13;
        case '+': return 14;
        case '-': return 14;
        case '*': return 15;
        case '/': return 15;
        case '^': return 16;
        case '|': return 17;
        case '<<': return 18;
        case '>>': return 18;
        case '%': return 19;
        default: throw new Error();
    }
}
