### React Testing Library

- UI 컴포넌트를 사용자가 사용하는 방식으로 테스트
- 사용자가 앱을 사용하는 방식과 테스트 방식이 유사할수록 신뢰성은 향상
- DOM과 이벤트 인터페이스를 기반으로 요소를 조회하고, 다양한 동작을 시뮬레이션 할 수 있음
- 요소 조회를 위한 쿼리는 다양하며, 우선 순위가 존재
  - https://testing-library.com/docs/queries/about
- 인터페이스 기반의 직관적인 코드와 내부 구현에 종속되지 않는 견고한 테스트 코드

### Spy 함수

- 함수의 호출 여부, 인자, 반환 값 등 함수 호출에 관련된 다양한 값을 저장
- 콜백 함수나 이벤트 핸들러가 올바르게 호출 되었는지 검증할 수 있음
- toHaveBeenCalledWith, toHaveBeenCalled 매처
