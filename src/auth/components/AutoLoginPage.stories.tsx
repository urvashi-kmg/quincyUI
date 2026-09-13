import type { Meta, StoryObj } from '@storybook/react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import authReducer from '../stores/authSlice';
import { AutoLoginPage } from './AutoLoginPage';

/**
 * No MSW/network mocking is wired into Storybook (see .storybook/preview.ts),
 * so only the states reachable without a real backend call are shown here —
 * the "Authenticating…" story never resolves, and MissingKey fails
 * synchronously before any network call. The success/backend-failure states
 * are covered by AutoLoginPage.test.tsx instead.
 */
const meta: Meta<typeof AutoLoginPage> = {
  title: 'Auth/AutoLoginPage',
  component: AutoLoginPage,
};
export default meta;

type Story = StoryObj<typeof AutoLoginPage>;

function withRoute(initialPath: string) {
  return [
    (Story: () => ReactElement) => (
      <Provider store={configureStore({ reducer: { auth: authReducer } })}>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/autoLogin" element={<Story />} />
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/" element={<div>Home</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    ),
  ];
}

export const Authenticating: Story = {
  decorators: withRoute('/autoLogin?key=demo-key'),
};

export const MissingKey: Story = {
  decorators: withRoute('/autoLogin'),
};
