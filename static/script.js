// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.continuous = false; // Ensures it captures a full sentence

// Text-to-Speech
const synth = window.speechSynthesis;

// Get Elements
const inputField = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const micButton = document.getElementById("mic-btn");
const chatBox = document.getElementById("chat-box");
const statusIndicator = document.getElementById("status-indicator");

const flashcardsContainer = document.getElementById("flashcards");
const addFlashcardButton = document.getElementById("addFlashcard");

let flashcards = []; // Store flashcards

// Send Message Function
function sendMessage() {
    let message = inputField.value.trim();
    if (message === "") return;

    appendMessage("You", message);
    inputField.value = "";

    fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        appendMessage("AI Tutor", data.response);
        speak(data.response);
    });
}

// Append Message to Chat
function appendMessage(sender, message) {
    let messageElement = document.createElement("div");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 🎤 Speech Recognition - Fix Listening Issue 🎤
micButton.addEventListener("click", () => {
    statusIndicator.innerText = "🎙️ Listening...";
    statusIndicator.style.color = "red"; // Indicate active listening
    recognition.start();
});

// When Speech is Recognized
recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript;
    inputField.value = spokenText;
    sendMessage(); // Auto-send message after speaking
    statusIndicator.innerText = ""; // Remove "Listening..." after input is captured
};

// Ensure Recognition Starts Properly
recognition.onspeechend = () => {
    recognition.stop();
};

// Handle Errors Properly
recognition.onerror = (event) => {
    console.error("Speech Recognition Error:", event.error);
    if (event.error === "no-speech") {
        statusIndicator.innerText = "⚠️ No speech detected. Try again.";
    } else if (event.error === "audio-capture") {
        statusIndicator.innerText = "⚠️ Microphone not detected. Check settings.";
    } else {
        statusIndicator.innerText = "⚠️ Error: " + event.error;
    }
    statusIndicator.style.color = "orange";
};

// Text-to-Speech
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    synth.speak(utterance);
}

// 📌 Fix: Flashcard Functionality Restored 📌
addFlashcardButton.addEventListener("click", () => {
    const text = prompt("Enter the concept or term to remember:");
    if (text) {
        flashcards.push(text);
        displayFlashcards();
    }
});

function displayFlashcards() {
    flashcardsContainer.innerHTML = "";
    flashcards.forEach((card, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("flashcard");
        cardDiv.innerText = card;
        cardDiv.addEventListener("click", () => alert(`Definition: ${card}`));
        flashcardsContainer.appendChild(cardDiv);
    });
}

// Enter Key to Send Message
inputField.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
