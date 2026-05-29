const DEFAULT_FORMAT = "test@test.com";

function generateEmail(format) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const unique =
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds());

  return format.includes("{unique-id}")
    ? format.replace("{unique-id}", unique)
    : format;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "insertFakeEmail",
    title: "Insert fake email address",
    contexts: ["editable"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "insertFakeEmail") return;

  chrome.storage.sync.get({ format: DEFAULT_FORMAT }, (data) => {
    const email = generateEmail(data.format);
    chrome.tabs.sendMessage(tab.id, {
      action: "fillEmail",
      email: email,
    });
  });
});