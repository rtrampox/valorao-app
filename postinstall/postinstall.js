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
            console.log('Detected Unix-like OS');
            const shScriptPath = path.join(__dirname, 'postinstall.sh');
            const bashScriptPath = path.join(__dirname, 'postinstall.bash');

            let shellCommand;

            try {
                execSync('which bash', { stdio: 'ignore' });
                console.log('Bash detected');
                shellCommand = 'bash';
            } catch (error) {
                console.log('Bash not found, falling back to sh');
                shellCommand = 'sh';
            }

            if (shellCommand === 'bash' && fs.existsSync(bashScriptPath)) {
                execSync(`${shellCommand} "${bashScriptPath}"`, { stdio: 'inherit' });
            } else if (fs.existsSync(shScriptPath)) {
                execSync(`${shellCommand} "${shScriptPath}"`, { stdio: 'inherit' });
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