import { screen } from '@testing-library/react';
import React from 'react';

import TextField from '@/components/TextField';
import render from '@/utils/test/render';

/**
 * 단위 테스트(Unit Test)는 단일 컴포넌트의 기능을 테스트하는 것이다.
 * - AAA 패턴으로 테스트를 작성할 수 있다.
 * - A(Arrange) - 테스트를 위한 환경 준비(ex. 렌더링, 모킹)
 * - A(Act) - 테스트할 액션 수행
 * - A(Assert) - 테스트 결과 확인(expect 함수를 사용하여 테스트)
 * */

/** beforeEach가 최상단에 선언될 경우, 각 테스트 케이스가 실행되기 전에 실행된다. */
beforeEach(() => {});

/** beforeAll은 모든 테스트 케이스가 실행되기 전에 한 번만 실행된다.
 * beforeAll과 beforeEach가 동일한 스코프에 있는 경우, beforeAll이 먼저 실행된다.
 * 이 함수는 전역 상태를 변경하거나, 테스트 환경을 설정할 때 사용한다.
 */
beforeAll(() => {});

/** afterEach가 최상단에 선언될 경우, 각 테스트 케이스가 실행된 후에 실행된다.
 * afterEach는 테스트 케이스가 실행된 후에, 테스트 환경을 정리할 때 사용한다.
 */
afterEach(() => {});

/** afterAll은 모든 테스트 케이스가 실행된 후에 한 번만 실행된다.
 * afterAll과 afterEach가 동일한 스코프에 있는 경우, afterEach가 먼저 실행된다.
 * 이 함수는 전역 상태를 변경하거나, 테스트 환경을 정리할 때 사용한다.
 * */
afterAll(() => {});

it('className props으로 설정한 css class가 적용된다.', async () => {
  /** A(Arrange) - 테스트를 위한 환경 준비(ex. 렌더링, 모킹) */
  // render API를 호출하여, 테스트 환경의 jsDom에 컴포넌트를 렌더링한다.
  await render(<TextField className="test-class" />);

  /** A(Act) - 테스트할 액션 수행 */
  // 이 부분은 패스 - 테스트할 액션이 없다.

  /** A(Assert) - 테스트 결과 확인 */
  // screen 객체를 사용하여 렌더링된 컴포넌트의 특정 엘리먼트를 찾아서 테스트한다.
  // getByText, getByRole, getByLabelText, getByPlaceholderText 등의 메서드를 사용할 수 있다.
  // getByPlaceholderText 메서드는 placeholder 속성값으로 엘리먼트를 찾는다.
  // toHaveClass는 엘리먼트가 특정 클래스를 가지고 있는지 확인한다.
  expect(screen.getByPlaceholderText('텍스트를 입력해 주세요.')).toHaveClass(
    'test-class',
  );
});

/** 테스트 함수
 * it('should~~'와 같이 테스트 케이스를 작성할 수도 있지만,
 * test('if  ~~~') 형태로도 작성할 수 있다.
 * describe('~~~', () => { 은 테스트를 그룹화할 때 사용한다.
 * */

describe('placeholder props', () => {
  /** beforeEach를 describe 내부에 선언할 경우, 해당 describe 내부의 테스트 케이스가 실행되기 전에 실행된다. */
  beforeEach(() => {});

  it('기본 placeholder "텍스트를 입력해 주세요."가 렌더링된다.', async () => {
    /** A(Arrange) - 테스트를 위한 환경 준비(ex. 렌더링, 모킹) */
    await render(<TextField />);

    /** screen.debug()는 렌더링된 컴포넌트의 html을 콘솔에 출력한다. */
    screen.debug();

    /** A(Act) - 테스트할 액션 수행 */
    // 이 부분은 패스 - 테스트할 액션이 없다.

    /** A(Assert) - 테스트 결과 확인 */
    // toBeInTheDocument는 매처라고 부른다. 매처란, 특정 조건을 만족하는지 확인하는 함수이다.
    // dom을 테스트하기 위해, @testing-library를 사용해 매처를 확장한다.
    expect(
      screen.getByPlaceholderText('텍스트를 입력해 주세요.'),
    ).toBeInTheDocument();
  });

  it('placeholder props으로 설정한 placeholder가 렌더링된다.', async () => {
    /** A(Arrange) - 테스트를 위한 환경 준비(ex. 렌더링, 모킹) */
    await render(<TextField placeholder="테스트 해보자!" />);

    /** A(Act) - 테스트할 액션 수행 */
    // 이 부분은 패스 - 테스트할 액션이 없다.

    /** A(Assert) - 테스트 결과 확인 */
    expect(screen.getByPlaceholderText('테스트 해보자!')).toBeInTheDocument();
  });
});
