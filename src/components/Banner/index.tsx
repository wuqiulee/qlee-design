import React, { useRef, DOMAttributes, MouseEvent, ReactNode, MutableRefObject } from 'react';
import classnames from 'classnames';
import Styles from './index.module.scss';

type CurrentType = {
  current: HTMLDivElement;
};
type BannerRefType = MutableRefObject<null> | CurrentType;
type BannerType = 'info' | 'warning' | 'danger' | 'success';
interface BannerProps extends DOMAttributes<HTMLDivElement> {
  type?: BannerType;
  description?: string;
  className?: string;
  fullMode?: boolean;
}

const Banner: React.FC<BannerProps> = (props) => {
  const { type, description, fullMode, className } = props;

  const bannerRef = useRef(null);

  const classes = classnames(Styles.banner_wrap, className, {
    [Styles[`banner_${type}`]]: type,
    [Styles.fullMode]: fullMode,
  });

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    (bannerRef as BannerRefType)!.current!.style.display = 'none';
  };

  return (
    <div className={classes} ref={bannerRef}>
      <div className={Styles.banner_content}>{description}</div>
      <div className={Styles.banner_close_icon} onClick={handleClick}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          focusable="false"
          aria-hidden="true"
        >
          <path
            d="M17.6568 19.7782C18.2426 20.3639 19.1924 20.3639 19.7782 19.7782C20.3639 19.1924 20.3639 18.2426 19.7782 17.6568L14.1213 12L19.7782 6.34313C20.3639 5.75734 20.3639 4.8076 19.7782 4.22181C19.1924 3.63602 18.2426 3.63602 17.6568 4.22181L12 9.87866L6.34313 4.22181C5.75734 3.63602 4.8076 3.63602 4.22181 4.22181C3.63602 4.8076 3.63602 5.75734 4.22181 6.34313L9.87866 12L4.22181 17.6568C3.63602 18.2426 3.63602 19.1924 4.22181 19.7782C4.8076 20.3639 5.75734 20.3639 6.34313 19.7782L12 14.1213L17.6568 19.7782Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

Banner.defaultProps = {
  type: 'info',
  description: '',
  className: '',
  fullMode: false,
};

export default Banner;