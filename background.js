const TONES = ["Formal", "Casual", "Friendly"];

chrome.runtime.onInstalled.addListener(() => {
  // Create a parent context menu item
  chrome.contextMenus.create({
    id: "toneshift-parent",
    title: "Rewrite with ToneShift",
    contexts: ["selection"]
  });

  // Create a sub-menu item for each tone
  TONES.forEach(tone => {
    chrome.contextMenus.create({
      id: `toneshift-${tone.toLowerCase()}`,
      parentId: "toneshift-parent",
      title: `As ${tone}`,
      contexts: ["selection"]
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  // Find which tone was clicked
  const clickedTone = TONES.find(t => info.menuItemId === `toneshift-${t.toLowerCase()}`);

  if (clickedTone) {
    // Dispatch the event with the correct tone
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (t) => document.dispatchEvent(new CustomEvent("ToneShift:rewrite", { detail: t })),
      args: [clickedTone]
    });
  }
});