import { gql, useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import * as Yup from "yup";

import { FormError } from "../formError.js";
import TestPaperR from "./TestPaperR.js";
import TestPaperL from "./TestPaperL.js";

const ANALYSIS_TEST_MUTATION = gql`
  mutation analysisTest($analysisTestInput: AnalysisTestInput!) {
    analysis(input: $analysisTestInput) {
      ok
      error
      mbti
    }
  }
`;

export default function TestPaper({ question, history }) {
  const methods = useForm({
    mode: "onChange",
  });

  const onCompleted = (data) => {
    const {
      login: { ok, mbti },
    } = data;
    if (ok && mbti) {
      history.push("/");
    }
  };

  const [analysisTestMutation, { data, loading }] = useMutation(
    ANALYSIS_TEST_MUTATION,
    {
      onCompleted,
    }
  );

  const onSubmit = (e) => {
    e.preventDefault();

    if (!loading) {
      const results = methods.getValues();

      analysisTestMutation({
        variables: {
          analysisTestInput: {
            results,
          },
        },
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        {question.map((type) =>
          type.map((q, index) =>
            index % 2 !== 0 ? (
              <TestPaperR question={q} key={q.id}></TestPaperR>
            ) : (
              <TestPaperL question={q} key={q.id}></TestPaperL>
            )
          )
        )}
        <div className="text-center mt-6">
          <button
            className="bg-blueGray-800 lg:w-3/12 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
