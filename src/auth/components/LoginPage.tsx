import { useEffect, useRef, useState } from 'react';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { TextField } from '@/components/controls/form/TextField';
import { useAppDispatch } from '@/redux/hooks';
import { loginAsync } from '../stores/authSlice';

const loginSchema = Yup.object({
  userId: Yup.string().required('User ID is required.'),
  password: Yup.string().min(6, 'Password must be at least 6 characters.').required('Password is required.'),
});

/**
 * Manual credential login. See auth/components/AutoLoginPage.tsx for the SSO
 * variant, and authSlice.ts's initializeAuthAsync for the config-gated
 * "default login" variant (no UI of its own — it's a boot-time fallback).
 */
export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';
  const submitInProgress = useRef(false);
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);

  // axiosClient.ts's _clearSession() leaves a one-shot message here when a
  // request is rejected for having no active session (expired/never logged in).
  useEffect(() => {
    const message = sessionStorage.getItem('_auth_logout_message');
    if (message) {
      setSessionMessage(message);
      sessionStorage.removeItem('_auth_logout_message');
    }
  }, []);

  const formik = useFormik({
    initialValues: { userId: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      if (submitInProgress.current) return;
      submitInProgress.current = true;
      setStatus(undefined);
      try {
        await dispatch(loginAsync(values)).unwrap();
        navigate(redirectTo, { replace: true });
      } catch (err) {
        setStatus(typeof err === 'string' ? err : 'Login failed.');
      } finally {
        setSubmitting(false);
        submitInProgress.current = false;
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-6">
      <div className="w-full max-w-sm rounded-card border border-line-decorative bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-heading-2 font-semibold text-ink-primary">Welcome back</h1>
          <p className="mt-1 text-small text-ink-secondary">Sign in to continue to Quincy</p>
        </div>

        {sessionMessage && (
          <div
            role="status"
            className="mb-4 flex items-start gap-2 rounded-card border border-line-decorative bg-page px-3 py-2"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-brand-purple" aria-hidden="true" />
            <p className="text-small text-ink-primary">{sessionMessage}</p>
          </div>
        )}

        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-4">
            <TextField name="userId" label="User ID" autoComplete="username" />
            <TextField name="password" label="Password" type="password" autoComplete="current-password" />

            {formik.status && (
              <p role="alert" className="rounded-card border border-line-error bg-fill-error px-3 py-2 text-small text-ink-error">
                {formik.status}
              </p>
            )}

            <Button type="submit" variant="purple" size="large" isLoading={formik.isSubmitting} className="mt-2 w-full">
              Log In
            </Button>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
}

export default LoginPage;
