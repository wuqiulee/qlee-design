import React, {
  FC,
  InputHTMLAttributes,
  FocusEvent,
  ReactNode,
  CSSProperties,
  useRef,
  useEffect,
  useState,
  ChangeEvent,
  MouseEvent,
} from 'react';
import classNames from 'classnames';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Icon from '../Icon';

type SizeType = 'default' | 'large' | 'small';
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix'> {
  /** 默认值 */
  defaultValue?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 输入框大小 */
  size?: SizeType;
  /** 输入框前缀 */
  prefix?: ReactNode;
  /** 输入框后缀 */
  suffix?: ReactNode;
  /** 前置标签 */
  addonBefore?: ReactNode;
  /** 后置标签 */
  addonAfter?: ReactNode;
  /** 类名 */
  className?: string;
  /** 样式名 */
  style?: CSSProperties;
  /** 输入框有内容且 hover或focus时展示清除按钮 */
  showClear?: boolean;
  /** 输入框聚焦的回调 */
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  /** 输入框失焦的回调 */
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  /** 输入框内容变化时的回调 */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  /** 点击清除按钮时的回调 */
  onClear?: (e: MouseEvent<SVGSVGElement>) => void;
}

/**
 * 输入框是最基本的接收用户文本输入的组件
 * ### 如何引入
 * ~~~js
 *
 * import { Input } from 'qlee-design';
 * ~~~
 */
const Input: FC<InputProps> = (props) => {
  const {
    defaultValue,
    disabled,
    size,
    addonBefore,
    addonAfter,
    prefix,
    suffix,
    className,
    style,
    showClear,
    onFocus,
    onBlur,
    onChange,
    onClear,
    ...restProps
  } = props;

  const [inputStyle, setInputStyle] = useState({});
  const prefixRef = useRef(null);
  const suffixRef = useRef(null);
  const disableRef = useRef(false);
  const inputRef = useRef(null);

  const classes = classNames('input_wrap', className, {
    input_focus: !disabled,
    input_disabled: disabled,
    [`input_size_${size}`]: size,
  });
  const boxClasses = classNames('input_box', {
    [`input_size_${size}`]: size,
    input_showclear: showClear,
  });

  // 获取焦点
  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'blue';
    disableRef.current = true;
    if (showClear && e.target.value) {
      (suffixRef.current! as HTMLElement).style.display = 'block';
    }
    onFocus && onFocus(e);
  };
  // 失去焦点
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'transparent';
    disableRef.current = false;
    showClear &&
      setTimeout(() => {
        (suffixRef.current! as HTMLElement).style.display = 'none';
      }, 0);
    onBlur && onBlur(e);
  };
  const handleMouseEnter = (e: any) => {
    if (showClear && !disableRef.current && e.target.value) {
      (suffixRef.current! as HTMLElement).style.display = 'block';
    }
  };
  const handleMouseLeave = () => {
    if (showClear && !disableRef.current) {
      (suffixRef.current! as HTMLElement).style.display = 'none';
    }
  };
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const ele: HTMLElement = suffixRef.current!;
    const { value } = e.target;
    onChange && onChange(e);
    if (!value && ele && showClear) {
      disableRef.current = true;
      ele.style.display = 'none';
      return;
    }
    // value有值再显示
    if (value && ele) {
      ele.style.display = 'block';
    }
  };
  // 清空输入框
  const clearInput = (e: MouseEvent<SVGSVGElement>) => {
    (inputRef.current! as HTMLInputElement).value = '';
    (suffixRef.current! as HTMLInputElement).style.display = 'none';
    onClear && onClear(e);
  };
  // 动态获取Input padding
  useEffect(() => {
    const prefixEle: HTMLElement = prefixRef.current!;
    const suffixEle: HTMLElement = suffixRef.current!;
    const newStyle = {
      ...style,
      paddingLeft: prefix ? prefixEle.offsetWidth + 10 : 12,
      paddingRight: suffix ? suffixEle.offsetWidth + 10 : 12,
    };
    setInputStyle(newStyle);
  }, [prefix, suffix]);

  return (
    <div className={boxClasses}>
      {addonBefore && <div className="input_addon">{addonBefore}</div>}
      <div
        className="input_content"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {prefix && (
          <span className="input_prefix" ref={prefixRef}>
            {prefix}
          </span>
        )}
        <input
          type="text"
          className={classes}
          ref={inputRef}
          defaultValue={defaultValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onInput={handleInput}
          disabled={disabled}
          style={inputStyle}
          {...restProps}
        />
        {(suffix || showClear) && (
          <span className="input_suffix" ref={suffixRef}>
            {showClear ? <Icon icon={faCircleXmark} onClick={clearInput} /> : suffix}
          </span>
        )}
      </div>
      {addonAfter && <div className="input_addon">{addonAfter}</div>}
    </div>
  );
};

Input.defaultProps = {
  disabled: false,
  size: 'default',
  showClear: false,
};

export default Input;
