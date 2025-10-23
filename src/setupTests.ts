import '@testing-library/jest-dom';
import './i18n';

import '@testing-library/jest-dom';

// Mock i18n module and JSON imports
jest.mock('./i18n', () => ({
  __esModule: true,
  default: {
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockReturnThis(),
    changeLanguage: jest.fn(),
    language: 'en',
  },
}));

// Mock locale JSON files
jest.mock('./i18n/locales/en.json', () => ({}));
jest.mock('./i18n/locales/es.json', () => ({}));
jest.mock('./i18n/locales/fr.json', () => ({}));
jest.mock('./i18n/locales/de.json', () => ({}));
jest.mock('./i18n/locales/zh.json', () => ({}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Return the key for testing
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

// Mock IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: class IntersectionObserver {
    constructor() {}
    observe() {}
    disconnect() {}
    unobserve() {}
  },
});

// Mock ResizeObserver
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: class ResizeObserver {
    constructor() {}
    observe() {}
    disconnect() {}
    unobserve() {}
  },
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollIntoView for JSDOM
Element.prototype.scrollIntoView = jest.fn();

// Mock hasPointerCapture for Radix UI components
Element.prototype.hasPointerCapture = jest.fn(() => false);
Element.prototype.setPointerCapture = jest.fn();
Element.prototype.releasePointerCapture = jest.fn();

// Mock fetch and Response for all tests
Object.defineProperty(globalThis, 'fetch', {
  writable: true,
  value: jest.fn(),
});

// Mock Response constructor
Object.defineProperty(globalThis, 'Response', {
  writable: true,
  value: class MockResponse {
    ok: boolean;
    status: number;
    statusText: string;
    headers: Map<string, string>;
    url: string;
    private _body: unknown;

    constructor(body?: BodyInit | null, init?: ResponseInit) {
      this.ok = (init?.status ?? 200) >= 200 && (init?.status ?? 200) < 300;
      this.status = init?.status ?? 200;
      this.statusText = init?.statusText ?? 'OK';
      this.headers = new Map();
      this.url = '';
      this._body = body;
    }

    async json(): Promise<unknown> {
      if (typeof this._body === 'string') {
        return JSON.parse(this._body);
      }
      return this._body || {};
    }

    async text(): Promise<string> {
      return typeof this._body === 'string'
        ? this._body
        : JSON.stringify(this._body || {});
    }

    clone(): Response {
      return this as unknown as Response;
    }
  },
});
