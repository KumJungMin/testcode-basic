import { screen } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { NO_COUPON_ID } from '@/constants';
import ShippingInformationForm from '@/pages/purchase/components/ShippingInformationForm';
import render from '@/utils/test/render';

const TestForm = props => {
  const methods = useForm({
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      requests: '',
      coupon: NO_COUPON_ID,
      ...props,
    },
  });

  return (
    <FormProvider {...methods}>
      <ShippingInformationForm />
      <button type="button" onClick={methods.handleSubmit(() => {})}>
        테스트 버튼
      </button>
    </FormProvider>
  );
};

/**
 * 지나치게 모킹에 의존하여 비즈니스 로직 검증
 * - 구매 성공, 실패 프로세스도 모킹에만 의존하여 검증
 * - 결제수단에 따른 빌링프로세스 → 모킹
 * - 결제 실패에 대한 에러 처리 → 모킹
 *
 * 통합 테스트
 * - 비즈니스 로직을 나누어 컴포넌트의 상호작용을 검증하기 좋음
 * - 전체 워크 플로우를 검증하기에는 한계가 있음
 * */

it('쿠폰 데이터를 가져오면 정상적으로 쿠폰 항목을 노출한다.', async () => {
  const { user } = await render(<TestForm />);

  const [selectBoxButton] = await screen.findAllByRole('button');

  await user.click(selectBoxButton);

  expect(screen.getByText('가입 기념! $5 할인 쿠폰')).toBeInTheDocument();
  expect(screen.getByText('$3 할인 쿠폰')).toBeInTheDocument();
  expect(screen.getByText('10% 할인 쿠폰')).toBeInTheDocument();
});

it('이름을 입력하지 않고 폼 전송을 시도하면 "이름을 입력하세요" 텍스트가 노출된다.', async () => {
  const { user } = await render(<TestForm />);

  const testSubmitButton = await screen.findByText('테스트 버튼');
  await user.click(testSubmitButton);

  expect(screen.getByText('이름을 입력하세요')).toBeInTheDocument();
});

it('주소를 입력하지 않고 폼 전송을 시도하면 "주소를 입력하세요" 텍스트가 노출된다.', async () => {
  const { user } = await render(<TestForm />);

  const testSubmitButton = await screen.findByText('테스트 버튼');
  await user.click(testSubmitButton);

  expect(screen.getByText('주소를 입력하세요')).toBeInTheDocument();
});

it('휴대폰 번호를 입력하지 않고 폼 전송을 시도하면 "휴대폰 번호를 입력하세요" 텍스트가 노출된다.', async () => {
  const { user } = await render(<TestForm />);

  const testSubmitButton = await screen.findByText('테스트 버튼');
  await user.click(testSubmitButton);

  expect(screen.getByText('휴대폰 번호를 입력하세요')).toBeInTheDocument();
});

it('휴대폰 번호의 패턴이 틀린 상태에서 폼 전송을 시도하면 "-를 포함한 휴대폰 번호만 가능합니다" 텍스트가 노출된다.', async () => {
  const { user } = await render(<TestForm phone="01099999999" />);

  const testSubmitButton = await screen.findByText('테스트 버튼');
  await user.click(testSubmitButton);

  expect(
    screen.getByText('-를 포함한 휴대폰 번호만 가능합니다'),
  ).toBeInTheDocument();
});
