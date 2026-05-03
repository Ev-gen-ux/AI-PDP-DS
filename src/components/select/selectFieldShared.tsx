import styled, { css } from 'styled-components';

export type SelectFieldState = 'enabled' | 'hover' | 'focus' | 'disabled' | 'error' | 'success';

export type SelectFieldShellProps = { $state: SelectFieldState };

export const selectBorderWidth = ($state: SelectFieldState): string =>
  $state === 'focus' || $state === 'error' ? '2px' : '1px';

const fieldStateStyles = {
  enabled: css`
    border-color: ${({ theme }) => theme.colors.select.border.enabled};
  `,
  hover: css`
    border-color: ${({ theme }) => theme.colors.select.border.hover};
  `,
  focus: css`
    border-color: ${({ theme }) => theme.colors.select.border.focus};
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  `,
  disabled: css`
    border-color: ${({ theme }) => theme.colors.select.border.disabled};
  `,
  error: css`
    border-color: ${({ theme }) => theme.colors.select.border.error};
  `,
  success: css`
    border-color: ${({ theme }) => theme.colors.select.border.success};
  `,
} as const;

export const SelectRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.paddings.compact};
  width: 100%;
`;

/** Внешняя рамка поля (без кнопки), чтобы рядом разместить отдельную кнопку clear. */
export const SelectFieldShell = styled.div<SelectFieldShellProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.related};
  min-height: ${({ theme }) => theme.spacing.height.large};
  border-style: solid;
  border-width: ${({ $state }) => selectBorderWidth($state)};
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  padding: 0 ${({ theme }) => theme.spacing.paddings.default};
  box-sizing: border-box;
  width: 100%;
  background-color: ${({ theme, $state }) =>
    $state === 'disabled'
      ? theme.colors.select.background.disabled
      : theme.colors.select.background.enabled};
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    box-shadow 0.15s ease;
  ${({ $state }) => fieldStateStyles[$state]}
`;

export const SelectMainButton = styled.button`
  flex: 1;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.related};
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
  color: inherit;

  &:disabled {
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
  }
`;

/** Для Multiselect с `Chips` (кнопка внутри кнопки запрещена). */
export const SelectMainHit = styled.div<{ $disabled: boolean }>`
  flex: 1;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.inner.related};
  min-width: 0;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};

  &:focus-visible {
    outline: none;
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  }
`;

export const SelectValueText = styled.span<{ $hasValue: boolean; $disabled: boolean }>`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.component.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  color: ${({ theme, $hasValue, $disabled }) => {
    if ($disabled) return theme.colors.select.textPlaceholder.disabled;
    return $hasValue
      ? theme.colors.select.textPlaceholderValue.enabled
      : theme.colors.select.textPlaceholder.enabled;
  }};
`;

export const SelectCaretWrap = styled.span<{ $disabled: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.select.icon.disabled : theme.colors.select.icon.enabled};
`;

export const SelectClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.componentInner};
  background: transparent;
  color: ${({ theme }) => theme.colors.select.icon.enabled};
  cursor: pointer;

  &:focus-visible {
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.select.icon.disabled};
    cursor: not-allowed;
  }
`;

/** Панель списка в портале (`document.body`), позиция задаётся через ref + inline style (см. `useSelectListPopover`). */
export const SelectListPopoverPanel = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3200;
  box-sizing: border-box;
`;

export const SelectAnchor = styled.div`
  position: relative;
  width: 100%;
`;

export const resolveSelectFieldState = (params: {
  disabled: boolean;
  invalid: boolean;
  success: boolean;
  focused: boolean;
  hovered: boolean;
}): SelectFieldState => {
  const { disabled, invalid, success, focused, hovered } = params;
  if (disabled) return 'disabled';
  if (invalid) return 'error';
  if (focused) return 'focus';
  if (hovered) return 'hover';
  if (success) return 'success';
  return 'enabled';
};
