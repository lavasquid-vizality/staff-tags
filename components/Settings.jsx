import React, { memo, createRef } from 'react';
import { Category, TextInput, SwitchItem } from '@vizality/components/settings';
import { Divider } from '@vizality/components';
import { getModule } from '@vizality/webpack';

import { DefaultSettings } from '../constants';

const styleTagDiv = { textTransform: 'none', fontSize: '14px', fontWeight: 400 };

const PreviewMLItem = createRef();
const MemberListItem = getModule(m => m.displayName === 'MemberListItem');
const UserMention = getModule(m => m.displayName === 'UserMention');

export default memo(({ getSetting, updateSetting, toggleSetting }) => {
  const user = getModule(m => m.getCurrentUser).getCurrentUser();

  return <>
    <Category
      title={'Tag Names'}
      opened
    >
      <TextInput
        defaultValue={getSetting('TNOwner', DefaultSettings.TNOwner)}
        onChange={value => { updateSetting('TNOwner', value); PreviewMLItem.current.forceUpdate(); }}
      >
        {<div style={styleTagDiv}>{'Tag name for Owner'}</div>}
      </TextInput>
      <TextInput
        defaultValue={getSetting('TNThreadCreator', DefaultSettings.TNThreadCreator)}
        onChange={value => { updateSetting('TNThreadCreator', value); PreviewMLItem.current.forceUpdate(); }}
      >
        {<div style={styleTagDiv}>{'Tag name for Thread Creator'}</div>}
      </TextInput>
      <TextInput
        defaultValue={getSetting('TNAdmin', DefaultSettings.TNAdmin)}
        onChange={value => { updateSetting('TNAdmin', value); PreviewMLItem.current.forceUpdate(); }}
      >
        {<div style={styleTagDiv}>{'Tag name for Admin'}</div>}
      </TextInput>
      <TextInput
        defaultValue={getSetting('TNManagement', DefaultSettings.TNManagement)}
        onChange={value => { updateSetting('TNManagement', value); PreviewMLItem.current.forceUpdate(); }}
      >
        {<div style={styleTagDiv}>{'Tag name for Management'}</div>}
      </TextInput>
      <div style={{ textAlign: 'center' }}><span style={{ fontWeight: 'bold', fontSize: '20px' }}>{'Previews'}</span></div>
      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '5px' }}>{
        [ <span>{'Member List:'}</span>,
          <MemberListItem status={getModule(m => m.getStatus).getStatus(user.id)} user={user} itemProps={{ className: 'ST-MemberListPreview', ...getModule('ListNavigatorProvider').useListItem(user.id) }} ref={PreviewMLItem} /> ]
      }</div>
      <div>{
        [ <span>{'\nUser Popout & User Modal (Click Mention): '}</span>,
          <UserMention className={'mention'} userId={user.id} /> ]
      }</div>
      <Divider style={{ marginTop: '10px', marginBottom: '15px' }} />
      <SwitchItem
        value={getSetting('TNIcons', DefaultSettings.TNIcons)}
        onChange={() => { toggleSetting('TNIcons'); PreviewMLItem.current.forceUpdate(); }}
      >
        {'Icons in Member List'}
      </SwitchItem>
    </Category>
    <Category
      title={'Toggle Show'}
      opened
    >
      <SwitchItem
        value={getSetting('MLShow', DefaultSettings.MLShow)}
        onChange={() => { toggleSetting('MLShow'); PreviewMLItem.current.forceUpdate(); }}
      >
        {'Member List'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('UPShow', DefaultSettings.UPShow)}
        onChange={() => toggleSetting('UPShow')}
      >
        {'User Popout'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('UMShow', DefaultSettings.UMShow)}
        onChange={() => toggleSetting('UMShow')}
      >
        {'User Modal'}
      </SwitchItem>
    </Category>
  </>;
});
