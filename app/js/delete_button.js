export default class DeleteButton {
  constructor(ui) {
    this.$msgList = ui.find(".content_msg-list");
    this.$deleteMsgButton = ui.find("#button_delete");

    this.initEvents();
  }

  initEvents () {
    this.$deleteMsgButton.on("click", this.removeCheckedMsgs.bind(this));
  }

  removeCheckedMsgs (e) {
    e.preventDefault();

    let checkboxes = this.$msgList.find(".content_msg-checkbox");
    let checkedMsgIdArr = [];

    if (checkboxes.is(":checked")) {
      $.each(checkboxes, (index, checkbox) => {
        if ($(checkbox).is(":checked")) {
          checkedMsgIdArr.push($(checkbox).closest(".content_msg-item").data("id"));
          $(checkbox).closest(".content_msg-item").remove();
        };
      });

      this.removeMsgs(checkedMsgIdArr);
    }
  }

  removeMsgs (checkedMsgIdArr) {
    if (this.$msgList.hasClass("inbox") || this.$msgList.hasClass("starred")) {
      this.filterCheckedMsgs("inboxList", checkedMsgIdArr);
      this.filterCheckedMsgs("starMsgIdList", checkedMsgIdArr);
      this.moveToDeleted(checkedMsgIdArr);
    }
    else if (this.$msgList.hasClass("draft")) {
      this.filterCheckedMsgs("draftList", checkedMsgIdArr);
    }
    else {
      this.filterCheckedMsgs("deleteMsgIdList", checkedMsgIdArr);
    }
  }

  moveToDeleted (checkedMsgIdArr) {
    if (localStorage.deleteMsgIdList) {
      localStorage.deleteMsgIdList = JSON.stringify(JSON.parse(localStorage.deleteMsgIdList).concat(checkedMsgIdArr));
    }
    else {
      localStorage.setItem("deleteMsgIdList", JSON.stringify(checkedMsgIdArr));
    }
  }

  filterCheckedMsgs (storage, checkedMsgsArr) {
    let newArr = JSON.parse(localStorage[storage]).filter((item) => {
      let condition = this.$msgList.hasClass("draft") || this.$msgList.hasClass("inbox") ? item.id : item;

      if(checkedMsgsArr.indexOf(condition) > -1) {
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
}
