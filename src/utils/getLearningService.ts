import { Anki } from "@src/learning-service/anki";

import { TLearningService } from "@src/models/types";
import { LiloChatService } from "@src/learning-service/liloChatService"

export const getLearningService = (learningService: TLearningService) => {
  if (learningService === "anki") {
    return new Anki();
  }
  if (learningService === "lilochat") {
    return new LiloChatService();
  }
};
