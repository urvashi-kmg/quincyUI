import { configureStore } from '@reduxjs/toolkit';

// Imported only via each feature's public index.ts — never a deep path —
// per the `no-restricted-imports` ESLint rule enforced across the app.
import { authReducer } from '@features/auth';
import { quotesApi, quoteWizardReducer } from '@features/quotes';
import { policiesApi } from '@features/policies';

// Global Redux store.
// Everything lives here now: RTK Query "server state" slices (quotesApi,
// policiesApi), truly global client state (auth), and feature-local UI
// state that still needs Redux's structure (quoteWizard) but is namespaced
// under its own reducer key and only touched via that feature's hooks —
// see src/features/quotes/stores/quoteWizardSlice.ts and
// src/features/quotes/hooks/useQuoteWizard.ts.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    quoteWizard: quoteWizardReducer,
    [quotesApi.reducerPath]: quotesApi.reducer,
    [policiesApi.reducerPath]: policiesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(quotesApi.middleware, policiesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
