/**
 * __mocks__ 하위에 위치한 파일은, vitest, jest에서 특정 모듈을 자동 모킹시킴
 * 만약, 테스트 환경에서 zustand를 모킹하고 싶다면, 이 파일을 작성하면 됨
 */

const { create: actualCreate } = await vi.importActual('zustand');
import { act } from '@testing-library/react';

/** storeResetFns: 모든 스토어를 재설정하는 함수 저장 */
const storeResetFns = new Set();

/** 스토어를 생성할 때 초기 상태를 가져와 리셋 함수를 생성하고 set에 추가 */
export const create = createState => {
  const store = actualCreate(createState);
  const initialState = store.getState();
  storeResetFns.add(() => store.setState(initialState, true));
  return store;
};

/**
 *  테스트가 구동되기 전 모든 스토어 리셋
 * -> 테스트의 독립성 유지
 */
beforeEach(() => {
  act(() => storeResetFns.forEach(resetFn => resetFn()));
});
