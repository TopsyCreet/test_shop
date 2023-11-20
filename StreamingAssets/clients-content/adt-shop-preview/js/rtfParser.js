let rtfParser = {
  init: function () {
    // test call
  },
  processRTF: function (obj) {
    var rtfObj = obj;
    let textDataReturn = "";
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
    let textDescriptionCopy = "";

    for (let ii = 0; ii < rtfObj.length; ii++) {
      outerTextWrapperStart = "<" + this.checkRTFType(rtfObj[ii]);
      outerTextWrapperEnd = "</" + this.checkRTFType(rtfObj[ii]);

      for (let iii = 0; iii < rtfObj[ii].children.length; iii++) {
        innerTextWrapperStart = "";
        innerTextWrapperEnd = "";
        outerChildrenTextWrapperStart = "";
        outerChildrenTextWrapperEnd = "";
        coreTextWrapperStart = "";
        coreTextWrapperEnd = "";
        innerTextWrapperStart = this.checkRTFStyleStart(
          rtfObj[ii].children[iii]
        );
        innerTextWrapperEnd = this.checkRTFStyleEnd(rtfObj[ii].children[iii]);

        var hasChildren = Object.prototype.hasOwnProperty.call(
          rtfObj[ii].children[iii],
          "children"
        );
        if (hasChildren) {
          //console.log("-------hasCHildren: "+ rtfObj[ii].children[iii].type);
          outerChildrenTextWrapperStart =
            "<" + this.checkRTFType(rtfObj[ii].children[iii]);
          outerChildrenTextWrapperEnd =
            "</" + this.checkRTFType(rtfObj[ii].children[iii]);
          for (let iiii = 0; iiii < rtfObj[ii].children[iii].children.length; iiii++) {
            coreTextWrapperStart = this.checkRTFStyleStart(
              rtfObj[ii].children[iii].children[iiii]
            );
            coreTextWrapperEnd = this.checkRTFStyleEnd(
              rtfObj[ii].children[iii].children[iiii]
            );
            textDescriptionCopy = rtfObj[ii].children[iii].children[iiii].text;
          }
        } else {
          textDescriptionCopy = rtfObj[ii].children[iii].text;
        }
        currentHTMLItem =
          outerTextWrapperStart +
          outerChildrenTextWrapperStart +
          innerTextWrapperStart +
          coreTextWrapperStart +
          textDescriptionCopy +
          coreTextWrapperEnd +
          innerTextWrapperEnd +
          outerChildrenTextWrapperEnd +
          outerTextWrapperEnd;
        console.log("html item: " + currentHTMLItem);
        textDescriptionArray.push(currentHTMLItem);
      }
    }

    // all data will be injected here
    return (textDataReturn = textDescriptionArray.join(""));
  },
  checkRTFType: function (item) {
    //console.log(item.type);
    var tagValue = "";
    if (item.type == "paragraph") {
      tagValue = "p>";
    } else if (item.type == "numbered-list") {
      tagValue = "ol>";
    } else if (item.type == "bulleted-list") {
      tagValue = "ul>";
    } else if (item.type == "list-item") {
      tagValue = "li>";
    } else {
      tagValue = "span>";
    }
    return tagValue;
  },
  checkRTFStyleStart: function (item) {
    //console.log("------------- item");
    //console.log("item: ", item);
    var tagValue = [];
    
    var subText = Object.prototype.hasOwnProperty.call(item, "subscript");
    var boldText = Object.prototype.hasOwnProperty.call(item, "bold");
    var italicText = Object.prototype.hasOwnProperty.call(item, "italic");
    var underlineText = Object.prototype.hasOwnProperty.call(item, "underline");
    var listedText = Object.prototype.hasOwnProperty.call(item, "list-item");

    //console.log("test boldText",boldText);

   
    if (boldText) {
      tagValue.push("<b>");
    }
    if (italicText) {
      tagValue.push("<i>");
    }
    if (underlineText) {
      tagValue.push("<u>");
    }
    if (subText) {
      tagValue.push("<sub>");
    }
    if (listedText) {
      tagValue.push("<li>");
    }

    // console.log("tagValue: "+tagValue);
    return tagValue.join("");
  },
  checkRTFStyleEnd: function (item) {
    //console.log(item);
    var tagValue = [];

    var subText = Object.prototype.hasOwnProperty.call(item, "subscript");
    var boldText = Object.prototype.hasOwnProperty.call(item, "bold");
    var italicText = Object.prototype.hasOwnProperty.call(item, "italic");
    var underlineText = Object.prototype.hasOwnProperty.call(item, "underline");
    var listedText = Object.prototype.hasOwnProperty.call(item, "list-item");

   
    if (boldText) {
      tagValue.unshift("</b>");
    }
    if (italicText) {
      tagValue.unshift("</i>");
    }
    if (underlineText) {
      tagValue.unshift("</u>");
    }
    if (subText) {
      tagValue.unshift("</sub>");
    }
    if (listedText) {
      tagValue.unshift("</li>");
    }

    return tagValue.join("");
  },
};
