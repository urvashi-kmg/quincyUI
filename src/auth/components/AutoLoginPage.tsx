import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Loader2, XCircle } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { autoLoginAsync } from '../stores/authSlice';

/**
 * SSO auto-login entry point (real route: /autoLogin).
 *
 * Reads the one-time `key` query param, exchanges it for a session via
 * authSlice's autoLoginAsync, and navigates to "/" on success.
 *
 * Security notes (see .claude/rules/security.md):
 *  - The key is treated as fully opaque — the frontend never inspects its
 *    contents, only checks it's non-empty before sending it.
 *  - authService.autoLogin() sends the key in the POST body, never a URL or
 *    query string, so it can't leak into server access logs.
 */
export function AutoLoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const attempted = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    const key = searchParams.get('key')?.trim();
    if (!key) {
      setError('Missing or empty authentication key in the URL. Please contact your administrator.');
      return;
    }

    dispatch(autoLoginAsync(key))
      .unwrap()
      .then(() => navigate('/', { replace: true }))
      .catch((message: string) => {
        setError(message || 'Authentication failed. Please try again.');
      });
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-card border border-line-decorative bg-white p-8 text-center shadow-sm">
        {!error ? (
          <>
            <Loader2 size={40} className="animate-spin motion-reduce:animate-none text-brand-purple" aria-hidden="true" />
            <div role="status">
              <p className="text-body font-medium text-ink-primary">Authenticating, please wait…</p>
              <p className="mt-1 text-small text-ink-secondary">You will be redirected shortly.</p>
            </div>
          </>
        ) : (
          <>
            <XCircle size={40} className="text-ink-error" aria-hidden="true" />
            <div role="alert">
              <p className="text-body font-semibold text-ink-primary">Authentication failed</p>
              <p className="mt-1 text-small text-ink-error">{error}</p>
            </div>
            <Link to="/login" className="text-small font-medium text-brand-purple hover:underline">
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default AutoLoginPage;
