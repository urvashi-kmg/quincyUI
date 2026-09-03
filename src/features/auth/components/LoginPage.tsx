import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

import { Button } from '@components/ui';
import { FormField, FormCheckbox } from '@components/controls';

import { useAuth } from '../hooks/useAuth';
import { AuthHeroPanel } from './AuthHeroPanel';
import { QuincyLogo } from './QuincyLogo';
import { MicrosoftGlyph } from './MicrosoftGlyph';
import type { Credentials } from '../types';

const validationSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(8, 'At least 8 characters').required('Password is required'),
});

// `rememberMe` is UI-only for now — not sent to the login request and not
// persisted anywhere. Wire it up alongside real session handling once
// Azure AD/MSAL lands in the next phase.
interface LoginFormValues extends Credentials {
  rememberMe: boolean;
}

const initialValues: LoginFormValues = { email: '', password: '', rememberMe: false };

export default function LoginPage() {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  return (
    <div className="flex min-h-screen bg-white">
      {/* Form panel */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-[440px] lg:flex-none lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <QuincyLogo />

          <div className="mt-10">
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back!</h1>
            <h2 className="text-2xl font-bold text-slate-900">Log In to getting started.</h2>
            <p className="mt-2 text-sm text-slate-500">Enter your details to proceed further</p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async ({ email, password }) => {
              const result = await login({ email, password });
              const wasSuccessful = result.meta.requestStatus === 'fulfilled';
              if (wasSuccessful) {
                navigate(from, { replace: true });
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 flex flex-col gap-5">
                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  autoComplete="username"
                  placeholder="quincy@company.com"
                  icon={Mail}
                />
                <FormField
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Start typing…"
                  icon={Lock}
                />

                <div className="flex items-center justify-between">
                  <FormCheckbox name="rememberMe" label="Remember Me" />
                  {/* Placeholder — password reset flow isn't built yet. */}
                  <button
                    type="button"
                    className="text-sm font-medium text-pink-600 hover:text-pink-700"
                    title="Password reset is coming in a future phase"
                  >
                    Forgot your password?
                  </button>
                </div>

                {error && <p className="text-sm text-signal-red">{error}</p>}

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="h-11 !rounded-full !bg-pink-600 hover:!bg-pink-700 focus-visible:!outline-pink-600"
                >
                  Log In
                </Button>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="h-px flex-1 bg-slate-200" />
                  OR
                  <span className="h-px flex-1 bg-slate-200" />
                </div>

                {/* Visual placeholder only — Azure AD/MSAL wiring lands in
                    the next phase. Disabled so it can't be clicked as if
                    it were already functional. */}
                <button
                  type="button"
                  disabled
                  title="Microsoft sign-in is coming in a future phase"
                  className="flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <MicrosoftGlyph />
                  Login with Microsoft
                </button>

                <div className="mt-2 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Secured Enterprise Login
                  </span>
                </div>
              </Form>
            )}
          </Formik>

          <p className="mt-8 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Quincy Mutual Group. All rights reserved.
          </p>
        </div>
      </div>

      <AuthHeroPanel />
    </div>
  );
}
