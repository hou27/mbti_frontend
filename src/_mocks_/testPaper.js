import { QUESTION_E_I } from "./E_I";
import { QUESTION_J_P } from "./J_P";
import { QUESTION_S_N } from "./S_N";
import { QUESTION_T_F } from "./T_F";

const E = [...Array(18)].map((_, index) => {
  return {
    id: index,
    question: QUESTION_E_I[index],
    type: "E_I",
    flag: index % 2 === 0,
  };
});

const S = [...Array(18)].map((_, index) => {
  return {
    id: index,
    question: QUESTION_S_N[index],
    type: "S_N",
    flag: index % 2 === 0,
  };
});

const T = [...Array(18)].map((_, index) => {
  return {
    id: index,
    question: QUESTION_T_F[index],
    type: "T_F",
    flag: index % 2 === 0,
  };
});

const J = [...Array(18)].map((_, index) => {
  return {
    id: index,
    question: QUESTION_J_P[index],
    type: "J_P",
    flag: index % 2 === 0,
  };
});

export const TEST_PAPER = { E, S, T, J };
