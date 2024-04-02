### 비동기를 테스트하는 법(with. 타이머)

- 테스트 코드는 동기적으로 실행한다.
- 비동기 함수가 실행되기 전에 테스트가 종료되어 테스트가 실패할 수 있다.
- 타이머를 원하는대로 제어하기 위해서는 타이머 모킹이 필요하다
- `useFakeTimers()`로 타이머를 모킹할 수 있으며, `advanceTimersByTime()`로 시간이 흐른 것처럼 제어할 수 있다.
- 테스트가 실행 된 후 다른 테스트에 영향을 주지 않기 위해 타이머 모킹을 해제해야한다.
- `useRealTimers()`를 호출해 타이머를 원래대로 되돌릴 수 있다.

```js
describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    // 테스트 후 타이머를 원래대로 돌려놓음
    vi.useRealTimers();
  });

  it('특정 시간이 지난 후 함수가 실행된다', () => {
    const spy = vi.fn();
    const time = 300;

    const debounced = debounce(spy, time);

    debounced();

    vi.advanceTimersByTime(time);

    expect(spy).toHaveBeenCalled();
  });
});
```

<br/>

- `setSystemTime()`으로 테스트가 구동되는 시간을 정의할 수 있다.

```js
beforeEach(() => {
  vi.setSystemTime(new Date('2021-01-01'));
});
```
