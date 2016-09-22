(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

(function () {
  var app = {
    init: function init() {
      app.setUpListeners();
    },

    setUpListeners: function setUpListeners() {
      $(window).on("load", app.showActiveMsgList);
      $(".message-list").on("click", app.openRemoveStarredMsg);
      $(".navigation-trigger-link").on("click", app.toggleMobileNavigation);
      $("#main_checkbox").on("change", app.selectAllMessages);
    },

    openRemoveStarredMsg: function openRemoveStarredMsg(e) {
      var eTarget = $(e.target);
      var currentMsg = eTarget.closest(".message-item");
      var currentMsgId = currentMsg.data("id");
      var currentStoredge = void 0;

      if (eTarget.hasClass("message-open-link")) {
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
      if (eTarget.hasClass("star") && !eTarget.hasClass("checked")) {
        currentStoredge = "starMsgList";
        eTarget.addClass("checked");
        app.moveMessage(currentStoredge, currentMsgId);
      }
    },

    moveMessage: function moveMessage(storadge, msgId) {
      if (localStorage[storadge]) {
        var currentArray = JSON.parse(localStorage.getItem(storadge));

        // currentArray.filter((index, item) => {
        //   console.log(item);
        //   console.log(msgId);
        //   if(item !== msgId) {
        //     currentArray.push(msgId);
        //     localStorage[storadge] = JSON.stringify(currentArray);
        //   } else {
        //     return false;
        //   }
        // });
        currentArray.push(msgId);
        localStorage[storadge] = JSON.stringify(currentArray);
      } else {
        localStorage.setItem(storadge, JSON.stringify([msgId]));
      }
    },

    showActiveMsgList: function showActiveMsgList() {
      var msgList = $(".message-list");
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

    showInfoMessage: function showInfoMessage() {
      $(".tabs-content-msg").removeClass("hidden");
    },

    openCurrentMsgList: function openCurrentMsgList(storage) {
      $.each(storage, function (index, item) {
        $(".message-list").append("\n          <li class='message-item' data-id='" + item.id + "'>\n            <div class='message'><input type='checkbox' class='message-checkbox'>\n              <div class='message-title'>" + item.title + "</div>\n              <div class='message-actions'>\n                <a href='#' title='open' class='message-link message-open-link open'>open</a>\n                <a href='#' title='delete' class='message-link remove'>remove</a>\n                <a href='#' title='like' class='message-link star'>like</a>\n              </div>\n            </div>\n            <div class='message-text hidden'>" + item.text + "</div>\n          </li>");
      });
    },

    checkLocalList: function checkLocalList(storagelist, idArr) {
      if (!localStorage.storagelist) {
        localStorage.setItem(storagelist, JSON.stringify(idArr));
      } else {
        localStorage.storagelist = JSON.stringify(idArr);
      }
      console.log(localStorage.storagelist);
    },

    toggleMobileNavigation: function toggleMobileNavigation(e) {
      e.preventDefault();

      $(".tabs").stop(true, true).slideToggle();
    },

    selectAllMessages: function selectAllMessages() {
      var checkboxes = $(".message-checkbox"),
          mainCheckbox = $("#main_checkbox");

      checkboxes.prop("checked", mainCheckbox.is(":checked"));
    }
  };
  app.init();
})();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBcXGpzXFxtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxDQUFDLFlBQU07QUFDTCxNQUFJLE1BQU07QUFDUixVQUFNLGdCQUFNO0FBQ1YsVUFBSSxjQUFKO0FBQ0QsS0FITzs7QUFLUixvQkFBZ0IsMEJBQU07QUFDcEIsUUFBRSxNQUFGLEVBQVUsRUFBVixDQUFhLE1BQWIsRUFBcUIsSUFBSSxpQkFBekI7QUFDQSxRQUFFLGVBQUYsRUFBbUIsRUFBbkIsQ0FBc0IsT0FBdEIsRUFBK0IsSUFBSSxvQkFBbkM7QUFDQSxRQUFFLDBCQUFGLEVBQThCLEVBQTlCLENBQWlDLE9BQWpDLEVBQTBDLElBQUksc0JBQTlDO0FBQ0EsUUFBRSxnQkFBRixFQUFvQixFQUFwQixDQUF1QixRQUF2QixFQUFpQyxJQUFJLGlCQUFyQztBQUNELEtBVk87O0FBWVIsMEJBQXNCLDhCQUFDLENBQUQsRUFBTztBQUMzQixVQUFJLFVBQVUsRUFBRSxFQUFFLE1BQUosQ0FBZDtBQUNBLFVBQUksYUFBYSxRQUFRLE9BQVIsQ0FBZ0IsZUFBaEIsQ0FBakI7QUFDQSxVQUFJLGVBQWUsV0FBVyxJQUFYLENBQWdCLElBQWhCLENBQW5CO0FBQ0EsVUFBSSx3QkFBSjs7QUFFQSxVQUFHLFFBQVEsUUFBUixDQUFpQixtQkFBakIsQ0FBSCxFQUEwQztBQUN4QyxVQUFFLGNBQUY7O0FBRUEsZ0JBQVEsV0FBUixDQUFvQixhQUFwQjtBQUNBLGdCQUFRLElBQVIsQ0FBYSxRQUFRLElBQVIsT0FBbUIsTUFBbkIsR0FBNEIsT0FBNUIsR0FBc0MsTUFBbkQ7QUFDQSxnQkFBUSxJQUFSLENBQWEsT0FBYixFQUFzQixRQUFRLElBQVIsQ0FBYSxPQUFiLE1BQTBCLE1BQTFCLEdBQW1DLE9BQW5DLEdBQTZDLE1BQW5FO0FBQ0EsbUJBQVcsSUFBWCxDQUFnQixlQUFoQixFQUFpQyxJQUFqQyxDQUFzQyxJ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LGlCQUFXLElBQVgsQ0FBZ0IsU0FBaEIsRUFBMkIsYUFBYSxFQUFiLENBQWdCLFVBQWhCLENBQTNCO0FBQ0Q7QUE3Sk8sR0FBVjtBQStKQSxNQUFJLElBQUo7QUFDRCxDQWpLRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoKCkgPT4ge1xyXG4gIGxldCBhcHAgPSB7XHJcbiAgICBpbml0OiAoKSA9PiB7XHJcbiAgICAgIGFwcC5zZXRVcExpc3RlbmVycygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRVcExpc3RlbmVyczogKCkgPT4ge1xyXG4gICAgICAkKHdpbmRvdykub24oXCJsb2FkXCIsIGFwcC5zaG93QWN0aXZlTXNnTGlzdCk7XHJcbiAgICAgICQoXCIubWVzc2FnZS1saXN0XCIpLm9uKFwiY2xpY2tcIiwgYXBwLm9wZW5SZW1vdmVTdGFycmVkTXNnKTtcclxuICAgICAgJChcIi5uYXZpZ2F0aW9uLXRyaWdnZXItbGlua1wiKS5vbihcImNsaWNrXCIsIGFwcC50b2dnbGVNb2JpbGVOYXZpZ2F0aW9uKTtcclxuICAgICAgJChcIiNtYWluX2NoZWNrYm94XCIpLm9uKFwiY2hhbmdlXCIsIGFwcC5zZWxlY3RBbGxNZXNzYWdlcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9wZW5SZW1vdmVTdGFycmVkTXNnOiAoZSkgPT4ge1xyXG4gICAgICBsZXQgZVRhcmdldCA9ICQoZS50YXJnZXQpO1xyXG4gICAgICBsZXQgY3VycmVudE1zZyA9IGVUYXJnZXQuY2xvc2VzdChcIi5tZXNzYWdlLWl0ZW1cIik7XHJcbiAgICAgIGxldCBjdXJyZW50TXNnSWQgPSBjdXJyZW50TXNnLmRhdGEoXCJpZFwiKTtcclxuICAgICAgbGV0IGN1cnJlbnRTdG9yZWRnZTtcclxuXHJcbiAgICAgIGlmKGVUYXJnZXQuaGFzQ2xhc3MoXCJtZXNzYWdlLW9wZW4tbGlua1wiKSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgZVRhcmdldC50b2dnbGVDbGFzcyhcIm9wZW4gY2xvc2VkXCIpO1xyXG4gICAgICAgIGVUYXJnZXQudGV4dChlVGFyZ2V0LnRleHQoKSA9PT0gXCJvcGVuXCIgPyBcImNsb3NlXCIgOiBcIm9wZW5cIik7XHJcbiAgICAgICAgZVRhcmdldC5wcm9wKFwidGl0bGVcIiwgZVRhcmdldC5wcm9wKFwidGl0bGVcIikgPT09IFwib3BlblwiID8gXCJjbG9zZVwiIDogXCJvcGVuXCIpO1xyXG4gICAgICAgIGN1cnJlbnRNc2cuZmluZChcIi5tZXNzYWdlLXRleHRcIikuc3RvcCh0cnVlLCB0cnVlKS5zbGlkZVRvZ2dsZSgpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChlVGFyZ2V0Lmhhc0NsYXNzKFwicmVtb3ZlXCIpKSB7XHJcbiAgICAgICAgY3VycmVudFN0b3JlZGdlID0gXCJkZWxldGVNc2dMaXN0XCI7XHJcbiAgICAgICAgYXBwLm1vdmVNZXNzYWdlKGN1cnJlbnRTdG9yZWRnZSwgY3VycmVudE1zZ0lkKTtcclxuICAgICAgICBjdXJyZW50TXNnLnJlbW92ZSgpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKGVUYXJnZXQuaGFzQ2xhc3MoXCJzdGFyXCIpICYmICFlVGFyZ2V0Lmhhc0NsYXNzKFwiY2hlY2tlZFwiKSkge1xyXG4gICAgICAgIGN1cnJlbnRTdG9yZWRnZSA9IFwic3Rhck1zZ0xpc3RcIjtcclxuICAgICAgICBlVGFyZ2V0LmFkZENsYXNzKFwiY2hlY2tlZFwiKTtcclxuICAgICAgICBhcHAubW92ZU1lc3NhZ2UoY3VycmVudFN0b3JlZGdlLCBjdXJyZW50TXNnSWQpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG1vdmVNZXNzYWdlOiAoc3RvcmFkZ2UsIG1zZ0lkKSA9PiB7XHJcbiAgICAgIGlmKGxvY2FsU3RvcmFnZVtzdG9yYWRnZV0pIHtcclxuICAgICAgICBsZXQgY3VycmVudEFycmF5ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShzdG9yYWRnZSkpO1xyXG5cclxuICAgICAgICAvLyBjdXJyZW50QXJyYXkuZmlsdGVyKChpbmRleCwgaXRlbSkgPT4ge1xyXG4gICAgICAgIC8vICAgY29uc29sZS5sb2coaXRlbSk7XHJcbiAgICAgICAgLy8gICBjb25zb2xlLmxvZyhtc2dJZCk7XHJcbiAgICAgICAgLy8gICBpZihpdGVtICE9PSBtc2dJZCkge1xyXG4gICAgICAgIC8vICAgICBjdXJyZW50QXJyYXkucHVzaChtc2dJZCk7XHJcbiAgICAgICAgLy8gICAgIGxvY2FsU3RvcmFnZVtzdG9yYWRnZV0gPSBKU09OLnN0cmluZ2lmeShjdXJyZW50QXJyYXkpO1xyXG4gICAgICAgIC8vICAgfSBlbHNlIHtcclxuICAgICAgICAvLyAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIC8vICAgfVxyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgICAgIGN1cnJlbnRBcnJheS5wdXNoKG1zZ0lkKTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Vbc3RvcmFkZ2VdID0gSlNPTi5zdHJpbmdpZnkoY3VycmVudEFycmF5KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShzdG9yYWRnZSwgSlNPTi5zdHJpbmdpZnkoW21zZ0lkXSkpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHNob3dBY3RpdmVNc2dMaXN0OiAoKSA9PiB7XHJcbiAgICAgIGxldCBtc2dMaXN0ID0gJChcIi5tZXNzYWdlLWxpc3RcIik7XHJcbiAgICAgIGxldCBzdG9yYWdlTGlzdCA9IFtdO1xyXG5cclxuICAgICAgaWYgKG1zZ0xpc3QuaGFzQ2xhc3MoXCJkZWxldGVkXCIpKSB7XHJcbiAgICAgICAgaWYobG9jYWxTdG9yYWdlLmRlbGV0ZU1zZ0xpc3QpIHtcclxuICAgICAgICAgIGxldCBhbGxNc2dzQXJyYXkgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5hbGxNc2dMaXN0KTtcclxuICAgICAgICAgIGxldCBkZWxldGVkTXNnc0lkQXJyID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZGVsZXRlTXNnTGlzdCk7XHJcbiAgICAgICAgICBsZXQgaW5ib3hNc2dzQXJyYXkgPSBbXTtcclxuICAgICAgICAgIGxldCBpbmJveCA9IFwiaW5ib3hcIjtcclxuXHJcbiAgICAgICAgICBpbmJveE1zZ3NBcnJheSA9IGFsbE1zZ3NBcnJheS5maWx0ZXIoKG1zZykgPT4ge1xyXG4gICAgICAgICAgICBpZihkZWxldGVkTXNnc0lkQXJyLmluZGV4T2YobXNnLmlkKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgc3RvcmFnZUxpc3QucHVzaChtc2cpO1xyXG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgYXBwLmNoZWNrTG9jYWxMaXN0KGluYm94LCBpbmJveE1zZ3NBcnJheSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgYXBwLnNob3dJbmZvTWVzc2FnZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAobXNnTGlzdC5oYXNDbGFzcyhcInN0YXJyZWRcIikpIHtcclxuICAgICAgICBpZihsb2NhbFN0b3JhZ2Uuc3Rhck1zZ0xpc3QpIHtcclxuICAgICAgICAgIGxldCBzdGFyTXNnc0lkQXJyID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2Uuc3Rhck1zZ0xpc3QpO1xyXG4gICAgICAgICAgbGV0IGluYm94TXNnc0FycmF5ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuaW5ib3gpO1xyXG5cclxuICAgICAgICAgIGluYm94TXNnc0FycmF5ID0gaW5ib3hNc2dzQXJyYXkuZmlsdGVyKChtc2cpID0+IHtcclxuICAgICAgICAgICAgaWYoc3Rhck1zZ3NJZEFyci5pbmRleE9mKG1zZy5pZCkgPiAtMSkge1xyXG4gICAgICAgICAgICAgIHN0b3JhZ2VMaXN0LnB1c2gobXNnKTtcclxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBhcHAuc2hvd0luZm9NZXNzYWdlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChtc2dMaXN0Lmhhc0NsYXNzKFwiaW5ib3hcIikpIHtcclxuICAgICAgICBpZighbG9jYWxTdG9yYWdlLmluYm94KSB7XHJcbiAgICAgICAgICAkLmdldEpTT04oXCJqc29uL2RhdGEuanNvblwiLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UuYWxsTXNnTGlzdCA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBzdG9yYWdlTGlzdCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmFsbE1zZ0xpc3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGFwcC5vcGVuQ3VycmVudE1zZ0xpc3QoSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuaW5ib3gpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgYXBwLm9wZW5DdXJyZW50TXNnTGlzdChzdG9yYWdlTGlzdCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNob3dJbmZvTWVzc2FnZTogKCkgPT4ge1xyXG4gICAgICAkKFwiLnRhYnMtY29udGVudC1tc2dcIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgICB9LFxyXG5cclxuICAgIG9wZW5DdXJyZW50TXNnTGlzdDogKHN0b3JhZ2UpID0+IHtcclxuICAgICAgJC5lYWNoKHN0b3JhZ2UsIChpbmRleCwgaXRlbSkgPT4ge1xyXG4gICAgICAgICQoXCIubWVzc2FnZS1saXN0XCIpLmFwcGVuZChgXHJcbiAgICAgICAgICA8bGkgY2xhc3M9J21lc3NhZ2UtaXRlbScgZGF0YS1pZD0nJHtpdGVtLmlkfSc+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9J21lc3NhZ2UnPjxpbnB1dCB0eXBlPSdjaGVja2JveCcgY2xhc3M9J21lc3NhZ2UtY2hlY2tib3gnPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9J21lc3NhZ2UtdGl0bGUnPiR7aXRlbS50aXRsZX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtZXNzYWdlLWFjdGlvbnMnPlxyXG4gICAgICAgICAgICAgICAgPGEgaHJlZj0nIycgdGl0bGU9J29wZW4nIGNsYXNzPSdtZXNzYWdlLWxpbmsgbWVzc2FnZS1vcGVuLWxpbmsgb3Blbic+b3BlbjwvYT5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9JyMnIHRpdGxlPSdkZWxldGUnIGNsYXNzPSdtZXNzYWdlLWxpbmsgcmVtb3ZlJz5yZW1vdmU8L2E+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPScjJyB0aXRsZT0nbGlrZScgY2xhc3M9J21lc3NhZ2UtbGluayBzdGFyJz5saWtlPC9hPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz0nbWVzc2FnZS10ZXh0IGhpZGRlbic+JHtpdGVtLnRleHR9PC9kaXY+XHJcbiAgICAgICAgICA8L2xpPmApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBjaGVja0xvY2FsTGlzdDogKHN0b3JhZ2VsaXN0LCBpZEFycikgPT4ge1xyXG4gICAgICBpZiAoIWxvY2FsU3RvcmFnZS5zdG9yYWdlbGlzdCkge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHN0b3JhZ2VsaXN0LCBKU09OLnN0cmluZ2lmeShpZEFycikpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zdG9yYWdlbGlzdCA9IEpTT04uc3RyaW5naWZ5KGlkQXJyKTtcclxuICAgICAgfVxyXG4gICAgICBjb25zb2xlLmxvZyhsb2NhbFN0b3JhZ2Uuc3RvcmFnZWxpc3QpO1xyXG4gICAgfSxcclxuXHJcbiAgICB0b2dnbGVNb2JpbGVOYXZpZ2F0aW9uOiAoZSkgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAkKFwiLnRhYnNcIikuc3RvcCh0cnVlLCB0cnVlKS5zbGlkZVRvZ2dsZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZWxlY3RBbGxNZXNzYWdlczogKCkgPT4ge1xyXG4gICAgICBsZXQgY2hlY2tib3hlcyA9ICQoXCIubWVzc2FnZS1jaGVja2JveFwiKSxcclxuICAgICAgICBtYWluQ2hlY2tib3ggPSAkKFwiI21haW5fY2hlY2tib3hcIik7XHJcblxyXG4gICAgICBjaGVja2JveGVzLnByb3AoXCJjaGVja2VkXCIsIG1haW5DaGVja2JveC5pcyhcIjpjaGVja2VkXCIpKTtcclxuICAgIH1cclxuICB9O1xyXG4gIGFwcC5pbml0KCk7XHJcbn0pKCk7XHJcbiJdfQ==
