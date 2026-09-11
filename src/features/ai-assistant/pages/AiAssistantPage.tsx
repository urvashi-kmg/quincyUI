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

      <p
        className="mb-4 rounded-card border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100"
        role="note"
      >
        {PII_WARNING}
      </p>

      <label htmlFor="assistant-draft" className="mb-1 block text-sm font-medium">
        Message
      </label>
      <textarea
        id="assistant-draft"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        rows={5}
        aria-describedby="assistant-draft-budget"
        aria-invalid={isOverLimit}
        className={`w-full rounded-card border px-3 py-2 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 dark:bg-muted-dark ${
          isOverLimit
            ? 'border-red-500 focus-visible:outline-red-500'
            : 'border-border-light focus-visible:outline-brand-500 dark:border-border-dark'
        }`}
      />

      <div className="mt-2 flex items-center justify-between">
        <p
          id="assistant-draft-budget"
          role={isOverLimit ? 'alert' : undefined}
          className={`text-xs ${isOverLimit ? 'text-red-600' : 'text-slate-500'}`}
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
