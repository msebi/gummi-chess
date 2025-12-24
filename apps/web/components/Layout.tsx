import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    // This div is the key. It centers your content and sets a max-width.
    <div className="container mx-auto px-4">
      {children}
    </div>
  );
};

export default Layout;