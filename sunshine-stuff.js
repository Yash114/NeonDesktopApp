var { spawn } = require('child_process');

const url = 'https://localhost:47990/api';

// const exePath_release = "./extraResources/Sunshine";
const exePath_release = "./resources/extraResources/Sunshine";


async function Verify_Connection() {
    return fetch(url + "/")
}

function Get_Connections() {
    
    fetch(url + '/clients', { method: "GET"})
            .then(response => response)
            .then(response => {
                console.log(response);

            })
            .catch(error => {
                console.log(error);              
            })
}

function Start_Sunshine() {
    const args = []; // Replace these with the arguments your .exe file requires

    const options_release = {
        detached: true,
        stdio: 'ignore', // Use 'ignore' to keep the .exe file open in the background
        cwd: exePath_release,
    };

    childProcess = spawn("sunshine", args, options_release)
      
    // childProcess.unref(); // This allows the .exe file to keep running even after the parent process exits
  
    childProcess.stdout.on('data', (data) => {
        console.log(`stdout from ${i}: ${data}`);
    });
        
    childProcess.stderr.on('data', (data) => {
      console.error(`stderr from ${i}: ${data}`);
    });

    return childProcess

}

async function Connect_With_Pin(pin) {

    if(pin.length != 4) {
        showFloatingMessage("ERROR: expected pair code to be length 4");

        return
    }

    let b = JSON.stringify({ pin: pin });

    return fetch(url + '/pin', { method: "POST", body: b })
        

}