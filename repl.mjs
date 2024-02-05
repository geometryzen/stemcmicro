import process from 'node:process';
import repl from 'node:repl';
import { create_script_context, human_readable_syntax_kind, syntaxKinds } from './dist/commonjs/index.js';

/**
 * See https://nodejs.org/en/learn/command-line/how-to-use-the-nodejs-repl
 * 
 * The REPL has some special commands, all starting with a dot '.'. They are:
 * 
 * .break
 * .clear
 * .editor
 * .exit
 * .help
 * .load
 * .native
 * .python
 * .save
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isRecoverableError(error) {
    if (error.name === 'SyntaxError') {
        return /^(Unexpected end of input|Unexpected token)/.test(error.message);
    }
    return false;
}

function prompt(syntaxKind) {
    return `${human_readable_syntax_kind(syntaxKind).toLowerCase()}> `;
}

const contextOptions = {
    useCaretForExponentiation: false
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
    try {
        const { values, errors } = ctxt.executeScript(cmd, executeOptions);
        for (const error of errors) {
            if (error instanceof Error) {
                return `${error.message}`;
            }
            else {
                return `${error}`;
            }
        }
        for (const value of values) {
            switch (executeOptions.syntaxKind) {
                default: {
                    return ctxt.renderAsInfix(value);
                }
            }
        }
    }
    catch (e) {
        if (e instanceof Error) {
            return e.message;
        }
        else {
            return `${e}`;
        }
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
