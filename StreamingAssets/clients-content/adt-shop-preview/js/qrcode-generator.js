function generateQRCode(user_input){

  document.querySelector(".qr-code").style = "";

  var qrcode = new QRCode(document.querySelector(".qr-code"), {
      text: `${user_input}`,
      width: 160, //128
      height: 160,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
  });

  //console.log(qrcode);

  /*let download = document.createElement("button");
  document.querySelector(".qr-code").appendChild(download);

  let download_link = document.createElement("a");
  download_link.setAttribute("download", "qr_code_linq.png");
  download_link.innerText = "Download";

  download.appendChild(download_link);*/

  if(document.querySelector(".qr-code img").getAttribute("src") == null){
      setTimeout(() => {
          //download_link.setAttribute("href", `${document.querySelector("canvas").toDataURL()}`);
          /*var qrImgEl = document.getElementById("tt-modal-qrcode-img");
          console.log(qrImgEl);
          qrImgEl.src = document.querySelector(".qr-code img").getAttribute("src");*/
        }, 300);
  } else {
      setTimeout(() => {
          //download_link.setAttribute("href", `${document.querySelector(".qr-code img").getAttribute("src")}`);
          /*var qrImgEl = document.getElementById("tt-modal-qrcode-img");
          console.log(qrImgEl);
          qrImgEl.src = document.querySelector(".qr-code img").getAttribute("src");*/
          console.log(document.querySelector(".qr-code img"));

          document.querySelector(".qr-code").style.width = "200px"; 
          document.querySelector(".qr-code img").style.display = "block";
          document.querySelector(".qr-code img").style.marginRight = "auto";
          document.querySelector(".qr-code img").style.marginLeft = "auto";
        

      }, 500);
  }
}