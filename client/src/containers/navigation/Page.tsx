import * as React from 'react';
import { useState } from 'react';
import PageComponent from '../../components/navigation/PageComponent';
import { useAuth0 } from '../../contexts/auth0-context';

type PageProps = {
  title: string;
  actionButton?: JSX.Element;
  children: React.ReactNode;
};

const Page = ({ title, actionButton, children }: PageProps) => {
  const { isAuthenticated } = useAuth0();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <PageComponent
      title={title}
      actionButton={isAuthenticated ? actionButton : undefined}
      children={children}
      mobileOpen={mobileOpen}
      handleDrawerToggle={handleDrawerToggle}
    />
  );
};

export default Page;
