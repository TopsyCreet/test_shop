var xrMsgSessionID;
var xureal360MSG = {
    init: function () {
        this._log("xrMSG - initiated");
        this._genSession();
    },
    onEventUpdate: function (_name,_message,_action,_points) {
        var _this = this;
                var urlParams = new URLSearchParams(window.location.search);
                var _appname;
                if (urlParams.has('name')) {
                    _appname = urlParams.get('name');
                } else {
                    _appname = _name;
                }
                var roundedScore = Math.round(_points);
                var eventData = {name:_appname, message:_message, action:_action, points:roundedScore, session:xrMsgSessionID};
                this._log("EVENT UPDATE: "+eventData.name +" / "+eventData.message+" / "+eventData.action+" / "+eventData.points);
                window.parent.postMessage(eventData, '*');
                this._contentCheck(eventData);
    },
    onEventClose: function (_name,_message,_action,_points) {
        const jsonObj = {
            "platform": "xureal-360-viewer",
            "action": "close-360-iframe",
            "data": ""
          };
        const jsonMessageData = JSON.stringify(jsonObj);
        window.top.postMessage(jsonMessageData, '*');
        console.log("jsonMessageData",jsonMessageData);
    },
    _genSession: function () {
        var sNum = Math.random();
        sNum.toString(36);
        var sID = sNum.toString(36).substr(2, 9);
        sID.length >= 9;
        this._log("xrmsg - sessionID: " + sID);
        xrMsgSessionID = sID;
    },
    _log: function (lval) {
        console.log(lval);
    },
    _contentCheck: function (eData) {
        var currentContentURL = window.location.href;
        console.log(currentContentURL);
        localStorage.setItem("content-"+currentContentURL, eData.points);
        const contentData = localStorage.getItem("content-"+currentContentURL);
        console.log(contentData);

    },
};
