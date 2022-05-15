// https://en.wikipedia.org/wiki/Trie
// https://kevinwin.com/blog/How-to-implement-a-Trie-in-JavaScript/
// https://gist.github.com/tpae/72e1c54471e88b689f85ad2b3940a8f0
//

class TrieNode<T> {
    parent: TrieNode<T> | null = null;
    readonly children: { [key: string]: TrieNode<T> } = {};
    end = false;
    readonly value: T[] = [];
    constructor(readonly key: string | null) {
    }
    // iterates through the parents to get the word.
    // time complexity: O(k), k = word length
    getWord(): string {
        const output: string[] = [];
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let node: TrieNode<T> | null = this;
        while (node !== null) {
            output.unshift(node.key as string);
            node = node.parent;
        }
        return output.join('');
    }
}

export class Trie<T> {
    root: TrieNode<T>;
    constructor() {
        this.root = new TrieNode(null);
    }
    insert(word: string, value?: T): void {
        let node = this.root; // we start at the root

        // for every character in the word
        for (let i = 0; i < word.length; i++) {
            // check to see if character node exists in children.
            if (!node.children[word[i]]) {
                // if it doesn't exist, we then create it.
                node.children[word[i]] = new TrieNode(word[i]);

                // we also assign the parent to the child node.
                node.children[word[i]].parent = node;
            }

            // proceed to the next depth in the trie.
            node = node.children[word[i]];

            // finally, we check to see if it's the last word.
            if (i == word.length - 1) {
                // if it is, we set the end flag to true.
                node.end = true;
                if (typeof value !== 'undefined') {
                    node.value.push(value);
                }
            }
        }
    }
    contains(word: string): boolean {
        let node = this.root;

        // for every character in the word
        for (let i = 0; i < word.length; i++) {
            // check to see if character node exists in children.
            if (node.children[word[i]]) {
                // if it exists, proceed to the next depth of the trie.
                node = node.children[word[i]];
            }
            else {
                // doesn't exist, return false since it's not a valid word.
                return false;
            }
        }

        // we finished going through all the words, but is it a whole word?
        return node.end;
    }
    lookup(word: string): T[] {
        let node = this.root;

        // for every character in the word
        for (let i = 0; i < word.length; i++) {
            // check to see if character node exists in children.
            if (node.children[word[i]]) {
                // if it exists, proceed to the next depth of the trie.
                node = node.children[word[i]];
            }
            else {
                // doesn't exist, return false since it's not a valid word.
                return [];
            }
        }

        // we finished going through all the words, but is it a whole word?
        return node.value;
    }
    findWordsWithPrefix(prefix: string): string[] {
        let node = this.root;
        const output: string[] = [];

        // for every character in the prefix
        for (let i = 0; i < prefix.length; i++) {
            // make sure prefix actually has words
            if (node.children[prefix[i]]) {
                node = node.children[prefix[i]];
            }
            else {
                // there's none. just return it.
                return output;
            }
        }

        // recursively find all words in the node
        findAllWords(node, output);

        return output;
    }
    remove(word: string): TrieNode<T> | null {
        if (!word) return null;
        let node = this.root;
        const chain = [];

        // traverse down trie
        for (let i = 0; i < word.length; i++) {
            if (node.children[word[i]]) {
                // we want all nodes accessible in chain
                // so we can move backwards and remove dangling nodes
                chain.push(node);
                node = node.children[word[i]];
            }
            else {
                // word is not in the trie
                return null;
            }
        }

        // if any children, we should only change end flag
        if (Object.keys(node.children).length) {
            node.end = false;
            return node;
        }

        // zero children in node
        // continue untill we hit a breaking condition
        let child = chain.length ? chain.pop() : null; // whatever node was
        let parent = chain.length ? chain.pop() : null; // if node has parent

        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (parent) {
                // remove child
                child && parent && delete parent.children[child.key as string];

                // if more children or chain is empty, we're done!
                if (Object.keys(parent.children).length || !chain.length) {
                    node.end = false;
                    return node;
                }
            }
            // otherwise, we have no more children for our parent and we should keep deleting nodes
            // our next parent is what we pop from the chain
            // our child is what our parent was
            child = parent;
            parent = chain.pop();
        }
    }
}

// recursive function to find all words in the given node.
function findAllWords(node: TrieNode<unknown>, arr: string[]) {
    // base case, if node is at a word, push to output
    if (node.end) {
        arr.unshift(node.getWord());
    }

    // iterate through each children, call recursive findAllWords
    for (const child in node.children) {
        findAllWords(node.children[child], arr);
    }
}