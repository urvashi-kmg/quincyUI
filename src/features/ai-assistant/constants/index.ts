/** Feature-local constants. Promote to a shared location only with approval
 * (.claude/rules/constants.md). */
export const MAX_MESSAGE_LENGTH = 4000;
export const MAX_THREAD_MESSAGES = 100;
export const ASSISTANT_DISPLAY_NAME = 'Quincy Assistant';

/**
 * Shown before the first message. The assistant handles policy and quote
 * questions; it must never be given customer PII to echo back
 * (.claude/rules/security.md: never paste regulated data into an AI prompt).
 */
export const PII_WARNING =
  'Do not include policyholder personal information in your messages.';
