// @ts-ignore
import React from "react";
import { gql, useMutation } from "@apollo/client";
import axios from "axios";
import * as Yup from "yup";
import qs from "qs";
import queryString from "query-string";

import { useHistory } from "react-router-dom";
import { FormError } from "../../components/formError";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const CREATE_KAKAO_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation(
    $createKakaoAccountInput: CreateKakaoAccountInput!
  ) {
    createKakaoAccount(input: $createKakaoAccountInput) {
      ok
      error
    }
  }
`;

const FIND_ACCOUNT_BY_EMAIL_MUTATION = gql`
  mutation findAccountByEmailMutation($findMyEmailInput: FindMyEmailInput!) {
    findByEmail(input: $findMyEmailInput) {
      ok
      error
    }
  }
`;

export default function KakaoCallback({ location }) {
  // Init Kakao api
  // @ts-ignore
  if (!window.Kakao.isInitialized()) {
    // @ts-ignore
    window.Kakao.init(process.env.REACT_APP_JS_KEY);
    // @ts-ignore
    console.log(window.Kakao.isInitialized());
  }
  const history = useHistory();

  const onCompleted = (data, error) => {
    const {
      createKakaoAccount: { ok },
    } = data;
    if (ok) {
      alert("Log in now!");
      history.push("/auth/login");
    } else if (error) {
      console.log(error);
    } else console.log(data);
  };

  // Declare mutation

  const [
    createKakaoAccountMutation,
    { data: createKakaoAccountMutationResult, loading, error },
  ] = useMutation(CREATE_KAKAO_ACCOUNT_MUTATION, {
    onCompleted,
  });

  // const [
  //   findAccountByEmailMutation,
  //   { data: findAccountByEmailMutationResult, loading: loadAccount },
  // ] = useMutation(FIND_ACCOUNT_BY_EMAIL_MUTATION, {
  //   onCompleted,
  // });

  const formSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is mendatory")
      .min(3, "Password must be at 3 char long"),
    confirmPassword: Yup.string()
      .required("Please type your password one more time.")
      .oneOf([Yup.ref("password")], "Passwords does not match"),
  });

  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(formSchema),
  });

  /** create kakao account */

  function createKakaoAccount(
    name,
    profileImg,
    email,
    gender,
    password,
    birth
  ) {
    if (!loading) {
      let intGender;
      gender === "male" ? (intGender = 0) : (intGender = 1);
      createKakaoAccountMutation({
        variables: {
          createKakaoAccountInput: {
            name,
            profileImg,
            email,
            gender: intGender,
            password,
            birth,
          },
        },
      });
    }
  }

  /** get user info */

  async function getToken() {
    const { code } = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    const formData = {
      grant_type: "authorization_code",
      client_id: process.env.REACT_APP_KAKAO_REST_API_KEY,
      redirect_uri: process.env.REACT_APP_REDIRECT_URI_AUTH,
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

  async function getUserInfo(password) {
    const kakaoData = await getToken();
    const access_token = kakaoData.data.access_token;

    // @ts-ignore
    window.Kakao.Auth.setAccessToken(access_token);
    // @ts-ignore
    window.Kakao.API.request({
      url: "/v2/user/me",
      success: function (res) {
        console.log(res);
        const name = res.properties.nickname;
        const profileImg = res.properties.profile_image;
        const email = res.kakao_account.email;
        const gender = res.kakao_account.gender;
        const birth = res.kakao_account.birthday;
        createKakaoAccount(name, profileImg, email, gender, password, birth);
      },
      fail: function (error) {
        console.log(error);
      },
    });
  }

  const onSubmit = () => {
    if (!loading) {
      const { password } = getValues();
      getUserInfo(password);
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

                {createKakaoAccountMutationResult?.createKakaoAccount?.error ? (
                  <span className="flex justify-center mb-6">
                    <FormError
                      errorMessage={
                        createKakaoAccountMutationResult?.createKakaoAccount
                          ?.error
                      }
                    />
                  </span>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex justify-center mb-6">
                      <img
                        alt="..."
                        src={
                          require("assets/img/kakao_login_medium_narrow.png")
                            .default
                        }
                      />
                    </div>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Password
                      </label>
                      {/**passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/ */}
                      <input
                        {...register("password")}
                        type="password"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Password"
                      />
                      {errors.password?.message && (
                        <FormError errorMessage={errors.password?.message} />
                      )}
                    </div>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Check Password
                      </label>
                      <input
                        {...register("confirmPassword")}
                        type="password"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Check your Password"
                      />
                      {errors.confirmPassword?.message && (
                        <FormError
                          errorMessage={errors.confirmPassword?.message}
                        />
                      )}
                    </div>
                    <div className="text-center mt-6">
                      <button
                        className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        type="submit"
                      >
                        {loading ? "Loading~~~" : "Create Account"}
                      </button>
                      {createKakaoAccountMutationResult?.createKakaoAccount
                        .error && (
                        <FormError
                          errorMessage={
                            createKakaoAccountMutationResult.createKakaoAccount
                              .error
                          }
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
