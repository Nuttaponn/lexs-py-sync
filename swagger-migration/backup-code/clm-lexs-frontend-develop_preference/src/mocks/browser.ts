import { createMockHandlers } from '@mocks/mock-handlers';
import { rest, setupWorker } from 'msw';

const worker = setupWorker(...createMockHandlers);
worker.start({ onUnhandledRequest: 'bypass' });

export { worker, rest };
