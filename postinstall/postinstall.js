const { execSync } = require('node:child_process');
const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');

function detectOSAndRunScript() {
    const isWindows = os.platform() === 'win32';
    
    try {
        if (isWindows) {
            console.log('Detected Windows OS');
            const psScriptPath = path.join(__dirname, 'postinstall.ps1');
            
            if (fs.existsSync(psScriptPath)) {
                // Run PowerShell script
                execSync(`powershell.exe -File "${psScriptPath}"`, { stdio: 'inherit' });
            } else {
                console.error(`PowerShell script not found: ${psScriptPath}`);
                console.log('Skipping postinstall script execution.');
            }
        } else {
            console.log('Detected Unix-like OS (assuming Bash)');
            const shScriptPath = path.join(__dirname, 'postinstall.sh');
            
            if (fs.existsSync(shScriptPath)) {
                // Run shell script
                execSync(`bash "${shScriptPath}"`, { stdio: 'inherit' });
            } else {
                console.error(`Shell script not found: ${shScriptPath}`);
                console.log('Skipping postinstall script execution.');
            }
        }
        console.log('Postinstall process completed');
    } catch (error) {
        console.error('Error during postinstall:', error.message);
    }
}

detectOSAndRunScript();