## ProductInfoTable의 통합 테스트

> `cart`, `user` 스토어 + `ProductInfoTableRow`가 결합된 컴포넌트.

- `ProductInfoTable` 컴포넌트에 `state`와 `API` 제어 코드를 응집해 관리하는 것이 좋다.
- 그러면, 로직 파악 및 유지 보수에 좋고, 통합 테스트의 단위를 깔끔하게 나눌 수 있다.
- 비즈니스 로직을 컴포넌트 통합 테스트로 검증할 수 있다.

<br/>

## 테스트 하는 방법(ProductInfoTable.spec.jsx)

> 잠깐! 왜 `ProductInfoTableRow` 대신 `ProductInfoTable` 컴포넌트를 테스트할까?

- `cart state` 변경에 따른 UI 변경도 검증이 가능해, 실제 앱의 기능을 유사하게 테스트할 수 있다.
- `ProductInfoTableRow` 컴포넌트의 기능까지 모두 검증할 수 있다.

<br/>

> 만약, `ProductInfoTableRow`에서도 state 액션을 가져오게 되면?

- 상태 관리 코드 산재 & 로직 파악 및 테스트 파악 어려움이 있다.
- 그래서 `state`, `api` 제어 코드를 통합 테스트 대상 컴포넌트로 응집하는 게 좋다
 -> 그러면, 유지보수성 향상, 테스트의 단위 나누기 좋음

<br/>

### 1. 사전 모킹하기

- `mockUseCartStore`, `mockUseUserStore`를 사용하여 cart, user 상태를 설정한다.

```js
beforeEach(() => {
  mockUseUserStore({ user: { id: 10 } });
  mockUseCartStore({
    cart: {
      1: {
        id: 1,
        title: '상품1',
        price: 809,
        description: 'one',
        images: ['', '', ''],
        count: 3,
      },
      2: {
        id: 2,
        title: '상품2',
        price: 442,
        description: 'two',
        images: ['', '', ''],
        count: 4,
      },
    },
  });
});
```

<br/>

### 2. 테스트 작성하기

> Test1. 장바구니에 포함된 아이템들의 이름, 수량, 합계가 제대로 노출된다

- `within`은 어떤 요소 내에서 특정 요소를 찾을 수 있게 해준다.

```js
it('장바구니에 포함된 아이템들의 이름, 수량, 합계가 제대로 노출된다', async () => {
  // Arrange
  await render(<ProductInfoTable />);
  const [firstItem] = screen.getAllByRole('row');

  // Assert
  // -> firstItem에서 '상품1'이라는 텍스트를 찾는다.
  expect(within(firstItem).getByText('상품1')).toBeInTheDocument();
  expect(within(firstItem).getByRole('textbox')).toHaveValue('3');
  expect(within(firstItem).getByText('$2,427.00')).toBeInTheDocument();
});
```

<br/>

> Test2. 특정 아이템의 수량이 1000개로 변경될 경우 "최대 999개 까지 가능합니다!"라고 경고 문구가 노출된다

- `window.alert`은 스파이 함수로 테스트할 수 있다.
- `toHaveBeenNthCalledWith`은 n번째 호출 시 전달된 인자를 검증한다.

```js
it('특정 아이템의 수량이 1000개로 변경될 경우 "최대 999개 까지 가능합니다!"라고 경고 문구가 노출된다', async () => {
  // Arrange
  const { user } = await render(<ProductInfoTable />);
  const [firstItem] = screen.getAllByRole('row');
  const input = within(firstItem).getByRole('textbox');
  const alertSpy = vi.fn();
  vi.stubGlobal('alert', alertSpy); // window.alert을 스파이 함수로 대체

  // Act
  await user.clear(input); // input 요소의 값을 지움
  await user.type(input, '1000'); // 1000개 입력

  // Assert
  expect(alertSpy).toHaveBeenNthCalledWith(1, '최대 999개 까지 가능합니다!');
});
```

<br/>

> Test3. 특정 아이템의 삭제 버튼을 클릭할 경우 해당 아이템이 사라진다

- `queryByText`는 요소의 존재 여부를 검사한다. 존재하지 않으면 null 반환하고 에러 발생시키지 않는다.

```js
it('특정 아이템의 삭제 버튼을 클릭할 경우 해당 아이템이 사라진다', async () => {
  // Arrange
  const { user } = await render(<ProductInfoTable />);
  const [, secondItem] = screen.getAllByRole('row');
  const deleteButton = within(secondItem).getByRole('button');

  // Assert
  expect(screen.getByText('상품2')).toBeInTheDocument();

  // Act
  await user.click(deleteButton);

  // Assert
  expect(screen.queryByText('상품2')).not.toBeInTheDocument();
});
```

<br/>

> Test4. 특정 아이템의 수량이 변경되었을 때 값이 재계산되어 올바르게 업데이트 된다

- `input`에 값을 넣는 경우, 사전에 input값을 꼭 지워주자. (`user.clear(input)`)

```js
it('특정 아이템의 수량이 변경되었을 때 값이 재계산되어 올바르게 업데이트 된다', async () => {
  // Arrange
  const { user } = await render(<ProductInfoTable />);
  const [firstItem] = screen.getAllByRole('row');
  const input = within(firstItem).getByRole('textbox');

  // Act
  await user.clear(input); // input 요소의 값을 지움
  await user.type(input, '5'); // input 요소에 '5'를 입력

  // Assert
  expect(within(firstItem).getByText('$4,045.00')).toBeInTheDocument();
});
```
