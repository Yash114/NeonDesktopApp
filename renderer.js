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

const nextButtonMessages = ["CONNECT PC " + String.fromCharCode(10095), "DONE " + String.fromCharCode(10095)]

button.addEventListener("click", Connect);


function showFloatingMessage(text) {
    floatingMessage.textContent = text;
    floatingMessage.classList.add("show");
    setTimeout(function () {
        floatingMessage.classList.remove("show");
    }, 3000); // Hide the message after 3 seconds (adjust as needed)
}



function VerifySunshineConnection() {

    //Gets the computer IP
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => IPField.textContent = data.ip);

    //Gets the computer name
    computerField.textContent = os.hostname();


    Verify_Connection()
        .then(response => {
            if(!response.ok) {
                Start_Sunshine()
                    .on('error', (error) => {
                        showFloatingMessage("Unable to start server");
                    });
            }
        })
        .catch(err => {
            Start_Sunshine()
                .on('error', (error) => {
                    showFloatingMessage("Unable to start server");
                });
        })

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

    if(slideIndex == 1 && !connect_to_mobile) {
        showFloatingMessage("Please connect to your mobile device first");
    } else {
        slideIndex += 1
        showSlides(slideIndex)
    }


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
