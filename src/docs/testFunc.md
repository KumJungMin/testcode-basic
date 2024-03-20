### it 함수

- 테스트의 실행 단위로서 테스트 디스크립션, 기대 결과에 대한 코드를 작성
- it 함수는 test 함수의 alias로서 동일한 역할 수행
- 기대 결과와 실제 결과가 같다면 테스트는 성공적으로 통과

### 단언(assertion)

- 테스트가 통과하기 위한 조건을 기술하여 겸증을 실행

### 매처

- 기대 결과를 검증하기 위해 사용되는 일종의 API 집합
- vitest에서는 다양한 기본 매처를 제공하며, 이를 확장하여 단언을 실행을 쓸 수 있음
  - https://vitest.dev/api/expect.html
  - https://github.com/testing-library/jest-dom#custom-matchers
