import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../stores/dashboardSlice';
import { LobFilterBar } from './LobFilterBar';

const meta: Meta<typeof LobFilterBar> = {
  title: 'Dashboard/LobFilterBar',
  component: LobFilterBar,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <Provider store={configureStore({ reducer: { dashboard: dashboardReducer } })}>
        <Story />
      </Provider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof LobFilterBar>;

export const Default: Story = {};
