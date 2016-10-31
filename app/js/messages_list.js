class MessagesList {
  constructor(ui) {
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
    let deleteMsgIdList = "deleteMsgIdList";
    let starMsgIdList = "starMsgIdList";

    if (this.$msgList.hasClass("deleted")) {
      this.loadMsgList(deleteMsgIdList);
    }

    if (this.$msgList.hasClass("starred")) {
      this.loadMsgList(starMsgIdList);
    }

    if (this.$msgList.hasClass("draft") && localStorage.draftList) {
      this.renderMsgList(JSON.parse(localStorage.draftList));
    }

    if (this.$msgList.hasClass("inbox")) {
      this.renderMsgList(JSON.parse(localStorage.inboxList));
    }
    this.toggleInfoMessage();
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

  toggleInfoMessage () {
    if (this.$msgList.html() === "") {
      this.$listInfoMsg.removeClass("hidden");
    }
    else {
      this.$listInfoMsg.addClass("hidden");
    }
  }

  renderMsgList (storage) {
    $.each(storage, (index, item) => {
        this.msgTemplate(item);
    });
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
}

export default MessagesList;
