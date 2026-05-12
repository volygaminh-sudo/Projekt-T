const fs = require('fs');
let css = fs.readFileSync('c:/Users/Admin/Desktop/Projekt-T/index/style.css', 'utf8');
css = css.replace(/\.page-content\s*\{[\s\S]*?\}/, '.page-content {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    min-height: 100vh;\n    padding-top: 80px;\n}');
css = css.replace(/\.home-hero\s*\{[\s\S]*?\}/, '.home-hero {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    padding: 0 20px;\n    width: 100%;\n}');
fs.writeFileSync('c:/Users/Admin/Desktop/Projekt-T/index/style.css', css);
