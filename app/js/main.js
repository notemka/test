(() => {
  let app = {
    init: () => {
      app.setUpListeners();
    },

    setUpListeners: () => {
      $(window).on("load", app.showActiveMsgList);
      $(window).on("resize", app.showNavigation);
      $(".content_msg-list").on("click", app.openRemoveStarredMsg);
      $(".header-nav-trigger").on("click", app.toggleMobileNavigation);
      $("#main_checkbox").on("change", app.selectAllMessages);
      $(".nav").on("click", app.checkActiveTab);
    },

    checkActiveTab: (e) => {
      e.preventDefault();

      let currentLink = $(e.target);
      let url = currentLink.attr("href");
      let msgList = $(".content_msg-list");

      currentLink.addClass("active").siblings().removeClass("active");
      app.clearMsgList();

      if (url !== "/") {
        msgList.toggleClass(`${msgList.attr("class")} content_msg-list ${url.slice(1)}`);
      }
      else {
        msgList.toggleClass(`${msgList.attr("class")} content_msg-list inbox`);
      }
      app.showActiveMsgList();
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
        currentStorage = "deleteMsgList";
        app.moveMessage(currentStorage, currentMsgId);
        currentMsg.remove();
      }
      if(eTarget.hasClass("star") && !eTarget.hasClass("checked")) {
        currentStorage = "starMsgList";
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

    showActiveMsgList: () => {
      let msgList = $(".content_msg-list");
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

    clearMsgList: () => {
      $(".content_msg-list").html("")
    },

    showInfoMessage: () => {
      $(".content_info-msg").removeClass("hidden");
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

    checkLocalList: (storageList, idArr) => {
      if (!localStorage.storageList) {
        localStorage.setItem(storageList, JSON.stringify(idArr));
      }
      else {
        localStorage.storageList = JSON.stringify(idArr);
      }
    },

    toggleMobileNavigation: (e) => {
      e.preventDefault();

      let nav = $(".nav");

      nav.stop(true, true).slideToggle();
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
    }
  };
  app.init();
})();
