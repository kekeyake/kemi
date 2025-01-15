document.addEventListener("DOMContentLoaded", function () {
  const dialog = document.querySelector(".dialog");

  const btnQrList = document.querySelectorAll(".btnQr");

  btnQrList.forEach((btn) => {
    btn.addEventListener("click", () => {
      // 클릭 시 실행할 코드
      const dialog = document.querySelector(".dialog");
      dialog.style.display = "flex"; // 대화 상자 표시
    });
  });

  dialog.addEventListener("click", function () {
    dialog.style.display = "none"; // 대화 상자 숨기기
  });
});
