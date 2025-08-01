import { createRoot } from "react-dom/client";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

import { $streaming, fetchCurrentStreamingFx } from "@src/models/streamings";
import { esRenderSetings } from "@src/models/settings";
import { esSubsChanged } from "@src/models/subs";
import { $video, getCurrentVideoFx, videoTimeUpdate } from "@src/models/videos";
import { Settings } from "@src/pages/content/components/Settings";
import { Subs } from "./components/Subs";
import { ProgressBar } from "./components/ProgressBar";
import { removeKeyboardEventsListeners } from "@src/utils/keyboardHandler";
import { QuickAddModal } from "./components/QuickAddModal/QuickAddModal";

refreshOnUpdate("pages/content");

fetchCurrentStreamingFx();

const handleTimeUpdate = () => {
  videoTimeUpdate();
};

$streaming.watch((streaming) => {
  console.log("streaming changed", streaming);
  document.body.classList.add("es-" + streaming.name);

  if (streaming == null) {
    return;
  }

  esRenderSetings.watch(() => {
    console.log("Event:", "esRenderSetings");
    document.querySelectorAll(".es-settings").forEach((e) => e.remove());
    const buttonContainer = streaming.getSettingsButtonContainer();
    const contentContainer = streaming.getSettingsContentContainer();

    const parentNode = buttonContainer?.parentNode;
    const settingNode = document.createElement("div");
    settingNode.className = "es-settings";
    parentNode?.insertBefore(settingNode, buttonContainer);

    getCurrentVideoFx();
    $video.watch((video) => {
      video?.removeEventListener("timeupdate", handleTimeUpdate as EventListener);
      video?.addEventListener("timeupdate", handleTimeUpdate as EventListener);
    });
    createRoot(settingNode).render(<Settings contentContainer={contentContainer} />);
  });

  streaming.init();
});

esSubsChanged.watch((language) => {
  console.log("Event:", "esSubsChanged");
  console.log("Language:", language);
  removeKeyboardEventsListeners();
  document.querySelectorAll("#es").forEach((e) => e.remove());
  const subsContainer = $streaming.getState().getSubsContainer();
  const subsNode = document.createElement("div");
  subsNode.id = "es";
  subsContainer?.appendChild(subsNode);
  createRoot(subsNode).render(<Subs />);

  if (!$streaming.getState().isOnFlight()) {
    document.querySelectorAll(".es-progress-bar").forEach((e) => e.remove());
    const progressBarNode = document.createElement("div");
    progressBarNode.classList.add("es-progress-bar");
    subsContainer?.appendChild(progressBarNode);
    createRoot(progressBarNode).render(<ProgressBar />);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "openQuickAddModal") {
    // A unique ID for our modal's root element
    const modalRootId = "es-quick-add-root";

    // Avoid creating multiple modals
    if (document.getElementById(modalRootId)) {
      return;
    }

    // 1. Create a div to be the root for our React component
    const modalRoot = document.createElement("div");
    modalRoot.id = modalRootId;
    document.body.appendChild(modalRoot);

    // 2. Define a cleanup function to remove the modal
    const unmountModal = () => {
      const root = document.getElementById(modalRootId);
      if (root) {
        document.body.removeChild(root);
      }
    };

    // 3. Render the React component into our new div
    const root = createRoot(modalRoot);
    root.render(<QuickAddModal word={message.text} onClose={unmountModal} />);
  }
});
