export default class Messages {
  constructor(ui) {
    this.$msgList = ui.find(".content_msg-list");
    this.$mainCheckbox = ui.find("#main_checkbox");

    this.initEvents();
  }

  initEvents () {
    this.$msgList.on("click", this.messageActions.bind(this));
    this.$mainCheckbox.on("change", this.selectAllMessages.bind(this));
  }

  messageActions (e) {
    let eTarget = $(e.target);

    if (!eTarget.hasClass("content_msg-checkbox")) {
      e.preventDefault();
    }
    if(eTarget.hasClass("open-link")) {
      this.openMsgText(eTarget);
    }
    if (eTarget.hasClass("remove")) {
      this.iconTrashAction(eTarget);
    }
    if(eTarget.hasClass("star")) {
      this.starMsg(eTarget);
    }
  }

  openMsgText (currentOpenIcon) {
    let currentMsg = currentOpenIcon.closest(".content_msg-item");

    currentOpenIcon.toggleClass("open closed")
                    .text(currentOpenIcon.text() === "open" ? "close" : "open")
                    .prop("title", currentOpenIcon.prop("title") === "open" ? "close" : "open");
    currentMsg.find(".content_msg-text").stop(true, true).slideToggle();
  }

  iconTrashAction (currentTrashIcon) {
    let currentMsgId = currentTrashIcon.closest(".content_msg-item").data("id");

    currentTrashIcon.closest(".content_msg-item").remove();

    if (this.$msgList.hasClass("draft")) {
      this.removeWithIconTrash("draftList", currentMsgId);
    }

    else if (this.$msgList.hasClass("deleted")) {
      this.removeWithIconTrash("deleteMsgIdList", currentMsgId);
    }

    else {
      this.moveMessage("deleteMsgIdList", currentMsgId);
      this.removeWithIconTrash("inboxList", currentMsgId);
      this.removeWithIconTrash("starMsgIdList", currentMsgId);
    }
  }

  removeWithIconTrash (storage, msgId) {
    let newArr = JSON.parse(localStorage[storage]).filter((item) => {
      let condition = this.$msgList.hasClass("draft") || this.$msgList.hasClass("inbox") ? item.id : item;

      if(msgId === condition) {
        return false;
      }
      return true;
    });

    if (newArr.length === 0) {
      localStorage.removeItem(storage);
    }
    else {
      localStorage[storage] = JSON.stringify(newArr);
    }
  }

  starMsg (currentStarIcon) {
    let currentMsg = currentStarIcon.closest(".content_msg-item");
    let currentMsgId = currentMsg.data("id");
    let starArr = JSON.parse(localStorage.starMsgIdList);

    if (!currentStarIcon.hasClass("checked")) {
      currentStarIcon.addClass("checked");
      this.moveMessage("starMsgIdList", currentMsgId);
    }
    else {
      let newStarArr = starArr.filter((id) => {
        if (id === currentMsgId) {
          return false;
        }
        return true;
      });

      currentMsg.find("a.star").removeClass("checked");
      localStorage.starMsgIdList = JSON.stringify(newStarArr);

      if (this.$msgList.hasClass("starred")) {
        currentMsg.remove();
      }
    }
  }

  moveMessage (storage, msgId) {
    if(localStorage[storage]) {
      let currentArray = JSON.parse(localStorage.getItem(storage));

      currentArray.push(msgId);
      localStorage[storage] = JSON.stringify(currentArray);
    }
    else {
      localStorage.setItem(storage, JSON.stringify([msgId]));
    }
  }

  selectAllMessages () {
    this.$msgList.find(".content_msg-checkbox").prop("checked", this.$mainCheckbox.is(":checked"));
  }
}
