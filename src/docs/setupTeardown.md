### setup, teardown?

> `setup`: 테스트를 실행하기 전 수행해야 하는 작업<br/>`teardown`: 테스트를 실행한 뒤 수행해야 하는 작업

- setup과 teardown으로 테스트 실행 전, 후 실행되어야 할 반복 작업을 깔끔하게 관리 가능
- 테스트 별로 별도의 스코프로 동작하기 때문에 독립적인 테스트를 구성 가능
- setup, teardown에서 전역 변수를 사용한 조건 처리는 독립성을 보장하지 못하고, 신뢰성이 낮아지므로 지양하자!

```js
// bad
let someCondition = false;

beforeEach (async () => {
  if (someCondition) {
  await render(<TextField className="my-class" />);
  } else {}
}):
```
