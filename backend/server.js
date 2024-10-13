const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Route for code execution
app.post('/execute', (req, res) => {
  const { language, code } = req.body;
  let command;
  let filePath;

  try {
    switch (language) {
      case 'python':
        filePath = path.join(__dirname, 'temp_code.py');
        fs.writeFileSync(filePath, code);
        command = `python ${filePath}`;  // Corrected to use template literals
        break;

      case 'cpp':
        filePath = path.join(__dirname, 'temp_code.cpp');
        fs.writeFileSync(filePath, code);
        if (process.platform === 'win32') {
          command = `g++ ${filePath} -o temp_exec && temp_exec.exe`; // Corrected to use template literals
        } else {
          command = `g++ ${filePath} -o temp_exec && ./temp_exec`; // Corrected to use template literals
        }
        break;

      case 'java':
        filePath = path.join(__dirname, 'Main.java');
        const javaCode = code.replace(/class\s+\w+/, 'class Main');
        fs.writeFileSync(filePath, javaCode);
        command = `javac ${filePath} && java -cp ${__dirname} Main`; // Corrected to use template literals
        break;

      case 'javascript':
        filePath = path.join(__dirname, 'temp_code.js');
        fs.writeFileSync(filePath, code);
        command = `node ${filePath}`; // Corrected to use template literals
        break;

      default:
        return res.status(400).send('Unsupported language');
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).send(stderr || 'Error executing code');
      }
      res.send(stdout);
    });
  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err.message}`); // Corrected error message formatting
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Corrected to use template literals
});
