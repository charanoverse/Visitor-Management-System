const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const NumberPlate = require('./models/NumberPlate'); // Import the NumberPlate model

function extractNumberPlate(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let uploadedFile = req.files.file;
    let uploadPath = __dirname + '/uploads/' + uploadedFile.name;

    uploadedFile.mv(uploadPath, function(err) {
        if (err) {
            return res.status(500).send(err);
        }

        let pythonScriptPath = path.join(__dirname, 'NumberPlate.py');
        let imagePath = uploadPath;
        let command = `python ${pythonScriptPath} ${imagePath}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).send('Error extracting number plate.');
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);

            let textFilePath = path.join(__dirname, 'output.txt');
            fs.readFile(textFilePath, 'utf8', async (err, data) => {
                if (err) {
                    return res.status(500).send('Error reading number plate text.');
                }
                
                try {
                    const numberPlate = data.trim();
                    const existingPlate = await NumberPlate.findOne({ number: numberPlate });

                    if (existingPlate) {
                        res.json({ message: 'Number plate successfully recognized', numberPlateText: numberPlate, recognized: true });
                    } else {
                        res.json({ message: 'Number plate not recognized', numberPlateText: numberPlate, recognized: false });
                    }
                } catch (dbErr) {
                    console.error(`Database error: ${dbErr}`);
                    res.status(500).send('Database error.');
                }
            });
        });
    });
}

module.exports = extractNumberPlate;
