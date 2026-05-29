const DEFAULT_FORMAT = "test@test.com";
const DEFAULT_PHONE = "07111222333";

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get({ format: DEFAULT_FORMAT, phone: DEFAULT_PHONE }, (data) => {
    document.getElementById("format").value = data.format;
    document.getElementById("phone").value = data.phone;
  });

  document.getElementById("save").addEventListener("click", () => {
    const format = document.getElementById("format").value.trim() || DEFAULT_FORMAT;
    const phone = document.getElementById("phone").value.trim() || DEFAULT_PHONE;
    chrome.storage.sync.set({ format, phone }, () => {
      const msg = document.getElementById("saved-msg");
      msg.style.display = "block";
      setTimeout(() => (msg.style.display = "none"), 2000);
    });
  });
});