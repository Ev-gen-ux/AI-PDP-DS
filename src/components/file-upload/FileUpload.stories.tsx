import type { Meta, StoryObj } from '@storybook/react';
import { FileUpload } from './FileUpload';

const meta: Meta<typeof FileUpload> = {
  title: 'Components/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Карточка загруженного файла: имя, размер, удаление, спиннер при загрузке, ошибка.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px', width: '320px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    fileName: { description: 'Отображаемое имя файла' },
    fileSizeLabel: { description: 'Подпись размера (например «16 (KB)»)' },
    status: { control: 'select', options: ['success', 'uploading', 'error'] },
    onRemove: { action: 'remove' },
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: {
    fileName: 'document.pdf',
    fileSizeLabel: '128 (KB)',
    status: 'success',
    onRemove: () => undefined,
  },
};

export const Uploading: Story = {
  args: {
    fileName: 'large-archive.zip',
    fileSizeLabel: '2 (MB)',
    status: 'uploading',
    onRemove: () => undefined,
  },
};

export const Error: Story = {
  args: {
    fileName: 'broken.png',
    fileSizeLabel: '16 (KB)',
    status: 'error',
    errorMessage: 'Не удалось загрузить файл',
    onRemove: () => undefined,
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <FileUpload
        fileName="Name"
        fileSizeLabel="16 (KB)"
        status="success"
        onRemove={() => undefined}
      />
      <FileUpload
        fileName="Name"
        fileSizeLabel="16 (KB)"
        status="uploading"
        onRemove={() => undefined}
      />
      <FileUpload
        fileName="Name"
        fileSizeLabel="16 (KB)"
        status="error"
        errorMessage="Help message"
        onRemove={() => undefined}
      />
    </div>
  ),
};
