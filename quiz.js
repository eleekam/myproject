// IT 3203 Milestone 2: Quiz functionality
// Each question has a correct answer and an explanation for the results page.
const answerKey = [
  { name: 'q1', type: 'text', answers: ['hypertext transfer protocol'], correct: 'Hypertext Transfer Protocol', explanation: 'HTTP stands for Hypertext Transfer Protocol.' },
  { name: 'q2', type: 'radio', answer: 'b', correct: 'TLS', explanation: 'HTTPS uses TLS to help secure communications.' },
  { name: 'q3', type: 'text', answers: ['443'], correct: '443', explanation: 'HTTPS commonly uses port 443 by default.' },
  { name: 'q4', type: 'radio', answer: 'c', correct: '80', explanation: 'HTTP commonly uses port 80 by default.' },
  { name: 'q5', type: 'checkbox', answers: ['a', 'c'], correct: 'The first and third options', explanation: 'HTTPS protects information in transit, but does not guarantee a site is trustworthy.' },
  { name: 'q6', type: 'radio', answer: 'a', correct: 'A request', explanation: 'The browser sends an HTTP request to the web server.' },
  { name: 'q7', type: 'radio', answer: 'c', correct: '404', explanation: '404 means the requested resource was not found.' },
  { name: 'q8', type: 'radio', answer: 'b', correct: 'GET', explanation: 'GET requests a resource from a server.' },
  { name: 'q9', type: 'radio', answer: 'a', correct: "The website's identity", explanation: 'A certificate helps verify which website a browser is connecting to.' },
  { name: 'q10', type: 'radio', answer: 'b', correct: 'HTTPS adds a protected connection using TLS', explanation: 'HTTPS is HTTP over a TLS-protected connection.' }
];

const quizForm = document.getElementById('quizForm');
const timerDisplay = document.getElementById('timer');
const results = document.getElementById('results');
const submitButton = document.getElementById('submitButton');
const totalSeconds = 10 * 60;
let secondsLeft = totalSeconds;
let quizFinished = false;

// Display minutes and seconds with leading zeros.
function formatTime(total) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return minutes + ':' + String(seconds).padStart(2, '0');
}

function updateTimer() {
  timerDisplay.textContent = 'Time left: ' + formatTime(secondsLeft);
  if (secondsLeft <= 60) timerDisplay.classList.add('warning');
  else timerDisplay.classList.remove('warning');
}

// Start the countdown as soon as the quiz page loads.
let timerInterval = setInterval(function () {
  if (quizFinished) return;
  secondsLeft--;
  updateTimer();
  if (secondsLeft <= 0) finishQuiz(true);
}, 1000);

// Find the user's answer(s) and compare them with the answer key.
function checkAnswer(question) {
  if (question.type === 'text') {
    const input = document.querySelector('[name="' + question.name + '"]');
    const value = input.value.trim().toLowerCase().replace(/\s+/g, ' ');
    return question.answers.includes(value);
  }
  if (question.type === 'checkbox') {
    const selected = Array.from(document.querySelectorAll('[name="' + question.name + '"]:checked'))
      .map(function (item) { return item.value; }).sort();
    const correct = question.answers.slice().sort();
    return selected.length === correct.length && selected.every(function (value, i) { return value === correct[i]; });
  }
  const selected = document.querySelector('[name="' + question.name + '"]:checked');
  return selected !== null && selected.value === question.answer;
}

// Show score, pass/fail, time taken and a result for every question.
function finishQuiz(timeExpired) {
  if (quizFinished) return;
  quizFinished = true;
  clearInterval(timerInterval);
  const secondsUsed = totalSeconds - secondsLeft;
  let score = 0;
  const questionResults = document.getElementById('questionResults');
  questionResults.innerHTML = '';

  answerKey.forEach(function (question, index) {
    const correct = checkAnswer(question);
    if (correct) score++;
    const item = document.createElement('div');
    item.className = correct ? 'answer-result correct' : 'answer-result incorrect';
    const heading = document.createElement('strong');
    heading.textContent = 'Question ' + (index + 1) + ': ' + (correct ? 'Correct' : 'Incorrect');
    const details = document.createElement('p');
    details.textContent = 'Answer: ' + question.correct + '. ' + question.explanation;
    item.appendChild(heading);
    item.appendChild(details);
    questionResults.appendChild(item);
  });

  const passed = score >= 7;
  document.getElementById('passFail').textContent = (passed ? 'PASS' : 'FAIL') + (timeExpired ? ' — Time expired' : '');
  document.getElementById('passFail').className = passed ? 'status-pass' : 'status-fail';
  document.getElementById('score').textContent = 'Total score: ' + score + '/10 (' + (score * 10) + '%)';
  document.getElementById('timeSpent').textContent = 'Time spent: ' + formatTime(secondsUsed);
  results.hidden = false;
  submitButton.disabled = true;
  quizForm.querySelectorAll('input').forEach(function (input) { input.disabled = true; });
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Avoid refreshing the page when submitting the form.
quizForm.addEventListener('submit', function (event) {
  event.preventDefault();
  finishQuiz(false);
});

// Start a fresh attempt: clear inputs, results and the countdown.
function resetQuiz() {
  clearInterval(timerInterval);
  quizForm.reset();
  quizForm.querySelectorAll('input').forEach(function (input) { input.disabled = false; });
  secondsLeft = totalSeconds;
  quizFinished = false;
  submitButton.disabled = false;
  document.getElementById('questionResults').innerHTML = '';
  results.hidden = true;
  updateTimer();
  timerInterval = setInterval(function () {
    if (quizFinished) return;
    secondsLeft--;
    updateTimer();
    if (secondsLeft <= 0) finishQuiz(true);
  }, 1000);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('resetButton').addEventListener('click', resetQuiz);
document.getElementById('resultsResetButton').addEventListener('click', resetQuiz);
updateTimer();
