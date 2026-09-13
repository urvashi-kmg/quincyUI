import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import authReducer from '../stores/authSlice';
import { LoginPage } from './LoginPage';

const meta: Meta<typeof LoginPage> = {
  title: 'Auth/LoginPage',
  component: LoginPage,
  decorators: [
    (Story) => (
      <Provider store={configureStore({ reducer: { auth: authReducer } })}>
        <MemoryRouter initialEntries={['/login']}>
          <Story />
        </MemoryRouter>
      </Provider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof LoginPage>;

export const Default: Story = {};

export const SessionExpired: Story = {
  decorators: [
    (Story) => {
      sessionStorage.setItem('_auth_logout_message', 'Your session has expired. Please log in again.');
      return <Story />;
    },
  ],
};
