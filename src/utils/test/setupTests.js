import '@testing-library/jest-dom';
// 추가로 사용하고 싶은 매처가 있다면, import 한다.

/** setupTest.js에 선언한 afterEach, afterAll, beforeAll, beforeEach는
 * 모든 테스트 파일에서 실행된다. (ex. 모킹한 모듈 히스토리 초기화)
 * */
afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});

/** matchMedia는 jsdom에서 지원하지 않아, 모킹해서 사용한다. */
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
