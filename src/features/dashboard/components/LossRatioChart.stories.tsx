import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer, { setSelectedLOB } from '../stores/dashboardSlice';
import { LossRatioChart } from './LossRatioChart';

function storeWithSelection(selectedLOB: string | null) {
  const store = configureStore({ reducer: { dashboard: dashboardReducer } });
  if (selectedLOB) store.dispatch(setSelectedLOB(selectedLOB));
  return store;
}

const meta: Meta<typeof LossRatioChart> = {
  title: 'Dashboard/LossRatioChart',
  component: LossRatioChart,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof LossRatioChart>;

export const AllLinesOfBusiness: Story = {
  decorators: [
    (Story) => (
      <Provider store={storeWithSelection(null)}>
        <div className="max-w-2xl">
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export const DrilledDown: Story = {
  decorators: [
    (Story) => (
      <Provider store={storeWithSelection('Home Owners')}>
        <div className="max-w-2xl">
          <Story />
        </div>
      </Provider>
    ),
  ],
};
