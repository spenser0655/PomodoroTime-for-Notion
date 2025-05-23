// テーマ・モード切替
const themeToggle = document.getElementById('themeToggle');
const modeToggle = document.getElementById('modeToggle');
const body = document.body;
const clockDisplay = document.getElementById('clockDisplay');
const pomodoroDisplay = document.getElementById('pomodoroDisplay');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
});

modeToggle.addEventListener('click', () => {
  if (clockDisplay.style.display === "none") {
    clockDisplay.style.display = "block";
    pomodoroDisplay.style.display = "none";
  } else {
    clockDisplay.style.display = "none";
    pomodoroDisplay.style.display = "block";
  }
});

// 設定モーダルの開閉
settingsBtn.addEventListener('click', () => {
  settingsModal.style.display = "flex";
});
closeSettings.addEventListener('click', () => {
  settingsModal.style.display = "none";
});
window.addEventListener('click', (e) => {
  if (e.target === settingsModal) {
    settingsModal.style.display = "none";
  }
});

// 現在時刻表示
function updateClock() {
  const now = new Date();
  const dateStr = now.getFullYear() + "年" +
                  (now.getMonth() + 1) + "月" +
                  now.getDate() + "日";
  const timeStr = now.toLocaleTimeString('ja-JP', { hour12: false });

  document.getElementById('currentDate').textContent = dateStr;
  document.getElementById('currentTime').textContent = timeStr;
}
setInterval(updateClock, 1000);
updateClock();

// ポモドーロタイマー
let focusTime = 25 * 60;
let shortBreak = 5 * 60;
let longBreak = 20 * 60;
let sessionsBeforeLong = 4;
let currentSession = 0;
let isFocus = true;
let timer = null;
let remainingTime = focusTime;

const pomodoroTimerElem = document.getElementById('pomodoroTimer');
const timerLabelElem = document.getElementById('timerLabel');
const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');
const sessionCountElem = document.getElementById('sessionCount');

function updatePomodoroDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  pomodoroTimerElem.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  timerLabelElem.textContent = isFocus ? "Focus" : "Break";
}

function startTimer() {
  if (timer) return;
  timer = setInterval(() => {
    remainingTime--;
    if (remainingTime < 0) {
      clearInterval(timer);
      timer = null;
      if (isFocus) {
        currentSession++;
        remainingTime = (currentSession % sessionsBeforeLong === 0) ? longBreak : shortBreak;
      } else {
        remainingTime = focusTime;
      }
      isFocus = !isFocus;
      updatePomodoroDisplay();
      startTimer(); // 自動的に次のセッションへ
    } else {
      updatePomodoroDisplay();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

startStopBtn.addEventListener('click', () => {
  if (timer) {
    stopTimer();
    startStopBtn.textContent = "Start";
  } else {
    startTimer();
    startStopBtn.textContent = "Stop";
  }
});

// 完全停止ボタン
resetBtn.addEventListener('click', () => {
  stopTimer();
  isFocus = true;
  remainingTime = focusTime;
  startStopBtn.textContent = "Start";
  updatePomodoroDisplay();
});

// 初期設定
updatePomodoroDisplay();
