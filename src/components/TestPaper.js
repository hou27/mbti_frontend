import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { FormError } from "../components/formError.js";
import { TEST_PAPER } from "../_mocks_/testPaper.js";

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
    <section className="relative py-20">
      <div className="container mx-auto px-4">
        <div className="items-center flex flex-wrap">
          <div className="w-full md:w-5/12 ml-auto mr-auto px-4">
            <div className="md:pr-12">
              <div className="text-lightBlue-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-lightBlue-300">
                <i className="fas fa-rocket text-xl"></i>
              </div>
              <h3 className="text-3xl font-semibold">A growing company</h3>
              <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                The extension comes with three pre-built pages to help you get
                started faster. You can change the text and images and you're
                good to go.
              </p>
              <ul className="list-none mt-6">
                <li className="py-2">
                  <div className="flex items-center">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-lightBlue-600 bg-lightBlue-200 mr-3">
                        <i className="fas fa-fingerprint"></i>
                      </span>
                    </div>
                    <div>
                      <h4 className="text-blueGray-500">
                        Carefully crafted components
                      </h4>
                    </div>
                  </div>
                </li>
                <li className="py-2">
                  <div className="flex items-center">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-lightBlue-600 bg-lightBlue-200 mr-3">
                        <i className="fab fa-html5"></i>
                      </span>
                    </div>
                    <div>
                      <h4 className="text-blueGray-500">
                        Amazing page examples
                      </h4>
                    </div>
                  </div>
                </li>
                <li className="py-2 text-right">
                  <label className="inline-flex items-center cursor-pointer">
                    <span className="text-sm font-semibold text-blueGray-600">
                      <input
                        {...register("decision")}
                        type="radio"
                        id="Male"
                        name="decision"
                        value="0"
                        className="form-radio border-0 rounded text-blueGray-700 ml-1 mr-3 w-5 h-5 ease-linear transition-all duration-150"
                        defaultChecked
                      />
                      <label htmlFor="Male" className="mr-3">
                        1
                      </label>
                      <input
                        {...register("decision")}
                        type="radio"
                        id={question.E[0].type}
                        name="decision"
                        value="2"
                        className="form-radio border-0 rounded text-blueGray-700 ml-1 mr-3 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <label htmlFor="Female" className="mr-3">
                        2
                      </label>
                    </span>
                    {errors.gender?.message && (
                      <FormError errorMessage={errors.gender?.message} />
                    )}
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <div className="hidden md:flex md:w-4/12 ml-auto mr-auto px-4">
            <img
              alt="..."
              className="max-w-full rounded-lg shadow-lg"
              src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="items-center flex flex-wrap">
          <div className="hidden md:flex md:w-4/12 ml-auto mr-auto px-4">
            <img
              alt="..."
              className="max-w-full rounded-lg shadow-lg"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80"
            />
          </div>
          <div className="w-full md:w-5/12 ml-auto mr-auto px-4">
            <div className="md:pr-12">
              <div className="text-lightBlue-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-lightBlue-300">
                <i className="fas fa-rocket text-xl"></i>
              </div>
              <h3 className="text-3xl font-semibold">A growing company</h3>
              <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                The extension comes with three pre-built pages to help you get
                started faster. You can change the text and images and you're
                good to go.
              </p>
              <ul className="list-none mt-6">
                <li className="py-2">
                  <div className="flex items-center">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-lightBlue-600 bg-lightBlue-200 mr-3">
                        <i className="fas fa-fingerprint"></i>
                      </span>
                    </div>
                    <div>
                      <h4 className="text-blueGray-500">
                        Carefully crafted components
                      </h4>
                    </div>
                  </div>
                </li>
                <li className="py-2">
                  <div className="flex items-center">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-lightBlue-600 bg-lightBlue-200 mr-3">
                        <i className="fab fa-html5"></i>
                      </span>
                    </div>
                    <div>
                      <h4 className="text-blueGray-500">
                        Amazing page examples
                      </h4>
                    </div>
                  </div>
                </li>
                <li className="py-2 text-right">
                  <label className="inline-flex items-center cursor-pointer">
                    <span className="text-sm font-semibold text-blueGray-600">
                      <input
                        {...register("decision")}
                        type="radio"
                        id={question.E[0].id}
                        name="decision"
                        value="0"
                        className="form-radio border-0 rounded text-blueGray-700 ml-1 mr-3 w-5 h-5 ease-linear transition-all duration-150"
                        defaultChecked
                      />
                      <label htmlFor={question.E[0].type} className="mr-3">
                        1
                      </label>
                      <input
                        {...register("decision")}
                        type="radio"
                        id={question.E[1].id}
                        name="decision"
                        value="2"
                        className="form-radio border-0 rounded text-blueGray-700 ml-1 mr-3 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <label htmlFor={question.E[1].type} className="mr-3">
                        2
                      </label>
                    </span>
                    {errors.gender?.message && (
                      <FormError errorMessage={errors.gender?.message} />
                    )}
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
