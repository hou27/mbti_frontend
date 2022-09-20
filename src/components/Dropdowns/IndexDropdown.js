import React from "react";
import { Link } from "react-router-dom";
import { createPopper } from "@popperjs/core";
import { useMe } from "../../hooks/useMe";
import { loggedInFlag } from "../../apollo";

const IndexDropdown = () => {
  const { data, loading } = useMe();

  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <a
        className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        {loggedInFlag() ? (loading ? "Loading.." : data?.me.name) : "My Pages"}
      </a>
      <img
        alt="..."
        src={require("assets/img/free-icon-down-arrow-748063.png").default}
      />
      <a
        href="https://www.flaticon.com/kr/free-icons/-"
        title="아래쪽 화살표 아이콘"
        className="hidden"
      >
        아래쪽 화살표 아이콘 제작자: Freepik - Flaticon
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        {loggedInFlag() ? (
          <>
            <span
              className={
                "text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400"
              }
            >
              Admin
            </span>
            <Link
              to={
                loggedInFlag()
                  ? loading
                    ? "Loading.."
                    : `/profile/${data?.me.id}`
                  : "/auth/login"
              }
              className={
                "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
              }
            >
              Profile
            </Link>
          </>
        ) : (
          <>
            <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100" />
            <span
              className={
                "text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400"
              }
            >
              Auth
            </span>
            <Link
              to="/auth/login"
              className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
            >
              Register
            </Link>
          </>
        )}

        <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100" />
        <span
          className={
            "text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400"
          }
        >
          Start
        </span>
        <Link
          to="/search"
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
        >
          유저 검색
        </Link>
      </div>
    </>
  );
};

export default IndexDropdown;
