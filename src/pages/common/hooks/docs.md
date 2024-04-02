### 리액트 훅이란?

- React 16.8부터 추가되었다.
- 컴포넌트 사이의 로직을 재사용, 비즈니스 로직을 분리하여 결합도를 낮춘다.
- class 없이 리액트 기능을 활용할 수 있다.
- 리액트 훅은 단순 함수이기에 독립적인 단위 테스트를 작성하기 적합하다.
- React Testing Library의 renderHook API로 검증할 수 있다.

<br/>

### 커스텀 훅을 검증하는 법

- `renderHook`, `act`함수로 테스트해야한다.
- `renderHook`은 커스텀 훅을 렌더링하고, 반환된 훅을 테스트할 수 있게 해준다.
- `act` 함수는 컴포넌트가 렌더링한 뒤, 상태를 변경하는 함수를 호출할 때 사용한다.

```js
it('호출 시 initialValue 인자를 지정하지 않는 경우 isModalOpened 상태가 false로 설정된다.', () => {
  // Arrange
  /** result: 훅이 반환하는 값, result.current로 최신 상태를 확인할 수 있음.
   * rerender: 훅에 인자를 넘겨 상태를 갱신할 수 있음
   **/
  const { result, rerender } = renderHook(useConfirmModal);

  // Assert
  expect(result.current.isModalOpened).toBe(false);
});
```

```js
it('훅의 toggleIsModalOpened()를 호출하면 isModalOpened 상태가 toggle된다.', () => {
  // Arrange
  const { result } = renderHook(() => useConfirmModal(true));

  // Act
  act(() => {
    result.current.toggleIsModalOpened();
  });

  // Assert
  expect(result.current.isModalOpened).toBe(false);
});
```

<br/>

### act 함수

- 테스트 환경에서 컴포넌트의 렌더링, 업데이트 결과를 jsdom에 반영할 때 사용해야 한다.
- React Testing Library의 `render`함수와 `user-event`는 내부적으로 `act` 함수를 호출하기에 테스트 코드 작성시 `act`함수 호출이 불필요했다.
- 그러나 `render`함수와 `user-event`로 검증하지 않는 경우, 변경점을 반영하기 위해 별도로 `act`함수를 호출해야한다.

ex) 리액트 state를 업데이트하여 변경 사항을 검증하는 경우
