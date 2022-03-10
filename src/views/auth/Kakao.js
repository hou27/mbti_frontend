// @ts-ignore
import React, { useEffect, useState } from "react";
import qs from "qs";
import { gql, useMutation } from "@apollo/client";
import axios from "axios";
import queryString from "query-string";
import { useHistory } from "react-router-dom";

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

export default function KakaoCallback({ location }) {
  // const [kakaoData, setKakaoData] = useState(null);
  // const [kakaoAuth, { data }] = useMutation(CREATE_KAKAO_ACCOUNT, {
  //   variables: { code: code },
  // });
  const onCompleted = (data, error) => {
    const {
      createKakaoAccount: { ok },
    } = data;
    if (ok) {
      alert("Log in now!");
      history.push("/");
    } else if (error) {
      console.log(error);
    } else console.log(data);
  };
  // @ts-ignore
  const [createKakaoAccountMutation, { data, loading, error }] = useMutation(
    CREATE_KAKAO_ACCOUNT_MUTATION,
    {
      onCompleted,
    }
  );

  const history = useHistory();

  const onClick = (e) => {
    e.preventDefault();
  };

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
        console.log(res.data);
        return res;
      });
    console.log("it there :: ", kakaoData);
    return kakaoData;
  }

  function loginWithKakao(name, profileImg, email, gender, password, birth) {
    if (!loading) {
      let intGender;
      gender === "male" ? (intGender = 0) : (intGender = 1);
      console.log(name, profileImg, email, intGender, password, birth);
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

  useEffect(() => {
    async function getUserInfo() {
      const kakaoData = await getToken();
      console.log("how about here :: ", kakaoData);
      const access_token = kakaoData.data.access_token;
      // @ts-ignore
      if (!window.Kakao.isInitialized()) {
        // @ts-ignore
        window.Kakao.init(process.env.REACT_APP_JS_KEY);
        // @ts-ignore
        console.log(window.Kakao.isInitialized());
      }
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
          const password = "123";
          const birth = res.kakao_account.birthday;
          loginWithKakao(name, profileImg, email, gender, password, birth);
        },
        fail: function (error) {
          console.log(error);
        },
      });
    }
    getUserInfo();
    // setTimeout(() => kakaoAuth(), 1000);
  }, []);

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
                <div className="flex justify-center">
                  <img
                    alt="..."
                    src={
                      require("assets/img/kakao_login_medium_narrow.png")
                        .default
                    }
                    onClick={onClick}
                  />
                </div>
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
