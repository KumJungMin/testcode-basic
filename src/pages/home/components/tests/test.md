## 비동기 함수로 노출 테스트하기

> 상품 목록 화면을 기준으로 테스트한 예시

### 1. handlers에 모의 응답 정의

- `handlers.js`에서 모킹 데이터를 기준으로 상품 목록 API의 페이징 응답 결과를 반환하도록 설정한다.
- `request`, `response`로 원하는 시나리오를 생성한다.

```js
// handlers.js

/**
 * 1. 테스트 환경에서 상품 목록 조회 API 요청이 실행되면 msw에서 요청을 가로챔
 * 2. products.json에 정의한 상품 목록 모킹 데이터를 페이징 단위로 잘라 API 응답처럼 반환
 * 3. 테스트 코드에서 동일한 모킹 데이터를 기반으로 원하는 시나리오에 대한 안정성 있는 검증 가능
 * */
rest.get(`${API_DOMAIN}${apiRoutes.products}`, (req, res, ctx) => {
  const data = response[apiRoutes.products];
  const offset = Number(req.url.searchParams.get('offset'));
  const limit = Number(req.url.searchParams.get('limit'));
  const products = data.products.filter(
    (_, index) => index >= offset && index < offset + limit,
  );

  return res(
    ctx.status(200),
    ctx.json({ products, lastPage: products.length < limit }),
  );
}),

```

<br/>

### 2. 실제 테스트 작성하기

- 현재 테스트에서는 API 호출 후에 테스트 대상 컴포넌트를 렌더링한다.
- 이 경우 컴포넌트를 접근할 때, `findByXXXX` 쿼리를 사용해여한다.
- `findByXXX` 쿼리는 쿼리가 통과하거나 시간 초과될 때 까지 재시도한다.(_1초 동안 50ms간격으로_)
- 비동기 처리(_ex. API 호출_)로 인한 변화를 감지할 때 사용하기 좋다.
- 단, `findByXXX` 쿼리는 Promise를 반환하므로 꼭! `await`를 해줘야한다.

```js
it('로딩이 완료된 경우 상품 리스트가 제대로 모두 노출된다', async () => {
  // Arrange
  await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);
  const productCards = await screen.findAllByTestId('product-card');

  // Assert
  expect(productCards).toHaveLength(PRODUCT_PAGE_LIMIT);

  productCards.forEach((el, index) => {
    /** within은 특정 엘리먼트 기준으로 쿼리를 실행할 수 있게 해줌  */
    const productCard = within(el);
    const product = data.products[index]; // 상품 데이터

    // 상품 카드에 상품 정보가 제대로 노출되는지 검증
    expect(productCard.getByText(product.title)).toBeInTheDocument();
    expect(productCard.getByText(product.category.name)).toBeInTheDocument();
    expect(
      productCard.getByText(formatPrice(product.price)),
    ).toBeInTheDocument();
    expect(
      productCard.getByRole('button', { name: '장바구니' }),
    ).toBeInTheDocument();
    expect(
      productCard.getByRole('button', { name: '구매' }),
    ).toBeInTheDocument();
  });
});
```

<br/>

```js
it('보여줄 상품 리스트가 더 있는 경우 show more 버튼이 노출되며, 버튼을 누르면 상품 리스트를 더 가져온다.', async () => {
  // Arrange
  const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

  // Act
  // Tip: show more 버튼이 노출되는지 확인
  // show more는 상품 목록이 불러와진 후에 노출되므로, 상품 목록이 불러와진 후에 검증해야함
  // findAllByTestId 쿼리로, 첫 페이지의 상품 목록이 렌더링되는 걸 기다리기!
  await screen.findAllByTestId('product-card');

  // Assert
  expect(screen.getByRole('button', { name: 'Show more' })).toBeInTheDocument();

  // Arrange
  const moreBtn = screen.getByRole('button', { name: 'Show more' });

  // Act
  await user.click(moreBtn);

  // Assert - 상품의 개수가 5 -> 10개로 늘어났는지 확인
  expect(await screen.findAllByTestId('product-card')).toHaveLength(
    2 * PRODUCT_PAGE_LIMIT,
  );
});
```

```js
it('보여줄 상품 리스트가 없는 경우 show more 버튼이 노출되지 않는다.', async () => {
  // Arrange - 모킹 데이터의 제한을 모킹 데이터 개수(20개)보다 크게 설정
  await render(<ProductList limit={40} />);

  // Act
  await screen.findAllByTestId('product-card');

  // Assert - queryByXXX를 사용해야, dom이 없을 때 에러를 발생시키지 않음
  expect(screen.queryByRole('button', { name: 'Show more' })).toBeNull();
});
```
