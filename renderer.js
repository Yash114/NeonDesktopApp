const { ipcMain } = require('electron');
const os = require('os')

var SunshineStatus = false;

const button = document.getElementById("connect");
const floatingMessage = document.getElementById("floatingMessage");
const pinInputField = document.getElementById("pinInput");

const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

const IPField = document.getElementById("ip_display");
const computerField = document.getElementById("computer_display");

let connect_to_mobile = false

const nextButtonMessages = ["Start Host " + String.fromCharCode(10095), "Done " + String.fromCharCode(10095)]

button.addEventListener("click", Connect);

function showFloatingMessage(text) {
    floatingMessage.textContent = text;
    floatingMessage.classList.add("show");
    setTimeout(function () {
        floatingMessage.classList.remove("show");
    }, 3000); // Hide the message after 3 seconds (adjust as needed)
}


function VerifySunshineConnection() {

    Verify_Connection()
        .then(response => {

            if(response.ok) {
                showFloatingMessage("Neon or Sunshine Host Already Found");
            } else  {
                showFloatingMessage("Starting Neon Host...");

                Start_Sunshine()
                .then(response => {
                    showFloatingMessage(response);
                },  response => {
                    showFloatingMessage(response);
                })
            }

        })
        .catch(err => {
            showFloatingMessage("Starting Neon Host...");

            console.log(err);              

            Start_Sunshine()
                .then(response => {
                    showFloatingMessage(response);
                },  response => {
                    showFloatingMessage(response);
                })
        })

    //Gets the computer IP
    fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => IPField.textContent = "IP Address: " + data.ip);

    //Gets the computer name
    computerField.textContent = "PC Name: " + os.hostname();

}



function Connect() {
    Connect_With_Pin(pinInputField.value.toString())
        .then(response => response.json())
        .then(response => {
            console.log(response);

            if (response.status.toString().toLowerCase() === "true") {
                showFloatingMessage("Mobile device paired successfully!");
                connect_to_mobile = true
                nextButton.style.backgroundColor = "#2BFF00"
            } else {
                showFloatingMessage("ERROR: Mobile device pair FAIL!");
            }

        })
        .catch(error => {
            console.log(error);              
            showFloatingMessage("ERROR: Mobile device pair FAIL!");
        })

}

let slideIndex = 0;
let i;
let slides = document.getElementsByClassName("mySlides");
let dots = document.getElementsByClassName("dot");


showSlides(slideIndex);

function incrementSide(){

    
    if(slideIndex == 0 && !connect_to_mobile) {
        VerifySunshineConnection();
    }

    if(slideIndex == 1) {
        if(!connect_to_mobile) {
            showFloatingMessage("Please connect to your mobile device first");
        }
    }

    slideIndex += 1
    showSlides(slideIndex)

}

function decrementSide(){
    slideIndex -= 1
    showSlides(slideIndex)
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {

    prevButton.style.display = n == 0 ? 'none' : 'block';
    nextButton.style.display = n == 2 ? 'none' : 'block';

    nextButton.textContent = nextButtonMessages[n > 2 ? 2 : n]

    if(slideIndex == 1 && !connect_to_mobile) {
        nextButton.style.backgroundColor = "#717171"
    } else {
        nextButton.style.backgroundColor = "#2BFF00"
    }

    if(slideIndex + n > slides.length + 1 || slideIndex + n < 0) {
        return;
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for(i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex].style.display = "block";
    dots[slideIndex].className += " active";
}

const path = require('path');

const script_path = "./resources/extraResources/Sunshine/scripts";
// const script_path = "./extraResources/Sunshine/scripts";

function installVigembus() {

    childProcess = spawn("install-vigembus.bat", [], {
        detached: true,
        stdio: 'ignore', // Use 'ignore' to keep the .exe file open in the background
        cwd: script_path,
    });
}

const { ipcRenderer } = require('electron');

ipcRenderer.on('message', (event, arg) => {
    console.log('Renderer Process received a response:', arg);
    // Handle the response
  });


  ipcRenderer.on('version', (event, arg) => {
    document.getElementById("version").textContent = "Neon Controller" + arg;
  }); 
