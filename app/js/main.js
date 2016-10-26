class App {
  constructor(ui) {
    this.$nav = ui.find(".nav");
    this.$navigationTrigger = ui.find(".header-nav-trigger");
    this.$msgList = ui.find(".content_msg-list");
    this.$listInfoMsg = ui.find(".content_info-msg");
    this.$mainCheckbox = ui.find("#main_checkbox");
    this.$msgCheckboxes = this.$msgList.find(".content_msg-checkbox");
    this.$newMsgButton = ui.find("#button_new");
    this.$newMsgCloseLink = ui.find(".new-msg_link");
    this.$newMsgForm = ui.find(".new-msg_form");
    this.$newMsgFields = ui.find(".new-msg_field");
    this.$newMsgInput = ui.find("input.new-msg_field");
    this.$newMsgTextarea = ui.find("textarea.new-msg_field");
    this.$deleteMsgButton = ui.find("#button_delete");

    this.initEvents();
  }

  initEvents () {
    $(window).on("load", this.createLocalList.bind(this));
    $(window).on("resize", this.showNavigation.bind(this));
    this.$navigationTrigger.on("click", this.toggleMobileNavigation.bind(this));
    this.$nav.on("click", this.selectActiveNavLink.bind(this));
    this.$msgList.on("click", this.openRemoveStarredMsg.bind(this));
    this.$mainCheckbox.on("change", this.selectAllMessages.bind(this));
    this.$deleteMsgButton.on("click", this.removeCheckedMsgs.bind(this));
    this.$newMsgButton.on("click", this.slideToggleMsgForm.bind(this));
    this.$newMsgCloseLink.on("click", this.slideToggleMsgForm.bind(this));
    this.$newMsgForm.on("submit", this.saveNewMsg.bind(this));
    this.$newMsgFields.on("input", this.removeErrorClass.bind(this));
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

  openRemoveStarredMsg (e) {
    let eTarget = $(e.target);
    let currentMsg = eTarget.closest(".content_msg-item");
    let currentMsgId = currentMsg.data("id");
    let currentStorage;

    if(eTarget.hasClass("open-link")) {
      e.preventDefault();
      eTarget.toggleClass("open closed");
      eTarget.text(eTarget.text() === "open" ? "close" : "open");
      eTarget.prop("title", eTarget.prop("title") === "open" ? "close" : "open");
      currentMsg.find(".content_msg-text").stop(true, true).slideToggle();
    }
    if (eTarget.hasClass("remove")) {
      e.preventDefault();
      currentStorage = "deleteMsgIdList";
      this.moveMessage(currentStorage, currentMsgId);
      currentMsg.remove();
    }
    if(eTarget.hasClass("star") && !eTarget.hasClass("checked")) {
      e.preventDefault();
      currentStorage = "starMsgIdList";
      eTarget.addClass("checked");
      this.moveMessage(currentStorage, currentMsgId);
    }
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

    if (this.$msgList.hasClass("draft")) {
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
      this.$msgList.append(`
        <li class="content_msg-item" data-id="${item.id}">
          <div class="content_msg-inner">
            <input type="checkbox" class="content_msg-checkbox">
            <div class="content_msg-title">${item.title}</div>

            <div class="content_msg-actions">
              <a href="#" title="open" class="content_msg-link open-link open">open</a>
              <a href="#" title="delete" class="content_msg-link remove">remove</a>
              <a href="#" title="like" class="content_msg-link star">like</a>
            </div>
          </div>
          <div class="content_msg-text hidden">${item.text}</div>
        </li>`);
      });
  }

  toggleMobileNavigation (e) {
    e.preventDefault();

    this.$nav.stop(true, true).slideToggle();
  }

  showNavigation () {
    if (window.innerWidth > 480) {
      this.$nav.removeAttr("style");
    }
  }

  selectAllMessages () {
    $(".content_msg-checkbox").prop("checked", this.$mainCheckbox.is(":checked"));
  }

  removeCheckedMsgs (e) {
    e.preventDefault();

    let checkboxes = this.$msgList.find(".content_msg-checkbox");
    let deletedList = JSON.parse(localStorage.deleteMsgIdList);
    let filteredList = [];
    let checkedMsgIdArr = [],
    currentList;

    if (this.$msgList.hasClass("inbox") || this.$msgList.hasClass("starred")) {
      currentList = "inboxList";
    }
    if (this.$msgList.hasClass("draft")) {
      currentList = "draftList";
    }
    else {
      currentList = "deleteMsgIdList";
    }

    if (checkboxes.is(":checked")) {
      if (currentList != "deleteMsgIdList" && currentList != "draftList") {
        $.each(checkboxes, (index, checkbox) => {
          if ($(checkbox).is(":checked")) {
            checkedMsgIdArr.push($(checkbox).closest(".content_msg-item").data("id"));
            $(checkbox).closest(".content_msg-item").remove();
          };
        });

        let newArr = JSON.parse(localStorage[currentList]).filter((msg) => {
          if(checkedMsgIdArr.indexOf(msg.id) > -1) {
            filteredList.push(msg.id);
            return false;
          }
          return true;
        });
        console.log(filteredList);
        localStorage[currentList] = JSON.stringify(newArr);
        localStorage.deleteMsgIdList = JSON.stringify(deletedList.concat(filteredList));
      }
      else {
        console.log("This is deleted list");
      }
    }
  }

  slideToggleMsgForm (e) {
    e.preventDefault();

    this.$newMsgButton.toggleClass("disable");

    this.$newMsgForm.slideToggle();
    this.$newMsgFields.removeClass("error-field");
  }

  saveNewMsg (e) {
    e.preventDefault();

    let draftMsgArr = [];
    let draftMsgItem = {};
    let counter;

    draftMsgItem.title = this.$newMsgInput.val();
    draftMsgItem.text = this.$newMsgTextarea.val();

    if (localStorage.draftList) {
      counter = JSON.parse(localStorage.draftList)[0].id + 1;
      draftMsgItem.id = counter++;

      draftMsgArr = JSON.parse(localStorage.draftList);
      draftMsgArr.push(draftMsgItem);

      localStorage.draftList = JSON.stringify(draftMsgArr);
    }
    else {
      draftMsgItem.id = JSON.parse(localStorage.allMessagesList).length + 1;
      draftMsgArr.push(draftMsgItem);
      localStorage.setItem("draftList", JSON.stringify(draftMsgArr));
    }
    draftMsgArr = [];
    draftMsgItem = {};
    this.clearForm();
  }

  clearForm () {
    this.$newMsgFields.val("");
  }

  checkFields () {
    $.each(this.$newMsgFields, (index, field) => {
      if (!$(field).val()) {
        $(field).focus().addClass("error-field");
      }
      else {
        $(field).attr("data-value", $(field).val());
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
