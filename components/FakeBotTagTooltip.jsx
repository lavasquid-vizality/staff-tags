import { isEqual } from 'lodash';
import React, { memo } from 'react';
import { getModule } from '@vizality/webpack';
import { joinClassNames } from '@vizality/util/dom';

import { Colors } from '../constants';

const Tooltip = getModule(m => m.displayName === 'Tooltip');
const Crown = getModule(m => m.displayName === 'Crown');
const BotTag = getModule(m => m.displayName === 'BotTag');

const { ownerIcon, icon } = getModule('ownerIcon');

const FakeBotTag = memo(({ place, color, className, props, text }) => {
  const { botTag: botTagML } = getModule('botTag', 'member');
  const { botTag: botTagUM } = getModule('botTag', 'additionalActionsIcon');
  const { headerBotTag, headerBotTagWithNickname } = getModule('headerBotTag');
  const { bot } = getModule('bot');

  const classes = place === 'MemberList'
    ? botTagML
    : place === 'UserPopout'
      ? joinClassNames(headerBotTag, bot)
      : place === 'UserPopoutNick'
        ? joinClassNames(headerBotTagWithNickname, bot)
        : place === 'UserModal'
          ? joinClassNames(botTagUM, bot)
          : '';

  const FakeBotTag = BotTag({ className: classes, color });
  FakeBotTag.props = {
    ...FakeBotTag.props,
    className: FakeBotTag.props.className += ` ${className}`,
    ...props
  };
  FakeBotTag.props.children[1].props.children = text;

  return FakeBotTag;
});

export default memo(({ TText, type, icons, place, color }) => {
  return <Tooltip className={`ST-${place} ST-${Object.keys(type)[0]}`} aria-label={false} tooltipClassName={joinClassNames('ST-Tooltip', `ST-Tooltip-${place}`, `ST-Tooltip-${Object.keys(type)[0]}`)} text={TText}>{ props => {
    if (icons) {
      return <Crown className={`${ownerIcon} ${icon} ST-Icon-${Object.keys(type)[0]}`} color={Colors[Object.keys(type)[0]]} {...props} />;
    }

    return <FakeBotTag place={place} color={color} className={`ST-${place} ST-${Object.keys(type)[0]}`} props={props} text={Object.values(type)[0]} />;
  }}
  </Tooltip>;
}, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});
