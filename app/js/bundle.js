(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

(function () {
  var app = {
    init: function init() {
      app.setUpListeners();
    },

    setUpListeners: function setUpListeners() {
      $(window).on("load", app.showActiveMsgList);
      $(window).on("resize", app.showNavigation);
      $(".content_msg-list").on("click", app.openRemoveStarredMsg);
      $(".header-nav-trigger").on("click", app.toggleMobileNavigation);
      $("#main_checkbox").on("change", app.selectAllMessages);
      $(".nav").on("click", app.checkActiveTab);
    },

    checkActiveTab: function checkActiveTab(e) {
      e.preventDefault();

      var currentLink = $(e.target);
      var url = currentLink.attr("href");
      var msgList = $(".content_msg-list");

      currentLink.addClass("active").siblings().removeClass("active");
      app.clearMsgList();

      if (url !== "/") {
        msgList.toggleClass(msgList.attr("class") + " content_msg-list " + url.slice(1));
      } else {
        msgList.toggleClass(msgList.attr("class") + " content_msg-list inbox");
      }
      app.showActiveMsgList();
    },

    openRemoveStarredMsg: function openRemoveStarredMsg(e) {
      var eTarget = $(e.target);
      var currentMsg = eTarget.closest(".content_msg-item");
      var currentMsgId = currentMsg.data("id");
      var currentStorage = void 0;

      e.preventDefault();

      if (eTarget.hasClass("open-link")) {
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
      if (eTarget.hasClass("star") && !eTarget.hasClass("checked")) {
        currentStorage = "starMsgList";
        eTarget.addClass("checked");
        app.moveMessage(currentStorage, currentMsgId);
      }
    },

    moveMessage: function moveMessage(storage, msgId) {
      if (localStorage[storage]) {
        var currentArray = JSON.parse(localStorage.getItem(storage));

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
      } else {
        localStorage.setItem(storage, JSON.stringify([msgId]));
      }
    },

    showActiveMsgList: function showActiveMsgList() {
      var msgList = $(".content_msg-list");
      var storageList = [];

      if (msgList.hasClass("deleted")) {
        if (localStorage.deleteMsgList) {
          (function () {
            var allMsgsArray = JSON.parse(localStorage.allMsgList);
            var deletedMsgsIdArr = JSON.parse(localStorage.deleteMsgList);
            var inboxMsgsArray = [];
            var inbox = "inbox";

            inboxMsgsArray = allMsgsArray.filter(function (msg) {
              if (deletedMsgsIdArr.indexOf(msg.id) > -1) {
                storageList.push(msg);
                return false;
              }
              return true;
            });
            app.checkLocalList(inbox, inboxMsgsArray);
          })();
        } else {
          app.showInfoMessage();
        }
      }
      if (msgList.hasClass("starred")) {
        if (localStorage.starMsgList) {
          (function () {
            var starMsgsIdArr = JSON.parse(localStorage.starMsgList);
            var inboxMsgsArray = JSON.parse(localStorage.inbox);

            inboxMsgsArray = inboxMsgsArray.filter(function (msg) {
              if (starMsgsIdArr.indexOf(msg.id) > -1) {
                storageList.push(msg);
                return false;
              }
              return true;
            });
          })();
        } else {
          app.showInfoMessage();
        }
      }
      if (msgList.hasClass("inbox")) {
        if (!localStorage.inbox) {
          $.getJSON("json/data.json", function (data) {
            localStorage.allMsgList = JSON.stringify(data);
          });
          storageList = JSON.parse(localStorage.allMsgList);
        } else {
          app.openCurrentMsgList(JSON.parse(localStorage.inbox));
        }
      }
      app.openCurrentMsgList(storageList);
    },

    clearMsgList: function clearMsgList() {
      $(".content_msg-list").html("");
    },

    showInfoMessage: function showInfoMessage() {
      $(".content_info-msg").removeClass("hidden");
    },

    openCurrentMsgList: function openCurrentMsgList(storage) {
      $.each(storage, function (index, item) {
        $(".content_msg-list").append("\n          <li class=\"content_msg-item\" data-id=\"" + item.id + "\">\n            <div class=\"content_msg-inner\">\n              <input type=\"checkbox\" class=\"content_msg-checkbox\">\n              <div class=\"content_msg-title\">" + item.title + "</div>\n\n              <div class=\"content_msg-actions\">\n                <a href=\"#\" title=\"open\" class=\"content_msg-link open-link open\">open</a>\n                <a href=\"#\" title=\"delete\" class=\"content_msg-link remove\">remove</a>\n                <a href=\"#\" title=\"like\" class=\"content_msg-link star\">like</a>\n              </div>\n            </div>\n            <div class=\"content_msg-text hidden\">" + item.text + "</div>\n          </li>");
      });
    },

    checkLocalList: function checkLocalList(storageList, idArr) {
      if (!localStorage.storageList) {
        localStorage.setItem(storageList, JSON.stringify(idArr));
      } else {
        localStorage.storageList = JSON.stringify(idArr);
      }
    },

    toggleMobileNavigation: function toggleMobileNavigation(e) {
      e.preventDefault();

      var nav = $(".nav");

      nav.stop(true, true).slideToggle();
    },

    showNavigation: function showNavigation() {
      if (window.innerWidth > 480) {
        $(".nav").removeAttr("style");
      }
    },

    selectAllMessages: function selectAllMessages() {
      var checkboxes = $(".content_msg-checkbox"),
          mainCheckbox = $("#main_checkbox");

      checkboxes.prop("checked", mainCheckbox.is(":checked"));
    }
  };
  app.init();
})();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBcXGpzXFxtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxDQUFDLFlBQU07QUFDTCxNQUFJLE1BQU07QUFDUixVQUFNLGdCQUFNO0FBQ1YsVUFBSSxjQUFKO0FBQ0QsS0FITzs7QUFLUixvQkFBZ0IsMEJBQU07QUFDcEIsUUFBRSxNQUFGLEVBQVUsRUFBVixDQUFhLE1BQWIsRUFBcUIsSUFBSSxpQkFBekI7QUFDQSxRQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsUUFBYixFQUF1QixJQUFJLGNBQTNCO0FBQ0EsUUFBRSxtQkFBRixFQUF1QixFQUF2QixDQUEwQixPQUExQixFQUFtQyxJQUFJLG9CQUF2QztBQUNBLFFBQUUscUJBQUYsRUFBeUIsRUFBekIsQ0FBNEIsT0FBNUIsRUFBcUMsSUFBSSxzQkFBekM7QUFDQSxRQUFFLGdCQUFGLEVBQW9CLEVBQXBCLENBQXVCLFFBQXZCLEVBQWlDLElBQUksaUJBQXJDO0FBQ0EsUUFBRSxNQUFGLEVBQVUsRUFBVixDQUFhLE9BQWIsRUFBc0IsSUFBSSxjQUExQjtBQUNELEtBWk87O0FBY1Isb0JBQWdCLHdCQUFDLENBQUQsRUFBTztBQUNyQixRQUFFLGNBQUY7O0FBRUEsVUFBSSxjQUFjLEVBQUUsRUFBRSxNQUFKLENBQWxCO0FBQ0EsVUFBSSxNQUFNLFlBQVksSUFBWixDQUFpQixNQUFqQixDQUFWO0FBQ0EsVUFBSSxVQUFVLEVBQUUsbUJBQUYsQ0FBZDs7QUFFQSxrQkFBWSxRQUFaLENBQXFCLFFBQXJCLEVBQStCLFFBQS9CLEdBQTBDLFdBQTFDLENBQXNELFFBQXREO0FBQ0EsVUFBSSxZQUFKOztBQUVBLFVBQUksUUFBUSxHQUFaLEVBQWlCO0FBQ2YsZ0JBQVEsV0FBUixDQUF1QixRQUFRLElBQVIsQ0FBYSxPQUFiLENBQXZCLDBCQUFpRSxJQUFJLEtBQUosQ0FBVSxDQUFWLENBQWpFO0FBQ0QsT0FGRCxN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QUFhO0FBQy9CLFFBQUUsSUFBRixDQUFPLE9BQVAsRUFBZ0IsVUFBQyxLQUFELEVBQVEsSUFBUixFQUFpQjtBQUMvQixVQUFFLG1CQUFGLEVBQXVCLE1BQXZCLDJEQUMwQyxLQUFLLEVBRC9DLG1MQUl1QyxLQUFLLEtBSjVDLHViQVkyQyxLQUFLLElBWmhEO0FBY0MsT0FmSDtBQWdCRCxLQS9KTzs7QUFpS1Isb0JBQWdCLHdCQUFDLFdBQUQsRUFBYyxLQUFkLEVBQXdCO0FBQ3RDLFVBQUksQ0FBQyxhQUFhLFdBQWxCLEVBQStCO0FBQzdCLHFCQUFhLE9BQWIsQ0FBcUIsV0FBckIsRUFBa0MsS0FBSyxTQUFMLENBQWUsS0FBZixDQUFsQztBQUNELE9BRkQsTUFHSztBQUNILHFCQUFhLFdBQWIsR0FBMkIsS0FBSyxTQUFMLENBQWUsS0FBZixDQUEzQjtBQUNEO0FBQ0YsS0F4S087O0FBMEtSLDRCQUF3QixnQ0FBQyxDQUFELEVBQU87QUFDN0IsUUFBRSxjQUFGOztBQUVBLFVBQUksTUFBTSxFQUFFLE1BQUYsQ0FBVjs7QUFFQSxVQUFJLElBQUosQ0FBUyxJQUFULEVBQWUsSUFBZixFQUFxQixXQUFyQjtBQUNELEtBaExPOztBQWtMUixvQkFBZ0IsMEJBQU07QUFDcEIsVUFBSSxPQUFPLFVBQVAsR0FBb0IsR0FBeEIsRUFBNkI7QUFDM0IsVUFBRSxNQUFGLEVBQVUsVUFBVixDQUFxQixPQUFyQjtBQUNEO0FBQ0YsS0F0TE87O0FBd0xSLHVCQUFtQiw2QkFBTTtBQUN2QixVQUFJLGFBQWEsRUFBRSx1QkFBRixDQUFqQjtVQUNFLGVBQWUsRUFBRSxnQkFBRixDQURqQjs7QUFHQSxpQkFBVyxJQUFYLENBQWdCLFNBQWhCLEVBQTJCLGFBQWEsRUFBYixDQUFnQixVQUFoQixDQUEzQjtBQUNEO0FBN0xPLEdBQVY7QUErTEEsTUFBSSxJQUFKO0FBQ0QsQ0FqTUQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKCgpID0+IHtcclxuICBsZXQgYXBwID0ge1xyXG4gICAgaW5pdDogKCkgPT4ge1xyXG4gICAgICBhcHAuc2V0VXBMaXN0ZW5lcnMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0VXBMaXN0ZW5lcnM6ICgpID0+IHtcclxuICAgICAgJCh3aW5kb3cpLm9uKFwibG9hZFwiLCBhcHAuc2hvd0FjdGl2ZU1zZ0xpc3QpO1xyXG4gICAgICAkKHdpbmRvdykub24oXCJyZXNpemVcIiwgYXBwLnNob3dOYXZpZ2F0aW9uKTtcclxuICAgICAgJChcIi5jb250ZW50X21zZy1saXN0XCIpLm9uKFwiY2xpY2tcIiwgYXBwLm9wZW5SZW1vdmVTdGFycmVkTXNnKTtcclxuICAgICAgJChcIi5oZWFkZXItbmF2LXRyaWdnZXJcIikub24oXCJjbGlja1wiLCBhcHAudG9nZ2xlTW9iaWxlTmF2aWdhdGlvbik7XHJcbiAgICAgICQoXCIjbWFpbl9jaGVja2JveFwiKS5vbihcImNoYW5nZVwiLCBhcHAuc2VsZWN0QWxsTWVzc2FnZXMpO1xyXG4gICAgICAkKFwiLm5hdlwiKS5vbihcImNsaWNrXCIsIGFwcC5jaGVja0FjdGl2ZVRhYik7XHJcbiAgICB9LFxyXG5cclxuICAgIGNoZWNrQWN0aXZlVGFiOiAoZSkgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICBsZXQgY3VycmVudExpbmsgPSAkKGUudGFyZ2V0KTtcclxuICAgICAgbGV0IHVybCA9IGN1cnJlbnRMaW5rLmF0dHIoXCJocmVmXCIpO1xyXG4gICAgICBsZXQgbXNnTGlzdCA9ICQoXCIuY29udGVudF9tc2ctbGlzdFwiKTtcclxuXHJcbiAgICAgIGN1cnJlbnRMaW5rLmFkZENsYXNzKFwiYWN0aXZlXCIpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgIGFwcC5jbGVhck1zZ0xpc3QoKTtcclxuXHJcbiAgICAgIGlmICh1cmwgIT09IFwiL1wiKSB7XHJcbiAgICAgICAgbXNnTGlzdC50b2dnbGVDbGFzcyhgJHttc2dMaXN0LmF0dHIoXCJjbGFzc1wiKX0gY29udGVudF9tc2ctbGlzdCAke3VybC5zbGljZSgxKX1gKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBtc2dMaXN0LnRvZ2dsZUNsYXNzKGAke21zZ0xpc3QuYXR0cihcImNsYXNzXCIpfSBjb250ZW50X21zZy1saXN0IGluYm94YCk7XHJcbiAgICAgIH1cclxuICAgICAgYXBwLnNob3dBY3RpdmVNc2dMaXN0KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9wZW5SZW1vdmVTdGFycmVkTXNnOiAoZSkgPT4ge1xyXG4gICAgICBsZXQgZVRhcmdldCA9ICQoZS50YXJnZXQpO1xyXG4gICAgICBsZXQgY3VycmVudE1zZyA9IGVUYXJnZXQuY2xvc2VzdChcIi5jb250ZW50X21zZy1pdGVtXCIpO1xyXG4gICAgICBsZXQgY3VycmVudE1zZ0lkID0gY3VycmVudE1zZy5kYXRhKFwiaWRcIik7XHJcbiAgICAgIGxldCBjdXJyZW50U3RvcmFnZTtcclxuXHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIGlmKGVUYXJnZXQuaGFzQ2xhc3MoXCJvcGVuLWxpbmtcIikpIHtcclxuICAgICAgICBlVGFyZ2V0LnRvZ2dsZUNsYXNzKFwib3BlbiBjbG9zZWRcIik7XHJcbiAgICAgICAgZVRhcmdldC50ZXh0KGVUYXJnZXQudGV4dCgpID09PSBcIm9wZW5cIiA/IFwiY2xvc2VcIiA6IFwib3BlblwiKTtcclxuICAgICAgICBlVGFyZ2V0LnByb3AoXCJ0aXRsZVwiLCBlVGFyZ2V0LnByb3AoXCJ0aXRsZVwiKSA9PT0gXCJvcGVuXCIgPyBcImNsb3NlXCIgOiBcIm9wZW5cIik7XHJcbiAgICAgICAgY3VycmVudE1zZy5maW5kKFwiLmNvbnRlbnRfbXNnLXRleHRcIikuc3RvcCh0cnVlLCB0cnVlKS5zbGlkZVRvZ2dsZSgpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChlVGFyZ2V0Lmhhc0NsYXNzKFwicmVtb3ZlXCIpKSB7XHJcbiAgICAgICAgY3VycmVudFN0b3JhZ2UgPSBcImRlbGV0ZU1zZ0xpc3RcIjtcclxuICAgICAgICBhcHAubW92ZU1lc3NhZ2UoY3VycmVudFN0b3JhZ2UsIGN1cnJlbnRNc2dJZCk7XHJcbiAgICAgICAgY3VycmVudE1zZy5yZW1vdmUoKTtcclxuICAgICAgfVxyXG4gICAgICBpZihlVGFyZ2V0Lmhhc0NsYXNzKFwic3RhclwiKSAmJiAhZVRhcmdldC5oYXNDbGFzcyhcImNoZWNrZWRcIikpIHtcclxuICAgICAgICBjdXJyZW50U3RvcmFnZSA9IFwic3Rhck1zZ0xpc3RcIjtcclxuICAgICAgICBlVGFyZ2V0LmFkZENsYXNzKFwiY2hlY2tlZFwiKTtcclxuICAgICAgICBhcHAubW92ZU1lc3NhZ2UoY3VycmVudFN0b3JhZ2UsIGN1cnJlbnRNc2dJZCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbW92ZU1lc3NhZ2U6IChzdG9yYWdlLCBtc2dJZCkgPT4ge1xyXG4gICAgICBpZihsb2NhbFN0b3JhZ2Vbc3RvcmFnZV0pIHtcclxuICAgICAgICBsZXQgY3VycmVudEFycmF5ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShzdG9yYWdlKSk7XHJcblxyXG4gICAgICAgIC8vIGN1cnJlbnRBcnJheS5maWx0ZXIoKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgLy8gICBpZihpdGVtICE9PSBtc2dJZCkge1xyXG4gICAgICAgIC8vICAgICBjdXJyZW50QXJyYXkucHVzaChtc2dJZCk7XHJcbiAgICAgICAgLy8gICAgIGxvY2FsU3RvcmFnZVtzdG9yYWdlXSA9IEpTT04uc3RyaW5naWZ5KGN1cnJlbnRBcnJheSk7XHJcbiAgICAgICAgLy8gICB9IGVsc2Uge1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgLy8gICB9XHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgY3VycmVudEFycmF5LnB1c2gobXNnSWQpO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZVtzdG9yYWdlXSA9IEpTT04uc3RyaW5naWZ5KGN1cnJlbnRBcnJheSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oc3RvcmFnZSwgSlNPTi5zdHJpbmdpZnkoW21zZ0lkXSkpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHNob3dBY3RpdmVNc2dMaXN0OiAoKSA9PiB7XHJcbiAgICAgIGxldCBtc2dMaXN0ID0gJChcIi5jb250ZW50X21zZy1saXN0XCIpO1xyXG4gICAgICBsZXQgc3RvcmFnZUxpc3QgPSBbXTtcclxuXHJcbiAgICAgIGlmIChtc2dMaXN0Lmhhc0NsYXNzKFwiZGVsZXRlZFwiKSkge1xyXG4gICAgICAgIGlmKGxvY2FsU3RvcmFnZS5kZWxldGVNc2dMaXN0KSB7XHJcbiAgICAgICAgICBsZXQgYWxsTXNnc0FycmF5ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuYWxsTXNnTGlzdCk7XHJcbiAgICAgICAgICBsZXQgZGVsZXRlZE1zZ3NJZEFyciA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmRlbGV0ZU1zZ0xpc3QpO1xyXG4gICAgICAgICAgbGV0IGluYm94TXNnc0FycmF5ID0gW107XHJcbiAgICAgICAgICBsZXQgaW5ib3ggPSBcImluYm94XCI7XHJcblxyXG4gICAgICAgICAgaW5ib3hNc2dzQXJyYXkgPSBhbGxNc2dzQXJyYXkuZmlsdGVyKChtc2cpID0+IHtcclxuICAgICAgICAgICAgaWYoZGVsZXRlZE1zZ3NJZEFyci5pbmRleE9mKG1zZy5pZCkgPiAtMSkge1xyXG4gICAgICAgICAgICAgIHN0b3JhZ2VMaXN0LnB1c2gobXNnKTtcclxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGFwcC5jaGVja0xvY2FsTGlzdChpbmJveCwgaW5ib3hNc2dzQXJyYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGFwcC5zaG93SW5mb01lc3NhZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKG1zZ0xpc3QuaGFzQ2xhc3MoXCJzdGFycmVkXCIpKSB7XHJcbiAgICAgICAgaWYobG9jYWxTdG9yYWdlLnN0YXJNc2dMaXN0KSB7XHJcbiAgICAgICAgICBsZXQgc3Rhck1zZ3NJZEFyciA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnN0YXJNc2dMaXN0KTtcclxuICAgICAgICAgIGxldCBpbmJveE1zZ3NBcnJheSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmluYm94KTtcclxuXHJcbiAgICAgICAgICBpbmJveE1zZ3NBcnJheSA9IGluYm94TXNnc0FycmF5LmZpbHRlcigobXNnKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHN0YXJNc2dzSWRBcnIuaW5kZXhPZihtc2cuaWQpID4gLTEpIHtcclxuICAgICAgICAgICAgICBzdG9yYWdlTGlzdC5wdXNoKG1zZyk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgYXBwLnNob3dJbmZvTWVzc2FnZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAobXNnTGlzdC5oYXNDbGFzcyhcImluYm94XCIpKSB7XHJcbiAgICAgICAgaWYoIWxvY2FsU3RvcmFnZS5pbmJveCkge1xyXG4gICAgICAgICAgJC5nZXRKU09OKFwianNvbi9kYXRhLmpzb25cIiwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmFsbE1zZ0xpc3QgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgc3RvcmFnZUxpc3QgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5hbGxNc2dMaXN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBhcHAub3BlbkN1cnJlbnRNc2dMaXN0KEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmluYm94KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGFwcC5vcGVuQ3VycmVudE1zZ0xpc3Qoc3RvcmFnZUxpc3QpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbGVhck1zZ0xpc3Q6ICgpID0+IHtcclxuICAgICAgJChcIi5jb250ZW50X21zZy1saXN0XCIpLmh0bWwoXCJcIilcclxuICAgIH0sXHJcblxyXG4gICAgc2hvd0luZm9NZXNzYWdlOiAoKSA9PiB7XHJcbiAgICAgICQoXCIuY29udGVudF9pbmZvLW1zZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTtcclxuICAgIH0sXHJcblxyXG4gICAgb3BlbkN1cnJlbnRNc2dMaXN0OiAoc3RvcmFnZSkgPT4ge1xyXG4gICAgICAkLmVhY2goc3RvcmFnZSwgKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgJChcIi5jb250ZW50X21zZy1saXN0XCIpLmFwcGVuZChgXHJcbiAgICAgICAgICA8bGkgY2xhc3M9XCJjb250ZW50X21zZy1pdGVtXCIgZGF0YS1pZD1cIiR7aXRlbS5pZH1cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnRfbXNnLWlubmVyXCI+XHJcbiAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY29udGVudF9tc2ctY2hlY2tib3hcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudF9tc2ctdGl0bGVcIj4ke2l0ZW0udGl0bGV9PC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50X21zZy1hY3Rpb25zXCI+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIHRpdGxlPVwib3BlblwiIGNsYXNzPVwiY29udGVudF9tc2ctbGluayBvcGVuLWxpbmsgb3BlblwiPm9wZW48L2E+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIHRpdGxlPVwiZGVsZXRlXCIgY2xhc3M9XCJjb250ZW50X21zZy1saW5rIHJlbW92ZVwiPnJlbW92ZTwvYT5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgdGl0bGU9XCJsaWtlXCIgY2xhc3M9XCJjb250ZW50X21zZy1saW5rIHN0YXJcIj5saWtlPC9hPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnRfbXNnLXRleHQgaGlkZGVuXCI+JHtpdGVtLnRleHR9PC9kaXY+XHJcbiAgICAgICAgICA8L2xpPmApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBjaGVja0xvY2FsTGlzdDogKHN0b3JhZ2VMaXN0LCBpZEFycikgPT4ge1xyXG4gICAgICBpZiAoIWxvY2FsU3RvcmFnZS5zdG9yYWdlTGlzdCkge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHN0b3JhZ2VMaXN0LCBKU09OLnN0cmluZ2lmeShpZEFycikpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zdG9yYWdlTGlzdCA9IEpTT04uc3RyaW5naWZ5KGlkQXJyKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICB0b2dnbGVNb2JpbGVOYXZpZ2F0aW9uOiAoZSkgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICBsZXQgbmF2ID0gJChcIi5uYXZcIik7XHJcblxyXG4gICAgICBuYXYuc3RvcCh0cnVlLCB0cnVlKS5zbGlkZVRvZ2dsZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzaG93TmF2aWdhdGlvbjogKCkgPT4ge1xyXG4gICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiA0ODApIHtcclxuICAgICAgICAkKFwiLm5hdlwiKS5yZW1vdmVBdHRyKFwic3R5bGVcIik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc2VsZWN0QWxsTWVzc2FnZXM6ICgpID0+IHtcclxuICAgICAgbGV0IGNoZWNrYm94ZXMgPSAkKFwiLmNvbnRlbnRfbXNnLWNoZWNrYm94XCIpLFxyXG4gICAgICAgIG1haW5DaGVja2JveCA9ICQoXCIjbWFpbl9jaGVja2JveFwiKTtcclxuXHJcbiAgICAgIGNoZWNrYm94ZXMucHJvcChcImNoZWNrZWRcIiwgbWFpbkNoZWNrYm94LmlzKFwiOmNoZWNrZWRcIikpO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgYXBwLmluaXQoKTtcclxufSkoKTtcclxuIl19
