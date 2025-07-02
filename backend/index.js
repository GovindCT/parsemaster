
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('logfile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, req.file.path);
    const parser = new xml2js.Parser({ explicitArray: false });

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error readin file:", err);
            return res.status(500).json({ message: 'Failed to read file' });
        }

        parser.parseString(data, (err, result) => {
            if (err) {
                console.error("Error parsing XML:", err);
                return res.status(500).json({ message: 'Failed to parse XML' });

            }

            try {
                const events = result.Events?.Event || [];
                const list = Array.isArray(events) ? events : [events];

                const failedLogins = [];

                for (const evt of list) {
                    const eventID = evt.System?.EventID?._ || evt.System?.EventID;
                    if (eventID === '4625') {
                        const time = evt.System.TimeCreated?.['$']?.SystemTime;
                        const user = evt.EventData?.Data?.find(d => d['$']?.Name === 'TargetUserName')?._;
                        const ip = evt.EventData?.Data?.find(d => d['$']?.Name === 'IpAddress')?._;

                        failedLogins.push({
                            timestamp: time || 'unknown',
                            username: user || 'unknown',
                            ip: ip || unknown
                        });
                    }
                }


                res.json({
                    message: 'Parsed windows event logs successfully',
                    failedLogins
                });

            } catch (e) {
                console.error('Error processing events:', e);
                res.status(500).json({ message: 'Error extracting events' });
            }
        });

    });

});

app.listen(port, () => {
    console.log(`Parsemaster backend running at http://localhost:${port}`);
});