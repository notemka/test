(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
          var _ret = function () {
            var allMsgsArray = JSON.parse(localStorage.allMsgList);
            var storageDeletedId = JSON.parse(localStorage.deleteMsgList);
            var inboxMsgsArray = void 0;

            allMsgsArray = allMsgsArray.filter(function (msg) {
              if (storageDeletedId.indexOf(msg.id + " + ''") > -1) {
                storageList.push(msg);
                return false;
              }
              return true;
            });

            inboxMsgsArray = allMsgsArray;
            app.checkLocalList(inboxMsgsArray);
            return {
              v: storageList
            };
          }();

          if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        }
      } else if (msgList.hasClass("starred") && !localStorage.starMsgList) {} else if (msgList.hasClass("inbox") && !localStorage.inbox) {
        $.getJSON("json/data.json", function (data) {
          localStorage.allMsgList = JSON.stringify(data);
        });
        storageList = localStorage.allMsgList;
      } else {
        app.showInfoMessage();
      }
      app.openCurrentMsgList(storageList);
    },

    showInfoMessage: function showInfoMessage() {
      $(".tabs-content-msg").removeClass("hidden");
    },

    openCurrentMsgList: function openCurrentMsgList(storage) {
      $.each(JSON.parse(storage), function (index, item) {
        $(".message-list").append("\n          <li class='message-item' data-id='" + item.id + "'>\n            <div class='message'><input type='checkbox' class='message-checkbox'>\n              <div class='message-title'>" + item.title + "</div>\n              <div class='message-actions'>\n                <a href='#' title='open' class='message-link message-open-link open'>open</a>\n                <a href='#' title='delete' class='message-link remove'>remove</a>\n                <a href='#' title='like' class='message-link star'>like</a>\n              </div>\n            </div>\n            <div class='message-text hidden'>" + item.text + "</div>\n          </li>");
      });
    },

    checkLocalList: function checkLocalList(list) {
      if (!localStorage.list) {
        localStorage.setItem(list, JSON.stringify(list));
      } else {
        // localStorage.list = JSON.stringify(list);
        localStorage[list] = JSON.stringify(list);
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBcXGpzXFxtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBLENBQUMsWUFBTTtBQUNMLE1BQUksTUFBTTtBQUNSLFVBQU0sZ0JBQU07QUFDVixVQUFJLGNBQUo7QUFDRCxLQUhPOztBQUtSLG9CQUFnQiwwQkFBTTtBQUNwQixRQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsTUFBYixFQUFxQixJQUFJLGlCQUF6QjtBQUNBLFFBQUUsZUFBRixFQUFtQixFQUFuQixDQUFzQixPQUF0QixFQUErQixJQUFJLG9CQUFuQztBQUNBLFFBQUUsMEJBQUYsRUFBOEIsRUFBOUIsQ0FBaUMsT0FBakMsRUFBMEMsSUFBSSxzQkFBOUM7QUFDQSxRQUFFLGdCQUFGLEVBQW9CLEVBQXBCLENBQXVCLFFBQXZCLEVBQWlDLElBQUksaUJBQXJDO0FBQ0QsS0FWTzs7QUFZUiwwQkFBc0IsOEJBQUMsQ0FBRCxFQUFPO0FBQzNCLFVBQUksVUFBVSxFQUFFLEVBQUUsTUFBSixDQUFkO0FBQ0EsVUFBSSxhQUFhLFFBQVEsT0FBUixDQUFnQixlQUFoQixDQUFqQjtBQUNBLFVBQUksZUFBZSxXQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBbkI7QUFDQSxVQUFJLHdCQUFKOztBQUVBLFVBQUcsUUFBUSxRQUFSLENBQWlCLG1CQUFqQixDQUFILEVBQTBDO0FBQ3hDLFVBQUUsY0FBRjs7QUFFQSxnQkFBUSxXQUFSLENBQW9CLGFBQXBCO0FBQ0EsZ0JBQVEsSUFBUixDQUFhLFFBQVEsSUFBUixPQUFtQixNQUFuQixHQUE0QixPQUE1QixHQUFzQyxNQUFuRDtBQUNBLGdCQUFRLElBQVIsQ0FBYSxPQUFiLEVBQXNCLFFBQVEsSUFBUixDQUFhLE9BQWIsTUFBMEIsTUFBMUIsR0FBbUMsT0FBbkMsR0FBNkMsTUFBbkU7QUFDQSxtQkFBVyxJQUFYLENBQWdCLGVBQWhCLEVBQWlDLElBQWpDLENBQXND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S0FBSyxJQVY1QztBQVlDLE9BYkg7QUFjRCxLQXJITzs7QUF1SFIsb0JBQWdCLHdCQUFDLElBQUQsRUFBVTtBQUN4QixVQUFJLENBQUMsYUFBYSxJQUFsQixFQUF3QjtBQUN0QixxQkFBYSxPQUFiLENBQXFCLElBQXJCLEVBQTJCLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBM0I7QUFDRCxPQUZELE1BR0s7O0FBRUgscUJBQWEsSUFBYixJQUFxQixLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQXJCO0FBQ0Q7QUFDRixLQS9ITzs7QUFpSVIsNEJBQXdCLGdDQUFDLENBQUQsRUFBTztBQUM3QixRQUFFLGNBQUY7O0FBRUEsUUFBRSxPQUFGLEVBQVcsSUFBWCxDQUFnQixJQUFoQixFQUFzQixJQUF0QixFQUE0QixXQUE1QjtBQUNELEtBcklPOztBQXVJUix1QkFBbUIsNkJBQU07QUFDdkIsVUFBSSxhQUFhLEVBQUUsbUJBQUYsQ0FBakI7VUFDRSxlQUFlLEVBQUUsZ0JBQUYsQ0FEakI7O0FBR0EsaUJBQVcsSUFBWCxDQUFnQixTQUFoQixFQUEyQixhQUFhLEVBQWIsQ0FBZ0IsVUFBaEIsQ0FBM0I7QUFDRDtBQTVJTyxHQUFWO0FBOElBLE1BQUksSUFBSjtBQUNELENBaEpEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIigoKSA9PiB7XHJcbiAgbGV0IGFwcCA9IHtcclxuICAgIGluaXQ6ICgpID0+IHtcclxuICAgICAgYXBwLnNldFVwTGlzdGVuZXJzKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFVwTGlzdGVuZXJzOiAoKSA9PiB7XHJcbiAgICAgICQod2luZG93KS5vbihcImxvYWRcIiwgYXBwLnNob3dBY3RpdmVNc2dMaXN0KTtcclxuICAgICAgJChcIi5tZXNzYWdlLWxpc3RcIikub24oXCJjbGlja1wiLCBhcHAub3BlblJlbW92ZVN0YXJyZWRNc2cpO1xyXG4gICAgICAkKFwiLm5hdmlnYXRpb24tdHJpZ2dlci1saW5rXCIpLm9uKFwiY2xpY2tcIiwgYXBwLnRvZ2dsZU1vYmlsZU5hdmlnYXRpb24pO1xyXG4gICAgICAkKFwiI21haW5fY2hlY2tib3hcIikub24oXCJjaGFuZ2VcIiwgYXBwLnNlbGVjdEFsbE1lc3NhZ2VzKTtcclxuICAgIH0sXHJcblxyXG4gICAgb3BlblJlbW92ZVN0YXJyZWRNc2c6IChlKSA9PiB7XHJcbiAgICAgIGxldCBlVGFyZ2V0ID0gJChlLnRhcmdldCk7XHJcbiAgICAgIGxldCBjdXJyZW50TXNnID0gZVRhcmdldC5jbG9zZXN0KFwiLm1lc3NhZ2UtaXRlbVwiKTtcclxuICAgICAgbGV0IGN1cnJlbnRNc2dJZCA9IGN1cnJlbnRNc2cuZGF0YShcImlkXCIpO1xyXG4gICAgICBsZXQgY3VycmVudFN0b3JlZGdlO1xyXG5cclxuICAgICAgaWYoZVRhcmdldC5oYXNDbGFzcyhcIm1lc3NhZ2Utb3Blbi1saW5rXCIpKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBlVGFyZ2V0LnRvZ2dsZUNsYXNzKFwib3BlbiBjbG9zZWRcIik7XHJcbiAgICAgICAgZVRhcmdldC50ZXh0KGVUYXJnZXQudGV4dCgpID09PSBcIm9wZW5cIiA/IFwiY2xvc2VcIiA6IFwib3BlblwiKTtcclxuICAgICAgICBlVGFyZ2V0LnByb3AoXCJ0aXRsZVwiLCBlVGFyZ2V0LnByb3AoXCJ0aXRsZVwiKSA9PT0gXCJvcGVuXCIgPyBcImNsb3NlXCIgOiBcIm9wZW5cIik7XHJcbiAgICAgICAgY3VycmVudE1zZy5maW5kKFwiLm1lc3NhZ2UtdGV4dFwiKS5zdG9wKHRydWUsIHRydWUpLnNsaWRlVG9nZ2xlKCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGVUYXJnZXQuaGFzQ2xhc3MoXCJyZW1vdmVcIikpIHtcclxuICAgICAgICBjdXJyZW50U3RvcmVkZ2UgPSBcImRlbGV0ZU1zZ0xpc3RcIjtcclxuICAgICAgICBhcHAubW92ZU1lc3NhZ2UoY3VycmVudFN0b3JlZGdlLCBjdXJyZW50TXNnSWQpO1xyXG4gICAgICAgIGN1cnJlbnRNc2cucmVtb3ZlKCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYoZVRhcmdldC5oYXNDbGFzcyhcInN0YXJcIikgJiYgIWVUYXJnZXQuaGFzQ2xhc3MoXCJjaGVja2VkXCIpKSB7XHJcbiAgICAgICAgY3VycmVudFN0b3JlZGdlID0gXCJzdGFyTXNnTGlzdFwiO1xyXG4gICAgICAgIGVUYXJnZXQuYWRkQ2xhc3MoXCJjaGVja2VkXCIpO1xyXG4gICAgICAgIGFwcC5tb3ZlTWVzc2FnZShjdXJyZW50U3RvcmVkZ2UsIGN1cnJlbnRNc2dJZCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbW92ZU1lc3NhZ2U6IChzdG9yYWRnZSwgbXNnSWQpID0+IHtcclxuICAgICAgaWYobG9jYWxTdG9yYWdlW3N0b3JhZGdlXSkge1xyXG4gICAgICAgIGxldCBjdXJyZW50QXJyYXkgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHN0b3JhZGdlKSk7XHJcblxyXG4gICAgICAgIC8vIGN1cnJlbnRBcnJheS5maWx0ZXIoKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgLy8gICBjb25zb2xlLmxvZyhpdGVtKTtcclxuICAgICAgICAvLyAgIGNvbnNvbGUubG9nKG1zZ0lkKTtcclxuICAgICAgICAvLyAgIGlmKGl0ZW0gIT09IG1zZ0lkKSB7XHJcbiAgICAgICAgLy8gICAgIGN1cnJlbnRBcnJheS5wdXNoKG1zZ0lkKTtcclxuICAgICAgICAvLyAgICAgbG9jYWxTdG9yYWdlW3N0b3JhZGdlXSA9IEpTT04uc3RyaW5naWZ5KGN1cnJlbnRBcnJheSk7XHJcbiAgICAgICAgLy8gICB9IGVsc2Uge1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgLy8gICB9XHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgY3VycmVudEFycmF5LnB1c2gobXNnSWQpO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZVtzdG9yYWRnZV0gPSBKU09OLnN0cmluZ2lmeShjdXJyZW50QXJyYXkpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHN0b3JhZGdlLCBKU09OLnN0cmluZ2lmeShbbXNnSWRdKSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc2hvd0FjdGl2ZU1zZ0xpc3Q6ICgpID0+IHtcclxuICAgICAgbGV0IG1zZ0xpc3QgPSAkKFwiLm1lc3NhZ2UtbGlzdFwiKTtcclxuICAgICAgdmFyIHN0b3JhZ2VMaXN0ID0gW107XHJcblxyXG4gICAgICBpZiAobXNnTGlzdC5oYXNDbGFzcyhcImRlbGV0ZWRcIikpIHtcclxuICAgICAgICBpZihsb2NhbFN0b3JhZ2UuZGVsZXRlTXNnTGlzdCkge1xyXG4gICAgICAgICAgbGV0IGFsbE1zZ3NBcnJheSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmFsbE1zZ0xpc3QpO1xyXG4gICAgICAgICAgbGV0IHN0b3JhZ2VEZWxldGVkSWQgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5kZWxldGVNc2dMaXN0KTtcclxuICAgICAgICAgIGxldCBpbmJveE1zZ3NBcnJheTtcclxuXHJcbiAgICAgICAgICBhbGxNc2dzQXJyYXkgPSBhbGxNc2dzQXJyYXkuZmlsdGVyKChtc2cpID0+IHtcclxuICAgICAgICAgICAgaWYoc3RvcmFnZURlbGV0ZWRJZC5pbmRleE9mKGAke21zZy5pZH0gKyAnJ2ApID4gLTEpIHtcclxuICAgICAgICAgICAgICBzdG9yYWdlTGlzdC5wdXNoKG1zZyk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgaW5ib3hNc2dzQXJyYXkgPSBhbGxNc2dzQXJyYXk7XHJcbiAgICAgICAgICBhcHAuY2hlY2tMb2NhbExpc3QoaW5ib3hNc2dzQXJyYXkpO1xyXG4gICAgICAgICAgcmV0dXJuIHN0b3JhZ2VMaXN0O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChtc2dMaXN0Lmhhc0NsYXNzKFwic3RhcnJlZFwiKSAmJiAhbG9jYWxTdG9yYWdlLnN0YXJNc2dMaXN0KSB7XHJcbiAgICAgICAgXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAobXNnTGlzdC5oYXNDbGFzcyhcImluYm94XCIpICYmICFsb2NhbFN0b3JhZ2UuaW5ib3gpIHtcclxuICAgICAgICAkLmdldEpTT04oXCJqc29uL2RhdGEuanNvblwiLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLmFsbE1zZ0xpc3QgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBzdG9yYWdlTGlzdCA9IGxvY2FsU3RvcmFnZS5hbGxNc2dMaXN0O1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGFwcC5zaG93SW5mb01lc3NhZ2UoKTtcclxuICAgICAgfVxyXG4gICAgICBhcHAub3BlbkN1cnJlbnRNc2dMaXN0KHN0b3JhZ2VMaXN0KTtcclxuICAgIH0sXHJcblxyXG4gICAgc2hvd0luZm9NZXNzYWdlOiAoKSA9PiB7XHJcbiAgICAgICQoXCIudGFicy1jb250ZW50LW1zZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKTtcclxuICAgIH0sXHJcblxyXG4gICAgb3BlbkN1cnJlbnRNc2dMaXN0OiAoc3RvcmFnZSkgPT4ge1xyXG4gICAgICAkLmVhY2goSlNPTi5wYXJzZShzdG9yYWdlKSwgKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgJChcIi5tZXNzYWdlLWxpc3RcIikuYXBwZW5kKGBcclxuICAgICAgICAgIDxsaSBjbGFzcz0nbWVzc2FnZS1pdGVtJyBkYXRhLWlkPScke2l0ZW0uaWR9Jz5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz0nbWVzc2FnZSc+PGlucHV0IHR5cGU9J2NoZWNrYm94JyBjbGFzcz0nbWVzc2FnZS1jaGVja2JveCc+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nbWVzc2FnZS10aXRsZSc+JHtpdGVtLnRpdGxlfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9J21lc3NhZ2UtYWN0aW9ucyc+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPScjJyB0aXRsZT0nb3BlbicgY2xhc3M9J21lc3NhZ2UtbGluayBtZXNzYWdlLW9wZW4tbGluayBvcGVuJz5vcGVuPC9hPlxyXG4gICAgICAgICAgICAgICAgPGEgaHJlZj0nIycgdGl0bGU9J2RlbGV0ZScgY2xhc3M9J21lc3NhZ2UtbGluayByZW1vdmUnPnJlbW92ZTwvYT5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9JyMnIHRpdGxlPSdsaWtlJyBjbGFzcz0nbWVzc2FnZS1saW5rIHN0YXInPmxpa2U8L2E+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPSdtZXNzYWdlLXRleHQgaGlkZGVuJz4ke2l0ZW0udGV4dH08L2Rpdj5cclxuICAgICAgICAgIDwvbGk+YCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNoZWNrTG9jYWxMaXN0OiAobGlzdCkgPT4ge1xyXG4gICAgICBpZiAoIWxvY2FsU3RvcmFnZS5saXN0KSB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obGlzdCwgSlNPTi5zdHJpbmdpZnkobGlzdCkpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIGxvY2FsU3RvcmFnZS5saXN0ID0gSlNPTi5zdHJpbmdpZnkobGlzdCk7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlW2xpc3RdID0gSlNPTi5zdHJpbmdpZnkobGlzdCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgdG9nZ2xlTW9iaWxlTmF2aWdhdGlvbjogKGUpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgJChcIi50YWJzXCIpLnN0b3AodHJ1ZSwgdHJ1ZSkuc2xpZGVUb2dnbGUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2VsZWN0QWxsTWVzc2FnZXM6ICgpID0+IHtcclxuICAgICAgbGV0IGNoZWNrYm94ZXMgPSAkKFwiLm1lc3NhZ2UtY2hlY2tib3hcIiksXHJcbiAgICAgICAgbWFpbkNoZWNrYm94ID0gJChcIiNtYWluX2NoZWNrYm94XCIpO1xyXG5cclxuICAgICAgY2hlY2tib3hlcy5wcm9wKFwiY2hlY2tlZFwiLCBtYWluQ2hlY2tib3guaXMoXCI6Y2hlY2tlZFwiKSk7XHJcbiAgICB9XHJcbiAgfTtcclxuICBhcHAuaW5pdCgpO1xyXG59KSgpO1xyXG4iXX0=
