const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
_encryptionKey = null;
_directory = null;
// Get directory input from the user
async function getDirectoryFromUser() {
    const answers = await inquirer.default.prompt([
        {
            type: 'input',
            name: 'directory',
            message: 'Please enter the directory path:',
            validate: function (input) {
                if (fs.existsSync(input) && fs.lstatSync(input).isDirectory()) {
                    return true;
                }
                return 'Invalid directory path or directory does not exist!';
            }
        }
    ]);
    return answers.directory;
}

// Find encryptionKey from system.json
function findEncryptionKey(directory) {
    _directory= directory;
    const jsonFilePath = path.join(directory, 'data', 'system.json');

    if (!fs.existsSync(jsonFilePath)) {
        throw new Error('system.json file not found in the specified directory.');
    }

    try {
        const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
        const parsedData = JSON.parse(jsonData);

        if (!parsedData.encryptionKey) {
            throw new Error('encryptionKey not found in system.json.');
        }

        return parsedData.encryptionKey;

    } catch (error) {
        throw new Error('Error reading or parsing system.json: ' + error.message);
    }
}

// Run the application
async function runApp() {
    try {
        const directory = await getDirectoryFromUser();
        const encryptionKey = findEncryptionKey(directory);
        console.log('Encryption key found:', encryptionKey);
        _encryptionKey =  encryptionKey;
        extract();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

const Utils = {

    decryptArrayBuffer: function (source) {
        const header = new Uint8Array(source, 0, 16);
        const headerHex = Array.from(header, x => x.toString(16)).join(",");
        if (headerHex !== "52,50,47,4d,56,0,0,0,0,3,1,0,0,0,0,0") {
            throw new Error("Decryption error");
        }
        const body = source.slice(16);
        const view = new DataView(body);
        const key = _encryptionKey.match(/.{2}/g);
        for (let i = 0; i < 16; i++) {
            view.setUint8(i, view.getUint8(i) ^ parseInt(key[i], 16));
        }
        return body;
    }
};

async function processDirectory(inputDir, outputDir) {
    const files = fs.readdirSync(inputDir);

    for (const file of files) {
        const fullPath = path.join(inputDir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            const newOutputDir = path.join(outputDir, file);
            fs.mkdirSync(newOutputDir, { recursive: true });
            await processDirectory(fullPath, newOutputDir);
        } else if (path.extname(file) === '.png_') {
            try {
                const encryptedData = fs.readFileSync(fullPath);
                const decryptedData = Utils.decryptArrayBuffer(encryptedData.buffer);
                const outputFile = path.join(outputDir, file.replace('.png_', '.png'));
                fs.writeFileSync(outputFile, Buffer.from(decryptedData));
                console.log(`Decrypted: ${outputFile}`);
            } catch (error) {
                console.error(`Failed to decrypt ${file}: ${error.message}`);
            }
        }else{
            continue;
        }
    }
}

async function extract(){
    const inputDir = path.resolve(path.join(_directory,'./img'));
    const outputDir = path.resolve(path.join(_directory,'./output_img'));
    fs.mkdirSync(outputDir, { recursive: true });
    await processDirectory(inputDir, outputDir);
    console.log('Decryption completed!');
}

runApp();