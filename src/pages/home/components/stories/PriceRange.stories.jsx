import { within, userEvent } from '@storybook/testing-library';

import PriceRange from '@/pages/home/components/PriceRange';

export default {
  title: '홈/상품 필터/가격 검색',
  component: PriceRange,
};

export const Default = { name: '기본' };

export const WithValue = {
  name: '가격이 입력된 상태',

  // play 함수
  // : 스토리를 렌더링한 뒤 사용자의 상호작용을 시뮬레이션
  // : 내부적으로 Testing Library를 통해 구현
  // : Dom과 상호작용하거나 assertion을 작성해 테스트할 수 있음
  play: async ({ canvasElement }) => {
    // play함수는 canvas의 최상위 요소에서 시작
    // canvasElement는 스토리가 렌더링되는 루트 요소
    // within 함수를 사용하여 canvasElement 내부의 요소를 선택할 수 있음
    const canvas = within(canvasElement);

    const [min, max] = canvas.getAllByRole('textbox');

    // userEvent를 사용하여 입력값을 변경(유저 동작 시뮬레이션)
    await userEvent.type(min, '300');
    await userEvent.type(max, '40000');
  },
};
