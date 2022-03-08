import React from "react";

export const FormError = ({ errorMessage }) => (
  <span role="alert" className="font-medium text-red-500">
    {errorMessage}
  </span>
);
