import React, { memo, createRef } from 'react';
import { getModule } from '@vizality/webpack';
const Tooltip = getModule(m => m?.displayName === 'Tooltip');

export const OverflowTooltip = memo(({ text, className, ...rest }) => {
  const myDiv = createRef();

  return (
    <Tooltip text={text} {...rest}>{props => {
      const _onMouseEnter = props.onMouseEnter;
      props.onMouseEnter = () => {
        const currentMyDiv = myDiv.current;
        if (currentMyDiv.scrollWidth > currentMyDiv.clientWidth) _onMouseEnter();
      };

      return <div className={className} {...props} ref={myDiv}>{text}</div>;
    }}</Tooltip>
  );
});
