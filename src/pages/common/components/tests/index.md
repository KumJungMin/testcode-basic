## msw의 API 응답을 수정하는 법

> 만약 handler에 선언한 API 함수의 응답을 특정 테스트에서 수정해야한다면?<br/>이 경우 mock의 use()를 사용해 해결할 수 있다!

### mock의 use 사용법

- 사용자 정보를 호출하는 가상 API는 null값을 응답하도록 선언되어 있다.
- 하지만 특정 테스트에서는 사용자 정보가 있어야 한다면? (_로그인 상태에서 어떤 테스트를 할 경우_)

```js
// handlers.js

export const handlers = [
  ...rest.get(`${API_DOMAIN}${apiRoutes.profile}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(null));
  }),
];
```

<br/>

- 로그인이 된 상태에서 테스트를 진행해야 하는 경우...
- 이 경우 msw에서 제공하는 `use()`를 이용해 API 응답을 수정할 수 있디.
- `use()`의 경우, `setupTest.js`에서 선언한 `setupServer()`를 이용해 설정해야한다.

```js
// NavigationBar.spec.js

describe('로그인이 된 경우', () => {
  const userId = 10;
  beforeEach(() => {
    // use를 사용해, 기존 handler의 응답을 변경할 수 있음
    server.use(
      rest.get('/user', (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            name: 'Maria',
            email: 'maria@mail.com',
            id: userId,
            password: '12345',
          }),
        );
      }),
    );
    ...
  });

  it('장바구니(담긴 상품 수와 버튼)와 로그아웃 버튼(사용자 이름: "Maria")이 노출된다.', async () => {
    ...
  });
});
```

<br/>

- 단, 이때 주의할 점은 `server.use`를 사용하는 경우, 각 테스트 케이스마다 핸들러를 리셋해야한다.
- `setUpTests.js`에서 `afterEach()` 단계에서 리셋해주면 된다.

```js
// setupTests.js

afterEach(() => {
  server.resetHandlers();
  ...
});
```
