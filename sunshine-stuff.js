var { spawn } = require('child_process');
const { shell, app } = require('electron');

const url = 'https://localhost:47990/api';

// const exePath_release = "./extraResources/Sunshine";
const exePath_release = "./resources/extraResources/Sunshine";

var childProcess;

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
        stdio: 'pipe', // Use 'ignore' to keep the .exe file open in the background
        cwd: exePath_release,
    };

    var sunshineStarted = false;
    let sunshinePromise = new Promise(function(success, failure) {

        var installVIGembus = false;

        childProcess = spawn("sunshine", args, options_release)
            
        childProcess.stdout.on('data', (data) => {

            console.log(`${data}`);

            let string = String(data);
            if(string.includes("Registered Sunshine mDNS service")) {
                success("Neon Controller Host Started!");
                sunshineStarted = true;
            }
        });

        setTimeout(function() {

            if(!sunshineStarted) {
                failure("Unable to Start Neon Host. Try reinstalling the application.");
            }

        }, 30000);
    });


    return sunshinePromise

}

function End_Sunshine() {
    if(childProcess != null) {
        childProcess.kill();
    }
}

async function Connect_With_Pin(pin) {

    if(pin.length != 4) {
        showFloatingMessage("ERROR: expected pair code to be length 4");

        return
    }

    let b = JSON.stringify({ pin: pin });

    return fetch(url + '/pin', { method: "POST", body: b })
        

}