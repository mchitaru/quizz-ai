import React from "react";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="max-w-3xl mx-auto">{children}</div>;
};

export default UserLayout;
