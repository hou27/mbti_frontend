// @ts-ignore
import React, { useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import axios from "axios";
import qs from "qs";
import queryString from "query-string";

import { useHistory } from "react-router-dom";
import { FormError } from "../../components/formError";
import { useForm } from "react-hook-form";
import { useLogin } from "../../hooks/useLogin";
import { LOCALSTORAGE_TOKEN } from "../../localToken";
import { jwtTokenVar, loggedInFlag } from "../../apollo";
import { Link } from "react-router-dom";

const FIND_ACCOUNT_BY_EMAIL_MUTATION = gql`
  mutation findAccountByEmailMutation($findByEmailInput: FindByEmailInput!) {
    findByEmail(input: $findByEmailInput) {
      ok
      error
      user {
        email
      }
    }
  }
`;

export default function KakaoLogin({ location }) {
  // Init Kakao api
  // @ts-ignore
  if (!window.Kakao.isInitialized()) {
    // @ts-ignore
    window.Kakao.init(process.env.REACT_APP_JS_KEY);
    // @ts-ignore
    console.log(window.Kakao.isInitialized());
  }
  const history = useHistory();

  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    mode: "onChange",
  });
  watch("email");

  const onCompleted = (data) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      jwtTokenVar(token);
      loggedInFlag(true);
      history.push("/");
    }
  };

  // Declare mutation

  const [
    findByEmailMutation,
    { data: findByEmailMutationResult, loading: accountLoading },
  ] = useMutation(FIND_ACCOUNT_BY_EMAIL_MUTATION, {});

  const [loginMutation, { data: loginMutationResult, loading }] =
    useLogin(onCompleted);

  /** get user info */

  async function getToken() {
    const { code } = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    const formData = {
      grant_type: "authorization_code",
      client_id: process.env.REACT_APP_KAKAO_REST_API_KEY,
      redirect_uri: process.env.REACT_APP_REDIRECT_URI_LOGIN,
      code,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
    };
    const kakaoData = await axios
      .post(
        `https://kauth.kakao.com/oauth/token?${queryString.stringify(formData)}`
      )
      .then((res) => {
        return res;
      });
    return kakaoData;
  }

  function callFindByEmail(email) {
    findByEmailMutation({
      variables: {
        findByEmailInput: {
          email,
        },
      },
    });
  }

  async function getUserInfo() {
    const kakaoData = await getToken();
    const access_token = kakaoData.data.access_token;

    // @ts-ignore
    window.Kakao.Auth.setAccessToken(access_token);
    // @ts-ignore
    window.Kakao.API.request({
      url: "/v2/user/me",
      success: function (res) {
        console.log(res);
        const email = res.kakao_account.email;
        callFindByEmail(email);
      },
      fail: function (error) {
        console.log(error);
      },
    });
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  const onSubmit = () => {
    if (!loading) {
      const { password } = getValues();
      loginMutation({
        variables: {
          loginInput: {
            email: findByEmailMutationResult?.findByEmail?.user.email,
            password,
          },
        },
      });
    }
  };

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

                {findByEmailMutationResult?.findByEmail?.error ? (
                  <>
                    <span className="flex justify-center mb-6">
                      <FormError
                        errorMessage={
                          findByEmailMutationResult?.findByEmail?.error
                        }
                      />
                    </span>
                    <div className="text-center">
                      <Link to="/auth/register" className="text-green-700">
                        <button
                          className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                          type="button"
                        >
                          Create new account
                        </button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Your Kakao Email
                      </label>
                      <input
                        type="email"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Email"
                        defaultValue={
                          accountLoading
                            ? "Loading..."
                            : findByEmailMutationResult?.findByEmail?.user.email
                        }
                        readOnly
                      />
                    </div>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Password
                      </label>
                      <input
                        {...register("password", {
                          required: "Password is required",
                        })}
                        required
                        type="password"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Password"
                      />
                      {errors.password?.message && (
                        <FormError errorMessage={errors.password?.message} />
                      )}
                    </div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          id="customCheckLogin"
                          type="checkbox"
                          className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                        />
                        <span className="ml-2 text-sm font-semibold text-blueGray-600">
                          Remember me
                        </span>
                      </label>
                    </div>

                    <div className="text-center mt-6">
                      <button
                        className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        type="submit"
                      >
                        {loading ? "Loading~~~" : "Sign In"}
                      </button>
                      {loginMutationResult?.login.error && (
                        <FormError
                          errorMessage={loginMutationResult.login.error}
                        />
                      )}
                    </div>
                  </form>
                )}
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>

              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>Last process of register</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
