import {
  type FC,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { TabGroupContext, type TabGroupContextValue } from './tab-group-context';

export interface TabGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Controlled selected tab value (must match a child `TabItem` `value`). */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  max-width: 100%;
`;

const TabRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  flex-wrap: nowrap;
`;

const InsetMeasure = styled.span`
  position: absolute;
  left: 0;
  top: 0;
  width: ${({ theme }) => theme.spacing.tab.item.indicatorInset};
  height: 0;
  overflow: hidden;
  visibility: hidden;
  pointer-events: none;
`;

const BorderTrack = styled.div`
  position: relative;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.inner.close};
  border-bottom: 1px solid ${({ theme }) => theme.colors.tab.group.border.calm.enabled};
`;

const Indicator = styled.div<{ $active: boolean }>`
  position: absolute;
  bottom: -1px;
  left: 0;
  height: ${({ theme }) => theme.spacing.tab.item.indicatorHeight};
  border-radius: ${({ theme }) => theme.borderRadius.componentInner}
    ${({ theme }) => theme.borderRadius.componentInner} 0 0;
  background-color: ${({ theme }) => theme.colors.tab.item.selectIndicator.calm.enabled};
  pointer-events: none;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition:
    left 0.15s ease,
    width 0.15s ease,
    opacity 0.15s ease;
`;

export const TabGroup: FC<TabGroupProps> = ({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  children,
  ...rest
}) => {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const selectedValue = valueProp !== undefined ? valueProp : uncontrolled;
  const tabOrderRef = useRef<string[]>([]);
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const baseId = useId();
  const tabRowRef = useRef<HTMLDivElement>(null);
  const borderTrackRef = useRef<HTMLDivElement>(null);
  const insetMeasureRef = useRef<HTMLSpanElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const selectValue = useCallback(
    (next: string) => {
      onValueChange?.(next);
      if (valueProp === undefined) {
        setUncontrolled(next);
      }
    },
    [onValueChange, valueProp],
  );

  const registerTab = useCallback((tabValue: string) => {
    const order = tabOrderRef.current;
    if (!order.includes(tabValue)) {
      tabOrderRef.current = [...order, tabValue];
    }
    return () => {
      tabOrderRef.current = tabOrderRef.current.filter((v) => v !== tabValue);
      delete tabButtonRefs.current[tabValue];
    };
  }, []);

  const tabRef = useCallback(
    (tabValue: string) => (el: HTMLButtonElement | null) => {
      tabButtonRefs.current[tabValue] = el;
    },
    [],
  );

  const ctx = useMemo<TabGroupContextValue>(
    () => ({
      selectedValue,
      selectValue,
      tabOrderRef,
      registerTab,
      tabRef,
      tabButtonRefs,
      baseId,
    }),
    [selectedValue, selectValue, registerTab, tabRef, baseId],
  );

  useLayoutEffect(() => {
    const track = borderTrackRef.current;
    if (!track) {
      return undefined;
    }

    const updateIndicator = () => {
      const insetEl = insetMeasureRef.current;
      if (!insetEl || selectedValue === '') {
        setIndicator(null);
        return;
      }
      const btn = tabButtonRefs.current[selectedValue];
      if (!btn) {
        setIndicator(null);
        return;
      }
      const insetPx = insetEl.offsetWidth;
      const tr = track.getBoundingClientRect();
      const br = btn.getBoundingClientRect();
      const left = br.left - tr.left + insetPx;
      const width = Math.max(0, br.width - 2 * insetPx);
      setIndicator({ left, width });
    };

    updateIndicator();

    const ro = new ResizeObserver(updateIndicator);
    if (tabRowRef.current) {
      ro.observe(tabRowRef.current);
    }
    ro.observe(track);
    window.addEventListener('resize', updateIndicator);

    const id = window.requestAnimationFrame(updateIndicator);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateIndicator);
      window.cancelAnimationFrame(id);
    };
  }, [selectedValue]);

  return (
    <TabGroupContext.Provider value={ctx}>
      <Shell {...rest}>
        <TabRow ref={tabRowRef} role="tablist">
          {children}
        </TabRow>
        <BorderTrack ref={borderTrackRef}>
          <InsetMeasure ref={insetMeasureRef} aria-hidden />
          <Indicator
            aria-hidden
            $active={Boolean(indicator && indicator.width > 0)}
            style={
              indicator
                ? {
                    left: indicator.left,
                    width: indicator.width,
                  }
                : { left: 0, width: 0 }
            }
          />
        </BorderTrack>
      </Shell>
    </TabGroupContext.Provider>
  );
};
