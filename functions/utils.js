const fs = require('fs')
const util = require('util');

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);

const getStuff = () => {
  return readFile('./data/holbrook-tagged-dev.dat', 'utf8');
}

const getData = async () => {
    const data = await getStuff();
    return data
}

const cleanData = (_data) => {
    let words = [];
    _data = _data.split(/(\<ERR)|(\<\/ERR\>)/)
    let data = _data.filter(s => {
        return (s !== undefined && s.includes('targ='))
    })
    data.forEach(e => {
        const word = e.split('> ')
        words.push({
            correct: word[0].substring(6),
            misspelled: word[1].substring(0, word[1].length - 1)
        })
    })
    return words;
}

const exportData = (_data) => {
    let data = JSON.stringify(_data, null, 2);
    fs.writeFileSync('output.json', data);
}

exports.getData = getData
exports.cleanData = cleanData
exports.exportData = exportData