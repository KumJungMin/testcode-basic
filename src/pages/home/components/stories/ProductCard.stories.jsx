import product from '@/__mocks__/response/product.json';
import ProductCard from '@/pages/home/components/ProductCard';

// 메타 정보
// : 스토리북에 표시될 컴포넌트의 정보를 설정
export default {
  // 고유 명칭, 스토리북에서 보여질 그룹명, "/"를 사용하면, 하위 그룹으로 표시됨
  title: '홈/상품 카드',
  component: ProductCard,

  // argTypes: 사용자가 컴포넌트에 전달할 수 있는 인수를 설정
  argTypes: {
    product: {
      control: 'object',
      description: '상품의 정보',
    },
  },
};

// 스토리 컴포넌트
export const Default = {
  name: '기본', // 스토리북에서 보여질 스토리명

  // 컴포넌트에 전달할 인수
  // argTypes에 정의된 인수를 전달해야 함
  args: {
    product,
  },
};

export const LongTitle = {
  args: {
    product: {
      ...product,
      title:
        'Long title Example Long title Example Long title Example Long title Example Long title Example Long title Example Long title Example Long title Example Long title Example Long title Example',
    },
  },
  name: '타이틀이 긴 경우',
};

export const LongCategoryName = {
  args: {
    product: {
      ...product,
      category: {
        name: 'Long Category Long Category Long Category Long Category',
      },
    },
  },
  name: '카테고리가 긴 경우',
};
