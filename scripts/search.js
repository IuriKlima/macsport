const fs = require('fs');
const path = require('path');

function searchFiles(dir, text) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === '.next') continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      searchFiles(filePath, text);
    } else {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.toLowerCase().includes(text.toLowerCase())) {
          console.log(filePath);
        }
      } catch (e) {}
    }
  }
}

searchFiles(path.join(__dirname, '..', 'src'), 'servidor interno validado');
