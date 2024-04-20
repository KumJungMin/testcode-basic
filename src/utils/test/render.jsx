import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { MemoryRouter } from 'react-router-dom';

/** api를 mocking 하기 위한 tanstack에 대한 테스트 설정 예시.
 * 테스트를 진행할 때, render.tsx 파일은 컴포넌트 렌더링 단계에서 쓰인다.
 * */

// https://tanstack.com/query/v4/docs/react/guides/testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /** 테스트 환경에서는 retry를 사용하지 않음 */
      retry: false,
    },
  },
  /** logger 테스트시, 콘솔에 기록되는 메시지를 제어할 때 사용 */
  logger: {
    log: console.log,
    warn: console.warn,
    // ✅ no more errors on the console for tests
    error: process.env.NODE_ENV === 'test' ? () => {} : console.error,
  },
});

export default async (component, options = {}) => {
  const { routerProps } = options;
  const user = userEvent.setup();

  return {
    user,
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter {...routerProps}>{component}</MemoryRouter>
        <Toaster />
      </QueryClientProvider>,
    ),
  };
};
