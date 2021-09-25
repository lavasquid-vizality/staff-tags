import React, { memo, createRef } from 'react';
import { getModule } from '@vizality/webpack';

const Tooltip = getModule(m => m.displayName === 'Tooltip');

export const OverflowTooltip = memo(({ text, tooltipText, className, ...rest }) => {
  const myDiv = createRef();

  return (
    <Tooltip text={tooltipText} {...rest}>{props => {
      const _onMouseEnter = props.onMouseEnter;
      props.onMouseEnter = () => {
        const currentMyDiv = myDiv.current;
        if (currentMyDiv.scrollWidth > currentMyDiv.clientWidth) _onMouseEnter();
      };

      return <div className={className} {...props} ref={myDiv}>{text}</div>;
    }}</Tooltip>
  );
});
