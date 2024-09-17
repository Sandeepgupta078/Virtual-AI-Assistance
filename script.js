let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

function speak(text){
    let textToSpeak = new SpeechSynthesisUtterance(text);
    textToSpeak.lang = "hi-GB";
    textToSpeak.volume = 1;
    textToSpeak.rate = 1;
    textToSpeak.pitch = 1;
    window.speechSynthesis.speak(textToSpeak);

}

function wishMe(){
    let date = new Date();
    let hour = date.getHours();
    let wish = "";
    if(hour < 12){
        speak("Good Morning, How can I help you?");
    } else if(hour < 18){
        speak("Good Afternoon, How can I help you?");
    } else {
        speak("Good Evening, How can I help you?");
    }
}
window.addEventListener("load", () => {
    wishMe();
});

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();
recognition.onresult = function(event){
    let current = event.resultIndex;
    let transcript = event.results[current][0].transcript;
    content.innerText = transcript;
    console.log(event);
    takeCommand(transcript.toLowerCase());
}

btn.addEventListener("click", () => {
    recognition.start();
    btn.style.display = "none";
    voice.style.display = "block";
});

function takeCommand(message){
    btn.style.display = "flex";
    voice.style.display = "none";
    if(message.includes("hello") || message.includes("hi") || message.includes("hey")){
        speak("Hello, How can I help you?");
    } else if(message.includes("how are you")){
        speak("I am fine, Thank you. How can I help you?");
    } else if(message.includes("who are you") || message.includes("what is your name")){
        speak("I am your Virtual Assistance. Shifra, created by Sandeep Sir.")
    } else if(message.includes("good morning")){
        speak("Good Morning, How can I help you?");
    } else if(message.includes("good afternoon")){
        speak("Good Afternoon, How can I help you?");
    } else if(message.includes("good evening")){
        speak("Good Evening, How can I help you?");
    } else if(message.includes("good night")){
        speak("Good Night, Sweet Dreams");
    } else if(message.includes("open google")){
        speak("Opening Google...");
        window.open("https://www.google.com", "_blank");
    } else if(message.includes("open youtube")){
        speak("Opening Youtube...");
        window.open("https://www.youtube.com", "_blank");
    } else if(message.includes("open facebook")){
        speak("Opening Facebook");
        window.open("https://www.facebook.com", "_blank");
    } else if(message.includes("open instagram")){
        speak("Opening Instagram");
        window.open("https://www.instagram.com", "_blank");
    } else if(message.includes("open twitter")){
        speak("Opening Twitter");
        window.open("https://www.twitter.com", "_blank");
    } else if(message.includes("open linkedin")){
        speak("Opening LinkedIn");
        window.open("https://www.linkedin.com", "_blank");
    } else if(message.includes("open github")){
        speak("Opening GitHub");
        window.open("https://www.github.com", "_blank");
    } else if(message.includes("open stackoverflow")){
        speak("Opening StackOverflow");
        window.open("https://www.stackoverflow.com", "_blank");
    } else if(message.includes("open codepen")){
        speak("Opening CodePen");
        window.open("https://www.codepen.io", "_blank");
    } else if(message.includes("open jsfiddle")){
        speak("Opening JSFiddle");
        window.open("https://www.jsfiddle.net", "_blank");
    } else if(message.includes("open w3schools")){
        speak("Opening W3Schools");
        window.open("https://www.w3schools.com", "_blank");
    } else if(message.includes("open geeksforgeeks")){
        speak("Opening GeeksForGeeks");
        window.open("https://www.geeksforgeeks.org", "_blank");
    } else if(message.includes("open calculator")){
        speak("Opening Calculator");
        window.open("calculator://");
    } else if(message.includes("open whatsapp")){
        speak("Opening whatsapp");
        window.open("whatsapp://");
    } else if(message.includes("time")){
        let time = new Date().toLocaleTimeString(undefined, {hour: 'numeric', minute: 'numeric'});
        speak(time);
    } else if(message.includes("date")){
        let date = new Date().toLocaleDateString(undefined, {day: 'numeric', month: 'long', year: 'numeric'});
        speak(date);
    }
    else{
        let finaltext = "let me search on google " + message.replace("Shipra","")||message.replace("Shifra","");
        speak(finaltext);
        window.open(`https://www.google.com/search?q=${message.replace("shifra","")}`, "_blank");
    }
}