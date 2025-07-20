import ILearningService, { TAditionalData } from "./learningService";

export class LiloChatService implements ILearningService {
  public color: string;

  constructor() {
    // A color for LiloChat, maybe a nice indigo
    this.color = "#6366F1";
  }

  /**
   * Sends a message to the background script to add a word to the user's LiloChat vocabulary.
   * @param {string} word - The French word or phrase.
   * @param {string} translation - The translation of the word.
   * @param {TAditionalData} aditionalData - Additional context (not currently used by LiloChat API but good to pass).
   * @returns {Promise<string>} A promise that resolves with a success message or rejects with an error.
   */
  public async addWord(word: string, translation: string, aditionalData: TAditionalData): Promise<string> {
    // The data payload for our LiloChat API endpoint.
    // 'my-words' is a good default source for words added via the extension.
    const data = {
      french: word,
      translationText: translation,
      translationLanguage: "en", // Assuming the translation is English for now
      sourceSlug: "my-words",
    };

    // We wrap the chrome.runtime.sendMessage in a Promise to work with async/await.
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          type: "addLiloChatWord", // A unique type for our new handler
          data: data,
        },
        (response) => {
          // The background script will send back a response object.
          // We check for a `success` property.
          if (chrome.runtime.lastError) {
            // This catches errors if the background script isn't available.
            return reject("LiloChat Service Error: " + chrome.runtime.lastError.message);
          }

          if (response && response.success) {
            resolve(`Word "${word}" added to LiloChat!`);
          } else {
            // If there's an error message from our backend, use it.
            const errorMessage = response?.error || "An unknown error occurred.";
            reject("LiloChat Error: " + errorMessage);
          }
        },
      );
    });
  }
}
