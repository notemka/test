class App {
  constructor(ui) {
    this.$nav = ui.find(".nav");
    this.$navigationTrigger = ui.find(".header-nav-trigger");
    this.$msgList = ui.find(".content_msg-list");
    this.$listInfoMsg = ui.find(".content_info-msg");
    this.$mainCheckbox = ui.find("#main_checkbox");
    this.$msgCheckboxes = ui.find(".content_msg-checkbox");
    this.$newMsgButton = ui.find("#button_new");
    this.$newMsgCloseLink = ui.find(".new-msg_link");
    this.$newMsgForm = ui.find(".new-msg_form");
    this.$newMsgFields = ui.find(".new-msg_field");
    this.$newMsgInput = ui.find("input.new-msg_field");
    this.$newMsgTextarea = ui.find("textarea.new-msg_field");
    this.$newMsgInfo = ui.find(".new-msg_info");
    this.$deleteMsgButton = ui.find("#button_delete");

    this.initEvents();
  }

  initEvents () {
    $(window).on("load", this.createLocalList.bind(this));
    $(window).on("resize", this.showNavigation.bind(this));
    this.$navigationTrigger.on("click", this.toggleMobileNavigation.bind(this));
    this.$nav.on("click", this.selectActiveNavLink.bind(this));
    this.$msgList.on("click", this.messageActions.bind(this));
    this.$mainCheckbox.on("change", this.selectAllMessages.bind(this));
    this.$deleteMsgButton.on("click", this.removeCheckedMsgs.bind(this));
    this.$newMsgButton.on("click", this.slideToggleMsgForm.bind(this));
    this.$newMsgCloseLink.on("click", this.slideToggleMsgForm.bind(this));
    this.$newMsgForm.on("submit", this.saveNewMsg.bind(this));
    this.$newMsgFields.on("input", this.removeErrorClass.bind(this));
  }

  // Navigation
  toggleMobileNavigation (e) {
    e.preventDefault();

    this.$nav.stop(true, true).slideToggle();
  }

  showNavigation () {
    if (window.innerWidth > 480) {
      this.$nav.removeAttr("style");
    }
  }

  selectActiveNavLink (e) {
    e.preventDefault();

    let currentLink = $(e.target);
    let url = currentLink.attr("href");

    currentLink.addClass("active").siblings().removeClass("active");
    this.clearMsgList();

    if (window.innerWidth <= 480) {
      this.toggleMobileNavigation(e);
    }

    if (url !== "/") {
      this.$msgList.toggleClass(`${this.$msgList.attr("class")} content_msg-list ${url.slice(1)}`);
    }
    else {
      this.$msgList.toggleClass(`${this.$msgList.attr("class")} content_msg-list inbox`);
    }
    this.showActiveMsgList();
  }

  clearMsgList () {
    this.$msgList.html("");
  }

  // Load message lists
  createLocalList () {
    if (!localStorage.inboxList) {
      $.getJSON("data.json", (data) => {
        localStorage.setItem("inboxList", JSON.stringify(data));
        localStorage.setItem("allMessagesList", JSON.stringify(data));
      });
    }
    this.openCurrentMsgList(JSON.parse(localStorage.inboxList));
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
      this.openCurrentMsgList(JSON.parse(localStorage.draftList));
    }

    if (this.$msgList.hasClass("inbox")) {
      this.openCurrentMsgList(JSON.parse(localStorage.inboxList));
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

      this.openCurrentMsgList(filteredList);
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

  openCurrentMsgList (storage) {
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

  // Message buttons' actions
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

    currentOpenIcon.toggleClass("open closed");
    currentOpenIcon.text(currentOpenIcon.text() === "open" ? "close" : "open");
    currentOpenIcon.prop("title", currentOpenIcon.prop("title") === "open" ? "close" : "open");
    currentMsg.find(".content_msg-text").stop(true, true).slideToggle();
  }

  iconTrashAction (currentTrashIcon) {
    let currentMsgId = currentTrashIcon.closest(".content_msg-item").data("id");

    currentTrashIcon.closest(".content_msg-item").remove();

    if (this.$msgList.hasClass("inbox") || this.$msgList.hasClass("starred")) {
      this.removeWithIconTrash("inboxList", currentMsgId);
      this.removeWithIconTrash("starMsgIdList", currentMsgId);
      this.moveMessage("deleteMsgIdList", currentMsgId);
    }

    if (this.$msgList.hasClass("draft")) {
      this.removeWithIconTrash("draftList", currentMsgId);
    }

    else if (this.$msgList.hasClass("deleted")) {
      this.removeWithIconTrash("deleteMsgIdList", currentMsgId);
    }
  }

  removeWithIconTrash (storage, msgId) {
    let newArr = JSON.parse(localStorage[storage]).filter((item) => {
      let condition = storage === "draftList" || storage === "inboxList" ? item.id : item;

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
    let currentMsgId = currentStarIcon.closest(".content_msg-item").data("id");

    if (!currentStarIcon.hasClass("checked")) {
      currentStarIcon.addClass("checked");
      this.moveMessage("starMsgIdList", currentMsgId);
    }
    else {}
  }

  moveMessage (storage, msgId) {
    if(localStorage[storage]) {
      let currentArray = JSON.parse(localStorage.getItem(storage));

      // currentArray.filter((index, item) => {
      //   if(item !== msgId) {
      //     currentArray.push(msgId);
      //     localStorage[storage] = JSON.stringify(currentArray);
      //   } else {
      //     return false;
      //   }
      // });
      currentArray.push(msgId);
      localStorage[storage] = JSON.stringify(currentArray);
    }
    else {
      localStorage.setItem(storage, JSON.stringify([msgId]));
    }
  }

  // Main checkbox action
  selectAllMessages () {
    this.$msgList.find(".content_msg-checkbox").prop("checked", this.$mainCheckbox.is(":checked"));
  }

  // Remove checked messages
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
      let condition = storage === "inboxList" || storage === "draftList" ? item.id : item;

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

  // "New message" form actions
  slideToggleMsgForm (e) {
    e.preventDefault();

    this.$newMsgButton.toggleClass("disable");

    this.$newMsgForm.slideToggle();
    this.$newMsgFields.removeClass("error-field");
  }

  saveNewMsg (e) {
    e.preventDefault();

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
    this.msgTemplate(newDraftMsg);
    this.toggleInfoMessage();
    this.clearForm();
    this.showSaveMsg();
    draftMsgArr = [];
    newDraftMsg = {};
  }

  clearForm () {
    this.$newMsgFields.val("");
  }

  showSaveMsg () {
    this.$newMsgInfo.addClass("active")
    setTimeout(() => this.$newMsgInfo.removeClass("active"), 3000);
  }

  checkFields () {
    $.each(this.$newMsgFields, (index, field) => {
      if (!$(field).val()) {
        $(field).focus().addClass("error-field");
      }
    });
  }

  removeErrorClass (e) {
    let currentField = $(e.target)
    if (currentField.hasClass("error-field")) {
      currentField.removeClass("error-field");
    }
  }
};

(() => {
  let app = new App($(".wrapper"));
})();
