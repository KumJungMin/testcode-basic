import React from 'react';

export default function TextField(props) {
  const [value, setValue] = React.useState('');
  const { onChange = () => {} } = props;

  // 2. 테스트를 통과하는 코드를 작성한다.(실패하지 않는 테스트)
  return (
    <input
      type="text"
      placeholder="텍스트를 입력해 주세요."
      onChange={event => {
        setValue(event.target.value);
        onChange(event.target.value);
      }}
      value={value}
    />
  );
}
