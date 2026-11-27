import { createContext, useContext, type MutableRefObject } from 'react';

export type TabGroupContextValue = {
  selectedValue: string;
  selectValue: (value: string) => void;
  tabOrderRef: MutableRefObject<string[]>;
  registerTab: (value: string) => () => void;
  tabButtonRefs: MutableRefObject<Record<string, HTMLButtonElement | null>>;
  tabRef: (value: string) => (el: HTMLButtonElement | null) => void;
  baseId: string;
};

export const TabGroupContext = createContext<TabGroupContextValue | null>(null);

export function useTabGroupContext(): TabGroupContextValue | null {
  return useContext(TabGroupContext);
}
