import { pick, debounce } from './common';

describe('pick util 단위테스트', () => {
  it('단일 인자로 전달된 키의 값을 객체에 담아 반환한다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj, 'a')).toEqual({ a: 'A' });
  });

  it('2개 이상의 인자로 전달된 키의 값을 객체에 담아 반환한다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj, 'a', 'b')).toEqual({ a: 'A', b: { c: 'C' } });
  });

  it('대상 객체로 아무 것도 전달 하지 않을 경우 빈 객체가 반환된다', () => {
    expect(pick()).toEqual({});
  });

  it('propNames를 지정하지 않을 경우 빈 객체가 반환된다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj)).toEqual({});
  });
});

/**
 * 비동기를 테스트하는 법
 *
 * debounce 함수는 일정 시간이 지난 후에 한 번만 실행되도록 하는 함수이다.
 * 그러나, 테스트 코드는 동기적으로 실행한다.
 * 비동기 함수가 실행되기 전에 테스트가 종료되어 테스트가 실패할 수 있다.
 * 이 경우, 비동기 함수가 실행되기 전 useFakeTimers함수를 사용하여 타이머를 조작할 수 있다.
 * */

describe('debounce', () => {
  /** 타이머 모킹하기(1)
   *  useFakeTimers란, setTimeout, setInterval, clearTimeout, clearInterval 함수를 모킹
   * -> 이 함수를 사용하면 타이머를 조작할 수 있음
   * -> setTimeout, setInterval 함수를 호출하면 즉시 실행되도록 함
   */
  beforeEach(() => {
    vi.useFakeTimers();

    // setSystemTime을 사용하면 테스트하는 시스템 시간을 변경할 수 있음
    // vi.setSystemTime(new Date('2021-01-01');
  });

  afterEach(() => {
    // 테스트 후 타이머를 원래대로 돌려놓음
    vi.useRealTimers();
  });

  it('특정 시간이 지난 후 함수가 실행된다', () => {
    const spy = vi.fn();
    const time = 300;

    const debounced = debounce(spy, time);

    debounced();

    /** 타이머 모킹하기(2)
     * 0.3s 후에 타이머가 실행되도록 함
     * advanceTimersByTime란, 현재 시간을 이동시키는 함수
     */
    vi.advanceTimersByTime(time);

    expect(spy).toHaveBeenCalled();
  });

  it('연이어 호출해도 마지막 호출 기준으로 일정 시간이 지난 후 함수가 실행된다', () => {
    const spy = vi.fn();

    const debounceFn = debounce(spy, 300);

    // 최초 호출
    debounceFn();

    // 0.1s 후에 호출
    vi.advanceTimersByTime(100);
    debounceFn();

    // 0.2s 후에 호출
    vi.advanceTimersByTime(200);
    debounceFn();

    // 0.3s 후에 호출
    vi.advanceTimersByTime(300);
    debounceFn();

    // 4번 호출됐지만 실제 호출은 1번만 되어야 한다.
    // toHaveBeenCalledTimes란, spy 함수가 몇 번 호출되었는지 확인하는 함수
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
