import React from 'react';

export default function TextField(props) {
  const [value, setValue] = React.useState('');
  const { onChange = () => {} } = props;

  // 2. 테스트를 통과하는 코드를 작성한다.(실패하지 않는 테스트)
  // 3. 리팩토링 및 중복 코드 제거(테스트 통과 여부 확인)
  const handleChange = event => {
    setValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="텍스트를 입력해 주세요."
      onChange={handleChange}
      value={value}
    />
  );
}
