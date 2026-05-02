import '@testing-library/jest-dom/vitest';

/** jsdom does not implement ResizeObserver; TabGroup uses it for the selection indicator. */
class ResizeObserverMock {
  constructor(private readonly callback: ResizeObserverCallback) {}

  observe(): void {
    this.callback([], this as unknown as ResizeObserver);
  }

  unobserve(): void {}

  disconnect(): void {}
}

globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
