import { screen } from '@testing-library/react';
import React from 'react';

import TextField from '@/components/TextField';
import render from '@/utils/test/render';

// TDD 방법론
// 1. 구현하고자 하는 기능에 대한 테스트를 작성한다.(실패하는 테스트)
it('기본 placeholder "텍스트를 입력해 주세요."가 노출되어야 한다.', async () => {
  await render(<TextField />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  expect(textInput).toBeInTheDocument();
});

// 1. 구현하고자 하는 기능에 대한 테스트를 작성한다.(실패하는 테스트)
it('텍스트를 입력하면 onChange prop으로 등록한 함수가 호출되어야 한다.', async () => {
  const spy = vi.fn();

  const { user } = await render(<TextField onChange={spy} />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  await user.type(textInput, 'Hello, World!');

  expect(spy).toHaveBeenCalledWith('Hello, World!');
});
