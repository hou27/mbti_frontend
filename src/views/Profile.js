import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbars/AuthNavbar.js";
import Footer from "../components/Footers/Footer.js";
import { useMe } from "../hooks/useMe.js";
import { loggedInFlag } from "../apollo.js";
import { useUserProfile } from "../hooks/useUserProfile.js";

export default function Profile({ match, history }) {
  const userId = +match.params.id;
  let userInfo,
    meInfo,
    myResult,
    userList,
    variety,
    sortedMbti = [];
  const { data: meData, loading: meLoading } = useMe();
  const { data: userData, loading: userLoading } = useUserProfile(userId);

  function getSortedArr(array) {
    const res = [];
    const counts = array.reduce((acc, cur) => {
      acc[cur] = (acc[cur] || 0) + 1;
      return acc;
    }, {});

    for (let mbti in counts) {
      res.push([mbti, counts[mbti]]);
    }

    res.sort((a, b) => {
      return b[1] - a[1];
    });

    return res;
  }

  if (!loggedInFlag()) {
    history.push("/auth/login");
  } else if (!meLoading) {
    const { me } = meData;
    if (me) {
      meInfo = me;
    }
  }
  if (!userLoading) {
    const {
      userProfile: { ok, user, myResult: mR, userList: uL },
    } = userData;
    if (ok) {
      userInfo = user;
      myResult = mR;
      userList = uL;
    }
    const myResultArr = myResult.map((mbti) => mbti.mbti);
    sortedMbti = getSortedArr(myResultArr);
    variety = new Set(myResultArr);
  }

  return (
    <>
      <Navbar transparent />
      <main className="profile-page">
        <section className="relative block h-500-px">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
            style={{ transform: "translateZ(0)" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-blueGray-200 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </section>
        <section className="relative py-16 bg-blueGray-200">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <img
                      alt="..."
                      src={
                        userInfo
                          ? userInfo.profileImg
                            ? userInfo.profileImg
                            : require("assets/img/user.png").default
                          : require("assets/img/user.png").default
                      }
                      className="shadow-xl object-cover h-150-px rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 w-150-px"
                    />
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                    <div className="py-6 px-3 mt-32 sm:mt-0">
                      <Link
                        to={
                          !meLoading && !userLoading
                            ? match.params.id === "0" ||
                              meInfo?.email === userInfo?.email
                              ? "/admin/editprofile"
                              : {
                                  pathname: `/research/${userId}`,
                                  state: {
                                    name: userInfo.name,
                                  },
                                }
                            : "#"
                        }
                      >
                        <button
                          className="bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                          type="button"
                        >
                          {!meLoading && !userLoading
                            ? match.params.id === "0" ||
                              meInfo?.email === userInfo?.email
                              ? "프로필 편집"
                              : "검사하기"
                            : "Loading..."}
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {!meLoading && !userLoading
                            ? myResult.length
                            : "Loading..."}
                        </span>
                        <span className="text-sm text-blueGray-400">
                          Researchers
                        </span>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {!meLoading && !userLoading
                            ? variety.size
                            : "Loading..."}
                        </span>
                        <span className="text-sm text-blueGray-400">
                          MBTI variety
                        </span>
                      </div>
                      <div className="lg:mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {!meLoading && !userLoading
                            ? userList.length
                            : "Loading..."}
                        </span>
                        <span className="text-sm text-blueGray-400">
                          My List
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {!userLoading ? (
                  <>
                    <div className="text-center mt-12">
                      <h3 className="text-4xl font-semibold leading-normal text-blueGray-700 mb-2">
                        {userInfo?.name ? userInfo.name : "No Info"}
                      </h3>
                      <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                        <i className="fas fa-solid fa-cake-candles mr-2 text-lg text-blueGray-400"></i>{" "}
                        {userInfo?.birth ? userInfo.birth : "enter your birth"}
                      </div>
                      <div className="mb-2 text-blueGray-600 mt-10">
                        <i className="fas fa-solid fa-quote-right mr-2 text-lg text-blueGray-400"></i>
                        The highest percentage of MBTI is...
                      </div>
                      <h4 className="text-4xl font-semibold leading-normal text-blueGray-700 mb-2">
                        {sortedMbti.length === 0 ? "Not yet" : sortedMbti[0][0]}
                      </h4>
                      <br />

                      <div className="mb-2 text-blueGray-600">
                        <i className="fas fa-regular fa-envelope-open mr-2 text-lg text-blueGray-400"></i>
                        {userInfo?.email ? userInfo?.email : "No Info"}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center mt-12">
                    <h3 className="text-4xl font-semibold leading-normal text-blueGray-700 mb-2">
                      "No Info"
                    </h3>
                  </div>
                )}
                <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                        {!userLoading ? (
                          userInfo?.bio ? (
                            userInfo?.bio
                          ) : (
                            <p>
                              enter your bio
                              <br />
                              ex) Info like your MBTI or some links like your
                              SNS.
                            </p>
                          )
                        ) : (
                          "No Info"
                        )}
                      </p>
                      <a
                        href="#pablo"
                        className="font-normal text-lightBlue-500"
                        onClick={(e) => e.preventDefault()}
                      >
                        Show more
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
