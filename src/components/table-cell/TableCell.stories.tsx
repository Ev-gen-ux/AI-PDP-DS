import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';
import { TableCellBadge } from './badge';
import { TableCellEmptyState } from './empty-state';
import { TableCellInlineEdit } from './inline-edit';
import { TableCellSingleChoice } from './single-choice';
import { TableCellSlotCentered } from './slot-centered';
import { TableCellSlotLeftAligned } from './slot-left-aligned';
import { TableCellSplitButton } from './split-button';
import { TableCellTextContent } from './text-content';
import type { TableCellState } from './shared/types';

const meta = {
  title: 'Components/TableCell',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '24px 0 24px 24px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 12,
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
    }}
  >
    <h3
      style={{
        margin: 0,
        fontSize: 16,
        lineHeight: '24px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
      }}
    >
      {title}
    </h3>
    <div
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: 16,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {children}
    </div>
  </div>
);

const InteractiveCell = ({
  renderCell,
}: {
  renderCell: (state: TableCellState, selected: boolean) => ReactNode;
}) => {
  const [state, setState] = useState<TableCellState>('enabled');
  const [selected, setSelected] = useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => {
        if (!selected) setState('hover');
      }}
      onMouseLeave={() => {
        if (!selected) setState('enabled');
      }}
      onMouseDown={() => {
        if (!selected) setState('active');
      }}
      onMouseUp={() => {
        if (!selected) setState('hover');
      }}
      onClick={() => {
        setSelected((prev) => !prev);
      }}
      style={{
        cursor: 'pointer',
        background: 'transparent',
        border: 0,
        padding: 0,
        textAlign: 'left',
      }}
    >
      {renderCell(state, selected)}
    </button>
  );
};

const RenderShowcase = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>
    <Section title="tableCell / emptyState">
      <InteractiveCell
        renderCell={(state, selected) => <TableCellEmptyState state={state} selected={selected} />}
      />
    </Section>
    <Section title="tableCell / singleChoice">
      <InteractiveCell
        renderCell={(state, selected) => (
          <TableCellSingleChoice state={state} selected={selected} checked={selected} />
        )}
      />
    </Section>
    <Section title="tableCell / textContent">
      <InteractiveCell
        renderCell={(state, selected) => <TableCellTextContent state={state} selected={selected} />}
      />
    </Section>
    <Section title="tableCell / badge">
      <InteractiveCell
        renderCell={(state, selected) => <TableCellBadge state={state} selected={selected} />}
      />
    </Section>
    <Section title="tableCell / splitButton">
      <InteractiveCell
        renderCell={(state, selected) => <TableCellSplitButton state={state} selected={selected} />}
      />
    </Section>
    <Section title="tableCell / slotCentered">
      <InteractiveCell
        renderCell={(state, selected) => (
          <TableCellSlotCentered state={state} selected={selected} />
        )}
      />
    </Section>
    <Section title="tableCell / slotLeftAligned">
      <InteractiveCell
        renderCell={(state, selected) => (
          <TableCellSlotLeftAligned state={state} selected={selected} />
        )}
      />
    </Section>
    <Section title="tableCell / inlineEdit">
      <TableCellInlineEdit />
    </Section>
  </div>
);

export const Showcase: Story = {
  render: () => <RenderShowcase />,
  parameters: {
    controls: { disable: true },
  },
};
