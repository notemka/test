import MessagesList from "./messages_list";

export default class NewMessageForm {
  constructor(ui) {
    this.$wrapper = ui;
    this.$msgList = ui.find(".content_msg-list");
    this.$newMsgButton = ui.find("#button_new");
    this.$newMsgForm = ui.find(".new-msg_form");
    this.$newMsgCloseLink = ui.find(".new-msg_link");
    this.$newMsgFields = ui.find(".new-msg_field");
    this.$newMsgInput = ui.find("input.new-msg_field");
    this.$newMsgTextarea = ui.find("textarea.new-msg_field");
    this.$newMsgInfo = ui.find(".new-msg_info");

    this.initEvents();
  }

  initEvents () {
    this.$newMsgButton.on("click", this.slideToggleMsgForm.bind(this));
    this.$newMsgCloseLink.on("click", this.slideToggleMsgForm.bind(this));
    this.$newMsgFields.on("invalid", this.checkFields.bind(this));
    this.$newMsgFields.on("input", this.removeErrorClass.bind(this));
    this.$newMsgForm.on("submit", this.saveNewMsg.bind(this));
  }

  slideToggleMsgForm (e) {
    e.preventDefault();

    this.$newMsgButton.toggleClass("disable");

    this.$newMsgForm.slideToggle();
    this.$newMsgFields.removeClass("error-field");
  }

  checkFields (e) {
    $(e.target).addClass("error-field");
  }

  removeErrorClass (e) {
    let currentField = $(e.target)
    if (currentField.hasClass("error-field")) {
      currentField.removeClass("error-field");
    }
  }

  saveNewMsg (e) {
    e.preventDefault();

    let messagesListModule = new MessagesList(this.$wrapper);
    let draftMsgArr = [];
    let newDraftMsg = {};
    let counter;

    newDraftMsg.title = this.$newMsgInput.val();
    newDraftMsg.text = this.$newMsgTextarea.val();

    if (localStorage.draftList) {
      counter = JSON.parse(localStorage.draftList)[0].id + 1;
      newDraftMsg.id = counter++;

      draftMsgArr = JSON.parse(localStorage.draftList);
      draftMsgArr.push(newDraftMsg);
      localStorage.draftList = JSON.stringify(draftMsgArr);
    }
    else {
      newDraftMsg.id = JSON.parse(localStorage.allMessagesList).length + 1;
      draftMsgArr.push(newDraftMsg);
      localStorage.setItem("draftList", JSON.stringify(draftMsgArr));
    }

    if (this.$msgList.hasClass("draft")) {
      messagesListModule.msgTemplate(newDraftMsg);
    }

    messagesListModule.toggleInfoMessage();
    this.clearForm();
    this.showSaveMsg();
    draftMsgArr = [];
    newDraftMsg = {};
  }

  clearForm () {
    this.$newMsgFields.val("");
  }

  showSaveMsg () {
    this.$newMsgInfo.addClass("active");
    setTimeout(() => this.$newMsgInfo.removeClass("active"), 3000);
  }
}
