import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { InputFile, type InputFileItem } from './InputFile';

const meta: Meta<typeof InputFile> = {
  title: 'Components/InputFile',
  component: InputFile,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Поле выбора файла с подписью и списком карточек FileUpload (отступ между блоком и карточками — inner/related, 8px).',
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
};

export default meta;
type Story = StoryObj<typeof InputFile>;

export const Default: Story = {
  args: {
    label: 'Label',
    actionLabel: 'Action',
    placeholder: 'Placeholder',
    helpMessage: 'Help message',
  },
};

export const WithFiles: Story = {
  render: function Render() {
    const [items, setItems] = useState<InputFileItem[]>([
      {
        id: '1',
        fileName: 'report.xlsx',
        fileSizeLabel: '42 (KB)',
        status: 'success',
      },
      {
        id: '2',
        fileName: 'draft.docx',
        fileSizeLabel: '128 (KB)',
        status: 'uploading',
      },
    ]);
    return (
      <InputFile
        label="Attachments"
        helpMessage="Up to 10 MB per file"
        items={items}
        onItemsChange={setItems}
        onFilesSelected={(list) => {
          const next: InputFileItem[] = [...items];
          Array.from(list).forEach((file, i) => {
            next.push({
              id: `${Date.now()}-${i}`,
              fileName: file.name,
              fileSizeLabel: `${Math.max(1, Math.round(file.size / 1024))} (KB)`,
              status: 'uploading',
            });
          });
          setItems(next);
        }}
      />
    );
  },
};

export const Invalid: Story = {
  args: {
    label: 'Label',
    invalid: true,
    errorMessage: 'Выберите файл',
    helpMessage: 'Help message',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Label',
    disabled: true,
    items: [
      {
        id: '1',
        fileName: 'only-read.pdf',
        fileSizeLabel: '1 (KB)',
        status: 'success',
      },
    ],
  },
};

export const FieldStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>
      <InputFile label="Enabled" helpMessage="Help message" />
      <InputFile label="Invalid" invalid errorMessage="Error message" />
      <InputFile label="Success" success helpMessage="Valid" />
      <InputFile label="Disabled" disabled helpMessage="Help message" />
    </div>
  ),
};
