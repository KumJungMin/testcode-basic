import { renderHook, act } from '@testing-library/react';

import useConfirmModal from './useConfirmModal';

/** 커스텀 훅을 검증하는 법
 * renderHook은 커스텀 훅을 렌더링하고, 반환된 훅을 테스트할 수 있게 해준다.
 * act 함수는 컴포넌트가 렌더링한 뒤, 상태를 변경하는 함수를 호출할 때 사용한다.
 **/

it('호출 시 initialValue 인자를 지정하지 않는 경우 isModalOpened 상태가 false로 설정된다.', () => {
  // Arrange
  /** result: 훅이 반환하는 값, result.current로 최신 상태를 확인할 수 있다.
   * * rerender: 훅에 인자를 넘겨 상태를 갱신할 수 있다.
   **/
  const { result, rerender } = renderHook(useConfirmModal);

  // Assert
  expect(result.current.isModalOpened).toBe(false);
});

it('호출 시 initialValue 인자를 boolean 값으로 지정하는 경우 해당 값으로 isModalOpened 상태가 설정된다.', () => {
  // Arrange
  const { result } = renderHook(() => useConfirmModal(true));

  // Assert
  expect(result.current.isModalOpened).toBe(true);
});

it('훅의 toggleIsModalOpened()를 호출하면 isModalOpened 상태가 toggle된다.', () => {
  // Arrange
  const { result } = renderHook(() => useConfirmModal(true));

  // Act
  // render함수나 useEvent의 모듈을 사용하지 않고 상태를 변경하는 코드는 act 함수로 감싸야 한다.
  // 그래야 상태 변경을 감지하고, 테스트 결과를 업데이트할 수 있다.
  act(() => {
    result.current.toggleIsModalOpened();
  });

  // Assert
  expect(result.current.isModalOpened).toBe(false);
});
