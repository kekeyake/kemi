// DOM 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
  initializeJobButtons();
  initializeMbtiButtons();
  initializeLanguageWrap();
  initializeLoginSteps();
});

/**
 * Job 버튼 초기화
 */
function initializeJobButtons() {
  const jobButtons = document.querySelectorAll('.job-button');

  // 각 Job 버튼에 클릭 이벤트 추가
  jobButtons.forEach(button => {
    button.addEventListener('click', () => {
      const job = getRadioValue(button);
      selectJob(job);
    });
  });
}

/**
 * 선택된 Job 버튼을 갱신
 * @param {string} job - 선택된 직업의 값
 */
function selectJob(job) {
  // 모든 버튼의 선택 상태 초기화
  resetJobSelection();

  // 클릭한 버튼만 selected 클래스 추가
  const selectedButton = document.getElementById(`${job}-btn`);
  if (selectedButton) {
    selectedButton.classList.add('selected');

    // 라디오 버튼 활성화
    const radioButton = selectedButton.querySelector('input[type="radio"]');
    if (radioButton) radioButton.checked = true;
  }
}

/**
 * Job 버튼의 선택 상태를 초기화
 */
function resetJobSelection() {
  document.querySelectorAll('.job-button').forEach(button => {
    button.classList.remove('selected');
  });

  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.checked = false;
  });
}

/**
 * MBTI 버튼 초기화
 */
function initializeMbtiButtons() {
  const mbtiButtons = document.querySelectorAll(".mbti-btn");

  // 각 MBTI 버튼에 클릭 이벤트 추가
  mbtiButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      activateMbtiButtons(mbtiButtons, index);
      updateStepDataWithActiveMbti(button); // 선택된 MBTI를 stepData에 저장

      const loginWrap = document.querySelector(".loginWrap");
      const currentStep = getCurrentStep();

      if (currentStep === "4") {
        const mbtiLevel = button.getAttribute("mbti-level");
        if (mbtiLevel) {
          // 현재 단계가 4이면, 선택과 동시에 Step 5로 이동
          loginWrap.setAttribute("login-step", "5");
        } else {
          alert("Please select a valid MBTI level.");
        }
      }
    });
  });
}

/**
 * 클릭된 MBTI 버튼과 이전 버튼들 활성화
 * @param {NodeListOf<Element>} buttons - MBTI 버튼 목록
 * @param {number} index - 클릭된 버튼의 인덱스
 */
function activateMbtiButtons(buttons, index) {
  buttons.forEach((button, i) => {
    if (i <= index) {
      button.classList.add("active"); // 이전 버튼 포함 활성화
    } else {
      button.classList.remove("active"); // 이후 버튼 비활성화
    }
  });
}
/**
 * 선택된 버튼의 MBTI 레벨을 stepData에 저장
 * @param {Element} activeButton - 선택된 MBTI 버튼
 */
function updateStepDataWithActiveMbti(activeButton) {
  const mbtiLevel = activeButton.getAttribute("mbti-level"); // mbti-level 값 가져오기
  if (mbtiLevel) {
    stepData.mbti = mbtiLevel; // stepData에 저장
    console.log(`Selected MBTI Level: ${mbtiLevel}`); // 디버깅용 로그
  }
}
/**
 * 특정 버튼에서 라디오 버튼의 value를 가져옴
 * @param {Element} button - 버튼 요소
 * @returns {string} - 라디오 버튼 값
 */
function getRadioValue(button) {
  const radioButton = button.querySelector('input[type="radio"]');
  return radioButton ? radioButton.value : "";
}

/**
 * 언어 추가/삭제 초기화
 */
function initializeLanguageWrap() {
  const languageContainer = document.querySelector(".step5");

  updateLanguageWrapButtons();

  // 이벤트 위임을 통해 Add/Delete 이벤트 처리
  languageContainer.addEventListener("click", (event) => {
    const target = event.target;

    if (target.classList.contains("add")) {
      addLanguageWrap();
    } else if (target.classList.contains("delete")) {
      deleteLanguageWrap(target);
    }

    updateLanguageWrapButtons();
  });
}

/**
 * langugeWrap 추가
 */
function addLanguageWrap() {
  const languageContainer = document.querySelector(".step5");
  const allWraps = document.querySelectorAll(".langugeWrap");

  if (allWraps.length >= 3) return; // 최대 3개 제한

  const newWrap = allWraps[0].cloneNode(true); // 첫 번째 langugeWrap 복제
  resetLanguageWrap(newWrap); // 새로 추가된 langugeWrap 초기화

  languageContainer.appendChild(newWrap); // 컨테이너에 추가
}

/**
 * langugeWrap 삭제
 * @param {Element} deleteButton - 클릭된 삭제 버튼
 */
function deleteLanguageWrap(deleteButton) {
  const languageContainer = document.querySelector(".step5");
  const allWraps = document.querySelectorAll(".langugeWrap");

  if (allWraps.length <= 1) return; // 최소 1개 제한

  const wrapToRemove = deleteButton.closest(".langugeWrap");
  if (wrapToRemove) languageContainer.removeChild(wrapToRemove); // 해당 langugeWrap 삭제
}

/**
 * langugeWrap 초기 상태로 설정
 * @param {Element} wrap - 초기화할 langugeWrap
 */
function resetLanguageWrap(wrap) {
  const selects = wrap.querySelectorAll("select");
  selects.forEach((select) => {
    select.value = ""; // 드롭다운 초기화
  });
}

/**
 * langugeWrap 관련 버튼 상태 업데이트
 */
function updateLanguageWrapButtons() {
  const allWraps = document.querySelectorAll(".langugeWrap");

  allWraps.forEach((wrap, index) => {
    const addButton = wrap.querySelector(".add");
    const deleteButton = wrap.querySelector(".delete");

    if (allWraps.length === 1) {
      // 1개일 경우: add 버튼만 보임, delete 버튼 숨김
      addButton.style.display = "block";
      deleteButton.style.display = "none";
    } else if (allWraps.length === 2) {
      // 2개일 경우: add, delete 모두 보임
      addButton.style.display = "block";
      deleteButton.style.display = "block";
    } else if (allWraps.length === 3) {
      // 3개일 경우: delete만 보임, add 버튼 숨김
      addButton.style.display = "none";
      deleteButton.style.display = "block";
    }
  });
}

/**
 * 단계별 데이터 저장을 위한 JSON 객체
 */
let stepData = {};

/**
 * Login 단계를 초기화
 */
function initializeLoginSteps() {
  const nextButton = document.querySelector(".loginStep__next");
  const backButton = document.querySelector(".loginStep__back");
  const closeButton = document.querySelector(".loginWrap__layer--closed");
  const joinButton = document.querySelector(".joinList__btn");

  // Next 버튼 클릭 처리
  nextButton.addEventListener("click", () => {
    const currentStep = getCurrentStep();
    handleNextStep(currentStep);
  });

  // Back 버튼 클릭 처리
  backButton.addEventListener("click", () => {
    const currentStep = getCurrentStep();
    handleBackStep(currentStep);
  });

  // Close 버튼 클릭 처리
  closeButton.addEventListener("click", resetToStep1);

  // Join 버튼 클릭 처리 (login-step="join")
  if (joinButton) {
    joinButton.addEventListener("click", () => {
      const loginWrap = document.querySelector(".loginWrap");
      alert("25th Jan 7:30pm"); // 특정 일정 알림
      loginWrap.setAttribute("login-step", "success");
    });
  }
}

/**
 * 현재 단계를 가져옴
 * @returns {number|string} - 현재 단계 (1, 2, 3, 4, 5 또는 join)
 */
function getCurrentStep() {
  const loginWrap = document.querySelector(".loginWrap");
  return loginWrap.getAttribute("login-step");
}

/**
 * 다음 단계로 진행
 * @param {number} currentStep - 현재 단계
 */
function handleNextStep(currentStep) {
  const loginWrap = document.querySelector(".loginWrap");

  if (currentStep === "1") {
    // Step 1: 이메일 형식 확인
    const emailInput = document.querySelector(".loginWrap__email input");
    if (validateEmail(emailInput.value)) {
      stepData.email = emailInput.value; // Email 저장
      loginWrap.setAttribute("login-step", "2");
    } else {
      alert("Please enter a valid email address.");
    }
  } else if (currentStep === "2") {
    // Step 2: 이름 확인
    const nameInput = document.querySelector(".step2 input");
    if (validateName(nameInput.value)) {
      stepData.name = nameInput.value; // Name 저장
      loginWrap.setAttribute("login-step", "3");
    } else {
      alert("Please enter a valid name (letters and numbers only).");
    }
  } else if (currentStep === "3") {
    // Step 3: 직업 선택 확인
    const selectedJob = document.querySelector('input[name="job"]:checked');
    if (selectedJob) {
      stepData.job = selectedJob.value; // Job 저장
      loginWrap.setAttribute("login-step", "4");
    } else {
      alert("Please select a job.");
    }
  } else if (currentStep === "4") {
    // Step 4: MBTI 선택 확인
    const activeMbtiElements = document.querySelectorAll(".mbti-btn.active"); // 모든 .active 버튼 가져오기
    if (activeMbtiElements.length > 0) {
      const lastActiveMbti = activeMbtiElements[activeMbtiElements.length - 1]; // 마지막 .active 버튼 선택
      const mbtiLevel = lastActiveMbti.getAttribute("mbti-level"); // mbti-level 값 가져오기
      stepData.mbti = mbtiLevel; // MBTI 값 저장
      loginWrap.setAttribute("login-step", "5");
    } else {
      alert("Please select at least one MBTI level.");
    }
  } else if (currentStep === "5") {
    // Step 5: 언어 선택 확인
    const allLanguages = document.querySelectorAll(".langugeWrap");
    let validLanguages = [];

    allLanguages.forEach((wrap) => {
      const language = wrap.querySelector(".lang-select:nth-child(1)").value;
      const level = wrap.querySelector(".lang-select:nth-child(2)").value;

      if (language && level) {
        validLanguages.push({ language, level });
      }
    });

    if (validLanguages.length >= 1) {
      stepData.languages = validLanguages; // 언어 데이터 저장
      loginWrap.setAttribute("login-step", "join");
      console.log("Collected Data:", stepData);
    } else {
      alert("Please select at least one language and level.");
    }
  }
}

/**
 * 이전 단계로 돌아가기
 * @param {number|string} currentStep - 현재 단계
 */
function handleBackStep(currentStep) {
  const loginWrap = document.querySelector(".loginWrap");

  if (currentStep === "2") {
    loginWrap.setAttribute("login-step", "1");
  } else if (currentStep === "3") {
    loginWrap.setAttribute("login-step", "2");
  } else if (currentStep === "4") {
    loginWrap.setAttribute("login-step", "3");
  } else if (currentStep === "5") {
    loginWrap.setAttribute("login-step", "4");
  }

  restoreStepData(currentStep - 1);
}

/**
 * Close 버튼 클릭 시 Step 1로 돌아감
 */
function resetToStep1() {
  document.querySelector(".loginWrap").setAttribute("login-step", "1");
  stepData = {}; // 데이터 초기화
}

/**
 * Email 유효성 검사
 * @param {string} email - 이메일 입력 값
 * @returns {boolean}
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Name 유효성 검사 (영문/숫자만 허용)
 * @param {string} name - 이름 입력 값
 * @returns {boolean}
 */
function validateName(name) {
  const nameRegex = /^[a-zA-Z0-9]+$/;
  return nameRegex.test(name);
}

/**
 * 활성화된 MBTI 버튼의 인덱스를 가져옴
 * @returns {number|null}
 */
function getMbtiActiveIndex() {
  const activeButton = document.querySelector(".mbti-btn.active");
  if (activeButton) {
    const buttons = document.querySelectorAll(".mbti-btn");
    return Array.from(buttons).indexOf(activeButton) + 1;
  }
  return null;
}

/**
 * 이전 단계 데이터를 복원
 * @param {number} previousStep - 이전 단계
 */
function restoreStepData(previousStep) {
  if (previousStep === 1) {
    const emailInput = document.querySelector(".loginWrap__email input");
    emailInput.value = stepData.email || "";
  } else if (previousStep === 2) {
    const nameInput = document.querySelector(".step2 input");
    nameInput.value = stepData.name || "";
  } else if (previousStep === 3) {
    if (stepData.job) {
      const radioButton = document.querySelector(`input[value="${stepData.job}"]`);
      if (radioButton) radioButton.checked = true;
    }
  } else if (previousStep === 4) {
    if (stepData.mbti) {
      const mbtiButtons = document.querySelectorAll(".mbti-btn");
      activateMbtiButtons(mbtiButtons, stepData.mbti - 1);
    }
  }
}