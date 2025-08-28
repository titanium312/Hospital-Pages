const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const dir = path.join(process.cwd(), 'public', 'pdfs');
  try {
    const files = fs.readdirSync(dir)
      .filter(f => /\.pdf$/i.test(f))
      .map(f => ({
        name: f.replace(/[-_]/g,' ').replace(/\.pdf$/i,''),
        file: f
      }));
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(files));
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'No se pudo leer /public/pdfs' }));
  }
};
