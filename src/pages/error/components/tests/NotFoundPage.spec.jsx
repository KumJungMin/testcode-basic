import { screen } from '@testing-library/react';
import React from 'react';

import NotFoundPage from '@/pages/error/components/NotFoundPage';
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

it('Home으로 이동 버튼 클릭시 홈 경로로 이동하는 navigate가 실행된다', async () => {
  // Arrange
  const { user } = await render(<NotFoundPage />);

  // Act
  await user.click(screen.getByRole('button', { name: 'Home으로 이동' }));

  // Assert
  expect(navigateFn).toHaveBeenNthCalledWith(1, '/', { replace: true });
});
