const IMAGE_PATH = "img/";
const DATA_PATH = "json/";
const IFRAME_SRC = "360/index.html";


const LONG_QUESTION_LENGTH = 225;
const LONG_ANSWER_LENGTH = 75;

const ANSWERS_TOTAL = 5;

/* -------------------------------- */
/* EXTERNAL COMMUNICATION */

function quitGame() {
  // console.log("quitGame()");
}

function earnXP(milesEarned) {
  //xureal360MSG.onEventUpdate("xureal_360","xureal_360","correct-answer",200);
  //xurealEX.gameEventOver(milesEarned);
  // console.log("earnXP(" + milesEarned + ")");
}

function viewAr() {
  //console.log("viewAr()");

  var arIsSupported = gEL("#tt-vr-iframe").contentWindow.arIsSupported;
  
  console.log("AR-DEBUG-KEY arIsSupported:", arIsSupported);

  if (arIsSupported) {
    console.log("AR-DEBUG-KEY startAR exists :", gEL("#tt-vr-iframe").contentWindow.startAR);

    if (gEL("#tt-vr-iframe").contentWindow.startAR) {
      gEL("#tt-vr-iframe").contentWindow.startAR();
    }
  } else {
    console.log("AR-DEBUG-KEY NO VR");
    showModal("viewar");
  }
}

function pingAR() {
  let count = 10;

  const tid = setInterval(() => {
    if (count > 0) {
      console.log("AR interval started");
      let _arSupported = gEL("#tt-vr-iframe").contentWindow.arIsSupported;
      let _canStartAR = gEL("#tt-vr-iframe").contentWindow.startAR;

      if (_arSupported && _canStartAR) {
        gEL("#tt-vr-iframe").contentWindow.startAR();
        count = 0;
        console.log("AR interval ended");
        clearInterval(tid);
        gEL("#tt-ar-loader").style.display = "none";
      }

      count--;
    } else {
      console.log("AR interval ended");
      clearInterval(tid);
      gEL("#tt-ar-loader").style.display = "none";
    }
  }, 500);
}

/* -------------------------------- */
/* QUIZ QUESTION LOGIC */

var currentLevelMiles;

var currentQuestionIndex;
var correctAnswerIndex;
var currentHotspot;

var questionsTotal = 0;
var answeredTotal = 0;
var correctTotal = 0;

var questionID;

var productData = {};

function displayProduct() {
  //console.log(document.getElementById('tt-quiz-logo-img'));
  for (
    let i = 0;
    i < document.getElementsByClassName("tt-quiz-logo-img").length;
    i++
  ) {
    document.getElementsByClassName("tt-quiz-logo-img")[i].src =
      productData.logo;
  }

  var productDescription = "";
  console.log("productData.description " + productData.description);
  if (Array.isArray(productData.description)) {
    productDescription = rtfParser.processRTF(productData.description);
  } else {
    productDescription = productData.description;
  }

  console.log("productDescription: " + productDescription);

  var productName = "";
  console.log("productData.name " + productData.name);
  if (Array.isArray(productData.name)) {
    productName = rtfParser.processRTF(productData.name);
  } else {
    productName = productData.name;
  }

  console.log("productDescription: " + productDescription);

  gEL("#product-title").innerHTML = productName;
  gEL("title").innerHTML = productName;
  gEL("#product-description").innerHTML = productDescription;

  // console.log(productData)
  // productData.flavorText.map((text, index) => {
  //     //let element = gEL('#tt-answer-' + index)
  //     //element.innerHTML = text;

  // })

  for (let i = 0; i < productData.flavorText.length; i++) {
    let textEl = productData.flavorText[i];
    let textDescription = "";
    let textDescriptionCopy = "";
    let textDescriptionArray = [];
    let coreTextWrapperStart = "";
    let innerTextWrapperStart = "";
    let outerTextWrapperStart = "";
    let coreTextWrapperEnd = "";
    let innerTextWrapperEnd = "";
    let outerTextWrapperEnd = "";
    let outerChildrenTextWrapperStart = "";
    let outerChildrenTextWrapperEnd = "";
    let currentHTMLItem = "";

    if (Array.isArray(textEl.desc)) {
      //outerTextWrapperStart = textEl.desc.forEach(checkRTFType);
      /*
            for (let ii = 0; ii < textEl.desc.length; ii++) { 
                outerTextWrapperStart = "<"+checkRTFType(textEl.desc[ii]);
                outerTextWrapperEnd= "</"+checkRTFType(textEl.desc[ii]);

                for (let iii = 0; iii < textEl.desc[ii].children.length; iii++) { 
                    innerTextWrapperStart = "";
                    innerTextWrapperEnd = "";
                    outerChildrenTextWrapperStart = "";
                    outerChildrenTextWrapperEnd = "";
                    coreTextWrapperStart = "";
                    coreTextWrapperEnd = "";
                    innerTextWrapperStart = checkRTFStyleStart(textEl.desc[ii].children[iii]);
                    innerTextWrapperEnd = checkRTFStyleEnd(textEl.desc[ii].children[iii]);
                 
                  
                  //  console.log("innerTextWrapperStart: ",innerTextWrapperStart);
                  //  console.log("innerTextWrapperEnd: ",innerTextWrapperEnd);
                    //console.log("textEl.desc[ii].children[iii].text: "+textEl.desc[ii].children[iii].text);

                    var hasChildren = Object.prototype.hasOwnProperty.call(textEl.desc[ii].children[iii], "children");
                    if (hasChildren) {
                       // console.log("-------hasCHildren");
                        outerChildrenTextWrapperStart = "<"+checkRTFType(textEl.desc[ii].children[iii]);
                        outerChildrenTextWrapperEnd= "</"+checkRTFType(textEl.desc[ii].children[iii]);
                        for (let iiii = 0; iiii < textEl.desc[ii].children.length; iiii++) { 
                            coreTextWrapperStart = checkRTFStyleStart(textEl.desc[ii].children[iii].children[iiii]);
                            coreTextWrapperEnd= checkRTFStyleEnd(textEl.desc[ii].children[iii].children[iiii]);
                            //console.log(outerTextWrapperStart+"TEST"+outerTextWrapperEnd);
                            //console.log("coreTextWrapperStart: ",coreTextWrapperStart);
                           // console.log("coreTextWrapperEnd: ",coreTextWrapperEnd);
                           // console.log("textEl.desc[ii].children[iii].text: "+textEl.desc[ii].children[iii].text);
                           // console.log("textEl.desc[ii].children[iii].text: "+textEl.desc[ii].children[iii].children[iiii].text);
                           textDescriptionCopy = textEl.desc[ii].children[iii].children[iiii].text;
                        }
                        
                    } else {
                        textDescriptionCopy = textEl.desc[ii].children[iii].text; 
                    }
                    currentHTMLItem = outerTextWrapperStart+outerChildrenTextWrapperStart+innerTextWrapperStart+coreTextWrapperStart+textDescriptionCopy+coreTextWrapperEnd+innerTextWrapperEnd+outerChildrenTextWrapperEnd+outerTextWrapperEnd;
                    console.log("html item: "+currentHTMLItem);
                    textDescriptionArray.push(currentHTMLItem);


                }

            }
           */
      // all data will be injected here
      textDescription = rtfParser.processRTF(textEl.desc);
    } else {
      textDescription = textEl.desc;
    }
    // PARSE RTF HERE:
    /*  <img class="arrow-icon" id="arrow-icon-${i}" src="./img/Down@1x.svg" alt="" /> */
    let flavorEl = ` 
        <div class="flavor-container" id="flavor-container-${i}">
            <div class="flavor-button">
                <div id="tt-answer-${i}" class="flavor-text">${textEl.title}</div>
                <svg class="arrow-down-icon" id="arrow-icon-${i}" width="8px" height="5px" viewBox="0 0 8 5" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>25B47609-5B67-4289-8EB2-D136D9C9C49E@1x</title>
    <g id="Tablet-UI" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Products/03-360s" class="arrow-color" transform="translate(-1040.000000, -473.000000)" fill="#0066DD" fill-rule="nonzero">
            <g id="Group-3" transform="translate(731.896667, 342.000000)">
                <g id="Group-2-Copy" transform="translate(0.103333, 124.000000)">
                    <g id="Icon/UI/Caret/Down" transform="translate(308.000000, 7.000000)">
                        <path d="M3.99995314,2.41149507 L1.49974218,0.22150962 C1.10166203,-0.127181089 0.520780806,-0.0565212455 0.202310684,0.379339941 C-0.116159439,0.815190827 -0.0516199139,1.45118312 0.346459739,1.79987383 L3.99994314,5.00002034 L7.65353454,1.79988383 C8.0516247,1.45120312 8.11616472,0.815210828 7.7977046,0.379349941 C7.47924448,-0.0565108455 6.89836425,-0.127181089 6.5002741,0.22149962 L3.99995314,2.41149507 Z" id="Path"></path>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>
            </div>
            <div class="flavor-desc" id="flavor-desc-${i}">${textDescription}</div>
        </div>
        `;
    let parent = document.getElementById("tt-answers");
    // console.log(parent)
    parent.innerHTML += flavorEl;
  }

  for (let i = 0; i < productData.flavorText.length; i++) {
    document
      .getElementById(`flavor-container-${i}`)
      .addEventListener("click", () => {
        console.log("click");
        //selectAnswer(2);
        if (
          document.getElementById(`arrow-icon-${i}`).style.transform ==
          "rotate(180deg)"
        ) {
          document.getElementById(`arrow-icon-${i}`).style.transform =
            "rotate(0deg)";
          document.getElementById(`flavor-desc-${i}`).style.opacity = 0;
          document.getElementById(`flavor-desc-${i}`).style.maxHeight = "0px";
          document.getElementById(`flavor-desc-${i}`).style.marginTop = "0px";
        } else {
          document.getElementById(`arrow-icon-${i}`).style.transform =
            "rotate(180deg)";
          document.getElementById(`flavor-desc-${i}`).style.opacity = 1;
          document.getElementById(`flavor-desc-${i}`).style.maxHeight =
            "inherit";
          document.getElementById(`flavor-desc-${i}`).style.marginTop = "10px";
        }
      });
  }
  // gEL("#shop-link").href = productData.externalLink;
  // gEL("#mobile-shop-link").href = productData.externalLink;
}

function selectAnswer(newAnswerIndex) {
  answeredTotal++;

  currentAnswerResult =
    newAnswerIndex === correctAnswerIndex ? "correct" : "wrong";

  gameData[currentQuestionIndex].answerResult = currentAnswerResult;

  if (currentAnswerResult === "correct") {
    //console.log("Correct: " + newAnswerIndex);
    correctTotal++;
    // console.log("Correct: ", newAnswerIndex + " Question: ", questionID);
    xurealEX.gameEventQuestion(questionID, newAnswerIndex, "correct");
  } else {
    // console.log("Incorrect: " + newAnswerIndex + " Question: ", questionID);
    xurealEX.gameEventQuestion(questionID, newAnswerIndex, "incorrect");
  }
  console.log("Question: " + gameData[currentQuestionIndex].Id);

  for (var a = 0; a < ANSWERS_TOTAL; a++) {
    var answerEl = gEL("#tt-answer-" + a);
    // answerEl.classList.add("selected");

    if (a === newAnswerIndex) {
      answerEl.classList.add(currentAnswerResult);
    }

    // [HACK] - force button redraw
    answerEl.innerHTML = answerEl.innerHTML;
  }

  updateHotspot(currentHotspot, currentAnswerResult);

  //console.log("answeredTotal:", answeredTotal, "questionsTotal:", questionsTotal, "correctTotal:", correctTotal);

  if (answeredTotal >= questionsTotal) {
    gsap.delayedCall(0.25, showScreen, ["result"]);
  }
}

function updateHotspot(hotspotNum, answerResult) {
  //console.log("updateHotspot(" + hotspotNum + "," + answerResult + ")");

  gEL("#tt-vr-iframe").contentWindow.updateHotspot(hotspotNum, answerResult);
}

function hotspotSelected(hotspotNum) {
  //console.log("hotspotSelected(" + hotspotNum + ")");
  // currentHotspot = hotspotNum;
}

/* -------------------------------- */
/* TIMER */

// let currentTime;

// function startTimer() {
//    //console.log("startTimer()");

//    //gsap.to("#tt-timer", 0.5, { autoAlpha: 1 });

//    currentTime = TIMER_SECONDS;

//    doTimer();
// }

// function doTimer() {
//    //console.log("doTimer()");

//    let showTime = currentTime;
//    if (showTime <= 9) showTime = "0" + String(showTime);

//    //gEL("#tt-timer-time").innerHTML = showTime;

//    if (currentTime === 0) {
//       //console.log("TIME UP");

//       return;
//    }

//    currentTime--;

//    gsap.delayedCall(1, doTimer);
// }

// function stopTimer() {
//    //console.log("stopTimer()");

//    gsap.killTweensOf(doTimer);
// }

/* -------------------------------- */
/* BUTTONS */

gEL("#tt-instruct-next").addEventListener("click", function () {
  showScreen("quiz");
});

gEL("#tt-steps-back").addEventListener("click", function () {
  showScreen("quiz");
});

gEL("#tt-steps-play").addEventListener("click", function () {
  xurealEX.gameEventStart();
  // console.log("Start Game");
  showScreen("quiz");
});

gEL("#tt-quiz-back").addEventListener("click", function () {
  closeQuizScreen();
});

gEL("#tt-mobile-quiz-back").addEventListener("click", function () {
  closeQuizScreen();
});

gEL("#tt-quiz-fullscreen").addEventListener("click", function () {
  toggleFullscreen();
});

// gEL("#tt-result-replay").addEventListener("click", function () {
//   showScreen("quiz");
// });

//gEL("#tt-result-quit").addEventListener("click", function () {
//
//    showModal("quit");
//});

// gEL("#tt-viewar").addEventListener("click", function () {
//   // enable to open ar in new tab
//   let param = new URL(window.location.href).searchParams;
//   let app = param.get("app");
//   if (app && app == "ios") {
//     console.log("loading schema url");
//     window.location.href = `unity://openexternal?link=${window.location.pathname}${window.location.search}&armode=true`;
//     return;
//   }
//   viewAr();
// });

// gEL("#tt-result-viewar").addEventListener("click", function () {
//   viewAr();
// });

// gEL("#tt-game-continue").addEventListener("click", function () {
//   hideModal();
// });

// gEL("#tt-game-quit").addEventListener("click", function () {
//   quitGame();
//   hideModal();
// });

/* -------------------------------- */
/* SHARED */

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* -------------------------------- */
/* RESIZE */

var isMobile = false;

function onTTResize() {
  //console.log("onTTResize()");

  isMobile = window.matchMedia("(max-width: 600px)").matches;
  //console.log("isMobile:", isMobile);

  const screenHeight = window.innerHeight;
  const fullHeight = Math.round(screenHeight) + "px";
  const halfHeight = Math.round(screenHeight * 0.5) + "px";

  gsap.set(".tt-intro-parent, .tt-split-parent", {
    height: fullHeight,
    minHeight: fullHeight,
  });

  var childHeight = isMobile
    ? isFullScreen
      ? `calc(${fullHeight} - 80px)`
      : "99vw"
    : fullHeight;
  gsap.set(".tt-split-child", { height: childHeight, minHeight: childHeight });

  fixSlideHeight();
}

function fixSlideHeight() {
  //console.log("fixSlideHeight()");

  var stepsHeight = window.innerHeight * 0.35;
  gsap.set(".tt-slide", {
    height: stepsHeight + "px",
    maxHeight: stepsHeight + "px",
  });
  //console.log("stepsHeight:", stepsHeight);
}

onTTResize();
window.addEventListener("resize", onTTResize);

/* -------------------------------- */
/* TOGGLE FULLSCREEN VR VIEW */

var isFullScreen = false;

function toggleFullscreen(mode) {
  //console.log("toggleFullscreen(" + mode + ")");

  isFullScreen = mode !== undefined ? mode : !isFullScreen;
  //console.log("isFullScreen:", isFullScreen);

  var iconCode = isFullScreen ? "&#xe904;" : "&#xe905;";
  gEL("#tt-quiz-fullscreen-icon").innerHTML = iconCode;

  var sideDisplay = isFullScreen ? "none" : "flex";
  var sideWidth = isFullScreen ? "0px" : "600px";
  var sideOpacity = isFullScreen ? "0" : "1";
  //var mobileZIndex = isFullScreen ? 10 : 0
  gsap.set(".tt-split-child", { minHeight: "0vw" });

  //document.getElementById("tt-quiz-main").style.height = '100vh !important'

  //gsap.set("#tt-quiz-main",{ zIndex: mobileZIndex });

  if (isFullScreen) {
    // !isMobile && gsap.set("#sidebar-body", { opacity: sideOpacity });
    // !isMobile && gsap.set("#shop-sidebar", { maxWidth: sideWidth });

    !isMobile &&
      !window.matchMedia("(max-height: 600px)").matches &&
      gsap.set("#sidebar-body", { opacity: sideOpacity });
    setTimeout(() => {
      !isMobile &&
        !window.matchMedia("(max-height: 600px)").matches &&
        gsap.set("#shop-sidebar", { maxWidth: sideWidth });
    }, [50]);
  } else {
    !isMobile &&
      !window.matchMedia("(max-height: 600px)").matches &&
      gsap.set("#shop-sidebar", { maxWidth: sideWidth });
    setTimeout(() => {
      if (!isMobile && !window.matchMedia("(max-height: 600px)").matches)
        gsap.set("#sidebar-body", { opacity: sideOpacity });
    }, [200]);
  }

  (isMobile || window.matchMedia("(max-height: 600px)").matches) &&
    gsap.set("#shop-sidebar", { display: sideDisplay });

  if (isFullScreen) {
    if (gEL("#tt-vr-iframe").contentWindow.hideHotspots) {
      gEL("#tt-vr-iframe").contentWindow.hideHotspots();
    }
  } else {
    if (gEL("#tt-vr-iframe").contentWindow.showHotspots) {
      gEL("#tt-vr-iframe").contentWindow.showHotspots();
    }
  }

  onTTResize();
}

function showBlackout() {
  //console.log("showBlackout()");

  gsap.set("#tt-blackout", { autoAlpha: 1, delay: 0.5, display: "flex" });
}

function hideBlackout() {
  //console.log("hideBlackout()");

  gsap.set("#tt-blackout", { autoAlpha: 0, display: "none" });
}

/* -------------------------------- */
/* HIDE / SHOW SCREENS */

function initScreens() {
  //console.log("initScreens()");

  var displayTopHeight = isMobile ? 35 : 70;
  //console.log("displayTopHeight:", displayTopHeight);

  gsap.set("#tt-intro-top", { height: displayTopHeight + "%" });

  gsap.set(".tt-layer, .tt-split-parent", { display: "none" });

  gsap.set("#tt-intro-instruct", { autoAlpha: 0 });
  gsap.set("#tt-intro-steps", { autoAlpha: 0 });

  gsap.set(".tt-modal", { autoAlpha: 0, display: "none" });

  var productName = GAME_CATEGORIES.find(
    (cat) => cat.id === currentCategoryId
  ).title;
  gEL("#tt-side-product").innerHTML = productName;
  // gEL("#tt-modal-product").innerHTML = productName;

  var introText =
    "<p>" +
    GAME_CATEGORIES.find((cat) => cat.id === currentCategoryId).intro +
    "</p>";
  introText +=
    "<p>Learn more by clicking the hotspots and answering the questions.</p>";
  introText += "<p>Oh, and earn some points along the way.</p>";

  gEL("#tt-instruct-panel").innerHTML = introText;
}

function showLoading() {
  //console.log("showLoading()");

  var delay = 0;

  gsap.set("#tt-intro-load", { autoAlpha: 1, display: "flex" });

  delay += showLogo();

  delay += 0.5;
  return delay;
}

function hideLoading() {
  //console.log("hideLoading()");

  var delay = 0;

  gsap.to("#tt-intro-load", 0.25, { autoAlpha: 0, display: "none" });

  delay += 0.25;
  return delay;
}

function showLogo() {
  //console.log("showLogo()");

  var delay = 0;

  var displayTopHeight = currentScreenId === "load" ? 70 : 35;
  if (isMobile) displayTopHeight = 35;
  //console.log("displayTopHeight:", displayTopHeight);

  var actualTopHeight = gsap.getProperty("#tt-intro-top", "height");
  //console.log("actualTopHeight:", actualTopHeight);

  if (displayTopHeight !== actualTopHeight) {
    gsap.to("#tt-intro-top", 0.5, {
      height: displayTopHeight + "%",
      ease: Quad.easeInOut,
    });
    delay += 0.5;
  }

  gsap.to("#tt-intro-logo", 0.5, {
    scale: 1,
    display: "flex",
    ease: Quad.easeInOut,
  });

  return delay;
}

function showInstruct() {
  //console.log("showInstruct()");

  var delay = 0;

  delay += showLogo();

  gsap.to("#tt-intro-instruct", 0.5, {
    autoAlpha: 1,
    display: "flex",
    delay: delay,
  });

  gsap.fromTo(
    "#tt-instruct-panel",
    0.5,
    { scale: 0 },
    { scale: 1, delay: delay, ease: Quad.easeOut }
  );

  delay += 0.5;
  return delay;
}

function hideInstruct() {
  //console.log("hideInstruct()");

  var delay = 0;

  gsap.to("#tt-intro-instruct", 0.25, {
    autoAlpha: 0,
    display: "none",
    delay: delay,
  });
  gsap.to("#tt-instruct-panel", 0.25, {
    scale: 0,
    delay: delay,
    ease: Quad.easeIn,
  });

  delay += 0.25;
  return delay;
}

var splide;

function showSteps() {
  //console.log("showSteps()");

  var delay = 0;

  fixSlideHeight();

  gsap.set("#tt-intro-steps", { autoAlpha: 0, display: "flex" });

  if (!splide) {
    splide = new Splide(".splide").mount();
  } else {
    splide.go(0);
  }

  delay += showLogo();

  delay += 0.25;
  gsap.set("#tt-intro-steps", { autoAlpha: 1 });

  if (!isMobile) {
    delay += 0.25;
    gsap.fromTo(
      "#tt-step-1",
      0.25,
      { scale: 0 },
      { scale: 1, delay: delay, ease: Quad.easeOut }
    );

    delay += 0.25;
    gsap.fromTo(
      "#tt-step-2",
      0.25,
      { scale: 0 },
      { scale: 1, delay: delay, ease: Quad.easeOut }
    );

    delay += 0.25;
    gsap.fromTo(
      "#tt-step-3",
      0.25,
      { scale: 0 },
      { scale: 1, delay: delay, ease: Quad.easeOut }
    );
  } else {
    delay += 0.25;
    gsap.fromTo(
      "#tt-steps-mobile",
      0.25,
      { autoAlpha: 0 },
      { autoAlpha: 1, delay: delay }
    );
  }

  delay += 0.25;
  gsap.fromTo(
    "#tt-steps-play",
    0.25,
    { scale: 0 },
    { scale: 1, delay: delay, ease: Quad.easeOut }
  );

  delay += 0.5;
  return delay;
}

function hideSteps() {
  //console.log("hideSteps()");

  var delay = 0;

  gsap.to("#tt-intro-steps", 0.25, { autoAlpha: 0, display: "none" });

  delay += 0.25;
  return delay;
}

function hideIntro() {
  //console.log("hideIntro()");

  gsap.to("#tt-intro-logo", 0.5, { scale: 0, display: "none" });

  gsap.to("#tt-intro", 0.5, { autoAlpha: 0, display: "none" });
}

function showIntro() {
  //console.log("showIntro()");

  gsap.to("#tt-intro", 0.5, { autoAlpha: 1, display: "flex" });
}

function showQuiz() {
  //console.log("showQuiz()");

  toggleFullscreen(false);

  loadIframe();

  var delay = 0;

  // hide question and answers
  gsap.set("#tt-quiz-question", { autoAlpha: 0 });
  for (var a = 0; a < ANSWERS_TOTAL; a++) {
    gsap.set("#tt-answer-" + a, { autoAlpha: 0 });
  }

  gsap.fromTo(
    "#tt-quiz",
    0.5,
    { autoAlpha: 0 },
    { autoAlpha: 1, display: "flex" }
  );

  delay += 0.5;
  return delay;
}

function selectQuestion() {
  var unansweredQuestions = [];

  if (unansweredQuestions.length === 0) {
    return;
  }

  var randNum = randRange(0, unansweredQuestions.length - 1);
  var randHotspot = unansweredQuestions[randNum];

  gsap.delayedCall(0.25, function () {
    if (gEL("#tt-vr-iframe").contentWindow.selectHotspot) {
      gEL("#tt-vr-iframe").contentWindow.selectHotspot(randHotspot);
    }
  });
}

function hideQuiz() {
  onParticlesResize();

  var delay = 0;

  gsap.to("#tt-quiz", 0.25, { autoAlpha: 0, display: "none" });

  gsap.delayedCall(0.25, function () {
    if (gEL("#tt-vr-iframe").contentWindow.clearSelectedHotspot) {
      gEL("#tt-vr-iframe").contentWindow.clearSelectedHotspot();
    }
  });

  delay += 0.25;
  return delay;
}

function showResult() {
  var delay = 0;

  var milesRatio = correctTotal / answeredTotal;
  milesRatio = milesRatio ? milesRatio : 0;

  var XP = Math.round(milesRatio * (answeredTotal * 50));
  var widthPct = Math.round(milesRatio * 100);

  gEL("#tt-result-xp").innerHTML = numberWithCommas(XP);
  gEL("#tt-max-score").innerHTML = "/ " + numberWithCommas(answeredTotal * 50);
  gEL("#tt-result-score").innerHTML = correctTotal + "/" + answeredTotal;
  if (correctTotal == 0) {
    document.getElementById("360-end-message").innerHTML = "TRY AGAIN";
    document.getElementById("360-end-message-mobile").innerHTML = "TRY AGAIN";
    document.getElementById("tt-particles1").style.display = "none";
    document.getElementById("tt-particles2").style.display = "none";
  } else if (correctTotal != answeredTotal) {
    document.getElementById("360-end-message").innerHTML = "GOOD JOB!";
    document.getElementById("360-end-message-mobile").innerHTML = "GOOD JOB!";
    document.getElementById("tt-particles1").style.display = "block";
    document.getElementById("tt-particles2").style.display = "block";
  } else {
    document.getElementById("360-end-message").innerHTML = "YOU DID IT!";
    document.getElementById("360-end-message-mobile").innerHTML = "YOU DID IT!";
    document.getElementById("tt-particles1").style.display = "block";
    document.getElementById("tt-particles2").style.display = "block";
  }
  earnXP(XP);

  gsap.fromTo(
    "#tt-result",
    0.5,
    { autoAlpha: 0 },
    { autoAlpha: 1, display: "flex" }
  );

  delay += 0.5;

  if (widthPct > 0) {
    gsap.set("#tt-xp-bar-progress", { autoAlpha: 1, width: "0%" });
    gsap.to("#tt-xp-bar-progress", 1, { width: widthPct + "%" });
  } else {
    gsap.set("#tt-xp-bar-progress", { autoAlpha: 0 });
  }

  resumeParticles();
  resetQuestions();

  delay += 0.5;
  return delay;
}

function hideResult() {
  //console.log("hideResult()");

  pauseParticles();

  var delay = 0;

  gsap.to("#tt-result", 0.25, { autoAlpha: 0, display: "none" });

  delay += 0.25;
  return delay;
}

/* -------------------------------- */
/* MODALS */

var currentModalId = "quit";

function showModal(modalId) {
  //console.log("showModal(" + modalId + ")");
  //alert("clicked3");
  //gEL("#tt-vr-iframe").contentWindow.hideAllHotspots();
  if (currentModalId) {
    hideModal();
  }

  gsap.to("#tt-" + modalId + "-modal", 0.25, { autoAlpha: 1, display: "flex" });

  currentModalId = modalId;

  if ((modalId = "viewar")) {
    gEL("#tt-viewar-modal").addEventListener("click", () => {
      // enable to open ar in new tab
      let param = new URL(window.location.href).searchParams;
      let app = param.get("app");
      if (app && app == "ios") {
        console.log("loading schema url");
        window.location.href = `unity://openexternal?link=${window.location.pathname}${window.location.search}&armode=true`;
        return;
      }
      hideModal();
    });
    // var qrImg = productData.qrCode;
    // console.log(qrImg);
    //var qrImgEl = document.getElementById("tt-modal-qrcode-img");
    //console.log(qrImgEl);
    // qrImgEl.src = qrImg;
  }
}

function hideModal() {
  console.log("hideModal3()");

  gsap.to("#tt-" + currentModalId + "-modal", 0.25, {
    autoAlpha: 0,
    display: "none",
  });

  currentModalId = null;
}

function addCloseClick(elements) {
  //console.log("addCloseClick()");

  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", function () {
      hideModal();
    });
  }
}

addCloseClick(document.getElementsByClassName("tt-modal-close"));
addCloseClick(document.getElementsByClassName("tt-fadeout"));

/* -------------------------------- */
/* NAV BETWEEN SCREENS */

var currentScreenId;

var screens = {
  load: {
    show: "showLoading",
    hide: "hideLoading",
  },
  instruct: {
    show: "showInstruct",
    hide: "hideInstruct",
  },
  steps: {
    show: "showSteps",
    hide: "hideSteps",
  },
  quiz: {
    show: "showQuiz",
    hide: "hideQuiz",
  },
  result: {
    show: "showResult",
    hide: "hideResult",
  },
};

function showScreen(screenId) {
  //console.log("showScreen(" + screenId + ")");

  var hideTime = 0;
  if (currentScreenId) {
    hideTime = window[screens[currentScreenId].hide]();
    //console.log("hideTime:", hideTime);
  }

  if (screenId === "quiz" || screenId === "result") {
    hideIntro();
  } else {
    showIntro();
    hideBlackout();
  }

  gsap.delayedCall(hideTime, function () {
    window[screens[screenId].show]();

    if (screenId === "quiz" || screenId === "result") {
      // showBlackout();
    }
  });

  currentScreenId = screenId;
}

function closeQuizScreen() {
  let param = new URL(window.location.href).searchParams;
  let app = param.get("app");
  let armode = param.get("armode");

  if (armode == "true") {
    handleiOSDeepLink();
    return;
  }
  if (app && app == "ios") {
    window.location.href = `unity://closewebview?state=ended`;
    return;
  }

  //xureal360MSG.onEventClose();
  window.close();
}

function handleiOSDeepLink() {
  console.log("Handling deep link to ADT iOS app");
  window.location.href = `adtvirtualtour://xureal/test-deep-link`;
}

/* -------------------------------- */
/* GAME QUESTION DATA */

let gameData;
let totalHotspots;
let backupLogo = "img/quizLogo.png";

function initData() {

  //console.log("initData()");

  const dataFilePath = DATA_PATH + currentCategoryId + ".json";

  let url = window.location.href;
  let param = new URL(url).searchParams;
  let product = param.get("product");
  let data_id = param.get("data_id");
  let preview = param.get("preview");
  let edit = param.get("edit");
  // let app = param.get("app");
  let arMode = param.get("armode");

  if (product) {

    console.log("-------------------------------------"+product+"------------------")
    console.log(objData_42);

 
        productData = eval("objData_"+product);
        console.log("productData: ",productData);
        
        gameData = productData.hotspots;
        totalHotspots = gameData.length;
        dataLoaded = true;
        console.log("-------------productData: ", productData);
        if (productData && productData.logo.length > 0) {
        } else {
          productData.logo = backupLogo;
        }
        document.getElementById("load-logo").src =
          productData.logo || backupLogo;
        var r = document.querySelector(":root");
        var rs = getComputedStyle(r);
        r.style.setProperty("--primary-color", productData.primaryBrandColor);
        setTimeout(() => {
          //document.querySelectorAll('#ar-icon').setAttribute('fill', "red");
        }, "1000");

        // document.getElementById()
        loadFinished();
        displayProduct();
        updateUIbyData();
    
    /*fetch(DATA_PATH + product + ".json")
      .then((result) => result.json())
      .then((json) => {
        productData = json;
        console.log(productData);
        gameData = productData.hotspots;
        totalHotspots = gameData.length;
        dataLoaded = true;
        console.log("-------------productData: ", productData);
        if (productData && productData.logo.length > 0) {
        } else {
          productData.logo = backupLogo;
        }
        document.getElementById("load-logo").src =
          productData.logo || backupLogo;
        var r = document.querySelector(":root");
        var rs = getComputedStyle(r);
        r.style.setProperty("--primary-color", productData.primaryBrandColor);
        setTimeout(() => {
          //document.querySelectorAll('#ar-icon').setAttribute('fill', "red");
        }, "1000");

        // document.getElementById()
        loadFinished();
        displayProduct();
        updateUIbyData();
      })
      .catch((err) => console.error(err));*/
  }

  if (data_id) {
    xurealAPI.get360DataByID(data_id).then((data) => {
      console.log("360d data: ", data.content.data);
      (productData = JSON.parse(data.content.data[0].json)),
        console.log(productData);
      gameData = productData.hotspots;
      totalHotspots = gameData.length;
      dataLoaded = true;
      if (productData && productData.logo.length > 0) {
      } else {
        productData.logo = backupLogo;
      }

      document.getElementById("load-logo").src = productData.logo || backupLogo;
      var r = document.querySelector(":root");
      var rs = getComputedStyle(r);
      r.style.setProperty("--primary-color", productData.primaryBrandColor);

      // document.getElementById()
      loadFinished();
      displayProduct();
      updateUIbyData();
    });
  }
  if (edit) {
    gEL("#tt-viewar").style.opacity = 0.0;
    gEL("#tt-quiz-back").style.opacity = 0.0;
    gEL("#tt-mobile-quiz-back").style.opacity = 0.0;
  }

  if (preview) {
    gEL("#tt-viewar").style.display = "none";

    //var testData = "ICAgIHsKICAgICAgICAibmFtZSI6W3sKICAgICAgICAgICAgInR5cGUiOiAic3BhbiIsCiAgICAgICAgICAgICJjaGlsZHJlbiI6IFt7CiAgICAgICAgICAgICAgICAidGV4dCI6ICJub3JtYWwgIgogICAgICAgICAgICB9LCB7CiAgICAgICAgICAgICAgICAidGV4dCI6ICJib2xkICIsCiAgICAgICAgICAgICAgICAiYm9sZCI6IHRydWUKICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgInRleHQiOiAiaXRhbGljICIsCiAgICAgICAgICAgICAgICAiaXRhbGljIjogdHJ1ZQogICAgICAgICAgICB9LCB7CiAgICAgICAgICAgICAgICAidGV4dCI6ICJ1bmRlcmxpbmVkIiwKICAgICAgICAgICAgICAgICJ1bmRlcmxpbmUiOiB0cnVlCiAgICAgICAgICAgIH1dCiAgICAgICAgfV0sCiAgICAgICAgImRlc2NyaXB0aW9uIjogW3sKICAgICAgICAgInR5cGUiOiAic3BhbiIsCiAgICAgICAgICJjaGlsZHJlbiI6IFt7CiAgICAgICAgICAgICAidGV4dCI6ICJub3JtYWwgIgogICAgICAgICB9LCB7CiAgICAgICAgICAgICAidGV4dCI6ICJib2xkICIsCiAgICAgICAgICAgICAiYm9sZCI6IHRydWUKICAgICAgICAgfSwgewogICAgICAgICAgICAgInRleHQiOiAiaXRhbGljICIsCiAgICAgICAgICAgICAiaXRhbGljIjogdHJ1ZQogICAgICAgICB9LCB7CiAgICAgICAgICAgICAidGV4dCI6ICJ1bmRlcmxpbmVkIiwKICAgICAgICAgICAgICJ1bmRlcmxpbmUiOiB0cnVlCiAgICAgICAgIH1dCiAgICAgfV0sCiAgICAgICAgImZsYXZvclRleHQiOiBbCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgICJ0aXRsZSI6ICJSZWxpYWJsZSBkZXRlY3Rpb24sIHJhcGlkIHJlc3BvbnNlIiwKICAgICAgICAgICAgICAgICJkZXNjIjogW3sKICAgICAgICAgICAgICAgICAgInR5cGUiOiAicGFyYWdyYXBoIiwKICAgICAgICAgICAgICAgICAgImNoaWxkcmVuIjogW3sKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogIm5vcm1hbCBpdGVtIDEiCiAgICAgICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogImJvbGQgaXRlbSAyICIsCiAgICAgICAgICAgICAgICAgICAgICAiYm9sZCI6IHRydWUsCiAgICAgICAgICAgICAgICAgICAgICAiaXRhbGljIjp0cnVlCiAgICAgICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogIml0YWxpYyBpdGVtIDMiLAogICAgICAgICAgICAgICAgICAgICAgIml0YWxpYyI6IHRydWUKICAgICAgICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAidW5kZXJsaW5lZCBpdGVtIDQiLAogICAgICAgICAgICAgICAgICAgICAgInVuZGVybGluZSI6IHRydWUKICAgICAgICAgICAgICAgICAgfV0KICAgICAgICAgICAgICB9LCB7CiAgICAgICAgICAgICAgICAgICJ0eXBlIjogIm51bWJlcmVkLWxpc3QiLAogICAgICAgICAgICAgICAgICAiY2hpbGRyZW4iOiBbewogICAgICAgICAgICAgICAgICAgICAgInR5cGUiOiAibGlzdC1pdGVtIiwKICAgICAgICAgICAgICAgICAgICAgICJjaGlsZHJlbiI6IFt7CiAgICAgICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAibnVtYmVybGlzdCBpdGVtIDUiCiAgICAgICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgInR5cGUiOiAiYnVsbGV0ZWQtbGlzdCIsCiAgICAgICAgICAgICAgICAgICJjaGlsZHJlbiI6IFt7CiAgICAgICAgICAgICAgICAgICAgICAidHlwZSI6ICJsaXN0LWl0ZW0iLAogICAgICAgICAgICAgICAgICAgICAgImNoaWxkcmVuIjogW3sKICAgICAgICAgICAgICAgICAgICAgICAgICAidGV4dCI6ICJ1bm9yZGVyZWQgbGlzdCBpdGVtIDYiCiAgICAgICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgInR5cGUiOiAicGFyYWdyYXBoIiwKICAgICAgICAgICAgICAgICAgImNoaWxkcmVuIjogW3sKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogInBhcmFncmFwaCBpdGVtIDciCiAgICAgICAgICAgICAgICAgIH1dCiAgICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgICAidHlwZSI6ICJudW1iZXJlZC1saXN0IiwKICAgICAgICAgICAgICAgICAgImNoaWxkcmVuIjogW3sKICAgICAgICAgICAgICAgICAgICAgICJ0eXBlIjogImxpc3QtaXRlbSIsCiAgICAgICAgICAgICAgICAgICAgICAiY2hpbGRyZW4iOiBbewogICAgICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogIkFsbCBzdHlsZXMgaXRlbSA4IiwKICAgICAgICAgICAgICAgICAgICAgICAgICAiYm9sZCI6IHRydWUsCiAgICAgICAgICAgICAgICAgICAgICAgICAgIml0YWxpYyI6IHRydWUsCiAgICAgICAgICAgICAgICAgICAgICAgICAgInVuZGVybGluZSI6IHRydWUKICAgICAgICAgICAgICAgICAgICAgIH1dCiAgICAgICAgICAgICAgICAgIH1dCiAgICAgICAgICAgICAgfV0KICAgICAgICAgICAgfSwKICAgICAgICAgICAgewogICAgICAgICAgICAgICAgInRpdGxlIjogIkFsYXJtcyB5b3Ugd29uJ3QgbWlzcyIsCiAgICAgICAgICAgICAgICAiZGVzYyI6ICJBdWRpYmxlIHNpcmVucyBhbmQgdmlzaWJsZSBMRURzIGhlbHAgYWxlcnQgZXZlcnlvbmUgaW4geW91ciBob21lIHRvIGdldCBvdXRzaWRlIgogICAgICAgICAgICB9LAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAidGl0bGUiOiAiQWxlcnRzIHRoZSBhdXRob3JpdGllcywgZXZlbiB3aGVuIHlvdSdyZSBhd2F5IiwKICAgICAgICAgICAgICAgICJkZXNjIjogIk1vcmUgcGVhY2Ugb2YgbWluZDsgdGhlIGZpcmUgZGVwYXJ0bWVudCB3aWxsIGJlIGFsZXJ0ZWQgZXZlbiBpZiB5b3UncmUgbm90IGhvbWUiCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgICJ0aXRsZSI6ICJBIHNtYXJ0ZXIgaG9tZSBpcyBhIHNhZmVyIGhvbWUiLAogICAgICAgICAgICAgICAgImRlc2MiOiAiLSBHZXQgYWxlcnRzIG9uIHlvdXIgbW9iaWxlIGRldmljZSBpZiBDTyBpcyBkZXRlY3RlZC4gVHVybiBvZmYgdGhlIGFpciBpbiB5b3VyIGhvbWUgdG8gc2xvdyB0aGUgY2lyY3VsYXRpb24gb2YgZGVhZGx5IGdhc2VzLiBVbmxvY2sgYWxsIHNtYXJ0LWxvY2stZXF1aXBwZWQgZG9vcnMgdG8gbGV0IGluIGZpcnN0IHJlc3BvbmRlcnMiCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgInRpdGxlIjogIjI0LzcgbW9uaXRvcmluZyIsCiAgICAgICAgICAgICAgICJkZXNjIjogIk91ciBtb25pdG9yaW5nIGNlbnRlcnMgd2lsbCByZWNlaXZlIGVtZXJnZW5jeSBzaWduYWxzIGFueSB0aW1lLCBkYXkgb3IgbmlnaHQuIgogICAgICAgICAgIH0KICAgICAgICBdLAogICAgICAgICJleHRlcm5hbExpbmsiOiAiaHR0cHM6Ly93d3cuYWR0LmNvbS9jYXJib24tbW9ub3hpZGUtYWxhcm0iLAogICAgICAgICJxckNvZGUiOiAiaHR0cHM6Ly9jbGllbnQtYWR0Lm1lZGlhLnh1cmVhbC5jb20vbWVkaWEvY2xpZW50cy9hZHQtYXNzZXRzL2ltYWdlcy9iNWE0NWJmNy0wYWQzLTRmNGEtYTU2OS1mMDE2ZDUwYWY2OTAucG5nIiwKICAgICAgICAibG9nbyI6ICJodHRwczovL2NsaWVudC1hZHQubWVkaWEueHVyZWFsLmNvbS9tZWRpYS9jbGllbnRzL2FkdC1hc3NldHMvaW1hZ2VzLzY2M2FmM2M2LTlmNzYtNGIzMi1hNWZlLThlYTJhODQyNTg1OS5wbmciLAogICAgICAgICJtb2RlbFNyYyI6ICJodHRwczovL2NsaWVudC1hZHQubWVkaWEueHVyZWFsLmNvbS9tZWRpYS9jbGllbnRzL2FkdC1hc3NldHMvbW9kZWxzLzNhOGZhMTIwLWU4NzItNDJiYi1hMjQ0LTIwMWZhNmNkZmRjYy5nbGIiLAogICAgICAgICJtb2RlbElvc1NyYyI6ICJodHRwczovL2NsaWVudC1hZHQubWVkaWEueHVyZWFsLmNvbS9tZWRpYS9jbGllbnRzL2FkdC1hc3NldHMvbW9kZWxzLzUyYjRhN2UyLTJjNWEtNGZmZi05OWIxLWEyYTFmNzFjOWIyMC51c2R6IiwKICAgICAgICAiaG90c3BvdHMiOiAKICAgICAgICBbCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgImhvdHNwb3QiOiB7CiAgICAgICAgICAgICAgICAgICJwb3NpdGlvbiI6ICIwLjAwMjgzMTgwNDUwMjM0NDAyMW0gMC4wNDQzMjkzNzg1MTYyNzVtIC0wLjAzMzMzMDk4NDc4NTkzNTM4bSIsCiAgICAgICAgICAgICAgICAgICJub3JtYWwiOiAiMC44OTkxNTA3OTk3NTY0NTI0bSAwLjM2MDc3OTcwNTkzMjIxNDE1bSAwLjI0NzcyMTMwMTIzMzQ1NzdtIgogICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAiZGVzYyI6IFt7CiAgICAgICAgICAgICAgICAgICJ0eXBlIjogInNwYW4iLAogICAgICAgICAgICAgICAgICAiY2hpbGRyZW4iOiBbewogICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAibm9ybWFsICIKICAgICAgICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAiYm9sZCAiLAogICAgICAgICAgICAgICAgICAgICAgImJvbGQiOiB0cnVlCiAgICAgICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogIml0YWxpYyAiLAogICAgICAgICAgICAgICAgICAgICAgIml0YWxpYyI6IHRydWUKICAgICAgICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAidW5kZXJsaW5lZCIsCiAgICAgICAgICAgICAgICAgICAgICAidW5kZXJsaW5lIjogdHJ1ZQogICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgIH1dCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgImhvdHNwb3QiOiB7CiAgICAgICAgICAgICAgICAgICJwb3NpdGlvbiI6ICIwLjAwMjMyMjQ4NzU0MDY2MDI1MDhtIDAuMDM5NzIwNTA0NTAzMDU1OTc2bSAtMC4wNDgyODU2NzE0ODYyMTkzM20iLAogICAgICAgICAgICAgICAgICAibm9ybWFsIjogIjAuMDA0NjQ2MjQ1MTQ5Mjg1MTIxbSAwLjk5MDc3MjAxMDE2MDgxNTNtIC0wLjEzNTQ1OTM1Mjg5OTM0ODhtIgogICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAiZGVzYyI6ICJBbGxvd3MgeW91IHRvIHBlcmZvcm0gcGVyaW9kaWMgdGVzdGluZyBvZiB5b3VyIGNhcmJvbiBtb25veGlkZSBkZXRlY3Rvci4iCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgImhvdHNwb3QiOiB7CiAgICAgICAgICAgICAgICAgICJwb3NpdGlvbiI6ICIwLjAwNTI0NTEzNDAzNzk1MTk4N20gMC4wNDE2MTcwMzIxNDA0OTM0Mm0gMC4wMDI5NTUwNjI4NzYxMDk0NDMzbSIsCiAgICAgICAgICAgICAgICAgICJub3JtYWwiOiAiMG0gMW0gMG0iCiAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICJkZXNjIjogIkJ1aWx0IGluIGFsYXJtIGZvciB0YW1wZXIgZGV0ZWN0aW9uIgogICAgICAgICAgICB9LAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgICJob3RzcG90IjogewogICAgICAgICAgICAgICAgICAicG9zaXRpb24iOiAiMC4wMDA1MzYwMTc0OTQ5Nzk4MTgybSAwLjAyNjg3MzQ4OTA1NDUwODU2NW0gMC4wNzEwMjQ0NzY4ODk2MTM5MW0iLAogICAgICAgICAgICAgICAgICAibm9ybWFsIjogIjAuMDI3MjA1NzkxMTM3NTIzMDg3bSAwLjgzMjIwNjYyNzcxMzY4MTVtIDAuNTUzNzk3NzczMzA1Mzg1N20iCiAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICJkZXNjIjogIkVuc3VyZXMgb3B0aW1hbCBjYXJib24gbW9ub3hpZGUgZGV0ZWN0b3Igc2V0dXAsIHdpdGggd2lyZWxlc3MgYW5kIGhhcmQtd2lyZWQgb3B0aW9ucy4iCiAgICAgICAgICAgIH0KICAgICAgICBdLAogICAgICAgICJ2aWV3QVJfYnV0dG9uIjp0cnVlLAogICAgICAgICJsaW5rT3V0X2J1dHRvbiI6ZmFsc2UsCiAgICAgICAgInByaW1hcnlCcmFuZENvbG9yIjogIiMwMDY2REQiCiAgICAgICB9CiAgIA==";
    //setPreviewData(testData);
    /*xurealAPI.get360DataByID(data_id).then((data) => {
      console.log("360d data: ", data.content.data);
      (productData = JSON.parse(data.content.data[0].json)),
        console.log(productData);
      gameData = productData.hotspots;
      totalHotspots = gameData.length;
      dataLoaded = true;

      document.getElementById("load-logo").src = productData.logo;

      // document.getElementById()
      loadFinished();
      displayProduct();
      updateUIbyData();
    });*/
  }

  if (arMode == "true") {
    console.log("Armode activated on app start");
    // viewAr();
    pingAR();
  } else {
    gEL("#tt-ar-loader").style.display = "none";
  }
}

function testPreviewData() {
  var testData =
    "ICAgIHsKICAgICAgICAibmFtZSI6W3sKICAgICAgICAgICAgInR5cGUiOiAic3BhbiIsCiAgICAgICAgICAgICJjaGlsZHJlbiI6IFt7CiAgICAgICAgICAgICAgICAidGV4dCI6ICJub3JtYWwgIgogICAgICAgICAgICB9LCB7CiAgICAgICAgICAgICAgICAidGV4dCI6ICJib2xkICIsCiAgICAgICAgICAgICAgICAiYm9sZCI6IHRydWUKICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgInRleHQiOiAiaXRhbGljICIsCiAgICAgICAgICAgICAgICAiaXRhbGljIjogdHJ1ZQogICAgICAgICAgICB9LCB7CiAgICAgICAgICAgICAgICAidGV4dCI6ICJ1bmRlcmxpbmVkIiwKICAgICAgICAgICAgICAgICJ1bmRlcmxpbmUiOiB0cnVlCiAgICAgICAgICAgIH1dCiAgICAgICAgfV0sCiAgICAgICAgImRlc2NyaXB0aW9uIjogW3sKICAgICAgICAgInR5cGUiOiAic3BhbiIsCiAgICAgICAgICJjaGlsZHJlbiI6IFt7CiAgICAgICAgICAgICAidGV4dCI6ICJub3JtYWwgIgogICAgICAgICB9LCB7CiAgICAgICAgICAgICAidGV4dCI6ICJib2xkICIsCiAgICAgICAgICAgICAiYm9sZCI6IHRydWUKICAgICAgICAgfSwgewogICAgICAgICAgICAgInRleHQiOiAiaXRhbGljICIsCiAgICAgICAgICAgICAiaXRhbGljIjogdHJ1ZQogICAgICAgICB9LCB7CiAgICAgICAgICAgICAidGV4dCI6ICJ1bmRlcmxpbmVkIiwKICAgICAgICAgICAgICJ1bmRlcmxpbmUiOiB0cnVlCiAgICAgICAgIH1dCiAgICAgfV0sCiAgICAgICAgImZsYXZvclRleHQiOiBbCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgICJ0aXRsZSI6ICJSZWxpYWJsZSBkZXRlY3Rpb24sIHJhcGlkIHJlc3BvbnNlIiwKICAgICAgICAgICAgICAgICJkZXNjIjogW3sKICAgICAgICAgICAgICAgICAgInR5cGUiOiAicGFyYWdyYXBoIiwKICAgICAgICAgICAgICAgICAgImNoaWxkcmVuIjogW3sKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogIm5vcm1hbCBpdGVtIDEiCiAgICAgICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogImJvbGQgaXRlbSAyICIsCiAgICAgICAgICAgICAgICAgICAgICAiYm9sZCI6IHRydWUsCiAgICAgICAgICAgICAgICAgICAgICAiaXRhbGljIjp0cnVlCiAgICAgICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogIml0YWxpYyBpdGVtIDMiLAogICAgICAgICAgICAgICAgICAgICAgIml0YWxpYyI6IHRydWUKICAgICAgICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAidW5kZXJsaW5lZCBpdGVtIDQiLAogICAgICAgICAgICAgICAgICAgICAgInVuZGVybGluZSI6IHRydWUKICAgICAgICAgICAgICAgICAgfV0KICAgICAgICAgICAgICB9LCB7CiAgICAgICAgICAgICAgICAgICJ0eXBlIjogIm51bWJlcmVkLWxpc3QiLAogICAgICAgICAgICAgICAgICAiY2hpbGRyZW4iOiBbewogICAgICAgICAgICAgICAgICAgICAgInR5cGUiOiAibGlzdC1pdGVtIiwKICAgICAgICAgICAgICAgICAgICAgICJjaGlsZHJlbiI6IFt7CiAgICAgICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAibnVtYmVybGlzdCBpdGVtIDUiCiAgICAgICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgInR5cGUiOiAiYnVsbGV0ZWQtbGlzdCIsCiAgICAgICAgICAgICAgICAgICJjaGlsZHJlbiI6IFt7CiAgICAgICAgICAgICAgICAgICAgICAidHlwZSI6ICJsaXN0LWl0ZW0iLAogICAgICAgICAgICAgICAgICAgICAgImNoaWxkcmVuIjogW3sKICAgICAgICAgICAgICAgICAgICAgICAgICAidGV4dCI6ICJ1bm9yZGVyZWQgbGlzdCBpdGVtIDYiCiAgICAgICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgInR5cGUiOiAicGFyYWdyYXBoIiwKICAgICAgICAgICAgICAgICAgImNoaWxkcmVuIjogW3sKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogInBhcmFncmFwaCBpdGVtIDciCiAgICAgICAgICAgICAgICAgIH1dCiAgICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgICAidHlwZSI6ICJudW1iZXJlZC1saXN0IiwKICAgICAgICAgICAgICAgICAgImNoaWxkcmVuIjogW3sKICAgICAgICAgICAgICAgICAgICAgICJ0eXBlIjogImxpc3QtaXRlbSIsCiAgICAgICAgICAgICAgICAgICAgICAiY2hpbGRyZW4iOiBbewogICAgICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogIkFsbCBzdHlsZXMgaXRlbSA4IiwKICAgICAgICAgICAgICAgICAgICAgICAgICAiYm9sZCI6IHRydWUsCiAgICAgICAgICAgICAgICAgICAgICAgICAgIml0YWxpYyI6IHRydWUsCiAgICAgICAgICAgICAgICAgICAgICAgICAgInVuZGVybGluZSI6IHRydWUKICAgICAgICAgICAgICAgICAgICAgIH1dCiAgICAgICAgICAgICAgICAgIH1dCiAgICAgICAgICAgICAgfV0KICAgICAgICAgICAgfSwKICAgICAgICAgICAgewogICAgICAgICAgICAgICAgInRpdGxlIjogIkFsYXJtcyB5b3Ugd29uJ3QgbWlzcyIsCiAgICAgICAgICAgICAgICAiZGVzYyI6ICJBdWRpYmxlIHNpcmVucyBhbmQgdmlzaWJsZSBMRURzIGhlbHAgYWxlcnQgZXZlcnlvbmUgaW4geW91ciBob21lIHRvIGdldCBvdXRzaWRlIgogICAgICAgICAgICB9LAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAidGl0bGUiOiAiQWxlcnRzIHRoZSBhdXRob3JpdGllcywgZXZlbiB3aGVuIHlvdSdyZSBhd2F5IiwKICAgICAgICAgICAgICAgICJkZXNjIjogIk1vcmUgcGVhY2Ugb2YgbWluZDsgdGhlIGZpcmUgZGVwYXJ0bWVudCB3aWxsIGJlIGFsZXJ0ZWQgZXZlbiBpZiB5b3UncmUgbm90IGhvbWUiCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgICJ0aXRsZSI6ICJBIHNtYXJ0ZXIgaG9tZSBpcyBhIHNhZmVyIGhvbWUiLAogICAgICAgICAgICAgICAgImRlc2MiOiAiLSBHZXQgYWxlcnRzIG9uIHlvdXIgbW9iaWxlIGRldmljZSBpZiBDTyBpcyBkZXRlY3RlZC4gVHVybiBvZmYgdGhlIGFpciBpbiB5b3VyIGhvbWUgdG8gc2xvdyB0aGUgY2lyY3VsYXRpb24gb2YgZGVhZGx5IGdhc2VzLiBVbmxvY2sgYWxsIHNtYXJ0LWxvY2stZXF1aXBwZWQgZG9vcnMgdG8gbGV0IGluIGZpcnN0IHJlc3BvbmRlcnMiCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgInRpdGxlIjogIjI0LzcgbW9uaXRvcmluZyIsCiAgICAgICAgICAgICAgICJkZXNjIjogIk91ciBtb25pdG9yaW5nIGNlbnRlcnMgd2lsbCByZWNlaXZlIGVtZXJnZW5jeSBzaWduYWxzIGFueSB0aW1lLCBkYXkgb3IgbmlnaHQuIgogICAgICAgICAgIH0KICAgICAgICBdLAogICAgICAgICJleHRlcm5hbExpbmsiOiAiaHR0cHM6Ly93d3cuYWR0LmNvbS9jYXJib24tbW9ub3hpZGUtYWxhcm0iLAogICAgICAgICJxckNvZGUiOiAiaHR0cHM6Ly9jbGllbnQtYWR0Lm1lZGlhLnh1cmVhbC5jb20vbWVkaWEvY2xpZW50cy9hZHQtYXNzZXRzL2ltYWdlcy9iNWE0NWJmNy0wYWQzLTRmNGEtYTU2OS1mMDE2ZDUwYWY2OTAucG5nIiwKICAgICAgICAibG9nbyI6ICJodHRwczovL2NsaWVudC1hZHQubWVkaWEueHVyZWFsLmNvbS9tZWRpYS9jbGllbnRzL2FkdC1hc3NldHMvaW1hZ2VzLzY2M2FmM2M2LTlmNzYtNGIzMi1hNWZlLThlYTJhODQyNTg1OS5wbmciLAogICAgICAgICJtb2RlbFNyYyI6ICJodHRwczovL2NsaWVudC1hZHQubWVkaWEueHVyZWFsLmNvbS9tZWRpYS9jbGllbnRzL2FkdC1hc3NldHMvbW9kZWxzLzNhOGZhMTIwLWU4NzItNDJiYi1hMjQ0LTIwMWZhNmNkZmRjYy5nbGIiLAogICAgICAgICJtb2RlbElvc1NyYyI6ICJodHRwczovL2NsaWVudC1hZHQubWVkaWEueHVyZWFsLmNvbS9tZWRpYS9jbGllbnRzL2FkdC1hc3NldHMvbW9kZWxzLzUyYjRhN2UyLTJjNWEtNGZmZi05OWIxLWEyYTFmNzFjOWIyMC51c2R6IiwKICAgICAgICAiaG90c3BvdHMiOiAKICAgICAgICBbCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgImhvdHNwb3QiOiB7CiAgICAgICAgICAgICAgICAgICJwb3NpdGlvbiI6ICIwLjAwMjgzMTgwNDUwMjM0NDAyMW0gMC4wNDQzMjkzNzg1MTYyNzVtIC0wLjAzMzMzMDk4NDc4NTkzNTM4bSIsCiAgICAgICAgICAgICAgICAgICJub3JtYWwiOiAiMC44OTkxNTA3OTk3NTY0NTI0bSAwLjM2MDc3OTcwNTkzMjIxNDE1bSAwLjI0NzcyMTMwMTIzMzQ1NzdtIgogICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAiZGVzYyI6IFt7CiAgICAgICAgICAgICAgICAgICJ0eXBlIjogInNwYW4iLAogICAgICAgICAgICAgICAgICAiY2hpbGRyZW4iOiBbewogICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAibm9ybWFsICIKICAgICAgICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAiYm9sZCAiLAogICAgICAgICAgICAgICAgICAgICAgImJvbGQiOiB0cnVlCiAgICAgICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogIml0YWxpYyAiLAogICAgICAgICAgICAgICAgICAgICAgIml0YWxpYyI6IHRydWUKICAgICAgICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAidW5kZXJsaW5lZCIsCiAgICAgICAgICAgICAgICAgICAgICAidW5kZXJsaW5lIjogdHJ1ZQogICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgIH1dCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgImhvdHNwb3QiOiB7CiAgICAgICAgICAgICAgICAgICJwb3NpdGlvbiI6ICIwLjAwMjMyMjQ4NzU0MDY2MDI1MDhtIDAuMDM5NzIwNTA0NTAzMDU1OTc2bSAtMC4wNDgyODU2NzE0ODYyMTkzM20iLAogICAgICAgICAgICAgICAgICAibm9ybWFsIjogIjAuMDA0NjQ2MjQ1MTQ5Mjg1MTIxbSAwLjk5MDc3MjAxMDE2MDgxNTNtIC0wLjEzNTQ1OTM1Mjg5OTM0ODhtIgogICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAiZGVzYyI6ICJBbGxvd3MgeW91IHRvIHBlcmZvcm0gcGVyaW9kaWMgdGVzdGluZyBvZiB5b3VyIGNhcmJvbiBtb25veGlkZSBkZXRlY3Rvci4iCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgImhvdHNwb3QiOiB7CiAgICAgICAgICAgICAgICAgICJwb3NpdGlvbiI6ICIwLjAwNTI0NTEzNDAzNzk1MTk4N20gMC4wNDE2MTcwMzIxNDA0OTM0Mm0gMC4wMDI5NTUwNjI4NzYxMDk0NDMzbSIsCiAgICAgICAgICAgICAgICAgICJub3JtYWwiOiAiMG0gMW0gMG0iCiAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICJkZXNjIjogIkJ1aWx0IGluIGFsYXJtIGZvciB0YW1wZXIgZGV0ZWN0aW9uIgogICAgICAgICAgICB9LAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgICJob3RzcG90IjogewogICAgICAgICAgICAgICAgICAicG9zaXRpb24iOiAiMC4wMDA1MzYwMTc0OTQ5Nzk4MTgybSAwLjAyNjg3MzQ4OTA1NDUwODU2NW0gMC4wNzEwMjQ0NzY4ODk2MTM5MW0iLAogICAgICAgICAgICAgICAgICAibm9ybWFsIjogIjAuMDI3MjA1NzkxMTM3NTIzMDg3bSAwLjgzMjIwNjYyNzcxMzY4MTVtIDAuNTUzNzk3NzczMzA1Mzg1N20iCiAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICJkZXNjIjogIkVuc3VyZXMgb3B0aW1hbCBjYXJib24gbW9ub3hpZGUgZGV0ZWN0b3Igc2V0dXAsIHdpdGggd2lyZWxlc3MgYW5kIGhhcmQtd2lyZWQgb3B0aW9ucy4iCiAgICAgICAgICAgIH0KICAgICAgICBdLAogICAgICAgICJ2aWV3QVJfYnV0dG9uIjp0cnVlLAogICAgICAgICJsaW5rT3V0X2J1dHRvbiI6ZmFsc2UsCiAgICAgICAgInByaW1hcnlCcmFuZENvbG9yIjogIiMwMDY2REQiCiAgICAgICB9CiAgIA==";
  setPreviewData(testData);
}

function setPreviewData(data) {
  var dataObj = JSON.parse(window.atob(data));
  console.log(dataObj);
  console.log("title: ", dataObj.name);

  productData = dataObj;
  console.log(productData.hotspots);
  gameData = productData.hotspots;
  totalHotspots = gameData.length;
  dataLoaded = true;
  if (productData && productData.logo.length > 0) {
  } else {
    productData.logo = backupLogo;
  }
  document.getElementById("load-logo").src = productData.logo || backupLogo;
  var r = document.querySelector(":root");
  var rs = getComputedStyle(r);
  r.style.setProperty("--primary-color", productData.primaryBrandColor);

  // document.getElementById()
  loadFinished();
  displayProduct();
  updateUIbyData();
}

function updateUIbyData() {
  // UI items:
  //productData.viewAR_button = true || false
  //productData.primaryBrandColor = color name or hex
  //productData.linkOut_button =  true || false

  if (!productData.viewAR_button) {
    gEL("#tt-viewar").style.display = "none";
  }

  if (!productData.linkOut_button) {
    const collectionButtonDesktop =
      document.getElementsByClassName("linkout-desktop");
    for (let i = 0; i < collectionButtonDesktop.length; i++) {
      collectionButtonDesktop[i].style.visibility = "hidden";
    }
    const collectionButtonMobile =
      document.getElementsByClassName("linkout-mobile");
    for (let i = 0; i < collectionButtonMobile.length; i++) {
      collectionButtonMobile[i].style.visibility = "hidden";
    }
  }
}

/* -------------------------------- */
/* LOAD VR MODEL */

var iframeLoaded = false;

function initModel() {
  //console.log("initModel()");

  showScreen("load");

  loadIframe();
}

function loadIframe() {
  //console.log("loadIframe()");

  if (iframeLoaded) {
    if (gEL("#tt-vr-iframe").contentWindow.modelVisible) {
      gEL("#tt-vr-iframe").contentWindow.modelVisible();
    }

    return;
  }

  iframeLoaded = true;

  gEL("#tt-vr-iframe").setAttribute("src", IFRAME_SRC);
}

function unloadIframe() {
  //console.log("unloadIframe()");

  iframeLoaded = false;

  gEL("#tt-vr-iframe").src = "";
  gEL("#tt-vr-iframe").location = "about:blank";

  //console.log("IFRAME CLEARED");
}

gEL("#tt-vr-iframe").addEventListener("load", function () {
  var iframeSrc = gEL("#tt-vr-iframe").src;
  //console.log("iframeSrc:", iframeSrc);

  if (iframeSrc.indexOf(IFRAME_SRC) != -1) {
    //console.log("IFRAME LOADED");

    postCall("setPrimaryColor",productData.primaryBrandColor);

    //if (gEL("#tt-vr-iframe").contentWindow.loadModel) {
      /*gEL("#tt-vr-iframe").contentWindow.setPrimaryColor(
        productData.primaryBrandColor
      );*/

      var loadObj = {
        modelId: "product",
        modelSrc: productData.modelSrc,
        modelIosSrc: productData.modelIosSrc,
      };

      postLoadCall("loadModel",loadObj,gameData,!modelLoaded);
     /* gEL("#tt-vr-iframe").contentWindow.loadModel(
        {
          modelId: "product",
          modelSrc: productData.modelSrc,
          modelIosSrc: productData.modelIosSrc,
        },
        gameData,
        !modelLoaded
      );*/
  //  }

   /* if (gEL("#tt-vr-iframe").contentWindow.resetHotspots) {
      gEL("#tt-vr-iframe").contentWindow.resetHotspots(questionsTotal);
    }

    if (gEL("#tt-vr-iframe").contentWindow.modelVisible) {
      gEL("#tt-vr-iframe").contentWindow.modelVisible();
    }
*/
    selectQuestion();
  }
});

function postCall(fCall, fData) {

  var postData = {
    "function": fCall,
    "data": fData,
  }

  gEL("#tt-vr-iframe").contentWindow.postMessage(postData, "*");

}

function postLoadCall(fCall, fData, gData, flag) {

  var postData = {
    "function": fCall,
    "data": fData,
    "gameData": gData,
    "flag": flag
  }
  gEL("#tt-vr-iframe").contentWindow.postMessage(postData, "*");
  

}

function modelProgress(totalProgress) {
  gsap.set("#tt-load-bar-progress  svg circle:nth-child(2)", {
    "stroke-dashoffset": 120 - (120 * Math.round(totalProgress * 100)) / 100,
  });
  gEL("#tt-load-text").innerHTML = Math.round(totalProgress * 100) + "%";

  if (totalProgress >= 0.98) {
    modelLoaded = true;

    unloadIframe();

    loadFinished();
  }
}

function loadFinished() {
  //console.log("loadFinished()");

  if (!modelLoaded) {
    initModel();
  }

  if (modelLoaded && dataLoaded) {
    showScreen("quiz");
  }
}

/* -------------------------------- */
/* START */

var modelLoaded = false;
var dataLoaded = false;

var screenId = getParameterByName("q");
if (!screenId) screenId = "steps";

//initScreens();
//initData();

// TODO: this needs to be passed dynamically
//xurealAPI.initEnv("https://client-adt.dev.xureal.com/");
initScreens();

document.addEventListener("DOMContentLoaded", function () {
  initData();
});
