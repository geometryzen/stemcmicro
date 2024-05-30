import {
    is_array_expression,
    is_assignment_expression,
    is_binary_expression,
    is_call_expression,
    is_expression_statement,
    is_identifier,
    is_literal,
    is_member_expression,
    is_program,
    is_sequence_expression,
    is_unary_expression,
    is_variable_declaration,
    is_variable_declarator,
    Node,
    ParseOptions,
    parseScript,
    Script
} from "@geometryzen/esprima";
import { create_boo, create_flt, create_int, create_rat, create_str, create_sym, create_tensor } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { cons, is_atom, is_cons, items_to_cons, nil, U } from "@stemcmicro/tree";
import { StackU } from "../env/StackU";
import { is_sym } from "../operators/sym/is_sym";
import { op_from_string } from "./helpers";
import { geometric_algebra_operator_precedence } from "./precedence";

type Lift = (nodes: Node[]) => Node;
type Test = (node: Node) => boolean;
type Visitor = (node: Node) => Node;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function visitNode(node: Node, visitor: Visitor, test?: Test, lift?: Lift): void {
    visitor(node);
}

export function js_parse(sourceText: string): { trees: U[]; errors: Error[] } {
    const options: ParseOptions = {
        attachComment: false,
        comment: false,
        jsx: false,
        loc: false,
        range: false,
        operatorPrecedence: geometric_algebra_operator_precedence
    };
    const stack = new StackU();
    try {
        const visitor: Visitor = function (node: Node) {
            if (is_identifier(node)) {
                stack.push(create_sym(node.name));
            } else if (is_binary_expression(node)) {
                stack.push(op_from_string(node.operator));
                visitNode(node.left, visitor);
                visitNode(node.right, visitor);
                const rhs = stack.pop();
                const lhs = stack.pop();
                const opr = stack.pop();
                if (is_sym(opr)) {
                    switch (opr.id) {
                        case Native.divide: {
                            const x = items_to_cons(native_sym(Native.pow), rhs, create_rat(-1));
                            stack.push(items_to_cons(native_sym(Native.multiply), lhs, x));
                            break;
                        }
                        case Native.subtract: {
                            const x = items_to_cons(native_sym(Native.multiply), create_rat(-1), rhs);
                            stack.push(items_to_cons(native_sym(Native.add), lhs, x));
                            break;
                        }
                        default: {
                            stack.push(items_to_cons(opr, lhs, rhs));
                        }
                    }
                }
            } else if (is_literal(node)) {
                if (typeof node.value === "number") {
                    if (Number.isInteger(node.value)) {
                        if (node.raw.indexOf(".") > 0) {
                            stack.push(create_flt(node.value));
                        } else {
                            stack.push(create_rat(node.value));
                        }
                    } else {
                        stack.push(create_flt(node.value));
                    }
                } else if (typeof node.value === "string") {
                    stack.push(create_str(node.value));
                } else if (typeof node.value === "boolean") {
                    stack.push(create_boo(node.value));
                } else if (typeof node.value === "object") {
                    if (node.value === null) {
                        stack.push(nil);
                    }
                } else {
                    throw new Error();
                }
            } else if (is_assignment_expression(node)) {
                stack.push(native_sym(Native.assign));
                visitNode(node.left, visitor);
                visitNode(node.right, visitor);
                const rhs = stack.pop();
                const lhs = stack.pop();
                const opr = stack.pop();
                stack.push(items_to_cons(opr, lhs, rhs));
            } else if (is_call_expression(node)) {
                const items: U[] = [];
                visitNode(node.callee, visitor);
                items.push(stack.pop());
                node.arguments.forEach((argument) => {
                    visitNode(argument, visitor);
                    items.push(stack.pop());
                });
                stack.push(items_to_cons(...items));
            } else if (is_variable_declaration(node)) {
                node.declarations.forEach((declaration) => {
                    visitNode(declaration, visitor);
                });
            } else if (is_variable_declarator(node)) {
                stack.push(native_sym(Native.def));
                visitNode(node.id, visitor);
                if (node.init) {
                    visitNode(node.init, visitor);
                    const rhs = stack.pop();
                    const varName = stack.pop();
                    const assign = items_to_cons(native_sym(Native.assign), varName, rhs);
                    const def = stack.pop();
                    stack.push(items_to_cons(def, assign));
                } else {
                    const varName = stack.pop();
                    const def = stack.pop();
                    stack.push(items_to_cons(def, varName));
                }
            } else if (is_array_expression(node)) {
                const elements: U[] = [];
                node.elements.forEach((element) => {
                    if (element) {
                        visitNode(element, visitor);
                        elements.push(stack.pop());
                    } else {
                        // null?
                    }
                });
                stack.push(create_tensor(elements));
            } else if (is_member_expression(node)) {
                visitNode(node.object, visitor);
                const obj = stack.pop();
                visitNode(node.property, visitor);
                const indices = stack.pop();
                if (is_cons(indices)) {
                    const ois = cons(obj, indices);
                    const x = cons(native_sym(Native.component), ois);
                    stack.push(x);
                } else if (is_atom(indices)) {
                    const ois = items_to_cons(obj, indices);
                    const x = cons(native_sym(Native.component), ois);
                    stack.push(x);
                }
            } else if (is_sequence_expression(node)) {
                const xs: U[] = [];
                node.expressions.forEach((expr) => {
                    visitNode(expr, visitor);
                    xs.push(stack.pop());
                });
                stack.push(items_to_cons(...xs));
            } else if (is_unary_expression(node)) {
                visitNode(node.argument, visitor);
                const argument = stack.pop();
                switch (node.operator) {
                    case "-": {
                        const negArg = items_to_cons(native_sym(Native.multiply), create_int(-1), argument);
                        stack.push(negArg);
                        break;
                    }
                    default:
                        throw new Error(`${node.operator}`);
                }
            } else if (is_expression_statement(node)) {
                visitNode(node.expression, visitor);
            } else if (is_program(node)) {
                node.body.forEach((statement) => {
                    visitNode(statement, visitor);
                });
            } else {
                throw new Error(node.type);
            }
            return node;
        };
        const script: Script = parseScript(sourceText, options);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const test = function (node: Node): boolean {
            throw new Error();
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const lift = function (ns: readonly Node[]): Node {
            throw new Error();
        };
        // Note that test and lift are only called when producing Node(s) with the visitor, which we do not do.
        visitNode(script, visitor, test, lift);
        const trees: U[] = [];
        while (stack.length > 0) {
            trees.push(stack.pop());
        }
        trees.reverse();
        return { trees, errors: [] };
    } finally {
        stack.release();
    }
}
