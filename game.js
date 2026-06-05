let score = 0;
let lives = 3;
let current = 0;
let questions = [];
let gameOver = false;
let player;

const soundCorrect = new Audio("media/audio/rightanswer.mp3");
const soundWrong   = new Audio("media/audio/wronganswer.mp3");
const gameOverSound = new Audio("media/audio/gameover.mp3");

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
                soundCorrect.currentTime = 0;
                soundCorrect.play();
                updateScore(Number(q.querySelector("points").textContent));
                current++;
                showQuestion();
            };
        }
        else {
            div.onclick = () => {
                soundWrong.currentTime = 0;
                soundWrong.play(); 
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
    gameOverSound.currentTime = 0;
    gameOverSound.play();
    score = 0;
    const container = document.getElementById("quiz");
    container.innerHTML = '<div id = "gameOverBox"><h1> Game Over!</h1><br> <button id = "restartButton" onclick="startQuiz()"> Brave enough to try again? </button></div>'
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
            <button id = "restartButton" onclick="startQuiz()"> Play again? </button>
        </div>
    `;
    launchConfetti();
}

function launchConfetti() {
    const canvas = document.createElement("canvas");
    canvas.id = "confetti-canvas";
    canvas.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        pointer-events: none;
        z-index: 999;
    `;
    document.body.appendChild(canvas);
 
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
 
    
    const colors = ["#46d659", "#ac0f0f", "#2b2eda", "#f1df36", "#9d28fd", "#1ce4eb"];
 
 const pieces = Array.from({ length: 160 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,         // start above screen
        w: 8 + Math.random() * 10,
        h: 5 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 2 + Math.random() * 4,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.15,
        drift: (Math.random() - 0.5) * 1.5,
    }));
 
    let frame;
    let elapsed = 0;
    const fadeStart = 4000; 
    let last = performance.now();
 
    function draw(now) {
        elapsed += now - last;
        last = now;
 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
 
        let anyVisible = false;
 
        for (const p of pieces) {
            if (p.done) continue;
 
            p.y += p.speed;
            p.x += p.drift;
            p.angle += p.spin;
 
            if (elapsed < fadeStart) {
                // active phase: wrap pieces back to top to keep it dense
                if (p.y > canvas.height + 20) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }
            } else {
                //wind-down phase — let pieces fall off the bottom for good
                if (p.y > canvas.height + 20) {
                    p.done = true;
                    continue;
                }
            }
 
            anyVisible = true;
 
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        }
 
        //keep animating until every last piece has fallen off screen
        if (elapsed < fadeStart || anyVisible) {
            frame = requestAnimationFrame(draw);
        } else {
            cancelAnimationFrame(frame);
            canvas.remove();
        }
    }
 
    frame = requestAnimationFrame(draw);
}


startQuiz();