import { screen } from '@testing-library/react';
import React from 'react';

import ErrorPage from '@/pages/error/components/ErrorPage';
import render from '@/utils/test/render';

/**
 * 테스트를 위한 사전 모킹
 * 1. spy함수를 사용해, useNavigate 훅으로 반환받은 navigate 함수가 올바르게 호출되는지 확인
 * 2. react-router-dom 모듈을 모킹하여 useNavigate 훅을 spy함수로 대체
 * */

const navigateFn = vi.fn();

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => navigateFn,
  };
});

it('"뒤로 이동" 버튼 클릭시 뒤로 이동하는 navigate(-1) 함수가 호출된다', async () => {
  // Arrange
  const { user } = await render(<ErrorPage />);

  // Act
  await user.click(screen.getByRole('button', { name: '뒤로 이동' }));

  // Assert - spy함수가 올바르게 호출되었는지 확인
  expect(navigateFn).toHaveBeenNthCalledWith(1, -1);
});
