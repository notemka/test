export default class MessagesList {
  constructor(ui) {
    this.$nav = ui.find(".nav");
    this.$msgList = ui.find(".content_msg-list");
    this.$listInfoMsg = ui.find(".content_info-msg");

    this.initEvents();
  }

  initEvents () {
    $(window).on("load", this.createLocalList.bind(this));
  }

  createLocalList () {
    if (!localStorage.inboxList) {
      $.getJSON("data.json", (data) => {
        localStorage.setItem("inboxList", JSON.stringify(data));
        localStorage.setItem("allMessagesList", JSON.stringify(data));
      });
    }
    this.renderMsgList(JSON.parse(localStorage.inboxList));
  }

  showActiveMsgList () {
    let deletedStorage = "deleteMsgIdList";
    let starredStorage = "starMsgIdList";

    this.$msgList.html("");

    if (this.$msgList.hasClass("deleted")) {
      this.loadMsgList(deletedStorage);
      this.checkActiveTab("deleted");
    }

    if (this.$msgList.hasClass("starred")) {
      this.loadMsgList(starredStorage);
      this.checkActiveTab("starred");
    }

    if (this.$msgList.hasClass("draft") && localStorage.draftList) {
      this.renderMsgList(JSON.parse(localStorage.draftList));
      this.checkActiveTab("draft");
    }

    if (this.$msgList.hasClass("inbox")) {
      this.renderMsgList(JSON.parse(localStorage.inboxList));
      this.checkActiveTab("inbox");
    }
    this.toggleInfoMessage();
  }

  checkActiveTab(listName) {
    this.$nav.find(`[data-list=${listName}]`).addClass("active").siblings().removeClass("active");
  }

  loadMsgList (checkedMsgIdList) {
    let filteredList = [];

    if(localStorage[checkedMsgIdList]) {
      let checkedMsgIdArr = JSON.parse(localStorage[checkedMsgIdList]);
      let mainArray = JSON.parse(localStorage.allMessagesList);

      let newMainArray = mainArray.filter((msg) => {
        if(checkedMsgIdArr.indexOf(msg.id) > -1) {
          filteredList.push(msg);
          return false;
        }
        return true;
      });

      if (checkedMsgIdList == "deleteMsgIdList") {
        localStorage.inboxList = JSON.stringify(newMainArray);
      }

      this.renderMsgList(filteredList);
    }
  }

  renderMsgList (storageArr) {
    storageArr.forEach((item) => {
      this.msgTemplate(item);
    });

    if (this.$msgList.hasClass("inbox") || this.$msgList.hasClass("starred") && localStorage.starMsgIdList) {
      let starArr = JSON.parse(localStorage.starMsgIdList);
      let inboxMsgs = this.$msgList.find(".content_msg-item");

      $.each(inboxMsgs, (index, msg) => {
        for(let i of starArr) {
          if (i === $(msg).data("id")) {
            $(msg).find("a.star").addClass("checked");
          }
        }
      });
    }
  }

  msgTemplate (msg) {
    this.$msgList.append(`
      <li class="content_msg-item" data-id="${msg.id}">
        <div class="content_msg-inner">
          <input type="checkbox" class="content_msg-checkbox">
          <div class="content_msg-title">${msg.title}</div>

          <div class="content_msg-actions">
            <a href="#" title="open" class="content_msg-link open-link open">open</a>
            <a href="#" title="delete" class="content_msg-link remove">remove</a>
            <a href="#" title="like" class="content_msg-link star">like</a>
          </div>
        </div>
        <div class="content_msg-text hidden">${msg.text}</div>
      </li>`);
  }

  toggleInfoMessage () {
    if (this.$msgList.html() === "") {
      this.$listInfoMsg.removeClass("hidden");
    }
    else {
      this.$listInfoMsg.addClass("hidden");
    }
  }
}
