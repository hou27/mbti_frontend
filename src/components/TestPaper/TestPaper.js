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
  return (
    <>
      {question.map((type, indexT) =>
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
    </>
  );
}
