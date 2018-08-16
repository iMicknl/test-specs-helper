#!/usr/bin/env node
const fs = require('fs');
const request = require('request-promise-native');

// Settings 
const settings = {
    addNotSupported: true,
    translateInput: false,
    translateResult: false,
    targetLang: 'nl',
    NotSupported: ['dotNet'],
    NotSupportedByDesign: ['javascript', 'python', 'java'],
    inputFolder: process.cwd() + '/', // Current folder
    outputFolder: process.cwd() + '/output'
}

// Read all files in inputFolder
fs.readdir(settings['inputFolder'], (err, files) => {
    if (err) { return console.log(err); }

    if (!fs.existsSync(settings['outputFolder'])) {
        fs.mkdirSync(settings['outputFolder']);
    }

    for (let file in files) {
        file = files[file];

        if (!file.endsWith('.json')) {
            continue;
        }

        if ((file.includes('package.json') || file.includes('package-lock.json'))) {
            continue;
        }

        // Read file
        fs.readFile(settings['inputFolder'] + file, 'utf8', (err, data) => {
            if (err) { return console.error(err); }

            let testCases = [];
            let stringsToTranslate = [];

            // Read data
            try {
                testCases = JSON.parse(data);
            } catch (error) {
                console.error(`Issue with parsing ${file}`)
                return;
            }

            // How many cases?
            const count = testCases.length;
            console.log(`${count} testcases found in ${file}.`)

            // Manipulate data
            for (index in testCases) {
                let testCase = testCases[index];

                // Add NotSupported & NotSupportedByDesign tags (override existing tags)
                testCase['NotSupported'] = settings['NotSupported'].join();
                testCase['NotSupportedByDesign'] = settings['NotSupportedByDesign'].join();

                // if (settings["translateInput"] === true) {
                // // Save original to comment, temporarily
                // testCase["Comment"] = `Original: ${testCase["Input"]}`;

                // // Manipulate input
                // testCase['Input'] = testCase['Input'];

                // stringsToTranslate.push(testCase['Input']);
                // }

                // Loop through results
                for (i in testCase['Results']) {

                    let testResult = testCase['Results'][i];

                    // Trim results
                    if (testResult['Text'] !== undefined) {
                        testResult['Text'] = testResult['Text'].trim();
                    }

                    // if (settings["translateResult"] === true) {
                    //     // Save original to comment, temporarily
                    //     testResult['Comment'] = `Original: ${testResult["Input"]}`;
                    //     // Manipulate input
                    //     testCase['Text'] = testCase['Text'];
                    // }

                    // Save new object
                    testCase['Results'][i] = testResult;
                }

                // Testcases without a result should always be tested
                if (testCase['Results'] === undefined || testCase['Results'].length < 1) {
                    delete testCase['NotSupported'];
                    delete testCase['NotSupportedByDesign'];
                }

                // Save new object
                testCases[index] = testCase;
            }

            // bulkTranslate(stringsToTranslate);

            // Write file
            fs.writeFile(settings['inputFolder'] + 'output/' + file, JSON.stringify(testCases, null, 2), (err) => {
                if (err) { return console.log(err); }
                console.log(`${file} saved!`);
            });

        });

    }
})

// /**
//  * 
//  * @param array input 
//  */
// const bulkTranslate = (input) => {

//     let stringsToTranslate = [];
//     let translatedStrings = [];

//     console.log(`Translating ${stringsToTranslate.length} strings`);

//     // Build array of bulk
//     let count = 0;

//     for (string of input) {
//         count++;
//         stringsToTranslate.push({ text: string });

//         if (count % 25 === 0) {
//             translatedStrings = bulkRequest(stringsToTranslate);
//             stringsToTranslate = [];
//         }
//     }

//     const response = translatedStrings;
//     return response;
// }

// const bulkRequest = (input) => {
//     const baseLang = 'en';
//     const targetLang = settings['targetLang'];

//     const options = {
//         method: 'POST',
//         body: input,
//         uri: 'https://api.cognitive.microsofttranslator.com/translate',
//         qs: {
//             'api-version': '3.0',
//             'from': baseLang,
//             'to': targetLang
//         },
//         headers: {
//             'Ocp-Apim-Subscription-Key': process.env.MicrosoftTranslatorKey
//         },
//         json: true
//     };

//     request(options)
//         .then((translations) => {
//             let result = [];

//             for (translation of translations) {
//                 result.push(translation['translations'][0]['text']);
//             }

//             console.log(`Translated ${result.length} strings`);
//             console.log(result);

//             return result;
//         })
//         .catch((err) => {
//             console.error(err);
//             return [];
//         });
// }
