import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../stores/dashboardSlice';
import { PolicyAnalysisChart } from './PolicyAnalysisChart';

const meta: Meta<typeof PolicyAnalysisChart> = {
  title: 'Dashboard/PolicyAnalysisChart',
  component: PolicyAnalysisChart,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <Provider store={configureStore({ reducer: { dashboard: dashboardReducer } })}>
        <div className="max-w-2xl">
          <Story />
        </div>
      </Provider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PolicyAnalysisChart>;

export const Default: Story = {};
