require('@testing-library/jest-dom');

// Polyfill for ReadableStream if not available
if (typeof (global as any).ReadableStream === 'undefined') {
  try {
    const { ReadableStream } = require('web-streams-polyfill');
    (global as any).ReadableStream = ReadableStream;
  } catch (e) {
    // Polyfill might not be needed in all environments
  }
}

// Mock for Next.js server functions if not already mocked
if (!jest.isMockFunction(require('next/server').NextRequest)) {
  jest.mock('next/server', () => ({
    NextRequest: class NextRequest {
      constructor(url: string, init?: any) {
        (this as any).url = url;
        (this as any).body = init?.body;
      }
      async json() {
        try {
          return JSON.parse((this as any).body);
        } catch {
          return {};
        }
      }
    },
    NextResponse: {
      json: (data: any, options?: any) => ({
        status: options?.status || 200,
        json: async () => data,
      }),
    },
  }));
}

// Suppress specific console errors in tests
const originalError = console.error;
console.error = function(...args: any[]) {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Not implemented: HTMLFormElement') ||
      args[0].includes('Warning: ReactDOM.render') ||
      args[0].includes('act') ||
      args[0].includes('Tavily search error'))
  ) {
    return;
  }
  originalError.apply(console, args);
};

