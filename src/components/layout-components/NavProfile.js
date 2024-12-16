import React, { useState, useEffect } from 'react';
import { Dropdown, Avatar } from 'antd';
import { useDispatch } from 'react-redux';
import {
  EditOutlined,
  SettingOutlined,
  ShopOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { signOut } from 'store/slices/authSlice';
import NavItem from './NavItem';
import Flex from 'components/shared-components/Flex';
import { FONT_WEIGHT, MEDIA_QUERIES, SPACER, FONT_SIZES } from 'constants/ThemeConstant';
import { fetchMe } from 'api/me';

const Icon = styled.div(() => ({
  fontSize: FONT_SIZES.LG,
}));

const Profile = styled.div(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const UserInfo = styled('div')`
  padding-left: ${SPACER[2]};

  @media ${MEDIA_QUERIES.MOBILE} {
    display: none;
  }
`;

const Name = styled.div(() => ({
  fontWeight: FONT_WEIGHT.SEMIBOLD,
}));

const Title = styled.span(() => ({
  opacity: 0.8,
}));

const MenuItem = (props) => (
  <Flex as="a" href={props.path} alignItems="center" gap={SPACER[2]}>
    <Icon>{props.icon}</Icon>
    <span>{props.label}</span>
  </Flex>
);

const MenuItemSignOut = (props) => {
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <div onClick={handleSignOut}>
      <Flex alignItems="center" gap={SPACER[2]}>
        <Icon>
          <LogoutOutlined />
        </Icon>
        <span>{props.label}</span>
      </Flex>
    </div>
  );
};

const items = [
  {
    key: 'Edit Profile',
    label: <MenuItem path="/" label="Edit Profile" icon={<EditOutlined />} />,
  },
  {
    key: 'Account Setting',
    label: <MenuItem path="/" label="Account Setting" icon={<SettingOutlined />} />,
  },
  {
    key: 'Account Billing',
    label: <MenuItem path="/" label="Account Billing" icon={<ShopOutlined />} />,
  },
  {
    key: 'Help Center',
    label: <MenuItem path="/" label="Help Center" icon={<QuestionCircleOutlined />} />,
  },
  {
    key: 'Sign Out',
    label: <MenuItemSignOut label="Sign Out" />,
  },
];

export const NavProfile = ({ mode }) => {
  const [userInfo, setUserInfo] = useState({ name: '', role: '' });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetchMe(); // Call the me API
        setUserInfo({ name: response.name, role: response.role });
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <Dropdown placement="bottomRight" menu={{ items }} trigger={['click']}>
      <NavItem mode={mode}>
        <Profile>
          <Avatar src="/img/avatars/thumb-1.jpg" />
          <UserInfo className="profile-text">
            <Name>{userInfo.name}</Name>
            <Title>{userInfo.role}</Title>
          </UserInfo>
        </Profile>
      </NavItem>
    </Dropdown>
  );
};

export default NavProfile;
