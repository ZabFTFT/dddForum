import React from "react";
import { Link, useLocation } from "react-router-dom";
import { UserData, useUser } from "../contexts/usersContext";

const TitleAndSubmission = () => (
  <div id="title-container">
    <h1>Domain-Driven Designers</h1>
    <h3>Where awesome domain driven designers are made</h3>
    <Link to={"/submit"}>submit</Link>
  </div>
);

const HeaderActionButton = ({ user }: { user: UserData | null }) => (
  <div id="header-action-button">
    {user ? (
      <div>
        <div>{user.username}</div>
        <u>
          <div>logout</div>
        </u>
      </div>
    ) : (
      <Link to="/join">Join</Link>
    )}
  </div>
);

const shouldShowActionButton = (pathName: string) => {
  return pathName !== "/join";
};

export const Header = ({}) => {
  const { user } = useUser();
  const location = useLocation();

  return (
    <header id="header" className="flex align-center">
      <TitleAndSubmission />
      {shouldShowActionButton(location.pathname) ? (
        <HeaderActionButton user={user} />
      ) : (
        ""
      )}
    </header>
  );
};
