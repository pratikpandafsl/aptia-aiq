export type SourceFeedback = { conversationId: string; support: "Does not support"; comment: string };

/** Sends thumbs-down source feedback. Replace the body with your database/API call later. */
export async function submitSourceFeedback(feedback: SourceFeedback): Promise<void> {
  console.info("Source feedback ready to save", feedback);
}
