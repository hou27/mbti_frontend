import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { FormError } from "../formError.js";
import TestPaperR from "./TestPaperR.js";
import TestPaperL from "./TestPaperL.js";

export default function TestPaper({ question }) {
  const formSchema = Yup.object().shape({
    decision: Yup.number()
      .required("Selecting the decision field is required")
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

  return (
    <>
      {question.map((q, index) =>
        index % 2 !== 0 ? (
          <TestPaperR question={q} key={q.id}></TestPaperR>
        ) : (
          <TestPaperL question={q} key={q.id}></TestPaperL>
        )
      )}
    </>
  );
}
