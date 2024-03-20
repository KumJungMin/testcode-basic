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
