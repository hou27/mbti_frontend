import React, { useState } from "react";
import { Link } from "react-router-dom";

// components

import Navbar from "../components/Navbars/AuthNavbar.js";
import Footer from "../components/Footers/Footer.js";

import { TEST_PAPER } from "../_mocks_/testPaper.js";
import TestPaper from "../components/TestPaper/TestPaper.js";
import { useMe } from "../hooks/useMe.js";
import { loggedInFlag } from "../apollo.js";
import Login from "./auth/Login.js";
import { useUserProfile } from "../hooks/useUserProfile.js";

export default function Research({ match, location, history }) {
  const [nickname, setNickname] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(loggedInFlag());
  const { data, loading, error } = useMe();
  const { data: userProfileData, loading: userProfileLoading } = useUserProfile(
    +match.params.id
  );
  const questions = TEST_PAPER;
  const regResearch = /research/;
  const userId = +match.params.id;

  if (!loading && userId === data?.me.id) history.push(`/profile/${userId}`);

  return (
    <>
      <Navbar transparent />
      <main>
        <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-75 bg-black"
            ></span>
          </div>
          <div className="container relative mx-auto">
            <div className="items-center flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                <Link to={`/profile/${userId}`}>
                  <button
                    className="text-emerald-500 bg-transparent border border-solid border-emerald-500 hover:bg-emerald-500 hover:text-white active:bg-emerald-600 font-bold uppercase px-8 py-3 rounded outline-none focus:outline-none mr-1 mb-8 ease-linear transition-all duration-150"
                    type="button"
                  >
                    {userProfileData?.userProfile?.user.name
                      ? userProfileData?.userProfile?.user.name
                      : "nonamed"}
                  </button>
                </Link>
                {regResearch.test(match.path) ? (
                  <>
                    <div className="py-12">
                      <h1 className="text-white font-semibold text-5xl">
                        검사 시작하기
                      </h1>
                      <p className="mt-4 text-lg text-blueGray-200">
                        지금부터 시작합니다!
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-white font-semibold text-5xl">
                      {location?.state?.testResult
                        ? location?.state?.testResult
                        : "Loading..."}
                    </h1>
                  </>
                )}
              </div>
            </div>
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
        </div>
        {regResearch.test(match.path) ? (
          <>
            <section className="pb-20 bg-blueGray-200 -mt-24">
              <div className="container mx-auto px-4">
                <div className="flex flex-wrap">
                  <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                      <div className="px-4 py-5 flex-auto">
                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                          <i className="fas fa-award"></i>
                        </div>
                        <h6 className="text-xl font-semibold">주의 사항 1</h6>
                        <p className="mt-2 mb-4 text-blueGray-500">
                          가능하면 오래 생각하지 마십시오.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-4/12 px-4 text-center">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                      <div className="px-4 py-5 flex-auto">
                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-lightBlue-400">
                          <i className="fas fa-retweet"></i>
                        </div>
                        <h6 className="text-xl font-semibold">주의 사항 2</h6>
                        <p className="mt-2 mb-4 text-blueGray-500">
                          반드시 모든 항목에 답변해주십시오.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 w-full md:w-4/12 px-4 text-center">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                      <div className="px-4 py-5 flex-auto">
                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-emerald-400">
                          <i className="fas fa-fingerprint"></i>
                        </div>
                        <h6 className="text-xl font-semibold">주의 사항 3</h6>
                        <p className="mt-2 mb-4 text-blueGray-500">
                          최대한 솔직하게 답변해주십시오.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="relative py-20">
              {isLoggedIn || loggedInFlag() ? (
                <TestPaper
                  question={questions}
                  id={userId}
                  nickname={nickname}
                ></TestPaper>
              ) : (
                <>
                  <div className="w-full px-4">
                    <Login userId={match.params.id}></Login>
                  </div>
                  <h1 className="flex content-center items-center justify-center ml-3 mb-8 font-medium text-xl tracking-wide">
                    O R
                  </h1>
                  <div className="w-full px-4">
                    <div className="container mx-auto px-4 h-full">
                      <div className="flex content-center items-center justify-center h-full">
                        <div className="w-full lg:w-4/12 px-4">
                          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                            <div className="rounded-t mb-0 px-6 py-6">
                              <div className="text-center mb-3">
                                <h6 className="text-blueGray-500 text-sm font-bold">
                                  비회원으로 진행
                                </h6>
                              </div>
                              <hr className="mt-6 border-b-1 border-blueGray-300" />
                            </div>
                            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                              <div className="relative w-full mb-3">
                                <label
                                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                  htmlFor="grid-password"
                                >
                                  Nickname
                                </label>
                                <input
                                  required
                                  onChange={(e) => setNickname(e.target.value)}
                                  type="text"
                                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                  placeholder="nickname"
                                />
                              </div>
                              <div className="text-center mt-6">
                                <button
                                  className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                  type="button"
                                  onClick={() => setIsLoggedIn(true)}
                                >
                                  검사하기
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>

            <section className="pb-20 relative block bg-blueGray-800">
              <div
                className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
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
                    className="text-blueGray-800 fill-current"
                    points="2560 0 2560 100 0 100"
                  ></polygon>
                </svg>
              </div>

              <div className="container mx-auto px-4 lg:pt-24 lg:pb-64">
                <div className="flex flex-wrap mt-12 justify-center">
                  <div className="w-full lg:w-3/12 px-4 text-center">
                    <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                      <i className="fas fa-medal text-xl"></i>
                    </div>
                    <h6 className="text-xl mt-5 font-semibold text-white">
                      MBTI Others
                    </h6>
                    <p className="mt-2 mb-4 text-blueGray-400">
                      It's a project that started to be developed on March 7,
                      2022.
                    </p>
                  </div>
                  <div className="w-full lg:w-3/12 px-4 text-center">
                    <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                      <i className="fas fa-poll text-xl"></i>
                    </div>
                    <h5 className="text-xl mt-5 font-semibold text-white">
                      Share Link to Others
                    </h5>
                    <p className="mt-2 mb-4 text-blueGray-400">
                      You can share the link and ask people to check your MBTI.
                    </p>
                  </div>
                  <div className="w-full lg:w-3/12 px-4 text-center">
                    <div className="text-blueGray-800 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                      <i className="fas fa-lightbulb text-xl"></i>
                    </div>
                    <h5 className="text-xl mt-5 font-semibold text-white">
                      Work Together
                    </h5>
                    <p className="mt-2 mb-4 text-blueGray-400">
                      I'm looking for frontend developer. Send me an email if
                      you interested in.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section className="relative block py-24 lg:pt-0 bg-blueGray-800">
              <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center lg:-mt-64 -mt-48">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200">
                      <div className="flex-auto p-5 lg:p-10">
                        <h4 className="text-2xl font-semibold">
                          Want to leave comment?
                        </h4>
                        <p className="leading-relaxed mt-1 mb-4 text-blueGray-500">
                          Complete this form
                        </p>
                        <div className="relative w-full mb-3 mt-8">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="full-name"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Full Name"
                          />
                        </div>

                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="message"
                          >
                            Message
                          </label>
                          <textarea
                            rows="4"
                            cols="80"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                            placeholder="Type a message..."
                          />
                        </div>
                        <div className="text-center mt-6">
                          <button
                            className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                          >
                            Send Message
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
