import React from 'react';

import PageTitle from '@/pages/cart/components/PageTitle';
import render from '@/utils/test/render';

/**
 * toMatchInlineSnapshot?
 * - 테스트 파일과 스냅샷 파일을 하나의 파일로 관리한다.
 * - 스냅샷 파일은 테스트 파일이 실행될 때 생성된다.
 * */

it('pageTitle 스냅샷 테스트(toMatchInlineSnapshot)', async () => {
  // container는 렌더링 결과를 div로 감싸서 반환한다.
  const { container } = await render(<PageTitle />);

  expect(container).toMatchInlineSnapshot();
});

/**
 * toMatchSnapshot?
 * - 테스트 파일과 스냅샷 파일을 별도로 분리해서 관리한다.
 * - 스냅샷 파일은 테스트 파일이 실행될 때 생성된다.
 */
it('pageTitle 스냅샷 테스트(toMatchSnapshot)', async () => {
  const { container } = await render(<PageTitle />);

  expect(container).toMatchSnapshot();
});
