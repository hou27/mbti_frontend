import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { loggedInFlag } from "../../apollo";
import { useMe } from "../../hooks/useMe";
import { FormError } from "../formError";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfileMutation($editProfileInput: EditProfileInput!) {
    editProfile(input: $editProfileInput) {
      ok
      error
    }
  }
`;

// components

export default function CardSettings() {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const { data: meData, loading: meLoading } = useMe();

  let meInfo;

  if (!loggedInFlag()) {
    history.push("/auth/login");
  } else if (!meLoading) {
    const { me } = meData;
    if (me) {
      meInfo = me;
    }
  }

  const onCompleted = (data, error) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok) {
      history.push(`/profile/${meInfo.id}`);
    } else if (error) {
      console.log(error);
    } else console.log(data);
  };

  // Declare mutation

  const [editProfileMutation, { data: editProfileData, loading: editLoading }] =
    useMutation(EDIT_PROFILE_MUTATION, {
      onCompleted,
    });

  // Control Form

  const formSchema = Yup.object().shape({
    newPassword: Yup.string().min(5, "Password must be at 5 char long"),
    confirmPassword: Yup.string()
      .required("Please type your password one more time.")
      .oneOf([Yup.ref("newPassword")], "Passwords does not match"),
  });

  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(formSchema),
  });
  const onSubmit = (e) => {
    e.preventDefault();

    console.log("a");
    if (!editLoading) {
      const { name, oldPassword, newPassword, confirmPassword, birth, bio } =
        getValues();
      editProfileMutation({
        variables: {
          editProfileInput: {
            name,
            oldPassword,
            password: newPassword,
            birth,
            bio,
          },
        },
      });
      setShowModal(false);
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-blueGray-700 text-xl font-bold">
                My account
              </h6>

              <button
                className="bg-green-500 text-black active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(true)}
              >
                {editLoading ? "Loading~~~" : "Save"}
              </button>
              {showModal ? (
                <>
                  <div
                    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    /*onClick={() => setShowModal(false)}*/
                  >
                    <div className="relative w-auto my-6 mx-auto max-w-sm">
                      {/*content*/}
                      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                          <h3 className="text-3xl font-semibold">진짜?</h3>
                          <button
                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            /*onClick={() => setShowModal(false)}*/
                          >
                            <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                              ×
                            </span>
                          </button>
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex-auto">
                          <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                            Are you sure?
                          </p>
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                          <button
                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => setShowModal(false)}
                          >
                            Close
                          </button>
                          <button
                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="submit"
                            /*onClick={() => setShowModal(false)}*/
                          >
                            {editLoading ? "Loading~~~" : "Save Changes"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
              ) : null}
            </div>
          </div>
          {meLoading ? (
            <span className="ml-3 font-medium text-xl tracking-wide">
              Loading...
            </span>
          ) : (
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                User Information
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Username
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue={meInfo?.name ? meInfo.name : "Loading..."}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue={meInfo?.email ? meInfo.email : "Loading..."}
                      readOnly
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Birth
                    </label>
                    <input
                      {...register("birth")}
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue={
                        meInfo?.birth ? meInfo.birth : "EX) 03 / 27 -> 0327"
                      }
                    />
                  </div>
                </div>
              </div>

              <hr className="mt-6 border-b-1 border-blueGray-300" />

              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                Password
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-12/12 px-4">
                  <div className="relative w-1/2 mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Type your current password
                    </label>
                    <input
                      {...register("oldPassword")}
                      type="password"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    />
                    {editProfileData?.editProfile?.error && (
                      <FormError
                        errorMessage={editProfileData?.editProfile?.error}
                      />
                    )}
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      New Password
                    </label>
                    <input
                      {...register("newPassword")}
                      type="password"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    />
                    {errors.newPassword?.message && (
                      <FormError errorMessage={errors.newPassword?.message} />
                    )}
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
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
                    />
                    {errors.confirmPassword?.message && (
                      <FormError
                        errorMessage={errors.confirmPassword?.message}
                      />
                    )}
                  </div>
                </div>
              </div>

              <hr className="mt-6 border-b-1 border-blueGray-300" />

              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                About Me
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-12/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      About me
                    </label>
                    <textarea
                      {...register("bio")}
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      rows="4"
                      /*value={
                      meInfo?.bio ? meInfo?.bio : "You can enter anything here."
                    }*/
                    >
                      {meInfo?.bio
                        ? meInfo?.bio
                        : "You can enter anything here."}
                    </textarea>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </>
  );
}
