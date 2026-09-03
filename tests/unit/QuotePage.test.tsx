import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from 'vitest';

import { quotesApi } from '@features/quotes';
import QuotePage from '@features/quotes/pages/QuotePage';

// Example integration test: real RTK Query slice + MSW-mocked network
// response (see src/mocks/handlers/quotes.handlers.ts, wired up in
// src/test/setup.ts) rather than mocking the api hook itself.
function renderWithStore(ui: React.ReactElement) {
  const store = configureStore({
    reducer: { [quotesApi.reducerPath]: quotesApi.reducer },
    middleware: (getDefault) => getDefault().concat(quotesApi.middleware),
  });
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('QuotePage', () => {
  it('renders quotes returned by the API', async () => {
    renderWithStore(<QuotePage />);

    expect(await screen.findByText('Q-100234')).toBeInTheDocument();
  });
});
