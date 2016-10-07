// var Model = {
//   openMessages: => {
//     $(".content_msg-list").on("click", (e) => {
//       let eTarget = $(e.target);
//       let currentMsg = eTarget.closest(".content_msg-item");
//       let currentMsgId = currentMsg.data("id");
//       let currentStoredge;
//
//       if(eTarget.hasClass("message-open-link")) {
//         e.preventDefault();
//
//         eTarget.toggleClass("open closed");
//         eTarget.text(eTarget.text() === "open" ? "close" : "open");
//         eTarget.prop("title", eTarget.prop("title") === "open" ? "close" : "open");
//         currentMsg.find(".message-text").stop(true, true).slideToggle();
//       }
//       else if (eTarget.hasClass("remove")) {
//         currentStoredge = "deleteMsgList";
//         this.moveMessage(currentStoredge, currentMsgId);
//         currentMsg.remove();
//       }
//       else if(eTarget.hasClass("star") && !eTarget.hasClass("checked")) {
//         currentStoredge = "starMsgList";
//         eTarget.addClass("checked");
//         this.moveMessage(currentStoredge, currentMsgId);
//       }
//     });
//   },
//
//   moveMessage: (storedge, msgId) => {
//     if(localStorage[storedge]) {
//       let currentArray = JSON.parse(localStorage.getItem(storedge));
//
//       // currentArray.filter((index, item) => {
//       //   console.log(item);
//       //   console.log(msgId);
//       //   if(item !== msgId) {
//       //     currentArray.push(msgId);
//       //     localStorage[storedge] = JSON.stringify(currentArray);
//       //   } else {
//       //     return false;
//       //   }
//       // });
//       currentArray.push(msgId);
//       localStorage[storedge] = JSON.stringify(currentArray);
//     }
//     else {
//       localStorage.setItem(storedge, JSON.stringify([msgId]));
//     }
//   },
//
//   selectAllMessages: => {
//     $("#main_checkbox").on("change", () => {
//       let checkboxes = $(".message-checkbox"),
//         mainCheckbox = $("#main_checkbox");
//
//       checkboxes.prop("checked", mainCheckbox.is(":checked"));
//     });
//   },
//
//   slideMenu: => {
//     $(".header-nav-trigger-link").on("click", (e) => {
//       e.preventDefault();
//
//       $(".tabs").stop(true, true).slideToggle();
//     });
//   },
//
//   newLetter: => {
//      return View.render(new);
//   },
//
//   inboxList: => {
//     return View.render(inboxList);
//   },
//
//   draftList: => {
//     return View.render(draftList);
//   },
//
//   starredList: => {
//     return View.render(starredList);
//   },
//
//   deletedList: => {
//     return View.render(deletedList);
//   }
// };
