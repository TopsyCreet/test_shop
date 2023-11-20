//------------------------------------------
//      Particles
//------------------------------------------

var areaWidth;
var areaHeight;

var particleW = 60;
var particleH = 50;

gsap.set(".tt-particles", { perspective: 600 });

var particleAR;
var particlesBuilt = false;

function buildParticles() {
   //console.log("buildParticles()");

   if (particlesBuilt) return;

   particlesBuilt = true;

   particleAR = [];

   var totalParticles = 40;

   for (var a = 1; a <= totalParticles; a++) {
      var distanceRatio = 1 - (a - 1) / totalParticles;
      buildParticle(distanceRatio);
   }
}

function buildParticle(distanceRatio) {
   //console.log("buildParticle(" + distanceRatio + ")");

   var particleEl = document.createElement("div");
   particleEl.classList = "tt-particle";

   particleAR.push(particleEl);

   var num = 1;
   if (distanceRatio < 0.5) {
      num = 2;
   }

   gEL("#tt-particles" + num).appendChild(particleEl);

   initParticle(particleEl, distanceRatio);
}

function initParticle(particleEl, distanceRatio) {
   //console.log("initParticle(" + particleEl + "," + distanceRatio + ")");

   var backgroundPositionY = -randRange(0, 5) * particleH;
   //console.log("backgroundPositionY", backgroundPositionY);

   var startX = randRange(0, areaWidth + 20) - 40;
   var startY = -100;
   var startRoration = randRange(0, 360);
   //console.log("startX", startX, "startY", startY);

   var scaleX;
   if (distanceRatio) {
      scaleX = (1 - 0.9 * distanceRatio) * 0.8;
   } else {
      scaleX = gsap.getProperty(particleEl, "scaleX");
   }
   if (scaleX < 0.3) scaleX = 0.3;
   var scaleY = randRange(20, 200) / 100;
   //console.log("scaleX", scaleX, "scaleY", scaleY);

   gsap.set(particleEl, {
      rotation: startRoration,
      x: startX,
      y: startY,
      scaleX: scaleX,
      scaleY: scaleY,
      backgroundPositionY: backgroundPositionY,
   });

   endRotation = startRoration + randRange(90, 180) * ab();

   var fallTime = 5 * (1 - scaleX * 0.9) * (areaHeight / 500);
   //console.log("fallTime", fallTime);

   particleEl.fallTime = fallTime;
   particleEl.startRotation = startRoration;
   particleEl.endRotation = endRotation;

   particleEl.tw1 = gsap.to(particleEl, particleEl.fallTime, {
      y: areaHeight + 50,
      rotation: particleEl.endRotation,
      ease: Linear.easeNone,
      onComplete: resetParticle,
      onCompleteParams: [particleEl],
   });

   if (!particleEl.initDone) {
      particleEl.initDone = true;
      particleEl.tw1.progress(randRange(2, 98) / 100);
   }

   var swayX = randRange(100, 300) * scaleX * ab();
   var swayTime = swayX / 30;

   particleEl.tw2 = gsap.to(particleEl, swayTime, {
      x: "+=" + swayX,
      ease: Sine.easeInOut,
      onComplete: reverseTween,
      onReverseComplete: restartTween,
   });
   particleEl.tw2.progress(randRange(2, 98) / 100);

   var maxRotate = 70;
   var rotationX = randRange(0, 360) * 3;
   var rotationY = randRange(-maxRotate, maxRotate);
   var flipTime = swayTime * (randRange(20, 50) / 10);

   particleEl.tw3 = gsap.to(particleEl, flipTime, {
      rotationX: rotationX,
      rotationY: rotationY,
      ease: Sine.easeInOut,
      onComplete: reverseTween,
      onReverseComplete: restartTween,
   });

   particleEl.tw1.pause();
   particleEl.tw2.pause();
   particleEl.tw3.pause();
}

function resetParticle(particleEl) {
   //console.log("resetParticle()");

   var startX = randRange(0, areaWidth + 20) - 40;
   var startY = -100;

   gsap.set(particleEl, {
      x: startX,
      y: startY,
      rotation: particleEl.startRotation,
   });

   particleEl.tw1 = gsap.to(particleEl, particleEl.fallTime, {
      y: areaHeight + 50,
      rotation: particleEl.endRotation,
      ease: Linear.easeNone,
      onComplete: resetParticle,
      onCompleteParams: [particleEl],
   });
}

function pauseParticles() {
   //console.log("pauseParticles()");
   for (var a in particleAR) {
      particleAR[a].tw1.pause();
      particleAR[a].tw2.pause();
      particleAR[a].tw3.pause();
   }
}

function resumeParticles() {
   //console.log("resumeParticles()");

   if (!particlesBuilt) {
      buildParticles();
      return;
   }

   for (var a in particleAR) {
      particleAR[a].tw1.resume();
      particleAR[a].tw2.resume();
      particleAR[a].tw3.resume();
   }
}

function ab() {
   return Math.random() < 0.5 ? -1 : 1;
}

function randRange(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gEL(id) {
   return document.querySelector(id);
}

function rEL(el) {
   //console.log("rEL(" + id + ")");
   el.parentElement.removeChild(el);
}

function reverseTween() {
   this.reverse();
}

function restartTween() {
   this.restart();
}

function onParticlesResize() {
   //console.log("onParticlesResize()");

   areaWidth = gEL("#tt-quiz-main").offsetWidth;
   //console.log("areaWidth", areaWidth);

   if (!areaWidth) areaWidth = gEL("#tt-result-main").offsetWidth;
   //console.log("areaWidth", areaWidth);

   if (!areaWidth) areaWidth = window.innerWidth;
   //console.log("areaWidth", areaWidth);

   areaHeight = window.outerHeight;
   //console.log("areaHeight", areaHeight);
}

window.addEventListener("resize", onParticlesResize);

window.onload = function () {
   onParticlesResize();
   buildParticles();
};
