let score = 0;
let lives = 3;
let current = 0;
let questions = [];
let gameOver = false;
let player;

async function startQuiz() {
    score = 0;
    lives = 3;
    current = 0;
    questions = [];
    gameOver = false;

    showCurrentPlayer();

    document.getElementById("score").innerHTML = score;
    document.getElementById("lives").innerHTML = lives;

    const response = await fetch("data/questions/questions.xml");
    const text = await response.text();
    const xml = new DOMParser().parseFromString(text, "application/xml");
    questions = Array.from(xml.querySelectorAll("question"));
    showQuestion();
}

function showQuestion() {
    const container = document.getElementById("quiz");


    if (current >= questions.length) {
        updateProgressBar();
        displayDone();
        return;
    }
    updateProgressBar();
    showCategory();

    const q = questions[current];
    container.innerHTML = "";

    container.innerHTML += `<p id="questionHeader">${q.querySelector("text").textContent}</p>`;

    const answerGrid = document.createElement("div");
    answerGrid.className = "answerGrid";

    for (const a of q.querySelectorAll("answer")) {
        const div = document.createElement("div");
        div.className = "answer";
        div.textContent = `${a.getAttribute("id").toUpperCase()}. ${a.textContent}`;

        if (a.getAttribute("correct") === "yes") {
            div.onclick = () => {
                updateScore(Number(q.querySelector("points").textContent));
                current++;
                showQuestion();
            };
        }
        else {
            div.onclick = () => {
                updateLives(-1);
                if (gameOver) return;
                current++;
                showQuestion();
            };
        }

        answerGrid.appendChild(div);
    }
    container.appendChild(answerGrid);
}

function updateScore(points) {
    score += points;
    document.getElementById("score").innerHTML = score;
}

function updateLives(num) {
    lives += num;
    document.getElementById("lives").innerHTML = lives;
    if (lives <= 0) setGameOver();
}

function setGameOver() {
    gameOver = true;
    score = 0;
    const container = document.getElementById("quiz");
    container.innerHTML = '<h1> Game Over!</h1><br> <button onclick="startQuiz()"> Brave enough to try again? </button>'
}

function showCurrentPlayer() {

    const id = localStorage.getItem('chosenPlayer');
    
    document.getElementById("player").textContent = id.replace(/_/g, ' ');

    const imgSrc = `media/players/${id.replace(/_/g, '').toLowerCase()}.jpeg`;
    document.getElementById('player-img').src = imgSrc;
}

function showCategory(){
    const q = questions[current];
    const category = q.parentNode.getAttribute("name");
    document.getElementById("category").innerHTML = category;
}

function updateProgressBar() {
    const percent = (current / questions.length) * 100;
    document.getElementById("progressFill").style.width = percent + "%";
}

function displayDone() {
    const container = document.getElementById("quiz");
    container.innerHTML = `
        <div class="doneDisplay">
            <h3 id="quizDoneHeader">Quiz finished! Congratulations!</h3>
            <h3 id="endScoreDisplay">Your Score: ${score}</h3>
        </div>
    `;
}


startQuiz();