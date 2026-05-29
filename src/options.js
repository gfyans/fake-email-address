const DEFAULT_FORMAT = "test@test.com";

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get({ format: DEFAULT_FORMAT }, (data) => {
    document.getElementById("format").value = data.format;
  });

  document.getElementById("save").addEventListener("click", () => {
    const format = document.getElementById("format").value.trim() || DEFAULT_FORMAT;
    chrome.storage.sync.set({ format }, () => {
      const msg = document.getElementById("saved-msg");
      msg.style.display = "block";
      setTimeout(() => (msg.style.display = "none"), 2000);
    });
  });
});