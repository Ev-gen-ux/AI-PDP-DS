import type { Preview } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../src/theme/tokens';
import '../src/theme/fonts.css';
import '../src/theme/variables.light.css';
import '../src/theme/variables.dark.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    backgrounds: { disable: true },
    a11y: { config: { rules: [] } },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Active color theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        showName: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const themeMode = context.globals.theme as 'light' | 'dark';
      return (
        <ThemeProvider theme={theme}>
          <div
            key={themeMode}
            data-theme={themeMode}
            style={{
              padding: '2rem',
              minHeight: '100vh',
              backgroundColor: 'var(--colors-background-body-calm)',
              color: 'var(--colors-text-base)',
              colorScheme: themeMode,
              transition: 'background-color 150ms ease, color 150ms ease',
            }}
          >
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
