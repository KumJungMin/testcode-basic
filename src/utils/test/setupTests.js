import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

import { handlers } from '@/__mocks__/handlers';

/** msw 설정
 * setupServer는 msw/node에서 제공하는 함수로, msw의 서버를 설정함
 * 테스트 환경에서 API 호출을 가로채서 응답을 변경할 수 있음
 */
export const server = setupServer(...handlers);

beforeAll(() => {
  /** msw 서버를 시작함 */
  server.listen();
});

afterEach(() => {
  /** msw 서버의 모든 핸들러를 리셋함 */
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  /** msw 서버를 종료함 */
  vi.resetAllMocks();
  server.close();
});

/** zustand를 __mocks__에 있는 zusand.js로 모킹하게 만듬 */
vi.mock('zustand');

// https://github.com/vitest-dev/vitest/issues/821
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
