import type { PlasmoMessaging } from "@plasmohq/messaging";

// Message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "GENERATE_QUESTION":
      handleGenerateQuestion(message.payload.text);
      break;
    case "GET_TODAY_STATS":
      handleGetTodayStats();
      break;
    case "START_REVIEW":
      handleStartReview();
      break;
    default:
      console.log("Unknown message type:", message.type);
  }

  return true;
});

async function handleGenerateQuestion(text: string) {
  try {
    // Call AI API to generate questions
    const response = await generateQuestionWithAI(text);

    // Store the generated question
    await saveQuestionToDB(response);

    // Notify user
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon-128.png",
      title: "Question Generated",
      message: "Your learning question has been created!",
    });
  } catch (error) {
    console.error("Error generating question:", error);
  }
}

async function generateQuestionWithAI(text: string) {
  // TODO: Implement Claude API call
  return {
    id: Date.now().toString(),
    question: "What is the main concept of this text?",
    answer: text,
    createdAt: new Date().toISOString(),
    nextReview: new Date().toISOString(),
  };
}

async function saveQuestionToDB(question: any) {
  // TODO: Implement IndexedDB storage
  console.log("Saving question:", question);
}

async function handleGetTodayStats() {
  // TODO: Implement stats retrieval
  return {
    questionsCreated: 0,
    questionsReviewed: 0,
    upcomingReviews: 0,
  };
}

async function handleStartReview() {
  // TODO: Open review page
  chrome.tabs.create({ url: "tabs/review.html" });
}

// Set up alarm for review reminders
chrome.alarms.create("reviewReminder", { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "reviewReminder") {
    checkReviewSchedule();
  }
});

async function checkReviewSchedule() {
  // TODO: Check for due reviews and send notification
  console.log("Checking review schedule...");
}
