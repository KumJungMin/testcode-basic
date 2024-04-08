import { useCartStore } from '@/store/cart';
import { useFilterStore } from '@/store/filter';
import { useUserStore } from '@/store/user';

/**
 * mockStore는 테스트 환경에서 zustand 스토어를 모킹하기 위한 함수
 * 이 mockStore로 각 store의 상태를 변경할 수 있음
 * */
const mockStore = (hook, state) => {
  const initStore = hook.getState();
  hook.setState({ ...initStore, ...state }, true);
};

/** store를 원하는 state로 초기화하고 싶을 때 사용 */
export const mockUseUserStore = state => {
  mockStore(useUserStore, state);
};

export const mockUseCartStore = state => {
  mockStore(useCartStore, state);
};

export const mockUseFilterStore = state => {
  mockStore(useFilterStore, state);
};
