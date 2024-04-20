import { screen, within } from '@testing-library/react';
import React from 'react';

import data from '@/__mocks__/response/products.json';
import ProductList from '@/pages/home/components/ProductList';
import { formatPrice } from '@/utils/formatter';
import {
  mockUseUserStore,
  mockUseCartStore,
} from '@/utils/test/mockZustandStore';
import render from '@/utils/test/render';

const PRODUCT_PAGE_LIMIT = 5;

const navigateFn = vi.fn();

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => navigateFn,
    useLocation: () => ({
      state: {
        prevPath: 'prevPath',
      },
    }),
  };
});

it('로딩이 완료된 경우 상품 리스트가 제대로 모두 노출된다', async () => {
  // Arrange
  await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);
  // findAllByTestId는 비동기를 테스트할 때 사용 - 1초간 50ms마다 요소가 있는지 조회함
  const productCards = await screen.findAllByTestId('product-card');

  // Assert
  expect(productCards).toHaveLength(PRODUCT_PAGE_LIMIT);

  productCards.forEach((el, index) => {
    /** within은 특정 엘리먼트 기준으로 쿼리를 실행할 수 있게 해줌  */
    const productCard = within(el);
    const product = data.products[index]; // 상품 데이터

    // 상품 카드에 상품 정보가 제대로 노출되는지 검증
    expect(productCard.getByText(product.title)).toBeInTheDocument();
    expect(productCard.getByText(product.category.name)).toBeInTheDocument();
    expect(
      productCard.getByText(formatPrice(product.price)),
    ).toBeInTheDocument();
    expect(
      productCard.getByRole('button', { name: '장바구니' }),
    ).toBeInTheDocument();
    expect(
      productCard.getByRole('button', { name: '구매' }),
    ).toBeInTheDocument();
  });
});

it('보여줄 상품 리스트가 더 있는 경우 show more 버튼이 노출되며, 버튼을 누르면 상품 리스트를 더 가져온다.', async () => {
  // Arrange
  const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

  // Act
  // Tip: show more 버튼이 노출되는지 확인
  // show more는 상품 목록이 불러와진 후에 노출되므로, 상품 목록이 불러와진 후에 검증해야함
  // findAllByTestId 쿼리로, 첫 페이지의 상품 목록이 렌더링되는 걸 기다리기!
  await screen.findAllByTestId('product-card');

  // Assert
  expect(screen.getByRole('button', { name: 'Show more' })).toBeInTheDocument();

  // Arrange
  const moreBtn = screen.getByRole('button', { name: 'Show more' });

  // Act
  await user.click(moreBtn);

  // Assert - 상품의 개수가 5 -> 10개로 늘어났는지 확인
  expect(await screen.findAllByTestId('product-card')).toHaveLength(
    2 * PRODUCT_PAGE_LIMIT,
  );
});

it('보여줄 상품 리스트가 없는 경우 show more 버튼이 노출되지 않는다.', async () => {
  // Arrange - 모킹 데이터의 제한을 모킹 데이터 개수(20개)보다 크게 설정
  await render(<ProductList limit={40} />);

  // Act
  await screen.findAllByTestId('product-card');

  // Assert - queryByXXX를 사용해야, dom이 없을 때 에러를 발생시키지 않음
  expect(screen.queryByRole('button', { name: 'Show more' })).toBeNull();
});

describe('로그인 상태일 경우', () => {
  // beforeEach는 각 테스트 케이스가 실행되기 전에 실행됨
  // 테스트 케이스마다 중복되는 코드를 줄이기 위해 사용
  // 테스트를 진행하기 전, useUserStore의 상태를 변경함
  beforeEach(() => {
    mockUseUserStore({ isLogin: true, user: { id: 10 } });
  });

  it('구매 버튼 클릭시 addCartItem 메서드가 호출되며, "/cart" 경로로 navigate 함수가 호출된다.', async () => {
    // 통합 테스트는 큰 범위의 비즈니스 로직을 검증할 수 있으나,
    // 다른 페이지의 로직을 검증할 수 없기에 이 경우 모킹을 사용해야함 (addCartItemFn)
    const addCartItemFn = vi.fn();
    mockUseCartStore({ addCartItem: addCartItemFn });

    const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    await screen.findAllByTestId('product-card');

    // 첫번째 상품을 대상으로 검증한다.
    const productIndex = 0;
    await user.click(
      screen.getAllByRole('button', { name: '구매' })[productIndex],
    );

    expect(addCartItemFn).toHaveBeenNthCalledWith(
      1,
      data.products[productIndex],
      10,
      1,
    );
    expect(navigateFn).toHaveBeenNthCalledWith(1, '/cart');
  });

  it('장바구니 버튼 클릭시 "장바구니 추가 완료!" toast를 노출하며, addCartItem 메서드가 호출된다.', async () => {
    const addCartItemFn = vi.fn();
    mockUseCartStore({ addCartItem: addCartItemFn });

    const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    await screen.findAllByTestId('product-card');

    // 첫번째 상품을 대상으로 검증한다.
    const productIndex = 0;
    const product = data.products[productIndex];
    await user.click(
      screen.getAllByRole('button', { name: '장바구니' })[productIndex],
    );

    expect(addCartItemFn).toHaveBeenNthCalledWith(1, product, 10, 1);
    expect(
      screen.getByText(`${product.title} 장바구니 추가 완료!`),
    ).toBeInTheDocument();
  });
});

describe('로그인이 되어 있지 않은 경우', () => {
  it('구매 버튼 클릭시 "/login" 경로로 navigate 함수가 호출된다.', async () => {
    const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    await screen.findAllByTestId('product-card');

    // 첫번째 상품을 대상으로 검증한다.
    const productIndex = 0;
    await user.click(
      screen.getAllByRole('button', { name: '구매' })[productIndex],
    );

    expect(navigateFn).toHaveBeenNthCalledWith(1, '/login');
  });

  it('장바구니 버튼 클릭시 "/login" 경로로 navigate 함수가 호출된다.', async () => {
    const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

    await screen.findAllByTestId('product-card');

    // 첫번째 상품을 대상으로 검증한다.
    const productIndex = 0;
    await user.click(
      screen.getAllByRole('button', { name: '장바구니' })[productIndex],
    );

    expect(navigateFn).toHaveBeenNthCalledWith(1, '/login');
  });
});

it('상품 클릭시 "/product/:productId" 경로로 navigate 함수가 호출된다.', async () => {
  const { user } = await render(<ProductList limit={PRODUCT_PAGE_LIMIT} />);

  const [firstProduct] = await screen.findAllByTestId('product-card');

  // 첫번째 상품을 대상으로 검증한다.
  await user.click(firstProduct);

  expect(navigateFn).toHaveBeenNthCalledWith(1, '/product/6');
});
