let selectedText = "";
let selectedRange = null;
const tones = ["Formal", "Casual", "Friendly"];

// --- Capture Selection ---
document.addEventListener("mouseup", (e) => {
  // Don't show popup if clicking *inside* an existing popup
  if (e.target.closest("#tone-popup") || e.target.closest("#tones-result")) {
    return;
  }
  
  const selection = window.getSelection();
  if (selection && !selection.isCollapsed) {
    selectedText = selection.toString();
    selectedRange = selection.getRangeAt(0);
    // Don't show popup if selection is too small
    if (selectedText.trim().length > 2) {
      showTonePopup(e.pageX, e.pageY);
    }
  } else {
    // Clicked away, remove popups
    removeExistingPopup();
  }
});

// Close popup on 'Escape' key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    removeExistingPopup();
  }
});


// --- Tone Selection Panel ---
function showTonePopup(x, y) {
  removeExistingPopup();

  const panel = document.createElement("div");
  panel.id = "tone-popup";
  panel.className = "tones-panel";
  
  // Position clamping to stay within viewport
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;
  
  // Set initial position to calculate size
  panel.style.visibility = "hidden";
  panel.style.left = "0px";
  panel.style.top = "0px";
  document.body.appendChild(panel);
  const panelWidth = panel.offsetWidth;
  const panelHeight = panel.offsetHeight;
  document.body.removeChild(panel); // Remove before final positioning
  
  // Calculate final position
  const finalX = Math.min(Math.max(5, x), viewportWidth - panelWidth - 5);
  const finalY = Math.min(Math.max(5, y + 8), viewportHeight - panelHeight - 5);

  panel.style.left = `${finalX}px`;
  panel.style.top = `${finalY}px`;
  panel.style.visibility = "visible";


  tones.forEach((tone) => {
    const btn = document.createElement("button");
    btn.textContent = tone;
    btn.onclick = async () => {
      // Show loading state *inside* the panel
      panel.innerHTML = "Rewriting with Gemini... 🤖";
      panel.classList.add("loading-state");

      // Run the rewrite
      const rewritten = await rewriteTextWithPromptAPI(selectedText, tone);
      
      // Remove the loading panel and show the result
      removeExistingPopup(); 
      applyOrShowResult(rewritten);
    };
    panel.appendChild(btn);
  });

  const closeBtn = document.createElement("span");
  closeBtn.textContent = "✖";
  closeBtn.className = "close-btn";
  closeBtn.onclick = removeExistingPopup;
  panel.appendChild(closeBtn);

  document.body.appendChild(panel);
}

// Remove existing popups and backdrop
function removeExistingPopup() {
  const oldPanel = document.getElementById("tone-popup");
  if (oldPanel) oldPanel.remove();
  
  const oldResult = document.getElementById("tones-result");
  if (oldResult) oldResult.remove();
  
  const oldBackdrop = document.getElementById("tones-backdrop");
  if (oldBackdrop) oldBackdrop.remove();
}

// --- Rewrite text using Prompt API or mock ---
async function rewriteTextWithPromptAPI(text, tone) {
  try {
    if (!("ai" in self && ai.prompt)) {
      console.warn("[ToneShift] Prompt API not available. Using mock rewrite.");
      return await mockRewrite(text, tone);
    }
    
    const state = await ai.prompt.readiness();
    if (state !== "readily-available" && state !== "available-after-download") {
       console.warn(`[ToneShift] Prompt API not ready (${state}). Using mock rewrite.`);
       return await mockRewrite(text, tone);
    }

    const prompt = `Rewrite the following text in a ${tone} tone:\n\n${text}`;
    const response = await ai.prompt.generate({
      model: "gemini-nano",
      prompt: prompt,
      max_output_tokens: 300
    });

    return response?.candidates?.[0]?.content || text;
  } catch (err) {
    console.error("[ToneShift] Prompt API error:", err);
    return await mockRewrite(text, tone);
  }
}

// --- Mock rewrite (FIXED with async) ---
async function mockRewrite(text, tone) {
  await new Promise(resolve => setTimeout(resolve, 750)); // Simulate delay
  if (tone === "Formal") return "With utmost sincerity, " + text + ". We appreciate your attention to this matter.";
  if (tone === "Casual") return "So basically, " + text + ". No biggie.";
  if (tone === "Friendly") return "Hey there! Just wanted to say that " + text + " 😊 Hope that helps!";
  return text;
}

// --- Apply inline or show popup ---
function applyOrShowResult(rewrittenText) {
  // Inline replacement if editable
  if (
    selectedRange &&
    (selectedRange.startContainer.parentElement.isContentEditable ||
      selectedRange.startContainer.parentElement.tagName === "TEXTAREA" ||
      selectedRange.startContainer.parentElement.tagName === "INPUT")
  ) {
    selectedRange.deleteContents();
    selectedRange.insertNode(document.createTextNode(rewrittenText));
  } else {
    showResultPopup(rewrittenText); // Show modal
  }
  
  // Clear selection after use
  selectedText = "";
  selectedRange = null;
}

// --- Show rewritten text popup (Modal UI) ---
function showResultPopup(rewrittenText) {
  removeExistingPopup(); // Clear everything

  // 1. Create Backdrop
  const backdrop = document.createElement("div");
  backdrop.id = "tones-backdrop";
  backdrop.onclick = removeExistingPopup; // Click background to close
  document.body.appendChild(backdrop);

  // 2. Create Popup Modal
  const popup = document.createElement("div");
  popup.id = "tones-result";
  popup.className = "tones-result";

  // Add a Title
  const title = document.createElement("h3");
  title.textContent = "Rewrite Result";
  popup.appendChild(title);

  // Add Textarea
  const textarea = document.createElement("textarea");
  textarea.value = rewrittenText;
  textarea.readOnly = true;
  popup.appendChild(textarea);
  
  // Add Button Group
  const buttonGroup = document.createElement("div");
  buttonGroup.className = "button-group";

  // Add Close Button
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.className = "secondary"; // Text button style
  closeBtn.onclick = removeExistingPopup;
  buttonGroup.appendChild(closeBtn);
  
  // Add Copy Button
  const copyBtn = document.createElement("button");
  copyBtn.textContent = "Copy";
  copyBtn.className = "primary"; // Filled button style
  copyBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(textarea.value);
      copyBtn.textContent = "Copied!";
      setTimeout(() => { copyBtn.textContent = "Copy"; }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy text.");
    }
  };
  buttonGroup.appendChild(copyBtn);

  popup.appendChild(buttonGroup);
  document.body.appendChild(popup);
  
  // Auto-focus the textarea
  textarea.select();
}

// --- Event Listener for Background/Popup ---
document.addEventListener("ToneShift:rewrite", (e) => {
  const tone = e.detail;

  if (selectedText && selectedRange) {
    // Show a loading indicator
    showLoadingPopup();

    // Run the rewrite
    rewriteTextWithPromptAPI(selectedText, tone).then(rewritten => {
      removeExistingPopup(); // Removes the loading popup
      applyOrShowResult(rewritten);
    });

  } else {
    alert("Please select some text on the page first!");
  }
});

// Helper function for modal loading state
function showLoadingPopup() {
  removeExistingPopup();

  // 1. Create Backdrop
  const backdrop = document.createElement("div");
  backdrop.id = "tones-backdrop";
  document.body.appendChild(backdrop);
  
  // 2. Create Loading Modal
  const popup = document.createElement("div");
  popup.id = "tones-result"; // Reuse the result style
  popup.className = "tones-result loading-state"; // Add loading class
  popup.innerHTML = "Rewriting with Gemini... 🤖";

  document.body.appendChild(popup);
}