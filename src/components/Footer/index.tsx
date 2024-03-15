import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = 'HL Techs';

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      // links={[
      //   {
      //     key: 'NhaKhoaHub',
      //     title: 'NhaKhoaHub',
      //     href: 'https://nhakhoahub.com',
      //     blankTarget: true,
      //   },
      // ]}
    />
  );
};

export default Footer;
