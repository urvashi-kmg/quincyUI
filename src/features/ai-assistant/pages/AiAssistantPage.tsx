import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button/Button';
import { useMessageDraft } from '../hooks/useMessageDraft';
import { ASSISTANT_DISPLAY_NAME, MAX_MESSAGE_LENGTH, PII_WARNING } from '../constants';

/**
 * Composer UI only. Sending is intentionally not wired: the assistant backend
 * contract (endpoint, streaming vs. request/response, retention, and what data
 * may be sent) was not specified, and that last point is a security decision,
 * not an implementation detail. See Rule Zero and
 * docs/prompts/03-api-data-integration.md.
 */
export default function AiAssistantPage() {
  const { draft, setDraft, remaining, isOverLimit, canSubmit } = useMessageDraft();

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={ASSISTANT_DISPLAY_NAME}
        description="Ask about quote and policy workflows."
      />

      {/* Amber warning banner: the spec has no "warning" semantic color, so
       * this stays on Tailwind's stock amber palette, out of scope — see the
       * token migration report's "no spec equivalent" list. Only its type
       * size is migrated to the new scale. */}
      <p
        className="mb-4 rounded-card border border-amber-300 bg-amber-50 p-3 text-small text-amber-900"
        role="note"
      >
        {PII_WARNING}
      </p>

      <label
        htmlFor="assistant-draft"
        className="mb-1 block text-body font-medium text-ink-primary"
      >
        Message
      </label>
      <textarea
        id="assistant-draft"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        rows={5}
        aria-describedby="assistant-draft-budget"
        aria-invalid={isOverLimit}
        className={`w-full rounded-lg border px-3 py-4 text-body text-ink-primary outline-none transition-colors focus:border-brand-purple ${
          isOverLimit ? 'border-line-error bg-fill-error' : 'border-line-field'
        }`}
      />

      <div className="mt-2 flex items-center justify-between">
        <p
          id="assistant-draft-budget"
          role={isOverLimit ? 'alert' : undefined}
          className={`text-caption ${isOverLimit ? 'text-ink-error' : 'text-ink-secondary'}`}
        >
          {isOverLimit
            ? `${Math.abs(remaining)} characters over the ${MAX_MESSAGE_LENGTH} limit`
            : `${remaining} characters remaining`}
        </p>
        <Button disabled={!canSubmit} title="Sending is not yet connected to a backend">
          Send
        </Button>
      </div>
    </div>
  );
}
