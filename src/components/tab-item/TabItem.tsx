import {
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type MutableRefObject,
  type Ref,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import styled, { css } from 'styled-components';
import { TabGroupContext } from '@/components/tab-group/tab-group-context';

function assignRef<T>(ref: Ref<T> | undefined, node: T | null): void {
  if (typeof ref === 'function') {
    ref(node);
  } else if (ref) {
    (ref as MutableRefObject<T | null>).current = node;
  }
}

export type TabItemState = 'enabled' | 'hover' | 'active' | 'focus' | 'disabled';

export interface TabItemProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'ref'
> {
  /** Unique id within the tab group; drives selection when used inside `TabGroup`. */
  value: string;
  text: string;
  /** Selected when `TabItem` is used outside of `TabGroup` (ignored when context is present). */
  selected?: boolean;
  /** Forces a visual state for documentation stories; omit for real `:hover` / `:focus-visible`. */
  state?: TabItemState;
}

type InnerProps = {
  $selected: boolean;
  $disabled: boolean;
  $demo: TabItemState | null;
};

type TabButtonProps = InnerProps & {
  $interactiveHover: boolean;
};

const Inner = styled.span<InnerProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.componentBase};
  padding: ${({ theme }) => theme.spacing.paddings.compact};
  font-family: ${({ theme }) => theme.typography.fontFamily.component};
  font-size: ${({ theme }) => theme.typography.fontSize.component.small};
  line-height: ${({ theme }) => theme.typography.lineHeight.text.small};
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  background-color: ${({ theme, $selected, $disabled, $demo }) => {
    if ($disabled || $demo === 'disabled') {
      return theme.colors.tab.item.background.calm.disabled;
    }
    if ($selected) {
      return theme.colors.tab.item.background.calm.selected;
    }
    if ($demo === 'hover' || $demo === 'active') {
      return theme.colors.tab.item.background.calm.hover;
    }
    return theme.colors.tab.item.background.calm.enabled;
  }};

  color: ${({ theme, $selected, $disabled, $demo }) => {
    if ($disabled || $demo === 'disabled') {
      return theme.colors.tab.item.label.loud.disabled;
    }
    if ($selected) {
      return theme.colors.tab.item.label.loud.selected;
    }
    return theme.colors.tab.item.label.loud.enabled;
  }};

  font-weight: ${({ theme, $selected, $disabled, $demo }) =>
    $disabled || $demo === 'disabled'
      ? theme.typography.fontWeight.medium
      : $selected
        ? theme.typography.fontWeight.semiBold
        : theme.typography.fontWeight.medium};
`;

const TabButton = styled.button<TabButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-align: center;
  transition: box-shadow 0.15s ease;

  &:disabled {
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
  }

  ${({ $interactiveHover, $selected, $demo }) =>
    $interactiveHover && !$selected && !$demo
      ? css`
          &:hover:enabled ${Inner} {
            background-color: ${({ theme }) => theme.colors.tab.item.background.calm.hover};
          }
        `
      : null}

  ${({ $demo }) =>
    $demo === 'focus'
      ? css`
          box-shadow: 0px 0px 0px 2px ${({ theme }) => theme.colors.focus.ring.default};
        `
      : null}
`;

export const TabItem = forwardRef<HTMLButtonElement, TabItemProps>(function TabItem(
  {
    value,
    text,
    selected: selectedProp,
    state: stateProp,
    disabled,
    onClick,
    onKeyDown,
    type = 'button',
    ...rest
  },
  forwardedRef,
) {
  const ctx = useContext(TabGroupContext);
  const selectedFromCtx = ctx !== null && ctx.selectedValue === value;
  const selected = ctx !== null ? selectedFromCtx : Boolean(selectedProp);
  const demoState = stateProp ?? null;
  const isDisabled = Boolean(disabled || demoState === 'disabled');
  const interactiveHover = demoState === null;

  const tabId = ctx ? `${ctx.baseId}-tab-${value}` : undefined;

  const registerTab = ctx?.registerTab;

  useEffect(() => {
    if (!registerTab) {
      return undefined;
    }
    return registerTab(value);
  }, [registerTab, value]);

  const moveFocus = useCallback(
    (nextValue: string) => {
      if (!ctx) {
        return;
      }
      ctx.selectValue(nextValue);
      window.requestAnimationFrame(() => {
        ctx.tabButtonRefs.current[nextValue]?.focus();
      });
    },
    [ctx],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || !ctx || isDisabled) {
        return;
      }
      const tabOrder = ctx.tabOrderRef.current;
      const idx = tabOrder.indexOf(value);
      if (idx < 0) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const delta = e.key === 'ArrowRight' ? 1 : -1;
        const len = tabOrder.length;
        if (len === 0) {
          return;
        }
        const nextIdx = (idx + delta + len) % len;
        moveFocus(tabOrder[nextIdx]!);
      } else if (e.key === 'Home') {
        e.preventDefault();
        moveFocus(tabOrder[0]!);
      } else if (e.key === 'End') {
        e.preventDefault();
        moveFocus(tabOrder[tabOrder.length - 1]!);
      }
    },
    [ctx, isDisabled, moveFocus, onKeyDown, value],
  );

  const tabIndex = useMemo(() => {
    if (!ctx) {
      return undefined;
    }
    return selected ? 0 : -1;
  }, [ctx, selected]);

  const tabSemantics = useMemo(() => {
    if (!ctx) {
      return {};
    }
    return {
      role: 'tab' as const,
      'aria-selected': selected,
      tabIndex,
    };
  }, [ctx, selected, tabIndex]);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented && ctx && !isDisabled) {
        ctx.selectValue(value);
      }
    },
    [ctx, isDisabled, onClick, value],
  );

  const setButtonRef = useCallback(
    (el: HTMLButtonElement | null) => {
      if (ctx) {
        ctx.tabRef(value)(el);
      }
      assignRef(forwardedRef, el);
    },
    [ctx, forwardedRef, value],
  );

  return (
    <TabButton
      {...rest}
      ref={setButtonRef}
      type={type}
      id={tabId}
      {...tabSemantics}
      disabled={isDisabled}
      $selected={selected}
      $disabled={isDisabled}
      $demo={demoState}
      $interactiveHover={interactiveHover}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <Inner $selected={selected} $disabled={isDisabled} $demo={demoState}>
        {text}
      </Inner>
    </TabButton>
  );
});

TabItem.displayName = 'TabItem';
