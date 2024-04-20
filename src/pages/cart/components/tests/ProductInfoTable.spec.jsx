import { screen, within } from '@testing-library/react';
import React from 'react';

import ProductInfoTable from '@/pages/cart/components/ProductInfoTable';
import {
  mockUseCartStore,
  mockUseUserStore,
} from '@/utils/test/mockZustandStore';
import render from '@/utils/test/render';

// 1. mockUseCartStore, mockUseUserStore를 사용하여 cart, user 상태를 설정한다.
beforeEach(() => {
  mockUseUserStore({ user: { id: 10 } });
  mockUseCartStore({
    cart: {
      1: {
        id: 1,
        title: '상품1',
        price: 809,
        description: 'one',
        images: ['', '', ''],
        count: 3,
      },
      2: {
        id: 2,
        title: '상품2',
        price: 442,
        description: 'two',
        images: ['', '', ''],
        count: 4,
      },
    },
  });
});
it('장바구니에 포함된 아이템들의 이름, 수량, 합계가 제대로 노출된다', async () => {
  // Arrange
  await render(<ProductInfoTable />);
  const [firstItem] = screen.getAllByRole('row');

  // Assert
  // within: 어떤 요소 내에서 특정 요소를 찾을 수 있게 해줌
  // -> firstItem에서 '상품1'이라는 텍스트를 찾는다.
  expect(within(firstItem).getByText('상품1')).toBeInTheDocument();
  expect(within(firstItem).getByRole('textbox')).toHaveValue('3');
  expect(within(firstItem).getByText('$2,427.00')).toBeInTheDocument();
});

it('특정 아이템의 수량이 변경되었을 때 값이 재계산되어 올바르게 업데이트 된다', async () => {
  // Arrange
  const { user } = await render(<ProductInfoTable />);
  const [firstItem] = screen.getAllByRole('row');
  const input = within(firstItem).getByRole('textbox');

  // Act
  await user.clear(input); // input 요소의 값을 지움
  await user.type(input, '5'); // input 요소에 '5'를 입력

  // Assert
  expect(within(firstItem).getByText('$4,045.00')).toBeInTheDocument();
});

it('특정 아이템의 수량이 1000개로 변경될 경우 "최대 999개 까지 가능합니다!"라고 경고 문구가 노출된다', async () => {
  // Arrange
  const { user } = await render(<ProductInfoTable />);
  const [firstItem] = screen.getAllByRole('row');
  const input = within(firstItem).getByRole('textbox');
  const alertSpy = vi.fn();
  vi.stubGlobal('alert', alertSpy); // window.alert을 스파이 함수로 대체

  // Act
  await user.clear(input); // input 요소의 값을 지움
  await user.type(input, '1000'); // 1000개 입력

  // Assert
  // toHaveBeenNthCalledWith: n번째 호출 시 전달된 인자를 검증
  expect(alertSpy).toHaveBeenNthCalledWith(1, '최대 999개 까지 가능합니다!');
});

it('특정 아이템의 삭제 버튼을 클릭할 경우 해당 아이템이 사라진다', async () => {
  // Arrange
  const { user } = await render(<ProductInfoTable />);
  const [, secondItem] = screen.getAllByRole('row');
  const deleteButton = within(secondItem).getByRole('button');

  // Assert
  expect(screen.getByText('상품2')).toBeInTheDocument();

  // Act
  await user.click(deleteButton);

  // Assert
  // queryByText: 요소의 존재 여부를 검사. 존재하지 않으면 null 반환하고 에러 발생 X
  expect(screen.queryByText('상품2')).not.toBeInTheDocument();
});
