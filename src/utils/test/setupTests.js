import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

import { handlers } from '@/__mocks__/handlers';

/* msw */
export const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();

  // 모킹된 모의 객체 호출에 대한 히스토리를 초기화
  // 단, 모듈의 모킹은 유지됨
  // -> 모킹 모듈 기반으로 작성된 테스트 코드를 작성할 때 유용
  // 반면, 모킹 히스토리가 쌓이므로 다른 테스트에 영향을 줄 수 있음
  vi.clearAllMocks();
});

afterAll(() => {
  // 모킹 모듈에 대한 모든 구현을 초기화
  // -> 테스트의 안전성과 신뢰성을 보장
  vi.resetAllMocks();
  server.close();
});

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
