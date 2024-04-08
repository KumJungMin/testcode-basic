## 상태 관리 모킹하기(zustand)

- store를 원하는 상태로 테스트하기 위해 zustand 모킹이 필요하다.
- 앱의 전역 상태를 모킹해 테스트 전, 후에 값을 변경하고 초기화해야 한다.
- `mocks/zustand.js`를 통해 자동 모킹을 적용해 스토어를 초기화하자

<br/>

### zustand 모킹하는 법

- `__mocks__` 하위 파일은, vitest, jest에서 특정 모듈을 자동 모킹시킨다.
- 만약, 테스트 환경에서 `zustand`를 모킹하고 싶다면, `__mocks__/zustand.js`를 작성하면 된다.

```js
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
```

<br/>

- `setupTest.js`에 `vi.mock('zustand')`를 호출해, `__mocks__/zustand.js`를 모킹하게 만든다.

```js
// setupTest.js

vi.mock('zustand');
```

<br/>

- `mockZustandStore` 유틸 함수로 zustand 스토어의 상태 변경한다.

```js
// mockZustandStore.jsx
/** 1. 모킹하고 싶은 store를 import함 */
import { useCartStore } from '@/store/cart';
import { useFilterStore } from '@/store/filter';
import { useUserStore } from '@/store/user';

/**
 * 2. mockStore는 테스트 환경에서 zustand 스토어를 모킹하기 위한 함수
 * 이 mockStore로 각 store의 상태를 변경할 수 있음
 * */
const mockStore = (hook, state) => {
  const initStore = hook.getState();
  hook.setState({ ...initStore, ...state }, true);
};

/** 3. store를 원하는 state로 초기화하고 싶을 때 사용 */
export const mockUseUserStore = state => {
  mockStore(useUserStore, state);
};

export const mockUseCartStore = state => {
  mockStore(useCartStore, state);
};

export const mockUseFilterStore = state => {
  mockStore(useFilterStore, state);
};
```
