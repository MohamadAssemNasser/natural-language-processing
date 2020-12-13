const ED = require('../edit-distance');

const getMatricesFromWord = (word, matrices) => {
    let insert, remove, update;
    insert = remove = (node) => 1;
    update = (correct, misspelled) => correct !== misspelled ? 1 : 0;
    let lev = ED.levenshtein(word.correct, word.misspelled, insert, remove, update);
    const pairs = lev.pairs();
    pairs.forEach(pair => {
        if(pair[0] !== null && pair[1] === null){
            if(matrices.insert[pair[0]])
                matrices.insert[pair[0]]++;
            else
                matrices.insert[pair[0]] = 1
        } else if(pair[0] === null && pair[1] !== null){
            if(matrices.delete[pair[1]])
                matrices.delete[pair[1]]++;
            else
                matrices.delete[pair[1]] = 1
        } else if(pair[0] !== pair[1]) {
            if(matrices.update[pair[1]])
                matrices.update[pair[1]]++;
            else
                matrices.update[pair[1]] = 1
        }
    })
}

const getConfusionMatrices = (words) => {
    let matrices = {
        update: {},
        insert: {},
        delete: {}
    };
    words.forEach(word => {
        getMatricesFromWord(word, matrices);
    });
    return matrices
}

exports.getMatricesFromWord = getMatricesFromWord
exports.getConfusionMatrices = getConfusionMatrices