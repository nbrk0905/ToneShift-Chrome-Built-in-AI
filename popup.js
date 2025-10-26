document.getElementById("apply").addEventListener("click", async () => {
  const tone = document.getElementById("tone").value;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (t) => document.dispatchEvent(new CustomEvent("ToneShift:rewrite", { detail: t })),
      args: [tone]
    });
  }
  
  window.close(); // Close the popup after clicking
});