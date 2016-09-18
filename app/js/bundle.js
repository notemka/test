(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var openCurrentMsgList = function openCurrentMsgList(storage) {
  $.each(JSON.parse(storage), function (index, item) {
    $(".message-list").append("\n      <li class='message-item' data-id='" + item.id + "'>\n        <div class='message'><input type='checkbox' class='message-checkbox'>\n          <div class='message-title'>" + item.title + "</div>\n          <div class='message-actions'>\n            <a href='#' title='open' class='message-link message-open-link open'>open</a>\n            <a href='#' title='delete' class='message-link remove'>remove</a>\n            <a href='#' title='like' class='message-link star'>like</a>\n          </div>\n        </div>\n        <div class='message-text hidden'>" + item.text + "</div>\n      </li>");
  });
};

$(window).on("load", function () {
  var msgList = $(".message-list");
  var storageList = [];

  if (msgList.hasClass("deleted")) {
    if (localStorage.deleteMsgList) {
      (function () {
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

        localStorage.inboxMsgList = JSON.stringify(inboxMsgsArray);
        // localStorage[inboxMsgList] = JSON.stringify(inboxMsgsArray);
      })();
    }
  } else if (msgList.hasClass("draft")) {
      storageList = localStorage.draftMsgList;
    } else if (msgList.hasClass("starred")) {
      storageList = localStorage.starMsgList;
    } else {
      storageList = localStorage.inboxMsgList;
    }
  // console.log(storageList);
  openCurrentMsgList(storageList);
  // $.each(JSON.parse(storageList), (index, item) => {
  //   msgList.append(`
  //     <li class='message-item' data-id='${item.id}'>
  //       <div class='message'><input type='checkbox' class='message-checkbox'>
  //         <div class='message-title'>${item.title}</div>
  //         <div class='message-actions'>
  //           <a href='#' title='open' class='message-link message-open-link open'>open</a>
  //           <a href='#' title='delete' class='message-link remove'>remove</a>
  //           <a href='#' title='like' class='message-link star'>like</a>
  //         </div>
  //       </div>
  //       <div class='message-text hidden'>${item.text}</div>
  //     </li>`);
  //   });

  // let tabLinks = $(".tabs-link");
  // $.each(tabLinks, (index, link) => {
  //   if ($(link).attr("href") === window.location.pathname) {
  //     $(link).toggleClass("active");
  //   }
  // });
});

// let getContent = (url, addState) => {
//   $.get(url)
//   .done((data) => {
//     $(".tabs-content").html(data);
//
//     if(addState == true) {
//       history.pushState(null, null, url.replace(".html", ""))
//     }
//   });
// };
//
// $(".tabs-link").on("click", (e) => {
//   e.preventDefault();
//
//   let path = $(this).attr("href");
//
//   getContent(path, true);
//   $(this).addClass("active").siblings().removeClass("active");
// });
//
// $(window).on("popstate", (e) => {
//   getContent(window.location.pathname, false);
// });

$.getJSON("json/data.json", function (data) {
  localStorage.allMsgList = JSON.stringify(data);
});

var moveMessage = function moveMessage(storadge, msgId) {
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
};

$(".message-list").on("click", function (e) {
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
  } else if (eTarget.hasClass("remove")) {
    currentStoredge = "deleteMsgList";
    moveMessage(currentStoredge, currentMsgId);
    currentMsg.remove();
  } else if (eTarget.hasClass("star") && !eTarget.hasClass("checked")) {
    currentStoredge = "starMsgList";
    eTarget.addClass("checked");
    moveMessage(currentStoredge, currentMsgId);
  }
});

$(".navigation-trigger-link").on("click", function (e) {
  e.preventDefault();

  $(".tabs").stop(true, true).slideToggle();
});

$("#main_checkbox").on("change", function () {
  var checkboxes = $(".message-checkbox"),
      mainCheckbox = $("#main_checkbox");

  checkboxes.prop("checked", mainCheckbox.is(":checked"));
});

$("#button_new").on("click", function () {});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBcXGpzXFxtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLHFCQUFxQixTQUFyQixrQkFBcUIsQ0FBQyxPQUFELEVBQWE7QUFDcEMsSUFBRSxJQUFGLENBQU8sS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFQLEVBQTRCLFVBQUMsS0FBRCxFQUFRLElBQVIsRUFBaUI7QUFDM0MsTUFBRSxlQUFGLEVBQW1CLE1BQW5CLGdEQUNzQyxLQUFLLEVBRDNDLGdJQUdtQyxLQUFLLEtBSHhDLHVYQVV1QyxLQUFLLElBVjVDO0FBWUMsR0FiSDtBQWNELENBZkQ7O0FBaUJBLEVBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxNQUFiLEVBQXFCLFlBQU07QUFDekIsTUFBSSxVQUFVLEVBQUUsZUFBRixDQUFkO0FBQ0EsTUFBSSxjQUFjLEVBQWxCOztBQUVBLE1BQUksUUFBUSxRQUFSLENBQWlCLFNBQWpCLENBQUosRUFBaUM7QUFDL0IsUUFBRyxhQUFhLGFBQWhCLEVBQStCO0FBQUE7QUFDN0IsWUFBSSxlQUFlLEtBQUssS0FBTCxDQUFXLGFBQWEsVUFBeEIsQ0FBbkI7QUFDQSxZQUFJLG1CQUFtQixLQUFLLEtBQUwsQ0FBVyxhQUFhLGFBQXhCLENBQXZCO0FBQ0EsWUFBSSx1QkFBSjs7QUFFQSx1QkFBZSxhQUFhLE1BQWIsQ0FBb0IsVUFBQyxHQUFELEVBQVM7QUFDMUMsY0FBRyxpQkFBaUIsT0FBakIsQ0FBNEIsSUFBSSxFQUFoQyxjQUE2QyxDQUFDLENBQWpELEVBQW9EO0FBQ2xELHdCQUFZLElBQVosQ0FBaUIsR0FBakI7QUFDQSxtQkFBTyxLQUFQO0FBQ0Q7QUFDRCxpQkFBTyxJQUFQO0FBQ0QsU0FOYyxDQUFmOztBQVFBLHFCQUFhLFlBQWIsR0FBNEIsS0FBSyxTQUFMLENBQWUsY0FBZixDQUE1Qjs7QUFiNkI7QUFlOUI7QUFDRixHQWpCRCxNQWtCSyxJQUFJ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LGFBQWEsRUFBYixDQUFnQixVQUFoQixDQUEzQjtBQUNELENBTEQ7O0FBT0EsRUFBRSxhQUFGLEVBQWlCLEVBQWpCLENBQW9CLE9BQXBCLEVBQTZCLFlBQU0sQ0FFbEMsQ0FGRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgb3BlbkN1cnJlbnRNc2dMaXN0ID0gKHN0b3JhZ2UpID0+IHtcclxuICAkLmVhY2goSlNPTi5wYXJzZShzdG9yYWdlKSwgKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAkKFwiLm1lc3NhZ2UtbGlzdFwiKS5hcHBlbmQoYFxyXG4gICAgICA8bGkgY2xhc3M9J21lc3NhZ2UtaXRlbScgZGF0YS1pZD0nJHtpdGVtLmlkfSc+XHJcbiAgICAgICAgPGRpdiBjbGFzcz0nbWVzc2FnZSc+PGlucHV0IHR5cGU9J2NoZWNrYm94JyBjbGFzcz0nbWVzc2FnZS1jaGVja2JveCc+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPSdtZXNzYWdlLXRpdGxlJz4ke2l0ZW0udGl0bGV9PC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPSdtZXNzYWdlLWFjdGlvbnMnPlxyXG4gICAgICAgICAgICA8YSBocmVmPScjJyB0aXRsZT0nb3BlbicgY2xhc3M9J21lc3NhZ2UtbGluayBtZXNzYWdlLW9wZW4tbGluayBvcGVuJz5vcGVuPC9hPlxyXG4gICAgICAgICAgICA8YSBocmVmPScjJyB0aXRsZT0nZGVsZXRlJyBjbGFzcz0nbWVzc2FnZS1saW5rIHJlbW92ZSc+cmVtb3ZlPC9hPlxyXG4gICAgICAgICAgICA8YSBocmVmPScjJyB0aXRsZT0nbGlrZScgY2xhc3M9J21lc3NhZ2UtbGluayBzdGFyJz5saWtlPC9hPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz0nbWVzc2FnZS10ZXh0IGhpZGRlbic+JHtpdGVtLnRleHR9PC9kaXY+XHJcbiAgICAgIDwvbGk+YCk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbiQod2luZG93KS5vbihcImxvYWRcIiwgKCkgPT4ge1xyXG4gIGxldCBtc2dMaXN0ID0gJChcIi5tZXNzYWdlLWxpc3RcIik7XHJcbiAgbGV0IHN0b3JhZ2VMaXN0ID0gW107XHJcblxyXG4gIGlmIChtc2dMaXN0Lmhhc0NsYXNzKFwiZGVsZXRlZFwiKSkge1xyXG4gICAgaWYobG9jYWxTdG9yYWdlLmRlbGV0ZU1zZ0xpc3QpIHtcclxuICAgICAgbGV0IGFsbE1zZ3NBcnJheSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmFsbE1zZ0xpc3QpO1xyXG4gICAgICBsZXQgc3RvcmFnZURlbGV0ZWRJZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmRlbGV0ZU1zZ0xpc3QpO1xyXG4gICAgICBsZXQgaW5ib3hNc2dzQXJyYXk7XHJcblxyXG4gICAgICBhbGxNc2dzQXJyYXkgPSBhbGxNc2dzQXJyYXkuZmlsdGVyKChtc2cpID0+IHtcclxuICAgICAgICBpZihzdG9yYWdlRGVsZXRlZElkLmluZGV4T2YoYCR7bXNnLmlkfSArICcnYCkgPiAtMSkge1xyXG4gICAgICAgICAgc3RvcmFnZUxpc3QucHVzaChtc2cpO1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBsb2NhbFN0b3JhZ2UuaW5ib3hNc2dMaXN0ID0gSlNPTi5zdHJpbmdpZnkoaW5ib3hNc2dzQXJyYXkpO1xyXG4gICAgICAvLyBsb2NhbFN0b3JhZ2VbaW5ib3hNc2dMaXN0XSA9IEpTT04uc3RyaW5naWZ5KGluYm94TXNnc0FycmF5KTtcclxuICAgIH1cclxuICB9XHJcbiAgZWxzZSBpZiAobXNnTGlzdC5oYXNDbGFzcyhcImRyYWZ0XCIpKSB7XHJcbiAgICBzdG9yYWdlTGlzdCA9IGxvY2FsU3RvcmFnZS5kcmFmdE1zZ0xpc3Q7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKG1zZ0xpc3QuaGFzQ2xhc3MoXCJzdGFycmVkXCIpKSB7XHJcbiAgICBzdG9yYWdlTGlzdCA9IGxvY2FsU3RvcmFnZS5zdGFyTXNnTGlzdDtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBzdG9yYWdlTGlzdCA9IGxvY2FsU3RvcmFnZS5pbmJveE1zZ0xpc3Q7XHJcbiAgfVxyXG4gIC8vIGNvbnNvbGUubG9nKHN0b3JhZ2VMaXN0KTtcclxuICBvcGVuQ3VycmVudE1zZ0xpc3Qoc3RvcmFnZUxpc3QpO1xyXG4gIC8vICQuZWFjaChKU09OLnBhcnNlKHN0b3JhZ2VMaXN0KSwgKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgLy8gICBtc2dMaXN0LmFwcGVuZChgXHJcbiAgLy8gICAgIDxsaSBjbGFzcz0nbWVzc2FnZS1pdGVtJyBkYXRhLWlkPScke2l0ZW0uaWR9Jz5cclxuICAvLyAgICAgICA8ZGl2IGNsYXNzPSdtZXNzYWdlJz48aW5wdXQgdHlwZT0nY2hlY2tib3gnIGNsYXNzPSdtZXNzYWdlLWNoZWNrYm94Jz5cclxuICAvLyAgICAgICAgIDxkaXYgY2xhc3M9J21lc3NhZ2UtdGl0bGUnPiR7aXRlbS50aXRsZX08L2Rpdj5cclxuICAvLyAgICAgICAgIDxkaXYgY2xhc3M9J21lc3NhZ2UtYWN0aW9ucyc+XHJcbiAgLy8gICAgICAgICAgIDxhIGhyZWY9JyMnIHRpdGxlPSdvcGVuJyBjbGFzcz0nbWVzc2FnZS1saW5rIG1lc3NhZ2Utb3Blbi1saW5rIG9wZW4nPm9wZW48L2E+XHJcbiAgLy8gICAgICAgICAgIDxhIGhyZWY9JyMnIHRpdGxlPSdkZWxldGUnIGNsYXNzPSdtZXNzYWdlLWxpbmsgcmVtb3ZlJz5yZW1vdmU8L2E+XHJcbiAgLy8gICAgICAgICAgIDxhIGhyZWY9JyMnIHRpdGxlPSdsaWtlJyBjbGFzcz0nbWVzc2FnZS1saW5rIHN0YXInPmxpa2U8L2E+XHJcbiAgLy8gICAgICAgICA8L2Rpdj5cclxuICAvLyAgICAgICA8L2Rpdj5cclxuICAvLyAgICAgICA8ZGl2IGNsYXNzPSdtZXNzYWdlLXRleHQgaGlkZGVuJz4ke2l0ZW0udGV4dH08L2Rpdj5cclxuICAvLyAgICAgPC9saT5gKTtcclxuICAvLyAgIH0pO1xyXG5cclxuICAvLyBsZXQgdGFiTGlua3MgPSAkKFwiLnRhYnMtbGlua1wiKTtcclxuICAvLyAkLmVhY2godGFiTGlua3MsIChpbmRleCwgbGluaykgPT4ge1xyXG4gIC8vICAgaWYgKCQobGluaykuYXR0cihcImhyZWZcIikgPT09IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSkge1xyXG4gIC8vICAgICAkKGxpbmspLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG4gIC8vICAgfVxyXG4gIC8vIH0pO1xyXG59KTtcclxuXHJcbi8vIGxldCBnZXRDb250ZW50ID0gKHVybCwgYWRkU3RhdGUpID0+IHtcclxuLy8gICAkLmdldCh1cmwpXHJcbi8vICAgLmRvbmUoKGRhdGEpID0+IHtcclxuLy8gICAgICQoXCIudGFicy1jb250ZW50XCIpLmh0bWwoZGF0YSk7XHJcbi8vXHJcbi8vICAgICBpZihhZGRTdGF0ZSA9PSB0cnVlKSB7XHJcbi8vICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIHVybC5yZXBsYWNlKFwiLmh0bWxcIiwgXCJcIikpXHJcbi8vICAgICB9XHJcbi8vICAgfSk7XHJcbi8vIH07XHJcbi8vXHJcbi8vICQoXCIudGFicy1saW5rXCIpLm9uKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuLy8gICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbi8vXHJcbi8vICAgbGV0IHBhdGggPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpO1xyXG4vL1xyXG4vLyAgIGdldENvbnRlbnQocGF0aCwgdHJ1ZSk7XHJcbi8vICAgJCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG4vLyB9KTtcclxuLy9cclxuLy8gJCh3aW5kb3cpLm9uKFwicG9wc3RhdGVcIiwgKGUpID0+IHtcclxuLy8gICBnZXRDb250ZW50KHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSwgZmFsc2UpO1xyXG4vLyB9KTtcclxuXHJcbiQuZ2V0SlNPTihcImpzb24vZGF0YS5qc29uXCIsIChkYXRhKSA9PiB7XHJcbiAgbG9jYWxTdG9yYWdlLmFsbE1zZ0xpc3QgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxufSk7XHJcblxyXG5sZXQgbW92ZU1lc3NhZ2UgPSAoc3RvcmFkZ2UsIG1zZ0lkKSA9PiB7XHJcbiAgaWYobG9jYWxTdG9yYWdlW3N0b3JhZGdlXSkge1xyXG4gICAgbGV0IGN1cnJlbnRBcnJheSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oc3RvcmFkZ2UpKTtcclxuXHJcbiAgICAvLyBjdXJyZW50QXJyYXkuZmlsdGVyKChpbmRleCwgaXRlbSkgPT4ge1xyXG4gICAgLy8gICBjb25zb2xlLmxvZyhpdGVtKTtcclxuICAgIC8vICAgY29uc29sZS5sb2cobXNnSWQpO1xyXG4gICAgLy8gICBpZihpdGVtICE9PSBtc2dJZCkge1xyXG4gICAgLy8gICAgIGN1cnJlbnRBcnJheS5wdXNoKG1zZ0lkKTtcclxuICAgIC8vICAgICBsb2NhbFN0b3JhZ2Vbc3RvcmFkZ2VdID0gSlNPTi5zdHJpbmdpZnkoY3VycmVudEFycmF5KTtcclxuICAgIC8vICAgfSBlbHNlIHtcclxuICAgIC8vICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAvLyAgIH1cclxuICAgIC8vIH0pO1xyXG4gICAgY3VycmVudEFycmF5LnB1c2gobXNnSWQpO1xyXG4gICAgbG9jYWxTdG9yYWdlW3N0b3JhZGdlXSA9IEpTT04uc3RyaW5naWZ5KGN1cnJlbnRBcnJheSk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oc3RvcmFkZ2UsIEpTT04uc3RyaW5naWZ5KFttc2dJZF0pKTtcclxuICB9XHJcbn07XHJcblxyXG4kKFwiLm1lc3NhZ2UtbGlzdFwiKS5vbihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgbGV0IGVUYXJnZXQgPSAkKGUudGFyZ2V0KTtcclxuICBsZXQgY3VycmVudE1zZyA9IGVUYXJnZXQuY2xvc2VzdChcIi5tZXNzYWdlLWl0ZW1cIik7XHJcbiAgbGV0IGN1cnJlbnRNc2dJZCA9IGN1cnJlbnRNc2cuZGF0YShcImlkXCIpO1xyXG4gIGxldCBjdXJyZW50U3RvcmVkZ2U7XHJcblxyXG4gIGlmKGVUYXJnZXQuaGFzQ2xhc3MoXCJtZXNzYWdlLW9wZW4tbGlua1wiKSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGVUYXJnZXQudG9nZ2xlQ2xhc3MoXCJvcGVuIGNsb3NlZFwiKTtcclxuICAgIGVUYXJnZXQudGV4dChlVGFyZ2V0LnRleHQoKSA9PT0gXCJvcGVuXCIgPyBcImNsb3NlXCIgOiBcIm9wZW5cIik7XHJcbiAgICBlVGFyZ2V0LnByb3AoXCJ0aXRsZVwiLCBlVGFyZ2V0LnByb3AoXCJ0aXRsZVwiKSA9PT0gXCJvcGVuXCIgPyBcImNsb3NlXCIgOiBcIm9wZW5cIik7XHJcbiAgICBjdXJyZW50TXNnLmZpbmQoXCIubWVzc2FnZS10ZXh0XCIpLnN0b3AodHJ1ZSwgdHJ1ZSkuc2xpZGVUb2dnbGUoKTtcclxuICB9XHJcbiAgZWxzZSBpZiAoZVRhcmdldC5oYXNDbGFzcyhcInJlbW92ZVwiKSkge1xyXG4gICAgY3VycmVudFN0b3JlZGdlID0gXCJkZWxldGVNc2dMaXN0XCI7XHJcbiAgICBtb3ZlTWVzc2FnZShjdXJyZW50U3RvcmVkZ2UsIGN1cnJlbnRNc2dJZCk7XHJcbiAgICBjdXJyZW50TXNnLnJlbW92ZSgpO1xyXG4gIH1cclxuICBlbHNlIGlmKGVUYXJnZXQuaGFzQ2xhc3MoXCJzdGFyXCIpICYmICFlVGFyZ2V0Lmhhc0NsYXNzKFwiY2hlY2tlZFwiKSkge1xyXG4gICAgY3VycmVudFN0b3JlZGdlID0gXCJzdGFyTXNnTGlzdFwiO1xyXG4gICAgZVRhcmdldC5hZGRDbGFzcyhcImNoZWNrZWRcIik7XHJcbiAgICBtb3ZlTWVzc2FnZShjdXJyZW50U3RvcmVkZ2UsIGN1cnJlbnRNc2dJZCk7XHJcbiAgfVxyXG59KTtcclxuXHJcbiQoXCIubmF2aWdhdGlvbi10cmlnZ2VyLWxpbmtcIikub24oXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgJChcIi50YWJzXCIpLnN0b3AodHJ1ZSwgdHJ1ZSkuc2xpZGVUb2dnbGUoKTtcclxufSk7XHJcblxyXG4kKFwiI21haW5fY2hlY2tib3hcIikub24oXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gIGxldCBjaGVja2JveGVzID0gJChcIi5tZXNzYWdlLWNoZWNrYm94XCIpLFxyXG4gICAgbWFpbkNoZWNrYm94ID0gJChcIiNtYWluX2NoZWNrYm94XCIpO1xyXG5cclxuICBjaGVja2JveGVzLnByb3AoXCJjaGVja2VkXCIsIG1haW5DaGVja2JveC5pcyhcIjpjaGVja2VkXCIpKTtcclxufSk7XHJcblxyXG4kKFwiI2J1dHRvbl9uZXdcIikub24oXCJjbGlja1wiLCAoKSA9PiB7XHJcblxyXG59KTtcclxuIl19
