import { screen } from '@testing-library/react';
import React from 'react';

import TextField from '@/components/TextField';
import render from '@/utils/test/render';

it('className props으로 설정한 css class가 적용된다.', async () => {
  /** A(Arrange) - 테스트를 위한 환경 준비(ex. 렌더링, 모킹) */
  // render API를 호출하여, 테스트 환경의 jsDom에 컴포넌트를 렌더링한다.
  await render(<TextField className="test-class" />);

  /** A(Act) - 테스트할 액션 수행 */
  // 이 부분은 패스 - 테스트할 액션이 없다.

  /** A(Assert) - 테스트 결과 확인 */
  expect(screen.getByPlaceholderText('텍스트를 입력해 주세요.')).toHaveClass(
    'test-class',
  );
});

describe('placeholder props', () => {
  it('기본 placeholder "텍스트를 입력해 주세요."가 렌더링된다.', async () => {
    /** A(Arrange) - 테스트를 위한 환경 준비(ex. 렌더링, 모킹) */
    await render(<TextField />);

    /** screen.debug()는 렌더링된 컴포넌트의 html을 콘솔에 출력한다. */
    screen.debug();

    /** A(Act) - 테스트할 액션 수행 */
    // 이 부분은 패스 - 테스트할 액션이 없다.

    /** A(Assert) - 테스트 결과 확인 */
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

it('텍스트를 입력할 때마다 onChange props으로 등록한 함수가 호출된다', async () => {
  /** A(Arrange) - 테스트를 위한 환경 준비(ex. 렌더링, 모킹) */
  // spy함수를 사용하면, 특정 함수가 호출되었는지 인자나 리턴값을 확인할 수 있다.
  const spy = vi.fn();
  const { user } = await render(<TextField onChange={spy} />);
  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  /** A(Act) - 테스트할 액션 수행 */
  await user.type(textInput, '테스트');

  /** A(Assert) - 테스트 결과 확인 */
  expect(spy).toBeCalledWith('테스트');
});

it('enter키를 입력했을 때, onEnter props으로 등록한 함수가 호출된다.', async () => {
  /** A(Arrange) - 테스트를 위한 환경 준비(ex. 렌더링, 모킹) */
  const spy = vi.fn();
  const { user } = await render(<TextField onEnter={spy} />);
  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  /** A(Act) - 테스트할 액션 수행 */
  // type API는 텍스트를 입력하는 액션을 수행한다.
  // test{Enter}는 test를 입력하고, Enter키를 누르는 액션을 수행한다.
  await user.type(textInput, 'test{Enter}');

  /** A(Assert) - 테스트 결과 확인 */
  expect(spy).toBeCalledWith('test');
});

it('focus가 활성화되면 onFocus props으로 등록한 함수가 호출된다.', async () => {
  /** A(Arrange) - 테스트를 위한 환경 준비(ex. 렌더링, 모킹) */
  const spy = vi.fn();
  const { user } = await render(<TextField onFocus={spy} />);
  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  /** A(Act) - 테스트할 액션 수행 */
  // click API는 클릭 액션을 수행한다.
  await user.click(textInput);

  /** A(Assert) - 테스트 결과 확인 */
  expect(spy).toHaveBeenCalled();
});

it('포커스가 활성화되면 border 스타일이 추가된다', async () => {
  /** A(Arrange) - 테스트를 위한 환경 준비(ex. 렌더링, 모킹) */
  const { user } = await render(<TextField />);

  /** A(Act) - 테스트할 액션 수행 */
  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');
  await user.click(textInput);

  /** A(Assert) - 테스트 결과 확인 */
  // toHaveStyle API는 특정 스타일이 적용되었는지 확인한다.
  expect(textInput).toHaveStyle({
    borderWidth: 2,
    borderColor: 'rgb(25, 118, 210)',
  });
});
