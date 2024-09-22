let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

function speak(text) {
    let textToSpeak = new SpeechSynthesisUtterance(text);
    let voices = window.speechSynthesis.getVoices();
    
    // Select a female voice
    let femaleVoice = voices.find(voice => voice.lang.includes("en") && voice.name.includes("Female"));
    
    if (femaleVoice) {
        textToSpeak.voice = femaleVoice;
    }
    
    textToSpeak.lang = "hi-GB";  // Adjust this for other languages if needed
    textToSpeak.volume = 1;
    textToSpeak.rate = 1;
    textToSpeak.pitch = 1;
    window.speechSynthesis.speak(textToSpeak);
}

function wishMe() {
    let date = new Date();
    let hour = date.getHours();
    if (hour < 12) {
        speak("Good Morning, How can I help you?");
    } else if (hour < 18) {
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
recognition.onresult = function(event) {
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

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Main Command Handling Function
function takeCommand(message) {
    btn.style.display = "flex";
    voice.style.display = "none";

    // Ethical constraint logic
    let inappropriateWords = ["porn", "vulgar", "nude", "violence", "harm", "drugs"];
    let isInappropriate = inappropriateWords.some(word => message.includes(word));

    if (isInappropriate) {
        speak("I am sorry, I cannot assist with that request.");
        return;
    }

    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
        speak("Hello, How can I help you?");
    } else if (message.includes("how are you")) {
        speak("I am fine, Thank you. How can I help you?");
    } else if (message.includes("who are you") || message.includes("what is your name")) {
        speak("I am your Virtual Assistance, Shifra, created by Sandeep Sir.");
    } else if (message.includes("good morning")) {
        speak("Good Morning, How can I help you?");
    } else if (message.includes("good afternoon")) {
        speak("Good Afternoon, How can I help you?");
    } else if (message.includes("good evening")) {
        speak("Good Evening, How can I help you?");
    } else if (message.includes("good night")) {
        speak("Good Night, Sweet Dreams");

    // --- WEATHER FUNCTIONALITY ---
    } else if (message.includes("weather")) {
        let city = message.split("in")[1].trim();
        speak(`Fetching weather for ${city}...`);
        getWeather(city);

    // --- TASK MANAGEMENT ---
    } else if (message.includes("add task")) {
        let task = message.replace("add task", "").trim();
        addTask(task);
    } else if (message.includes("show tasks")) {
        getTasks();

    // --- ALARM FUNCTIONALITY ---
    } else if (message.includes("set alarm for")) {
        let time = message.replace("set alarm for", "").trim();
        let alarmTime = new Date(time);
        if (!isNaN(alarmTime.getTime())) {
            setAlarm(alarmTime);
        } else {
            speak("Invalid time. Please specify a valid time.");
        }

    // --- WIKIPEDIA SEARCH ---
    } else if (message.includes("search wikipedia for")) {
        let query = message.replace("search wikipedia for", "").trim();
        speak(`Searching Wikipedia for ${query}...`);
        searchWikipedia(query);

    // --- CURRENCY CONVERSION ---
    } else if (message.includes("convert")) {
        let [amount, fromCurrency, , toCurrency] = message.split(" ");
        convertCurrency(parseFloat(amount), fromCurrency.toUpperCase(), toCurrency.toUpperCase());

    // --- TIME, DATE, DAY ---
    } else if (message.includes("time")) {
        let time = new Date().toLocaleTimeString(undefined, {hour: 'numeric', minute: 'numeric'});
        speak(time);
    } else if (message.includes("date")) {
        let date = new Date().toLocaleDateString(undefined, {day: 'numeric', month: 'long', year: 'numeric'});
        speak(date);
    } else if (message.includes("day")) {
        let day = new Date().toLocaleDateString(undefined, {weekday: 'long'});
        speak(day);

    // --- DEFAULT SEARCH ---
    } else {
        let finaltext = "Let me search on Google " + message.replace("shifra", "");
        speak(finaltext);
        window.open(`https://www.google.com/search?q=${message.replace("shifra", "")}`, "_blank");
    }
}

// --- ADDITIONAL FUNCTIONS ---

// Weather Function (uses OpenWeather API)
function getWeather(city) {
    const apiKey = "671683d3d983f6cb05d6871a0c9f0ce8";
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            let weather = `It's currently ${data.weather[0].description} in ${city} with a temperature of ${data.main.temp}°C.`;
            speak(weather);
        })
        .catch(() => {
            speak("Sorry, I couldn't fetch the weather for that location.");
        });
}

// Add Task Function (saves tasks to local storage)
function addTask(task) {
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    speak(`Task added: ${task}`);
}

// Get Tasks Function
function getTasks() {
    if (tasks.length === 0) {
        speak("Your task list is empty.");
    } else {
        speak(`You have ${tasks.length} tasks.`);
        tasks.forEach((task, index) => {
            speak(`Task ${index + 1}: ${task}`);
        });
    }
}

// Set Alarm Function
function setAlarm(time) {
    let alarmTime = new Date(time);
    let currentTime = new Date();
    let timeToAlarm = alarmTime - currentTime;

    if (timeToAlarm > 0) {
        setTimeout(() => {
            speak("It's time!");
        }, timeToAlarm);
        speak(`Alarm set for ${alarmTime.toLocaleTimeString()}.`);
    } else {
        speak("The specified time has already passed.");
    }
}

// Wikipedia Search Function
function searchWikipedia(query) {
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.extract) {
                speak(data.extract);
            } else {
                speak("Sorry, I couldn't find any information on that.");
            }
        })
        .catch(() => {
            speak("Sorry, I couldn't connect to Wikipedia.");
        });
}

// Currency Conversion Function (uses Exchange Rate API)
function convertCurrency(amount, fromCurrency, toCurrency) {
    const apiKey = "29ac203100fc48ac120ef809";
    fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        .then(response => response.json())
        .then(data => {
            let rate = data.rates[toCurrency];
            if (rate) {
                let convertedAmount = (amount * rate).toFixed(2);
                speak(`${amount} ${fromCurrency} is equal to ${convertedAmount} ${toCurrency}.`);
            } else {
                speak("Sorry, I couldn't find the exchange rate for that currency.");
            }
        })
        .catch(() => {
            speak("Sorry, I couldn't fetch currency rates at the moment.");
        });
}
