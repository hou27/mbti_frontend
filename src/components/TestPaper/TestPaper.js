import { gql, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

import { FormError } from "../formError.js";
import TestPaperR from "./TestPaperR.js";
import TestPaperL from "./TestPaperL.js";
import { useMe } from "../../hooks/useMe.js";
import { useHistory } from "react-router-dom";

const ANALYSIS_TEST_MUTATION = gql`
  mutation analysisTest($analysisTestInput: AnalysisTestInput!) {
    analysisTest(input: $analysisTestInput) {
      ok
      error
      testResult {
        mbti
        user {
          id
          name
        }
        tester {
          id
          name
        }
      }
    }
  }
`;

export default function TestPaper({ name, question, id: userId }) {
  const history = useHistory();
  const methods = useForm({
    mode: "onChange",
  });

  const onCompleted = (data) => {
    const {
      analysisTest: { ok, error, testResult },
    } = data;
    if (ok && testResult) {
      console.log(testResult);
      history.push({
        pathname: `/result/${userId}`,
        state: { name, testResult: testResult.mbti },
      });
    } else if (error) {
      console.log(error);
    }
  };

  const { data: meData, loading: meLoading } = useMe();

  const [analysisTestMutation, { data, loading }] = useMutation(
    ANALYSIS_TEST_MUTATION,
    {
      onCompleted,
    }
  );

  const onSubmit = (e) => {
    e.preventDefault();

    if (!loading && !meLoading) {
      const results = methods.getValues();
      console.log(results);
      const values = Object.values(results);
      console.log(values);
      const sum = values.reduce((acc, cur) => (acc += +cur), 0).toString();
      console.log(sum);

      analysisTestMutation({
        variables: {
          analysisTestInput: {
            userId,
            testerId: meData.me.id,
            results: sum,
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
