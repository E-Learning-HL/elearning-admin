import { clearAuthority, getAuthority } from '@/common/authority';
import { LogoutOutlined, SettingOutlined, UserOutlined, RedoOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { history, useModel } from '@umijs/max';
import { Spin, Modal, Form, Input, notification, Space, message } from 'antd';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useState } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.name}</span>;
};

const FormItem = Form.Item;

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    // await outLogin();
    clearAuthority();
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };
  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });
  const { initialState, setInitialState } = useModel('@@initialState');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({ ...s, currentUser: undefined }));
        });
        loginOut();
        return;
      } else if (key === 'changepassword') {
        setIsModalOpen(true);
      }
      if (key != 'changepassword') {
        history.push(`/account/${key}`);
      }
    },
    [setInitialState],
  );

  const loading = (
    <span className={actionClassName}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: '个人中心',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
    {
      key: 'changepassword',
      icon: <RedoOutlined />,
      label: 'Đổi mật khẩu',
    },
  ];
  type NotificationType = 'success' | 'info' | 'warning' | 'error';
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type: NotificationType, message: String) => {
    api[type]({
      message: type.toUpperCase(),
      description: message,
    });
  };

  const [formChangePassword] = Form.useForm();

  const onSubmit = async () => {
    const formValue = await formChangePassword.validateFields();
    const body = {
      oldpassword: formValue.oldpass,
      newpassword: formValue.newpass,
    };
    await fetch(`${API_ENDPOINT}/api/user/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthority()}`,
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.message.includes('successfully')) {
          openNotificationWithIcon('success', res.message);
          setIsModalOpen(false);
          formChangePassword.resetFields();
        } else if (res.message.includes('incorrect')) {
          openNotificationWithIcon('error', res.message);
        } else {
          openNotificationWithIcon('error', res.message);
        }
      })
      .catch(() => {});
  };
  return (
    <>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        {children}
      </HeaderDropdown>
      <Modal
        title="Đổi mật khẩu"
        open={isModalOpen}
        onOk={() => onSubmit()}
        onCancel={() => {
          setIsModalOpen(false);
          formChangePassword.resetFields();
        }}
        maskClosable={false}
        cancelText="Hủy"
      >
        <Form form={formChangePassword} labelCol={{ span: 9 }} wrapperCol={{ span: 24 }}>
          <FormItem
            label="Mật khẩu cũ"
            name="oldpass"
            dependencies={['password']}
            rules={[{ required: true, message: '' }]}
          >
            <Input.Password />
          </FormItem>
          <FormItem
            label="Mật khẩu mới"
            name="newpass"
            dependencies={['password']}
            rules={[
              { required: true, message: '' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value.length > 5) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu phải chứa ít nhất 6 kí tự!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </FormItem>
          <FormItem
            label="Nhập lại mật khẩu mới"
            name="comfirmnewpass"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: '',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newpass') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu mới không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </FormItem>
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
};
