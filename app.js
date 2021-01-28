document.addEventListener("DOMContentLoaded", () => {
  toggleView("dashboard");
  createHallOfFame();
});


const currentPlayer = document.querySelectorAll(".current-player");
currentPlayer.forEach( player => {
  player.innerHTML = localStorage.getItem("current-player") ? localStorage.getItem("current-player") : "Guest";
})

const square = document.querySelectorAll(".square");
const mole = document.querySelectorAll(".mole");
const timeLeft = document.querySelector("#time-left");
let score = document.querySelector("#score");
let gameNumberDisplay = document.querySelector("#game-number");

//setting up implementing game number increment
let gameNumber = localStorage.getItem("gameNumber") ? localStorage.getItem("gameStorage") : 0;
gameNumberDisplay = gameNumber;

//Improvements needed:
// Quicken pace of mole throughout game, add alerts to speed changes
// Store number of games played in local storage; increment on start game; reset on new player
// Improve gameboard appearance
// Reformat project into more advanced MVC structure
// Make display responsive
// Adding some implementation of async features
// Refactor/reorganize code


let result = 0;
let currentTime = 0;
let speed = 1000;
var ouch = new Audio("sounds/ouch.wav");

//Game Logic
function randomSquare() {
  //clear all squares
  square.forEach(className => {
    className.classList.remove("mole")
  })
  //then add the mole at a random position
  let randomPosition = square[Math.floor(Math.random()*9)];
  randomPosition.classList.add("mole");
  //assign the id of the random position to the hit position for us to use later
  hitPosition = randomPosition.id;
}

square.forEach( square => {
  //mouseup refers to hitting an element with the mouse
  //here it means if the id of the div we hit, checking it against hit position
  square.addEventListener("mouseup", () => {
    if(square.id === hitPosition) {
      ouch.play();
      result = result+1;
      score.textContent = result;
    }
  })
})

function runGame() {
  let timerID = null;
  randomSquare();
  countDown();
}

function newGame() {
  currentTime = 6;
  result = 0;
  score.textContent=0;
  timerID = setInterval(runGame, 1000);
  // checkHighScore(result);
}

function endGame() {
  localStorage.setItem("result", result);
  console.log("inside endgame final score is", result);
  console.log("from local storage is", localStorage.getItem("result"));
  result = 0;
  clearInterval(timerID);
  console.log("inside endgame, cleared timerId");
  console.log("inside endgame, cleared result, now is", result);
}


// //things that need to happen after game runs
// function clearGame() {
//   console.log("entered clear game");
//   result = 0;
//   score.textContent = result;
// }

// function countDown() {
//     currentTime--;
//     timeLeft.textContent = currentTime;
//     if (currentTime < 0) {
//       clearInterval(timerID);
//       alert("Game Over! Your final score is " + result);
//       }
//     localStorage.setItem("result", result);
// }

function countDown() {
  currentTime--;
  timeLeft.textContent = currentTime;
  if(currentTime < 1) {
    clearInterval(timerID);
    localStorage.setItem("result", result);
    result = 0;
    checkHighScore(localStorage.getItem("result"));
    // createHallOfFame();
    toggleView("game-over");
  }
}

function checkHighScore(score) {
  //if there are no scores currently in local storage, create object
  let userName = localStorage.getItem("current-player") ? localStorage.getItem("current-player") : "Guest";
  let result = localStorage.getItem("result");
  if (!localStorage.getItem("highScores")) {
    let highScoreArray = [ {name: userName, score: result} ];
    localStorage.setItem("highScores", JSON.stringify(highScoreArray));
  } else {
    //else we have some scores already and we will need to order them
    let highScoreArray = JSON.parse(localStorage.getItem("highScores") || "[]");
    highScoreArray.push({name: userName, score: result});
    highScoreArray.sort( (a, b) => {
      return b.score - a.score;
    })
    if (highScoreArray.length>5) {
      //then we need to bump the lowest score off (currently ordered greatest to least)
      //pop the lowest score off the end of the highScoreArray
      highScoreArray.pop();
    }
    //now resave this to localStorage
    localStorage.setItem("highScores", JSON.stringify(highScoreArray));
    }
  createHallOfFame();
  // score.textContent = 0;
  // result = 0;
}

//display of the highScores in the hall of fame
function createHallOfFame() {
  console.log("inside create hall of fame");
  const hallOfFame = JSON.parse(localStorage.getItem("highScores") || "[]");
  hallOfFame.sort( (a,b) => {
    return b.value-a.value;
  })
  for (let i=1; i<hallOfFame.length+1; i++) {
    let highScore = hallOfFame[i-1];
    document.getElementById(`high-score-${i}`).textContent = `Name: ${highScore.name}, Score: ${highScore.score}`;
  }
}


//logic for dashboard
const nameInputs = document.querySelectorAll(".new-player");
const dashboard = document.getElementById("dashboard");

const changePlayerButton = document.getElementById("change-player");
changePlayerButton.addEventListener( "click", () => {
  nameInputs.forEach(item => {
    item.classList.toggle("hide");
  });
})

const submitPlayerButton = document.getElementById("submit-player");
submitPlayerButton.addEventListener("click", () => {
  let newPlayer = document.getElementById("inputName").value;
  if (newPlayer === "") { newPlayer = "Guest"};
  localStorage.setItem("current-player", newPlayer);
  currentPlayer.forEach( player => {
    player.innerHTML = localStorage.getItem("current-player");
  })
  document.getElementById("inputName").value = null;
  nameInputs.forEach(item => {
    item.classList.toggle("hide");
  })
})

const endButton = document.getElementById("end-game");
endButton.addEventListener("click", () => {
  endGame();
  toggleView('game-over');
})

function toggleView(activeView) {
  views = document.querySelectorAll(".tabcontent");
  views.forEach( view => view.classList.contains("hide") ? "" : view.classList.add("hide"));
  document.getElementById(activeView).classList.toggle("hide");
  if (activeView === "hall-of-fame") {
    createHallOfFame();
  }
  if (activeView === "game-over") {
    score.textContent = 0;
    console.log("inside toggle view testing cleared result", result);
    document.getElementById("final-score").textContent = localStorage.getItem("result");
    document.getElementById("final-player").textContent = localStorage.getItem("current-player");
  }
  if (activeView === "active-game") {
    newGame();
  }
}
