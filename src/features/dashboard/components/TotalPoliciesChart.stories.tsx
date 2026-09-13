import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../stores/dashboardSlice';
import { TotalPoliciesChart } from './TotalPoliciesChart';

const meta: Meta<typeof TotalPoliciesChart> = {
  title: 'Dashboard/TotalPoliciesChart',
  component: TotalPoliciesChart,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <Provider store={configureStore({ reducer: { dashboard: dashboardReducer } })}>
        <div className="max-w-xl">
          <Story />
        </div>
      </Provider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TotalPoliciesChart>;

export const Default: Story = {};
