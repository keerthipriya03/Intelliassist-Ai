const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-ip");
const sendBtn = document.getElementById("send-btn");

const BACKEND_URL = "http://localhost:5000/api/chat";

window.onload = () => {
    const savedChat = localStorage.getItem("chatHistory");
    if (savedChat) {
        chatBox.innerHTML = savedChat;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
};

function addMessage(message, className) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", className);
    msgDiv.textContent = message;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot-mess");
    typingDiv.textContent = "AI is typing...";
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingDiv;
}

async function getBotReply(userMess) {
    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMess }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Backend Error:", data);
            return data?.error || "Error fetching response.";
        }

        return data.reply || "Sorry, I couldn't get that.";
    } catch (error) {
        console.error(error);
        return "Something went wrong. Is the server running?";
    }
}

sendBtn.addEventListener("click", async () => {
    const message = userInput.value.trim();
    if (message === "") return;

    addMessage(message, "user-mess");
    userInput.value = "";

    const typingDiv = showTyping();
    const botReply = await getBotReply(message);
    typingDiv.remove();

    addMessage(botReply, "bot-mess");
    localStorage.setItem("chatHistory", chatBox.innerHTML);
});

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
});