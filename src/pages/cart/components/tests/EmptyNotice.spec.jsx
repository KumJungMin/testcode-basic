import { screen } from '@testing-library/react';
import React from 'react';

import EmptyNotice from '@/pages/cart/components/EmptyNotice';
import render from '@/utils/test/render';

/** navigate 함수 자체도 검증해야할까?
 * navigate 함수 자체에 대한 검증은 불필요
 * 왜냐하면 navigate 함수는 react-router-dom에서 제공하는 함수이기 때문에 이미 테스트가 되어있음
 * */

/**
 * EmptyNotice를 테스트할 수 있는 이유?
 * 해당 컴포넌트는 단순히 한 가지 기능만을 수행하기 때문에 테스트가 가능하다.
 * 또한, 복잡한 로직이 없기 때문에 테스트가 가능하다.
 * 단, 구성 요소가 많아지면 테스트하기 어려워진다.
 * */

/**
 * 테스트를 위한 사전 모킹
 * 1. spy함수를 사용해, useNavigate 훅으로 반환받은 navigate 함수가 올바르게 호출되는지 확인
 * 2. react-router-dom 모듈을 모킹하여 useNavigate 훅을 spy함수로 대체
 * */

const navigateFn = vi.fn(); // spy 함수

// 실제 모듈을 모킹한 모듈로 대체하여 테스트
vi.mock('react-router-dom', async () => {
  // vi.importActual함수를 사용하여 실제 모듈을 가져올 수 있다.
  const original = await vi.importActual('react-router-dom');

  return {
    ...original,
    useNavigate: () => navigateFn,
  };
});

it('"홈으로 가기" 링크를 클릭할경우 "/"경로로 navigate함수가 호출된다', async () => {
  // Arrange
  const { user } = await render(<EmptyNotice />);

  // Act
  await user.click(screen.getByText('홈으로 가기'));

  // Assert
  expect(navigateFn).toHaveBeenNthCalledWith(1, '/');
});
