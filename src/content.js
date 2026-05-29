let lastFocusedInput = null;

document.addEventListener(
  "focus",
  (e) => {
    const tag = e.target.tagName.toLowerCase();
    const type = (e.target.type || "").toLowerCase();
    if (tag === "input" && type !== "submit" && type !== "button" && type !== "checkbox" && type !== "radio") {
      lastFocusedInput = e.target;
    }
  },
  true
);

chrome.runtime.onMessage.addListener((message) => {
  if (message.action !== "fillEmail") return;

  const target = lastFocusedInput || document.activeElement;
  if (!target) return;

  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  ).set;
  nativeInputValueSetter.call(target, message.email);
  target.dispatchEvent(new Event("input", { bubbles: true }));
  target.dispatchEvent(new Event("change", { bubbles: true }));
});