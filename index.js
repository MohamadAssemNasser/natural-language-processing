var ED = require('./edit-distance');

let insert, remove, update;
insert = remove = (node) => 1;
// update = (stringA, stringB) => stringA !== stringB ? 1 : 0;
update = (stringA, stringB) => {
    // console.log('String one: ', stringA);
    // console.log('String two: ', stringB);
    return stringA !== stringB ? 1 : 0;
}
 
// Define two strings.
const stringA = "hello";
const stringB = "elos";

// Compute edit distance, mapping, and alignment.
let lev = ED.levenshtein(stringA, stringB, insert, remove, update);
console.log('Levenshtein Distance: ', lev.distance);
console.log('Levenshtein Pairs: ', lev.pairs());
console.log('Levenshtein Alignment: ', lev.alignment());