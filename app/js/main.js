(() => {
  let app = {
    init: () => {
      app.setUpListeners();
    },

    setUpListeners: () => {
      $(window).on("load", app.createLocalList);
      $(window).on("resize", app.showNavigation);
      $(".content_msg-list").on("click", app.openRemoveStarredMsg);
      $(".header-nav-trigger").on("click", app.toggleMobileNavigation);
      $("#main_checkbox").on("change", app.selectAllMessages);
      $(".nav").on("click", app.selectActiveNavLink);
      $("#button_new").on("click", app.slideToggleMsgForm);
      $("#button_delete").on("click", app.removeCheckedMsgs);
      $(".new-msg_link").on("click", app.slideToggleMsgForm);
      $(".new-msg_form").on("submit", app.saveNewMsg);
      $(".new-msg_field").on("input", app.removeErrorClass);
    },

    selectActiveNavLink: (e) => {
      e.preventDefault();

      let currentLink = $(e.target);
      let url = currentLink.attr("href");
      let msgList = $(".content_msg-list");
      let newMsgForm = $(".new-msg_form");

      currentLink.addClass("active").siblings().removeClass("active");
      app.clearMsgList();

      if (window.innerWidth <= 480) {
        app.toggleMobileNavigation(e);
      }

      if (url !== "/") {
        msgList.toggleClass(`${msgList.attr("class")} content_msg-list ${url.slice(1)}`);
      }
      else {
        msgList.toggleClass(`${msgList.attr("class")} content_msg-list inbox`);
      }
      app.showActiveMsgList(msgList);
    },

    clearMsgList: () => {
      $(".content_msg-list").html("")
    },

    openRemoveStarredMsg: (e) => {
      let eTarget = $(e.target);
      let currentMsg = eTarget.closest(".content_msg-item");
      let currentMsgId = currentMsg.data("id");
      let currentStorage;

      e.preventDefault();

      if(eTarget.hasClass("open-link")) {
        eTarget.toggleClass("open closed");
        eTarget.text(eTarget.text() === "open" ? "close" : "open");
        eTarget.prop("title", eTarget.prop("title") === "open" ? "close" : "open");
        currentMsg.find(".content_msg-text").stop(true, true).slideToggle();
      }
      if (eTarget.hasClass("remove")) {
        currentStorage = "deleteMsgIdList";
        app.moveMessage(currentStorage, currentMsgId);
        currentMsg.remove();
      }
      if(eTarget.hasClass("star") && !eTarget.hasClass("checked")) {
        currentStorage = "starMsgIdList";
        eTarget.addClass("checked");
        app.moveMessage(currentStorage, currentMsgId);
      }
    },

    moveMessage: (storage, msgId) => {
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
    },

    createLocalList: () => {
      if (!localStorage.inboxList) {
        $.getJSON("data.json", (data) => {
          localStorage.setItem("inboxList", JSON.stringify(data));
          localStorage.setItem("allMessagesList", JSON.stringify(data));
        });
      }
      app.openCurrentMsgList(JSON.parse(localStorage.inboxList));
    },

    showActiveMsgList: (msgList) => {
      let deleteMsgIdList = "deleteMsgIdList";
      let starMsgIdList = "starMsgIdList";

      if (msgList.hasClass("deleted")) {
        app.loadMsgList(deleteMsgIdList);
      }

      if (msgList.hasClass("starred")) {
        app.loadMsgList(starMsgIdList);
      }

      if (msgList.hasClass("draft")) {
        app.openCurrentMsgList(JSON.parse(localStorage.draftList));
      }

      if (msgList.hasClass("inbox")) {
        app.openCurrentMsgList(JSON.parse(localStorage.inboxList));
      }
      app.toggleInfoMessage();
    },

    loadMsgList: (checkedMsgIdList) => {
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

        app.openCurrentMsgList(filteredList);
      }
    },

    toggleInfoMessage: () => {
      let infoMsg = $(".content_info-msg");

      if ($(".content_msg-list").html() === "") {
        infoMsg.removeClass("hidden");
      }
      else {
        infoMsg.addClass("hidden");
      }
    },

    openCurrentMsgList: (storage) => {
      $.each(storage, (index, item) => {
        $(".content_msg-list").append(`
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
    },

    toggleMobileNavigation: (e) => {
      e.preventDefault();

      $(".nav").stop(true, true).slideToggle();
    },

    showNavigation: () => {
      if (window.innerWidth > 480) {
        $(".nav").removeAttr("style");
      }
    },

    selectAllMessages: () => {
      let checkboxes = $(".content_msg-checkbox"),
        mainCheckbox = $("#main_checkbox");

      checkboxes.prop("checked", mainCheckbox.is(":checked"));
    },

    removeCheckedMsgs: (e) => {
      e.preventDefault();

      let msgList = $(".content_msg-list");
      let checkedCheckboxes = msgList.find(".content_msg-checkbox").is(":checked");
      let checkedItems, filteredList, checkedMsgIdArr = [],
      currentList;

      if (msgList.hasClass("inbox") || msgList.hasClass("starred")) {
        currentList = "inboxList";
      }
      if (msgList.hasClass("draft")) {
        currentList = "draftList";
      }
      else {
        currentList = "deleteMsgIdList";
      }

      if (checkedCheckboxes) {
        console.log(currentList != "deleteMsgIdList");
        if (currentList != "deleteMsgIdList") {
          $.each(msgList.find(".content_msg-checkbox"), (index, checkbox) => {
            if ($(checkbox).is(":checked")) {
              // checkedItems.push($(checkbox).closest(".content_msg-item"));
              checkedMsgIdArr.push($(checkbox).closest(".content_msg-item").data("id"));
            };
          });

          let newArr = JSON.parse(localStorage[currentList]).filter((msg) => {
            if(checkedMsgIdArr.indexOf(msg.id) === -1) {
              filteredList.push(msg);
              return false;
            }
            return true;
          });
          localStorage[currentList] = JSON.stringify(newArr);
          localStorage.deleteMsgIdList = JSON.stringify(JSON.parse(localStorage.deleteMsgIdList).push(filteredList));
          checkedItems.remove();
        }
        else {
          console.log("This is deleted list");
        }
      }
    },

    slideToggleMsgForm: (e) => {
      e.preventDefault();

      $("#button_new").toggleClass("disable");

      $(".new-msg_form").slideToggle();
      $(".new-msg_field").removeClass("error-field");
    },

    saveNewMsg: (e) => {
      e.preventDefault();

      let draftMsgArr = [];
      let draftMsgItem = {};
      let counter;

      draftMsgItem.title = $("input.new-msg_field").val();
      draftMsgItem.text = $("textarea.new-msg_field").val();

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
      app.clearForm();
    },

    clearForm: () => {
      $(".new-msg_field").val("");
    },

    checkFields: () => {
      $.each($(".new-msg_field"), (index, field) => {
        if (!$(field).val()) {
          $(field).focus().addClass("error-field");
        }
        else {
          $(field).attr("data-value", $(field).val());
        }
      });
    },

    removeErrorClass: (e) => {
      let currentField = $(e.target)
      if (currentField.hasClass("error-field")) {
        currentField.removeClass("error-field");
      }
    }
  };
  app.init();
})();
