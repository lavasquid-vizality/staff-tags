import React, { memo, useState, createRef } from 'react';
import { Category, TextInput, SwitchItem } from '@vizality/components/settings';
import { Divider } from '@vizality/components';
import { getModule } from '@vizality/webpack';

const styleTagDiv = { textTransform: 'none', fontSize: '14px', fontWeight: 400 };

const PreviewMLItem = createRef();
const MemberListItem = getModule(m => m?.displayName === 'MemberListItem');
const UserMention = getModule(m => m?.displayName === 'UserMention');

export default memo(({ getSetting, updateSetting, toggleSetting }) => {
  const user = getModule(m => m?.getCurrentUser).getCurrentUser();

  const [ getTNOpened, setTNOpened ] = useState(true);
  const [ getTSOpened, setTSOpened ] = useState(true);

  return (
    <>
      <Category
        name={'Tag Names'}
        opened={getTNOpened}
        onChange={() => setTNOpened(!getTNOpened)}
      >
        <TextInput
          defaultValue={getSetting('TNOwner', 'Owner')}
          onChange={value => { updateSetting('TNOwner', value); PreviewMLItem.current.forceUpdate(); }}
        >
          {<div style={styleTagDiv}>{'Tag name for Owner'}</div>}
        </TextInput>
        <TextInput
          defaultValue={getSetting('TNAdmin', 'Admin')}
          onChange={value => { updateSetting('TNAdmin', value); PreviewMLItem.current.forceUpdate(); }}
        >
          {<div style={styleTagDiv}>{'Tag name for Admin'}</div>}
        </TextInput>
        <TextInput
          defaultValue={getSetting('TNManagement', 'Management')}
          onChange={value => { updateSetting('TNManagement', value); PreviewMLItem.current.forceUpdate(); }}
        >
          {<div style={styleTagDiv}>{'Tag name for Management'}</div>}
        </TextInput>
        <div style={{ textAlign: 'center' }}><span style={{ fontWeight: 'bold', fontSize: '20px' }}>{'Previews'}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '5px' }}>{
          [ <span>{'Member List:'}</span>,
            <MemberListItem status={getModule(m => m?.getStatus).getStatus(user.id)} user={user} itemProps={getModule('ListNavigatorProvider').useListItem(user.id)} ref={PreviewMLItem} /> ]
        }</div>
        <div>{
          [ <span>{'\nUser Popout & User Modal (Click Mention): '}</span>,
            <UserMention userId={user.id} /> ]
        }</div>
        <Divider style={{ marginTop: '10px', marginBottom: '15px' }} />
        <SwitchItem
          value={getSetting('TNIcons', false)}
          onChange={() => { toggleSetting('TNIcons'); PreviewMLItem.current.forceUpdate(); }}
        >
          {'Icons in Member List'}
        </SwitchItem>
      </Category>
      <Category
        name={'Toggle Show'}
        opened={getTSOpened}
        onChange={() => setTSOpened(!getTSOpened)}
      >
        <SwitchItem
          value={getSetting('MLShow', true)}
          onChange={() => { toggleSetting('MLShow'); PreviewMLItem.current.forceUpdate(); }}
        >
          {'Member List'}
        </SwitchItem>
        <SwitchItem
          value={getSetting('UPShow', true)}
          onChange={() => toggleSetting('UPShow')}
        >
          {'User Popout'}
        </SwitchItem>
        <SwitchItem
          value={getSetting('UMShow', true)}
          onChange={() => toggleSetting('UMShow')}
        >
          {'User Modal'}
        </SwitchItem>
      </Category>
    </>
  );
});
