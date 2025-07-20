// --- src/pages/background/index.ts ---

import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import { googleTranslateBatchFetcher, TWordTranslate } from "@src/utils/googleTranslateBatchFetcher";
import { googleTranslateSingleFetcher } from "@src/utils/googleTranslateSingleFetcher";
import "webext-dynamic-content-scripts";

reloadOnUpdate("pages/background");
reloadOnUpdate("pages/content/style.scss");

console.log("background loaded");

// --- CONTEXT MENU LOGIC ---

const createContextMenu = () => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "add-to-lilochat",
      title: "Add '%s' to LiloChat",
      contexts: ["selection"],
    });
    console.log("LiloChat context menu created/updated.");
  });
};

// --- EXTENSION LIFECYCLE AND SETUP (SINGLE LISTENER) ---

chrome.runtime.onInstalled.addListener((details) => {
  // 1. Create the context menu.
  createContextMenu();

  // 2. Handle the onboarding page for new installations.
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    const onboardingUrl = "https://lilochat.com"; // Updated to your site
    chrome.tabs.create({ url: onboardingUrl });
  }
});

// --- CONTEXT MENU CLICK HANDLER ---

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "add-to-lilochat" && info.selectionText) {
    chrome.tabs.sendMessage(tab.id, {
      type: "openQuickAddModal",
      text: info.selectionText.trim(),
    });
  }
});

// --- MAIN MESSAGE LISTENER (SINGLE LISTENER) ---

chrome.runtime.onMessage.addListener(function (message, _sender, sendResponse) {
  console.log("background message received: ", message);

  switch (message.type) {
    // ORIGINAL TRANSLATION CASES
    case "translateWord":
      googleTranslateBatchFetcher
        .getWordTranslation({ text: message.text, lang: message.language })
        .then((respData: TWordTranslate) => sendResponse(respData));
      return true;

    case "translateWordFull":
      googleTranslateBatchFetcher
        .getWordFullTranslation({ text: message.text, lang: message.language })
        .then((respData: unknown) => sendResponse(respData));
      return true;

    case "translateFullText":
      googleTranslateSingleFetcher
        .getFullTextTranslation({ text: message.text, lang: message.language })
        .then((respData: unknown) => sendResponse(respData));
      return true;

    case "getTextLanguage":
      googleTranslateBatchFetcher
        .getTextLanguage({ text: message.text, lang: message.language })
        .then((respData: unknown) => sendResponse(respData));
      return true;

    // ORIGINAL FORM/POST REQUEST CASES
    case "postFormDataRequest":
      const formData = new FormData();
      for (const key in message.data) {
        formData.append(key, message.data[key].toString());
      }
      fetch(message.url, { method: "POST", body: formData })
        .then((resp) => resp.json())
        .then(sendResponse)
        .catch((error) => sendResponse({ error: error.message || "Request failed" }));
      return true;

    case "post":
      fetch(message.url, { method: "POST", body: JSON.stringify(message.data) })
        .then((resp) => {
          if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
          return resp.json();
        })
        .then(sendResponse)
        .catch((error) => sendResponse({ error: error.message || "connection error" }));
      return true;

    // YOUR NEW LILOCHAT CASE
    case "addLiloChatWord":
      handleAddLiloChatWord(message.data)
        .then(sendResponse)
        .catch((error) => sendResponse({ success: false, error: error.message }));
      return true;

    default:
      console.warn("Unknown message type received:", message.type);
      break;
  }
});

// --- ASYNC HELPER FUNCTION FOR LILOCHAT ---

async function handleAddLiloChatWord(vocabData) {
  try {
    const { authToken } = await chrome.storage.local.get("authToken");
    if (!authToken) {
      return { success: false, error: "You are not logged in to LiloChat." };
    }

    const response = await fetch("https://lilochat.com/api/vocabulary/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(vocabData),
    });

    const result = await response.json();
    return response.ok
      ? { success: true, data: result.data }
      : { success: false, error: result.error || `Server error: ${response.status}` };
  } catch (error) {
    console.error("LiloChat API Error:", error);
    return { success: false, error: "A network error occurred. Please check your connection." };
  }
}
