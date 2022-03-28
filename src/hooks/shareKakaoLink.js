export const shareKakaoLink = (userId) => {
  console.log("active");
  // @ts-ignore
  window.Kakao.Link.createCustomButton({
    container: "#kakao-link-btn",
    templateId: 73967,
    templateArgs: {
      userId: `${userId}`,
    },
  });
};
