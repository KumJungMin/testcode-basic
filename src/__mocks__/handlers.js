/** 모킹할 API에 대한 응답을 정의한 파일입니다. */

import { rest } from 'msw';

import response from '@/__mocks__/response';
import { apiRoutes } from '@/apiRoutes';

const API_DOMAIN = 'http://localhost:3000';

export const handlers = [
  ...[
    apiRoutes.users,
    apiRoutes.product,
    apiRoutes.categories, // 카테고리 목록 조회 API 응답 모킹
    apiRoutes.couponList,
  ].map(path =>
    /** request 쿼리 파라미터에 대한 응답을 변경
     * http status를 변경하는 등, 다양한 응답을 테스트할 수 있음
     * */

    rest.get(`${API_DOMAIN}${path}`, (_, res, ctx) =>
      res(ctx.status(200), ctx.json(response[path])),
    ),
  ),

  /** Mock Service Worker를 이용한 API 응답 모킹
   *
   * 1. 테스트 환경에서 상품 목록 조회 API 요청이 실행되면 msw에서 요청을 가로챔
   * 2. products.json에 정의한 상품 목록 모킹 데이터를 페이징 단위로 잘라 API 응답처럼 반환
   * 3. 테스트 코드에서 동일한 모킹 데이터를 기반으로 원하는 시나리오에 대한 안정성 있는 검증 가능
   * */
  rest.get(`${API_DOMAIN}${apiRoutes.products}`, (req, res, ctx) => {
    const data = response[apiRoutes.products];
    const offset = Number(req.url.searchParams.get('offset'));
    const limit = Number(req.url.searchParams.get('limit'));
    const products = data.products.filter(
      (_, index) => index >= offset && index < offset + limit,
    );

    return res(
      ctx.status(200),
      ctx.json({ products, lastPage: products.length < limit }),
    );
  }),
  rest.get(`${API_DOMAIN}${apiRoutes.profile}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(null));
  }),
  rest.post(`${API_DOMAIN}${apiRoutes.users}`, (req, res, ctx) => {
    if (req.body.name === 'FAIL') {
      return res(ctx.status(500));
    }

    return res(ctx.status(200));
  }),
  rest.post(`${API_DOMAIN}${apiRoutes.login}`, (req, res, ctx) => {
    if (req.body.email === 'FAIL@gmail.com') {
      return res(ctx.status(401));
    }

    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'access_token',
      }),
    );
  }),
  rest.post(`${API_DOMAIN}${apiRoutes.log}`, (_, res, ctx) => {
    return res(ctx.status(200));
  }),
];
