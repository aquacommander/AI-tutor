/**
 * Read-aloud, for children who are still building reading fluency.
 *
 * Uses the browser's built-in speech synthesis — no audio files, no network
 * request, and nothing leaves the device. Support is good but not universal, so
 * every caller must cope with `speak` returning false rather than assuming a
 * voice exists.
 */

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Speaks a phrase, cancelling anything already in progress.
 *
 * Slightly slower than default: the stock rate is pitched at adults, and a
 * nine-year-old following along with the words needs a moment longer.
 */
export function speak(text: string): boolean {
  if (!canSpeak()) return false;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.05;
  utterance.lang = 'en-GB';
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}
