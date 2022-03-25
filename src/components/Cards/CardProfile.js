import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useHistory } from "react-router";
import { loggedInFlag } from "../../apollo";
import { LOCALSTORAGE_TOKEN } from "../../localKey";
import { FormError } from "../formError";
import Modal from "../Modal";

const DELETE_ACCOUNT_MUTATION = gql`
  mutation deleteAccountMutation {
    deleteAccount {
      ok
      error
    }
  }
`;

export default function CardProfile() {
  const history = useHistory();

  const onCompleted = (data, error) => {
    const {
      deleteAccount: { ok },
    } = data;
    if (ok) {
      history.push("/");
      localStorage.removeItem(LOCALSTORAGE_TOKEN);
      loggedInFlag(false);
    } else if (error) {
      console.log(error);
    }
  };

  // Declare mutation

  const [
    deleteAccountMutation,
    { data: deleteAccountData, loading: deleteAccountLoading },
  ] = useMutation(DELETE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  const deleteAccount = () => {
    if (!deleteAccountLoading) {
      deleteAccountMutation();
    }
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
        <h1 className="ml-3 font-medium text-xl tracking-wide">
          Will Implement Flocking Simulation Here!
        </h1>
      </div>
      <Modal
        title={"회원 탈퇴"}
        content={
          "회원 탈퇴 시, 회원님의 검사 기록은 사라지지 않지만 회원님을 대상으로 한 검사 내역은 전부 사라집니다. 정말 탈퇴하시겠습니까?"
        }
        submitButtonContent={"탈퇴"}
        submitFunc={deleteAccount}
      ></Modal>
      {deleteAccountData?.deleteAccount?.error && (
        <FormError errorMessage={deleteAccountData?.deleteAccount?.error} />
      )}
    </>
  );
}
