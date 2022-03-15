import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../../components/formError";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const CREATEACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

export default function Register({ history }) {
  const formSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .required("Email is required")
      .matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email"
      ),
    password: Yup.string()
      .required("Password is mendatory")
      .min(3, "Password must be at 3 char long"),
    confirmPassword: Yup.string()
      .required("Please type your password one more time.")
      .oneOf([Yup.ref("password")], "Passwords does not match"),
    gender: Yup.number()
      .required("Selecting the gender field is required")
      .oneOf([0, 1], "Must be one of 0, 1"),
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
  const onCompleted = (data) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      alert("Log in now!");
      history.push("/auth/login");
    } else console.log(ok);
  };
  const [
    createAccountMutation,
    { data: createAccountMutationResult, loading },
  ] = useMutation(CREATEACCOUNT_MUTATION, {
    onCompleted,
  });

  const onSubmit = () => {
    if (!loading) {
      const { name, email, password, gender } = getValues();
      const intGender = +gender;
      createAccountMutation({
        variables: {
          createAccountInput: {
            name,
            email,
            password,
            gender: intGender,
          },
        },
      });
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Sign up with
                  </h6>
                </div>
                <div className="btn-wrapper text-center">
                  <a
                    href={`https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI_AUTH}&response_type=code`}
                    className="mr-2 mb-1 shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                  >
                    <img
                      alt="..."
                      src={
                        require("assets/img/kakao_login_medium_narrow.png")
                          .default
                      }
                    />
                  </a>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>Or sign up with credentials</small>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Name
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Name"
                    />
                    {errors.name?.message && (
                      <FormError errorMessage={errors.name?.message} />
                    )}
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Email"
                    />
                    {errors.email?.message && (
                      <FormError errorMessage={errors.email?.message} />
                    )}
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

                  <div className="mb-8">
                    <label className="inline-flex items-center cursor-pointer">
                      <span className="text-sm font-semibold text-blueGray-600">
                        <input
                          {...register("gender")}
                          type="radio"
                          id="Male"
                          name="gender"
                          value="0"
                          className="form-radio border-0 rounded text-blueGray-700 ml-1 mr-3 w-5 h-5 ease-linear transition-all duration-150"
                          defaultChecked
                        />
                        <label htmlFor="Male" className="mr-3">
                          Male
                        </label>
                        <input
                          {...register("gender")}
                          type="radio"
                          id="Female"
                          name="gender"
                          value="1"
                          className="form-radio border-0 rounded text-blueGray-700 ml-1 mr-3 w-5 h-5 ease-linear transition-all duration-150"
                        />
                        <label htmlFor="Female" className="mr-3">
                          Female
                        </label>
                      </span>
                      {errors.gender?.message && (
                        <FormError errorMessage={errors.gender?.message} />
                      )}
                    </label>
                  </div>
                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        I agree with the{" "}
                        <a
                          href="#pablo"
                          className="text-lightBlue-500"
                          onClick={(e) => e.preventDefault()}
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>

                  <div className="text-center mt-6">
                    <button
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      {loading ? "Loading~~~" : "Create Account"}
                    </button>
                    {createAccountMutationResult?.createAccount.error && (
                      <FormError
                        errorMessage={
                          createAccountMutationResult.createAccount.error
                        }
                      />
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
