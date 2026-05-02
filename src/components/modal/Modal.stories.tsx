import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import type { ModalProps } from './Modal';
import { Modal } from './Modal';
import {
  modalStoryBodyByVariant,
  modalStoryFooterActions,
  type ModalStoryBodyVariant,
} from './modalStoryPresets';

type ModalStoryArgs = Omit<ModalProps, 'children' | 'footer'> & {
  bodyVariant: ModalStoryBodyVariant;
  withFooter: boolean;
};

function ModalStoryRender(args: ModalStoryArgs) {
  const { bodyVariant, withFooter, ...modalProps } = args;
  return (
    <Modal {...modalProps} footer={withFooter ? modalStoryFooterActions : undefined}>
      {modalStoryBodyByVariant[bodyVariant]}
    </Modal>
  );
}

const meta: Meta<ModalStoryArgs> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Панель модального окна (header, body, footer) с токенами `modal/*`, тенью `effects.overlay.modal` и базовой ловушкой фокуса.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: 640,
          padding: '24px 0 24px 24px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  render: ModalStoryRender,
  args: {
    header: 'Header',
    closable: true,
    moveFocusOnMount: false,
    iconBefore: true,
    contentBefore: true,
    contentAfter: true,
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
      description:
        'Figma `contentBefore`: слот до заголовка; без `contentBeforeSlot` — пунктирный плейсхолдер.',
    },
    contentAfter: {
      control: 'boolean',
      description:
        'Figma `contentAfter`: слот после заголовка; без `contentAfterSlot` — пунктирный плейсхолдер.',
    },
    header: {
      control: 'text',
      description: 'Заголовок в шапке (Figma: Header).',
    },
    closable: {
      control: 'boolean',
      description: 'Показывать кнопку закрытия.',
    },
    moveFocusOnMount: {
      control: 'boolean',
      description:
        'Перенос фокуса внутрь диалога при монтировании (в stories по умолчанию выключен).',
    },
    onClose: {
      description: 'Закрытие по клику на X или клавише Escape (в Default задано через `fn()`).',
    },
  },
};

export default meta;
type Story = StoryObj<ModalStoryArgs>;

export const Default: Story = {};

export const WithoutLeadingIcon: Story = {
  args: {
    iconBefore: false,
    moveFocusOnMount: false,
    bodyVariant: 'medium',
    withFooter: true,
  },
  parameters: {
    controls: { disable: true },
  },
};

export const NonClosable: Story = {
  args: {
    closable: false,
    moveFocusOnMount: false,
    bodyVariant: 'short',
    withFooter: false,
  },
  parameters: {
    controls: { disable: true },
  },
};

export const BodyOnly: Story = {
  args: {
    moveFocusOnMount: false,
    bodyVariant: 'medium',
    withFooter: false,
  },
  parameters: {
    controls: { disable: true },
  },
};
