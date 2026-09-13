import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../stores/dashboardSlice';
import { KPISection } from './KPISection';

const meta: Meta<typeof KPISection> = {
  title: 'Dashboard/KPISection',
  component: KPISection,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <Provider store={configureStore({ reducer: { dashboard: dashboardReducer } })}>
        <div className="max-w-4xl">
          <Story />
        </div>
      </Provider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof KPISection>;

export const Default: Story = {};
