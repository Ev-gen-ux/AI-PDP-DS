import { Button } from '@/components/button';
import { ModalFooterActions } from './Modal';

export const modalStoryFooterActions = (
  <ModalFooterActions>
    <Button appearance="primary" size="small" text="Button Label" />
    <Button appearance="outline" size="small" text="Button Label" />
  </ModalFooterActions>
);

export const modalStoryBodyByVariant = {
  short: <div style={{ minHeight: 80 }}>Короткое содержимое body.</div>,
  medium: (
    <div style={{ minHeight: 180 }}>
      Средний блок контента: проверка отступов и минимальной высоты панели.
    </div>
  ),
  long: (
    <div style={{ minHeight: 120 }}>
      {Array.from({ length: 16 }, (_, i) => (
        <p key={i} style={{ margin: '0 0 8px' }}>
          Строка {i + 1}. Прокрутка внутри области body.
        </p>
      ))}
    </div>
  ),
} as const;

export type ModalStoryBodyVariant = keyof typeof modalStoryBodyByVariant;
