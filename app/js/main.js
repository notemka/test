(() => {
  let app = {
    init: () => {
      app.setUpListeners();
    },

    setUpListeners: () => {
      $(window).on("load", app.showActiveMsgList);
      $(".message-list").on("click", app.openRemoveStarredMsg);
      $(".navigation-trigger-link").on("click", app.toggleMobileNavigation);
      $("#main_checkbox").on("change", app.selectAllMessages);
    },

    openRemoveStarredMsg: (e) => {
      let eTarget = $(e.target);
      let currentMsg = eTarget.closest(".message-item");
      let currentMsgId = currentMsg.data("id");
      let currentStoredge;

      if(eTarget.hasClass("message-open-link")) {
        e.preventDefault();

        eTarget.toggleClass("open closed");
        eTarget.text(eTarget.text() === "open" ? "close" : "open");
        eTarget.prop("title", eTarget.prop("title") === "open" ? "close" : "open");
        currentMsg.find(".message-text").stop(true, true).slideToggle();
      }
      if (eTarget.hasClass("remove")) {
        currentStoredge = "deleteMsgList";
        app.moveMessage(currentStoredge, currentMsgId);
        currentMsg.remove();
      }
      if(eTarget.hasClass("star") && !eTarget.hasClass("checked")) {
        currentStoredge = "starMsgList";
        eTarget.addClass("checked");
        app.moveMessage(currentStoredge, currentMsgId);
      }
    },

    moveMessage: (storadge, msgId) => {
      if(localStorage[storadge]) {
        let currentArray = JSON.parse(localStorage.getItem(storadge));

        // currentArray.filter((index, item) => {
        //   if(item !== msgId) {
        //     currentArray.push(msgId);
        //     localStorage[storadge] = JSON.stringify(currentArray);
        //   } else {
        //     return false;
        //   }
        // });
        currentArray.push(msgId);
        localStorage[storadge] = JSON.stringify(currentArray);
      }
      else {
        localStorage.setItem(storadge, JSON.stringify([msgId]));
      }
    },

    showActiveMsgList: () => {
      let msgList = $(".message-list");
      let storageList = [];

      if (msgList.hasClass("deleted")) {
        if(localStorage.deleteMsgList) {
          let allMsgsArray = JSON.parse(localStorage.allMsgList);
          let deletedMsgsIdArr = JSON.parse(localStorage.deleteMsgList);
          let inboxMsgsArray = [];
          let inbox = "inbox";

          inboxMsgsArray = allMsgsArray.filter((msg) => {
            if(deletedMsgsIdArr.indexOf(msg.id) > -1) {
              storageList.push(msg);
              return false;
            }
            return true;
          });
          app.checkLocalList(inbox, inboxMsgsArray);
        }
        else {
          app.showInfoMessage();
        }
      }
      if (msgList.hasClass("starred")) {
        if(localStorage.starMsgList) {
          let starMsgsIdArr = JSON.parse(localStorage.starMsgList);
          let inboxMsgsArray = JSON.parse(localStorage.inbox);

          inboxMsgsArray = inboxMsgsArray.filter((msg) => {
            if(starMsgsIdArr.indexOf(msg.id) > -1) {
              storageList.push(msg);
              return false;
            }
            return true;
          });
        }
        else {
          app.showInfoMessage();
        }
      }
      if (msgList.hasClass("inbox")) {
        if(!localStorage.inbox) {
          $.getJSON("json/data.json", (data) => {
            localStorage.allMsgList = JSON.stringify(data);
          });
          storageList = JSON.parse(localStorage.allMsgList);
        }
        else {
          app.openCurrentMsgList(JSON.parse(localStorage.inbox));
        }
      }
      app.openCurrentMsgList(storageList);
    },

    showInfoMessage: () => {
      $(".tabs-content-msg").removeClass("hidden");
    },

    openCurrentMsgList: (storage) => {
      $.each(storage, (index, item) => {
        $(".message-list").append(`
          <li class='message-item' data-id='${item.id}'>
            <div class='message'><input type='checkbox' class='message-checkbox'>
              <div class='message-title'>${item.title}</div>
              <div class='message-actions'>
                <a href='#' title='open' class='message-link message-open-link open'>open</a>
                <a href='#' title='delete' class='message-link remove'>remove</a>
                <a href='#' title='like' class='message-link star'>like</a>
              </div>
            </div>
            <div class='message-text hidden'>${item.text}</div>
          </li>`);
        });
    },

    checkLocalList: (storagelist, idArr) => {
      if (!localStorage.storagelist) {
        localStorage.setItem(storagelist, JSON.stringify(idArr));
      }
      else {
        localStorage.storagelist = JSON.stringify(idArr);
      }
    },

    toggleMobileNavigation: (e) => {
      e.preventDefault();

      $(".tabs").stop(true, true).slideToggle();
    },

    selectAllMessages: () => {
      let checkboxes = $(".message-checkbox"),
        mainCheckbox = $("#main_checkbox");

      checkboxes.prop("checked", mainCheckbox.is(":checked"));
    }
  };
  app.init();
})();
