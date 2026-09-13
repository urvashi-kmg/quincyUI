import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../stores/dashboardSlice';
import { AgencyExperienceChart } from './AgencyExperienceChart';

const meta: Meta<typeof AgencyExperienceChart> = {
  title: 'Dashboard/AgencyExperienceChart',
  component: AgencyExperienceChart,
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

type Story = StoryObj<typeof AgencyExperienceChart>;

export const Default: Story = {};
