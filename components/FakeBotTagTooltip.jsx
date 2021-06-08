/* global _ */
import React, { memo } from 'react';
import { getModule } from '@vizality/webpack';
const Tooltip = getModule(m => m?.displayName === 'Tooltip');
import { joinClassNames } from '@vizality/util/dom';

const CrownIcon = 'M13.6572 5.42868C13.8879 5.29002 14.1806 5.30402 14.3973 5.46468C14.6133 5.62602 14.7119 5.90068 14.6473 6.16202L13.3139 11.4954C13.2393 11.7927 12.9726 12.0007 12.6666 12.0007H3.33325C3.02725 12.0007 2.76058 11.792 2.68592 11.4954L1.35258 6.16202C1.28792 5.90068 1.38658 5.62602 1.60258 5.46468C1.81992 5.30468 2.11192 5.29068 2.34325 5.42868L5.13192 7.10202L7.44592 3.63068C7.46173 3.60697 7.48377 3.5913 7.50588 3.57559C7.5192 3.56612 7.53255 3.55663 7.54458 3.54535L6.90258 2.90268C6.77325 2.77335 6.77325 2.56068 6.90258 2.43135L7.76458 1.56935C7.89392 1.44002 8.10658 1.44002 8.23592 1.56935L9.09792 2.43135C9.22725 2.56068 9.22725 2.77335 9.09792 2.90268L8.45592 3.54535C8.46794 3.55686 8.48154 3.56651 8.49516 3.57618C8.51703 3.5917 8.53897 3.60727 8.55458 3.63068L10.8686 7.10202L13.6572 5.42868ZM2.66667 12.6673H13.3333V14.0007H2.66667V12.6673Z';
const Colors = {
  Owner: '#FAA61A',
  Admin: '#C0C0C0',
  Management: '#CD7F32'
};

const FakeBotTag = memo(({ children, className, place, ...rest }) => {
  const { botTag: botTagML } = getModule('botTag', 'member');
  const { botTag: botTagUM } = getModule('botTag', 'additionalActionsIcon');
  const { headerBotTag, headerBotTagWithNickname } = getModule('headerBotTag');
  const { bot } = getModule('bot');
  const { botTagRegular, botTagInvert, px, botText } = getModule('px');

  const classes = place === 'MemberList'
    ? joinClassNames(botTagML, botTagRegular, px)
    : place === 'UserPopout'
      ? joinClassNames(headerBotTag, bot, botTagRegular, px)
      : place === 'UserPopoutNick'
        ? joinClassNames(headerBotTagWithNickname, bot, botTagRegular, px)
        : place === 'UserModal'
          ? joinClassNames(botTagUM, bot, botTagInvert, px)
          : '';

  return (
    <span className={joinClassNames(classes, className)} {...rest}>
      <div className={botText}>
        {children}
      </div>
    </span>
  );
});

export const FakeBotTagTooltip = memo(({ TText, type, icons, place }) => {
  return (
    <Tooltip className={`ST-${place} ST-${Object.keys(type)[0]}`} aria-label={false} tooltipClassName={joinClassNames('ST-tooltip', `ST-tooltip-${place}`, `ST-tooltip-${Object.keys(type)[0]}`)} text={TText}>{ props => {
      if (icons) {
        return (
          <svg className={`${getModule('ownerIcon').ownerIcon} ST-Icon-${Object.keys(type)[0]}`} viewBox={'0 0 16 16'} style={{ marginLeft: '3px' }} {...props}>
            <path fill={Colors[Object.keys(type)[0]]} d={CrownIcon}>
            </path>
          </svg>
        );
      }

      return (
        <FakeBotTag className={`ST-${place} ST-${Object.keys(type)[0]}`} place={place} {...props}>
          {Object.values(type)[0]}
        </FakeBotTag>
      );
    }}
    </Tooltip>
  );
}, (prevProps, nextProps) => {
  return _.isEqual(prevProps, nextProps);
});
