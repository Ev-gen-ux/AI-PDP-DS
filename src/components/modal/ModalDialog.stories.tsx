import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import type { ModalDialogProps } from './ModalDialog';
import { ModalDialog } from './ModalDialog';
import {
  modalStoryBodyByVariant,
  modalStoryFooterActions,
  type ModalStoryBodyVariant,
} from './modalStoryPresets';

type ModalDialogStoryArgs = Omit<ModalDialogProps, 'children' | 'footer'> & {
  bodyVariant: ModalStoryBodyVariant;
  withFooter: boolean;
};

function ModalDialogStoryRender(args: ModalDialogStoryArgs) {
  const { bodyVariant, withFooter, ...modalProps } = args;
  return (
    <ModalDialog {...modalProps} footer={withFooter ? modalStoryFooterActions : undefined}>
      {modalStoryBodyByVariant[bodyVariant]}
    </ModalDialog>
  );
}

const meta: Meta<ModalDialogStoryArgs> = {
  title: 'Components/ModalDialog',
  component: ModalDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Полноэкранная оболочка (Figma `modalDialog`, node `3309:21489`): слой `modal.fade` под панелью, отступы `paddings.large` × `paddings.section`, панель `Modal` по центру вьюпорта; клик по затемнению при `onClose` + `closeOnBackdropClick`.',
      },
    },
  },
  render: ModalDialogStoryRender,
  args: {
    header: 'Header',
    closable: true,
    moveFocusOnMount: false,
    iconBefore: true,
    contentBefore: true,
    contentAfter: true,
    closeOnBackdropClick: true,
    lockBodyScroll: false,
    bodyVariant: 'medium',
    withFooter: true,
    onClose: fn(),
  },
  argTypes: {
    bodyVariant: {
      control: 'inline-radio',
      options: ['short', 'medium', 'long'],
      description: 'Состав body в Canvas: высота и объём контента.',
    },
    withFooter: {
      control: 'boolean',
      description: 'Показывать регион footer с кнопками.',
    },
    iconBefore: {
      control: 'boolean',
      description: 'Ведущая иконка в шапке (meta).',
    },
    contentBefore: {
      control: 'boolean',
      description: 'Слот в шапке до заголовка (плейсхолдер по умолчанию).',
    },
    contentAfter: {
      control: 'boolean',
      description: 'Слот в шапке после заголовка (плейсхолдер по умолчанию).',
    },
    header: { control: 'text' },
    closable: { control: 'boolean' },
    moveFocusOnMount: { control: 'boolean' },
    closeOnBackdropClick: {
      control: 'boolean',
      description: 'Закрытие по клику на `modal.fade` (только если передан `onClose`).',
    },
    lockBodyScroll: {
      control: 'boolean',
      description: 'В Storybook по умолчанию выключен, чтобы не блокировать скролл доков.',
    },
    onClose: {
      description:
        'Колбэк закрытия (в Default — `fn()` из Storybook). Без него затемнение не закрывает диалог.',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          boxSizing: 'border-box',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<ModalDialogStoryArgs>;

export const Default: Story = {};

/** Высокий body: прокрутка внутри оболочки (`Shell`), затемнение на месте. */
export const ScrollableBody: Story = {
  args: {
    bodyVariant: 'long',
    moveFocusOnMount: false,
    lockBodyScroll: false,
  },
  parameters: {
    controls: { disable: true },
  },
};
