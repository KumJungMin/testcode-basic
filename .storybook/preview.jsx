/** @type { import('@storybook/react').Preview } */
import { withRouter } from 'storybook-addon-react-router-v6';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initialize, mswDecorator } from 'msw-storybook-addon';

import { handlers } from '../src/__mocks__/handlers';
import withRHF from './withRHF';

import 'swiper/css';
import 'swiper/css/navigation';

const queryClient = new QueryClient();
initialize({
  onUnhandledRequest: 'bypass',
});

const preview = {
  parameters: {
    // actions: 이벤트 핸들러 실행시, 받은 데이터를 스토리 로그에 출력
    actions: { argTypesRegex: '^on[A-Z].*' },

    // controls
    // : 컴포넌트의 props를 변경할 수 있는 인터페이스를 제공
    // : controls 탭에서 props를 바로 변경할 수 있음
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    // msw
    // : msw를 사용하여 API 호출을 가로챔
    msw: {
      handlers,
    },
  },
  // decorators
  // : 스토리에 재사용 가능한 요소를 추가
  // : 특정 React context나 루트 컴포넌트로 감싸는 등의 작업을 할 수 있음
  decorators: [
    withRouter, // 라우터 추가
    mswDecorator, // msw 추가(실제 API 호출을 가로챔)
    withRHF(false), // react-hook-form 추가
    Story => (
      // QueryClientProvider 추가
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <Story />
      </QueryClientProvider>
    ),
  ],
};

export default preview;
