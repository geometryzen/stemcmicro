import { AssignmentExpression, BinaryExpression, ExpressionStatement, Identifier, Literal, Node, Script, Syntax, VariableDeclaration, VariableDeclarator } from '@geometryzen/esprima';
import { Sym } from 'math-expression-atoms';
import { Native, native_sym } from 'math-expression-native';

export function is_assignment_expression(node: Node): node is AssignmentExpression {
    return node.type == Syntax.AssignmentExpression;
}

export function is_binary_expression(node: Node): node is BinaryExpression {
    return node.type == Syntax.BinaryExpression;
}

export function is_expression_statement(node: Node): node is ExpressionStatement {
    return node.type == Syntax.ExpressionStatement;
}

export function is_identifier(node: Node): node is Identifier {
    return node.type == Syntax.Identifier;
}

export function is_literal(node: Node): node is Literal {
    return node.type == Syntax.Literal;
}

export function is_program(node: Node): node is Script {
    return node.type == Syntax.Program;
}

export function is_variable_declaration(node: Node): node is VariableDeclaration {
    return node.type == Syntax.VariableDeclaration;
}

export function is_variable_declarator(node: Node): node is VariableDeclarator {
    return node.type == Syntax.VariableDeclarator;
}

export function op_from_string(operator: string): Sym {
    switch (operator) {
        case '+': return native_sym(Native.add);
        case '-': return native_sym(Native.subtract);
        case '*': return native_sym(Native.multiply);
        case '/': return native_sym(Native.divide);
        case '^': return native_sym(Native.outer);
        case '<<': return native_sym(Native.lco);
        case '>>': return native_sym(Native.rco);
        case '**': return native_sym(Native.pow);
        default: throw new Error(operator);
    }
}
