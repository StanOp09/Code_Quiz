// Initially define all constant variables
const startButton = document.getElementById('start-btn');
const backButton = document.getElementById('back-btn');
const refreshButton = document.getElementById('refresh-btn');
const questionContainer = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');
const scoreForm = document.getElementById('score-form');
const initialsInput = document.getElementById('initials');
const highscoresLink = document.getElementById('highscores-link');
const highscoresList = document.getElementById('highscores-list');
const timerElement = document.getElementById('timer');
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 60; // 1 minute in seconds
let timerId;

// Define an array of questions and options
const questions = [
  {
    question: "What is the name of the 12th element of the periodic table?",
    options: ["1. Hydrogen", "2. Oxygen", "3. Carbon", "4. Nitrogen"],
    answer: 2 // Index of the correct answer in the options array
  },
  {
    question: "What is responsible for the green color in plant leaves?",
    options: ["1. Nectar", "2. Chlorophyll", "3. Sepal", "4.Petal"],
    answer: 1
  },
  {
    question: "Which team won the 2022-2023 NBA finals?",
    options: ["1. Denver Nuggets", "2. New York Knicks", "3. Miami Heat", "4. Los Angeles Lakers"],
    answer: 0
  },
  {
    question: "Which Canadian Province is known for oil?",
    options: ["1. Ontario", "2. Alberta", "3. British Columbia", "4. Halifax"],
    answer: 1
  },
];

// Define clickable buttons
startButton.addEventListener('click', startQuiz);
backButton.addEventListener('click', goBack);
refreshButton.addEventListener('click', refreshHighScores);
scoreForm.addEventListener('submit', storeScore);
highscoresLink.addEventListener('click', showHighScores);

// Define function of start quiz button 
function startQuiz() {
  startButton.style.display = 'none';
  backButton.style.display = 'none';
  refreshButton.style.display = 'none';
  questionContainer.style.display = 'block';
  timerElement.style.display = 'block';
  showQuestion(currentQuestionIndex);
  startTimer();
}

// Set time interval to 1 minute
function startTimer() {
  timerId = setInterval(updateTimer, 1000);
}

// Automatically start countdown from 60 seconds
function updateTimer() {
  timerElement.innerText = `Time Left: ${timeLeft}s`;
  timeLeft--;

  if (timeLeft < 0) {
    clearInterval(timerId);
    showResult();
  }
}

// Function to show questions
function showQuestion(index) {
  const question = questions[index];
  const { question: questionText, options } = question;
  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');

  questionElement.innerText = questionText;
  optionsElement.innerHTML = '';

  options.forEach((option, i) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.innerText = option;
    button.classList.add('option');
    button.addEventListener('click', () => selectOption(i));
    li.appendChild(button);
    optionsElement.appendChild(li);

    if (i === options.length - 1) {
      const hr = document.createElement('hr');
      optionsElement.appendChild(hr);
    }
  });
}

// Function to make a choice from list of options
function selectOption(selectedOptionIndex) {
  const question = questions[currentQuestionIndex];
  const isCorrect = selectedOptionIndex === question.answer;

  if (isCorrect) {
    score++;
  } else {
    timeLeft -= 10; // Penalty of 10 seconds for wrong answer
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion(currentQuestionIndex);
  } else {
    clearInterval(timerId);
    showResult();
  }

  // Show the result of the selected option
  showOptionResult(isCorrect);
}

// Print Correct on Wrong based on user response
function showOptionResult(isCorrect) {
  const optionsElement = document.getElementById('options');
  const resultText = document.createElement('p');
  resultText.innerText = isCorrect ? 'Correct' : 'Wrong';
  optionsElement.appendChild(resultText);

  setTimeout(() => {
    resultText.remove();
  }, 4000);
}

// Indicate correct answer count
function showResult() {
  questionContainer.style.display = 'none';
  resultContainer.style.display = 'block';
  const resultElement = document.getElementById('result');
  resultElement.innerText = `Your score: ${score}/${questions.length}`;

  scoreForm.style.display = 'block';
  backButton.style.display = 'inline-block';
}

// Store scores in high score function
function storeScore(e) {
  e.preventDefault();
  const initials = initialsInput.value.trim();
  const highscores = getHighScoresFromStorage();
  highscores.push({ initials, score });
  saveHighScoresToStorage(highscores);
  initialsInput.value = ''; // Clear the initials input
  scoreForm.style.display = 'none';
  refreshButton.style.display = 'inline-block';
}

function getHighScoresFromStorage() {
  const highscores = JSON.parse(localStorage.getItem('highscores')) || [];
  return highscores;
}

function saveHighScoresToStorage(highscores) {
  localStorage.setItem('highscores', JSON.stringify(highscores));
}

function showHighScores() {
  const highscores = getHighScoresFromStorage();
  highscoresList.innerHTML = ''; // Clear previous high scores

  highscores.sort((a, b) => b.score - a.score); // Sort high scores by score in descending order

  highscores.forEach(({ initials, score }) => {
    const listItem = document.createElement('li');
    listItem.innerText = `${initials}: ${score}`;
    highscoresList.appendChild(listItem);
  });

  // Show the high scores page and hide other elements
  startButton.style.display = 'none';
  questionContainer.style.display = 'none';
  resultContainer.style.display = 'none';
  scoreForm.style.display = 'none';
  highscoresLink.style.display = 'none';
  highscoresList.style.display = 'block';
  backButton.style.display = 'inline-block';
}

function goBack() {
  startButton.style.display = 'block';
  backButton.style.display = 'none';
  refreshButton.style.display = 'none';
  questionContainer.style.display = 'none';
  resultContainer.style.display = 'none';
  scoreForm.style.display = 'none';
  highscoresLink.style.display = 'inline-block';
  highscoresList.style.display = 'none';
  clearInterval(timerId);
  timeLeft = 60;
  timerElement.innerText = '';
  currentQuestionIndex = 0;
  score = 0;
}

function refreshHighScores() {
  highscoresList.innerHTML = ''; // Clear the existing high scores

  // Clear the high scores in the storage
  localStorage.removeItem('highscores');

  // Retrieve the updated high scores (empty list)
  const highScores = getHighScoresFromStorage();

  highScores.forEach(({ initials, score }) => {
    const listItem = document.createElement('li');
    listItem.innerText = `${initials}: ${score}`;
    highscoresList.appendChild(listItem);
  });
}
