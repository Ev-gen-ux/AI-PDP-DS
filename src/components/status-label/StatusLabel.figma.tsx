import { figma } from '@figma/code-connect';
import { StatusLabel } from './StatusLabel';

figma.connect(
  StatusLabel,
  'https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=240-694',
  {
    props: {
      appearance: figma.enum('Appearance', {
        Primary: 'primary',
        Secondary: 'secondary',
      }),
      size: figma.enum('Size', {
        Medium: 'medium',
        Small: 'small',
      }),
      status: figma.enum('Status', {
        Success: 'success',
        Information: 'information',
        Alert: 'alert',
        Wait: 'wait',
        Error: 'error',
      }),
      text: figma.string('Label'),
      withIcon: figma.boolean('With Icon'),
    },
    example: ({ appearance, size, status, text, withIcon }) => (
      <StatusLabel
        appearance={appearance}
        size={size}
        status={status}
        text={text}
        withIcon={withIcon}
      />
    ),
  },
);
