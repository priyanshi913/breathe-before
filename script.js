// ===== Breathe Before - script =====
// one script for all pages. each part only runs if that page's buttons exist.


// ---------- text for each event ----------
var eventInfo = {
  test: {
    heading: "Before your test",
    goodLuck: "Good luck on your test! Read each question slowly. You know more than you think.",
    messages: [
      "You've studied for this. Trust what you know.",
      "One question at a time. You don't have to do it all at once.",
      "If you get stuck, skip it and come back. That's allowed.",
      "One test does not decide who you are.",
      "Your brain works better when you're calm. You're giving it a head start right now.",
      "Even if it doesn't go perfectly, you will be okay."
    ]
  },
  presentation: {
    heading: "Before your presentation",
    goodLuck: "Good luck on your presentation! Speak slowly and remember to breathe between slides.",
    messages: [
      "Everyone in that room wants you to do well.",
      "Nobody knows your script. If you skip a line, no one will notice.",
      "Nervous and excited feel almost the same. Call it excitement.",
      "Talk to one friendly face at a time.",
      "It's okay to pause. Pauses sound confident.",
      "You know this topic better than anyone in the audience right now."
    ]
  },
  tryout: {
    heading: "Before your tryout",
    goodLuck: "Good luck at your tryout! Have fun out there and show them your effort.",
    messages: [
      "You've practised for this. Your body remembers.",
      "Coaches notice effort and attitude, not just skill.",
      "One mistake doesn't define your whole tryout. Shake it off.",
      "Focus on the next play, not the last one.",
      "Butterflies mean you care. Use that energy.",
      "Just show them who you are on a normal day."
    ]
  }
};

// messages for when someone skipped picking an event
var generalMessages = [
  "You are more prepared than you think.",
  "Whatever happens, you will be okay.",
  "Take it one step at a time.",
  "Being nervous means you care.",
  "You've gotten through hard things before."
];


// ---------- helper functions ----------

// gets the event the user picked (saved in sessionStorage)
function getEvent() {
  return sessionStorage.getItem("event");
}

// gets the right list of messages
function getMessages() {
  var event = getEvent();
  if (event && eventInfo[event]) {
    return eventInfo[event].messages;
  } else {
    return generalMessages;
  }
}

// adds a click to a button only if the button is on this page
function onClick(id, whatToDo) {
  var button = document.getElementById(id);
  if (button) {
    button.addEventListener("click", whatToDo);
  }
}


// ---------- HOME PAGE ----------
function pickEvent(eventName) {
  sessionStorage.setItem("event", eventName);
  window.location.href = "feelings.html";
}

onClick("testBtn", function () { pickEvent("test"); });
onClick("presentationBtn", function () { pickEvent("presentation"); });
onClick("tryoutBtn", function () { pickEvent("tryout"); });

onClick("breatheShortcut", function () {
  sessionStorage.removeItem("event");
  window.location.href = "breathe.html";
});


// ---------- FEELINGS PAGE ----------
var eventHeading = document.getElementById("eventHeading");
if (eventHeading) {
  var event = getEvent();
  if (event && eventInfo[event]) {
    eventHeading.textContent = eventInfo[event].heading;
  }
}

onClick("bodyBtn", function () { window.location.href = "breathe.html"; });
onClick("mindBtn", function () { window.location.href = "encourage.html"; });
onClick("backHome", function () { window.location.href = "index.html"; });


// ---------- BREATHING PAGE ----------
var circle = document.getElementById("circle");

if (circle) {
  var circleText = document.getElementById("circleText");
  var timeLeftText = document.getElementById("timeLeft");
  var doneMessage = document.getElementById("doneMessage");
  var startBtn = document.getElementById("startBtn");
  var oneMin = document.getElementById("oneMin");
  var twoMin = document.getElementById("twoMin");

  var totalSeconds = 60;   // 1 minute is picked at the start
  var phaseTimer;
  var countdownTimer;

  // box breathing: 4 seconds each
  var phases = ["Breathe in", "Hold", "Breathe out", "Hold"];
  var phaseNumber = 0;

  oneMin.addEventListener("click", function () {
    totalSeconds = 60;
    oneMin.classList.add("selected");
    twoMin.classList.remove("selected");
  });

  twoMin.addEventListener("click", function () {
    totalSeconds = 120;
    twoMin.classList.add("selected");
    oneMin.classList.remove("selected");
  });

  function showPhase() {
    var phase = phases[phaseNumber];
    circleText.textContent = phase;

    if (phase == "Breathe in") {
      circle.classList.add("grow");
    } else if (phase == "Breathe out") {
      circle.classList.remove("grow");
    }
    // on "Hold" the circle just stays the same size

    phaseNumber = phaseNumber + 1;
    if (phaseNumber == phases.length) {
      phaseNumber = 0;
    }
  }

  function startBreathing() {
    // stop any old timers if start is pressed again
    clearInterval(phaseTimer);
    clearInterval(countdownTimer);

    var secondsLeft = totalSeconds;
    phaseNumber = 0;
    doneMessage.textContent = "";
    startBtn.textContent = "Restart";

    showPhase();
    phaseTimer = setInterval(showPhase, 4000);

    timeLeftText.textContent = secondsLeft + " seconds left";
    countdownTimer = setInterval(function () {
      secondsLeft = secondsLeft - 1;
      timeLeftText.textContent = secondsLeft + " seconds left";

      if (secondsLeft <= 0) {
        finishBreathing();
      }
    }, 1000);
  }

  function finishBreathing() {
    clearInterval(phaseTimer);
    clearInterval(countdownTimer);
    circle.classList.remove("grow");
    circleText.textContent = "Well done";
    timeLeftText.textContent = "";
    doneMessage.textContent = "Nice work. Taking you to the next page...";

    setTimeout(function () {
      window.location.href = "ready.html";
    }, 3000);
  }

  startBtn.addEventListener("click", startBreathing);
}

onClick("imDone", function () { window.location.href = "ready.html"; });


// ---------- ENCOURAGEMENT PAGE ----------
var messageText = document.getElementById("message");
var lastMessage = -1;

function showRandomMessage() {
  var list = getMessages();
  var randomNumber = Math.floor(Math.random() * list.length);

  // pick again if it's the same as last time
  while (randomNumber == lastMessage && list.length > 1) {
    randomNumber = Math.floor(Math.random() * list.length);
  }

  lastMessage = randomNumber;
  messageText.textContent = list[randomNumber];
}

if (messageText) {
  showRandomMessage();
}

onClick("anotherBtn", showRandomMessage);
onClick("readyBtn", function () { window.location.href = "ready.html"; });


// ---------- YOU'RE READY PAGE ----------
var goodLuck = document.getElementById("goodLuck");
if (goodLuck) {
  var chosen = getEvent();
  if (chosen && eventInfo[chosen]) {
    goodLuck.textContent = eventInfo[chosen].goodLuck;
  }
}

onClick("breatheAgain", function () { window.location.href = "breathe.html"; });

onClick("startOver", function () {
  sessionStorage.removeItem("event");
  window.location.href = "index.html";
});
