require('@testing-library/jest-dom');
const { TextEncoder, TextDecoder } = require('util');
const { ReadableStream, WritableStream, TransformStream } = require('web-streams-polyfill');
const { Blob, File } = require('node:buffer');

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
(global as any).ReadableStream = ReadableStream;
(global as any).WritableStream = WritableStream;
(global as any).TransformStream = TransformStream;
(global as any).Blob = Blob;
(global as any).File = File;

(global as any).MessagePort = class MessagePort {
  addEventListener() {}
  removeEventListener() {}
  postMessage() {}
  start() {}
  close() {}
};
(global as any).MessageChannel = class MessageChannel {
  port1 = new (global as any).MessagePort();
  port2 = new (global as any).MessagePort();
};

// Polyfill for Fetch API (needed for Next.js Request/Response in JSDOM)
const { Request, Response, Headers } = require('undici');
if (typeof (global as any).Request === 'undefined') (global as any).Request = Request;
if (typeof (global as any).Response === 'undefined') (global as any).Response = Response;
if (typeof (global as any).Headers === 'undefined') (global as any).Headers = Headers;




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

