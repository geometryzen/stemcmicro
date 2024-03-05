import { is_assignment_expression, Node, ParseOptions, parseScript, Script } from '@geometryzen/esprima';
import { create_flt, create_rat, create_str, create_sym } from 'math-expression-atoms';
import { Native, native_sym } from 'math-expression-native';
import { items_to_cons, nil, U } from 'math-expression-tree';
import { StackU } from '../env/StackU';
import { is_binary_expression, is_expression_statement, is_identifier, is_literal, is_program, is_variable_declaration, is_variable_declarator, op_from_string } from './helpers';

type Lift = (nodes: Node[]) => Node;
type Test = (node: Node) => boolean;
type Visitor = (node: Node) => Node;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function visitNode(node: Node, visitor: Visitor, test?: Test, lift?: Lift): void {
    visitor(node);
}



export function js_parse(sourceText: string): U {
    const options: ParseOptions = {
        attachComment: false,
        comment: false,
        jsx: false,
        loc: false,
        range: false
    };
    const stack = new StackU();
    try {
        const visitor: Visitor = function (node: Node) {
            if (is_identifier(node)) {
                stack.push(create_sym(node.name));
            }
            else if (is_binary_expression(node)) {
                stack.push(op_from_string(node.operator));
                visitNode(node.left, visitor);
                visitNode(node.right, visitor);
                const rhs = stack.pop();
                const lhs = stack.pop();
                const opr = stack.pop();
                stack.push(items_to_cons(opr, lhs, rhs));
            }
            else if (is_literal(node)) {
                if (typeof node.value === 'number') {
                    if (Number.isInteger(node.value)) {
                        if (node.raw.indexOf('.') > 0) {
                            stack.push(create_flt(node.value));
                        }
                        else {
                            stack.push(create_rat(node.value));
                        }
                    }
                    else {
                        console.log(node.value, `${typeof node.value}`);
                        throw new Error();
                    }
                }
                else if (typeof node.value === 'string') {
                    stack.push(create_str(node.value));
                }
                else {
                    console.log(node.value, `${typeof node.value}`);
                    throw new Error();
                }
            }
            else if (is_assignment_expression(node)) {
                stack.push(native_sym(Native.assign));
                visitNode(node.left, visitor);
                visitNode(node.right, visitor);
                const rhs = stack.pop();
                const lhs = stack.pop();
                const opr = stack.pop();
                stack.push(items_to_cons(opr, lhs, rhs));
            }
            else if (is_variable_declaration(node)) {
                node.declarations.forEach(declaration => {
                    visitNode(declaration, visitor);
                });
            }
            else if (is_variable_declarator(node)) {
                stack.push(native_sym(Native.def));
                visitNode(node.id, visitor);
                if (node.init) {
                    visitNode(node.init, visitor);
                    const rhs = stack.pop();
                    const varName = stack.pop();
                    const assign = items_to_cons(native_sym(Native.assign), varName, rhs);
                    const def = stack.pop();
                    stack.push(items_to_cons(def, assign));    
                }
                else {
                    const varName = stack.pop();
                    const def = stack.pop();
                    stack.push(items_to_cons(def, varName));    
                }
            }
            else if (is_expression_statement(node)) {
                visitNode(node.expression, visitor);
            }
            else if (is_program(node)) {
                node.body.forEach(statement => {
                    visitNode(statement, visitor);
                });
            }
            else {
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
        return stack.pop();

        return nil;
    }
    finally {
        stack.release();
    }
}