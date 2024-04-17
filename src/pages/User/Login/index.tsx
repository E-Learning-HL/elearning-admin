import { setAuthority, setInfo } from '@/common/authority';
import { Footer } from '@/components';
import { currentUser, login } from '@/services/ant-design-pro/api';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage, Helmet, history, useIntl, useModel } from '@umijs/max';
import { Alert, message, ConfigProvider } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
import viVnIntl from 'antd/lib/locale/vi_VN';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState] = useState<API.LoginResult>({});
  const [type] = useState<string>('account');
  const { setInitialState } = useModel('@@initialState');

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const intl = useIntl();

  const fetchUserInfo = async (id: number) => {
    const userInfo = await currentUser(id);
    // const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: { ...userInfo, avatar: 'https://i.pravatar.cc/50' },
        }));
      });
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      // 登录
      console.log('values', values);
      delete values.autoLogin;

      const msg = await login({ ...values, email: values.username });
      if (msg?.data?.accessToken) {
        setAuthority(msg?.data?.accessToken);
        setInfo(msg?.data?.userId);

        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: 'Đăng nhập thành công',
        });

        await fetchUserInfo(msg?.data?.userId);
        const urlParams = new URL(window.location.href).searchParams;
        message.success(defaultLoginSuccessMessage);
        history.push(urlParams.get('redirect') || '/');
        return;
      }
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: 'Đăng nhập thất bại',
      });
      // message.error(defaultLoginFailureMessage);
    }
  };
  const { status, type: loginType } = userLoginState;

  return (
    <div className={containerClassName}>
      {/* <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          - {Settings.title}
        </title>
      </Helmet> */}
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <ConfigProvider locale={viVnIntl}>
          <LoginForm
            contentStyle={{
              minWidth: 280,
              maxWidth: '75vw',
            }}
            logo={<img alt="logo" src="/image/elearning-logo.png" />}
            // title="Ant Design"
            subTitle=" "
            initialValues={{
              autoLogin: true,
            }}
            onFinish={async (values) => {
              await handleSubmit(values);
            }}
          >
            {status === 'error' && loginType === 'account' && (
              <LoginMessage
                content={intl.formatMessage({
                  id: 'pages.login.accountLogin.errorMessage',
                  defaultMessage: '账户或密码错误(admin/ant.design)',
                })}
              />
            )}
            {type === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined />,
                  }}
                  placeholder={'Tên đăng nhập'}
                  rules={[
                    {
                      required: true,
                      message: 'Bạn chưa điền tên đăng nhập',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined />,
                  }}
                  placeholder={'Mật khẩu'}
                  rules={[
                    {
                      required: true,
                      message: 'Bạn chưa điền mật khẩu',
                    },
                  ]}
                />
              </>
            )}

            <div
              style={{
                marginBottom: 24,
              }}
            >
              {/* <a
              style={{
                float: 'right',
                marginBottom: 24,
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </a> */}
            </div>
          </LoginForm>
        </ConfigProvider>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
