/** 모킹할 API에 대한 응답을 정의한 파일입니다. */

import { rest } from 'msw';

import response from '@/__mocks__/response';
import { apiRoutes } from '@/apiRoutes';

const API_DOMAIN = 'http://localhost:3000';

export const handlers = [
  ...[
    apiRoutes.users,
    apiRoutes.product,
    apiRoutes.categories,
    apiRoutes.couponList,
  ].map(path =>
    /** request 쿼리 파라미터에 대한 응답을 변경
     * http status를 변경하는 등, 다양한 응답을 테스트할 수 있음
     * */

    rest.get(`${API_DOMAIN}${path}`, (_, res, ctx) =>
      res(ctx.status(200), ctx.json(response[path])),
    ),
  ),
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
