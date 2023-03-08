import process from 'node:process';
import repl from 'node:repl';
import { create_script_context, human_readable_syntax_kind, SyntaxKind, syntaxKinds } from './dist/commonjs/index.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isRecoverableError(error) {
    if (error.name === 'SyntaxError') {
        return /^(Unexpected end of input|Unexpected token)/.test(error.message);
    }
    return false;
}

function prompt(syntaxKind) {
    return `symbolic-math:${human_readable_syntax_kind(syntaxKind).toLowerCase()}> `;
}

const contextOptions = {
    syntaxKind: SyntaxKind.Native,
    useCaretForExponentiation: false,
    useDefinitions: false
};

const ctxt = create_script_context(contextOptions);

const executeOptions = {
    syntaxKind: contextOptions.syntaxKind
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function run(cmd, unusedContext, filename, callback) {
    /*
    let result;
    try {
        result = vm.runInThisContext(cmd);
    }
    catch (e) {
        if (isRecoverableError(e)) {
            return callback(new repl.Recoverable(e));
        }
    }
    callback(null, result);
    */
    const { values, errors } = ctxt.executeScript(cmd, executeOptions);
    for (const error of errors) {
        return `${error}`;
    }
    for (const value of values) {
        return ctxt.renderAsInfix(value);
    }
}

const serverOptions = {
    prompt: prompt(executeOptions.syntaxKind),
    eval: (input, context, filename, callback) => {
        callback(null, run(input));
    },
    ignoreUndefined: true,
    useColors: true
};

const replServer = new repl.REPLServer(serverOptions);

syntaxKinds.forEach(function (syntaxKind) {
    replServer.defineCommand(human_readable_syntax_kind(syntaxKind).toLowerCase(), {
        help: `Sets the scripting syntax to ${human_readable_syntax_kind(syntaxKind)}`,
        action() {
            this.clearBufferedCommand();
            executeOptions.syntaxKind = syntaxKind;
            replServer.setPrompt(prompt(syntaxKind));
            this.displayPrompt();
        },
    });
});

//
// Handle the .exit command
//
replServer.on('exit', () => {
    process.exit();
});

//
// Handle the .clear command.
//
replServer.on('reset', () => {
    ctxt.clearBindings();
});

// r.write("");

// r.close();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
process.on('beforeExit', (code) => {
    // console.lg('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
    ctxt.release();
    if (code !== 0) {
        // console.lg('Process exit event with code: ', code);
    }
});
