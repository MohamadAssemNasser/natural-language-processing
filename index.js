const ED = require('./edit-distance');
const { getData, cleanData, exportData } = require('./functions/utils')
const { getConfusionMatrices } = require('./functions/edit-distance')

const getMisspelledWords = async () => {
    let data = await getData();
    data = cleanData(data);
    // console.log(data[0]);
    const matrices = getConfusionMatrices(data)
    exportData(matrices);
    // return data;
}

getMisspelledWords()
