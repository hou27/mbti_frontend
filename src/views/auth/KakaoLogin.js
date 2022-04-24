// @ts-ignore
import React, { useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { FormError } from "../../components/formError";
import {
  LOCALSTORAGE_TESTPAGEID,
  LOCALSTORAGE_TOKEN,
  REFRESH_TOKEN,
} from "../../localKey";
import {
  jwtAccessTokenVar,
  jwtRefreshTokenVar,
  loggedInFlag,
} from "../../apollo";
import qs from "qs";
import { setCookie } from "../../utils/cookie";

const LOGIN_WITH_KAKAO_MUTATION = gql`
  mutation loginWithKakao($loginWithKakaoInput: LoginWithKakaoInput!) {
    loginWithKakao(input: $loginWithKakaoInput) {
      ok
      error
      access_token
      refresh_token
    }
  }
`;

export default function KakaoLogin({ location }) {
  const history = useHistory();

  const onCompleted = (data, error) => {
    const {
      loginWithKakao: { ok, access_token, refresh_token },
    } = data;
    if (ok && access_token && refresh_token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, access_token);
      localStorage.setItem(REFRESH_TOKEN, refresh_token);
      // setCookie(REFRESH_TOKEN, refresh_token, {
      //   path: "/",
      //   secure: true,
      //   httpOnly: true,
      // });
      jwtAccessTokenVar(access_token);
      jwtRefreshTokenVar(refresh_token);
      loggedInFlag(true);

      if (localStorage.getItem(LOCALSTORAGE_TESTPAGEID)) {
        const testpageId = localStorage.getItem(LOCALSTORAGE_TESTPAGEID);
        localStorage.removeItem(LOCALSTORAGE_TESTPAGEID);
        history.push(`/research/${testpageId}`);
      } else history.push("/");
    } else if (error) {
      console.log(error);
    }
  };

  // Declare mutation

  const [
    loginWithKakaoMutation,
    { data: loginWithKakaoMutationResult, loading },
  ] = useMutation(LOGIN_WITH_KAKAO_MUTATION, {
    onCompleted,
  });

  useEffect(() => {
    if (!loading) {
      async function getToken() {
        const { code } = qs.parse(location.search, {
          ignoreQueryPrefix: true,
        });

        return code;
      }

      async function kakaoLogin() {
        const code = await getToken();

        if (!loginWithKakaoMutationResult) {
          loginWithKakaoMutation({
            variables: {
              loginWithKakaoInput: {
                code,
              },
            },
          });
        }
      }

      kakaoLogin();
    }
  }, [location, loginWithKakaoMutation, loginWithKakaoMutationResult, loading]);

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-6">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    On process
                  </h6>
                </div>

                {loginWithKakaoMutationResult?.loginWithKakao?.error ? (
                  <span className="flex justify-center mb-6">
                    <FormError
                      errorMessage={
                        loginWithKakaoMutationResult?.loginWithKakao?.error
                      }
                    />
                  </span>
                ) : (
                  <>
                    <div className="flex justify-center mb-6">
                      <img
                        alt="..."
                        src={
                          require("assets/img/kakao_login_medium_narrow.png")
                            .default
                        }
                      />
                    </div>
                    <div className="relative w-full mb-3 text-center">
                      <span className="ml-3 font-medium text-xl tracking-wide">
                        Loading...
                      </span>
                    </div>
                  </>
                )}
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>

              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>Last process of login with Kakao</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
