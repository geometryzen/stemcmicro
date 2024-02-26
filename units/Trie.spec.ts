import assert from 'assert';
import { Trie } from '../src/trie/Trie';

describe("Trie", function () {
    it("Basics", function () {
        const trie = new Trie();

        trie.insert("hello");
        trie.insert("helium");

        assert.strictEqual(trie.contains("helium"), true);
        assert.strictEqual(trie.contains("kickass"), false);

        const words = trie.findWordsWithPrefix("hel");
        assert.strictEqual(words.length, 2);
        assert.strictEqual(words[0], 'helium');
        assert.strictEqual(words[1], 'hello');
    });
    it("Values", function () {
        const trie = new Trie<number>();

        trie.insert("even", 0);
        trie.insert("even", 2);
        trie.insert("odd", 1);
        trie.insert("odd", 3);
        trie.insert("odd", 5);

        assert.strictEqual(trie.contains("even"), true);
        assert.strictEqual(trie.contains("odd"), true);
        assert.strictEqual(trie.contains("other"), false);

        const evens = trie.lookup("even");
        assert.strictEqual(evens.length, 2);
        assert.strictEqual(evens[0], 0);
        assert.strictEqual(evens[1], 2);

        const odds = trie.lookup("odd");
        assert.strictEqual(odds.length, 3);
        assert.strictEqual(odds[0], 1);
        assert.strictEqual(odds[1], 3);
        assert.strictEqual(odds[2], 5);
    });
});
