## MSW와 통합 테스트

> 통합 테스트에서 API를 호출하는 컴포넌트를 테스트하기 위해 TanStack query 설정과 API에 대한 모킹이 필요하다!

<br/>

### TanStack Query

- 이 라이브러리는 API 호출에 따른 로딩, 에러 상태 처리 및 페이지네이션 캐싱 등의 편의성을 위해 사용한다.
- 기본적으로 API 실패시 retry를 하는데, 테스트 환경에서는 불필요하다.
- 그래서 테스트 환경에서는 TanStack Query 설정을 달리 적용한다. (ex. `render.jsx`)

```js
// render.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { MemoryRouter } from 'react-router-dom';

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
```

```js
import render from '@/utils/test/render'; // import함

it('"홈으로 가기" 링크를 클릭할경우 "/"경로로 navigate함수가 호출된다', async () => {
  // 컴포넌트 렌더링시에 사용함
  // 이를 통해 테스트 환경의 tanStack 설정을 사용할 수 있음
  const { user } = await render(<EmptyNotice />);
  ...
});

```

<br/>

### Mock Service Worker(MSW)

- Node js, 브라우저 환경을 위한 API 모킹 라이브러리이다.
- Node.js 환경에서는 XHR, fetch 등의 요청을 가로채는 인터셉터를 사용한다.
- 테스트에 사용하기 위해, `setupTest.js`에서 테스트 실행 전 API를 모킹하고 해제하는 설정을 해야한다.

```js
// setupTest.js

import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import { handlers } from '@/__mocks__/handlers';

/** msw 설정
 * setupServer는 msw/node에서 제공하는 함수로, msw의 서버를 설정함
 * 테스트 환경에서 API 호출을 가로채서 응답을 변경할 수 있음
 */
export const server = setupServer(...handlers);

beforeAll(() => {
  /** msw 서버를 시작함 */
  server.listen();
});

afterEach(() => {
  /** msw 서버의 모든 핸들러를 리셋함 */
  server.resetHandlers();
});

afterAll(() => {
  /** msw 서버를 종료함 */
  server.close();
});
```
