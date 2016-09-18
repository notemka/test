let openCurrentMsgList = (storage) => {
  $.each(JSON.parse(storage), (index, item) => {
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
};

$(window).on("load", () => {
  let msgList = $(".message-list");
  let storageList = [];

  if (msgList.hasClass("deleted")) {
    if(localStorage.deleteMsgList) {
      let allMsgsArray = JSON.parse(localStorage.allMsgList);
      let storageDeletedId = JSON.parse(localStorage.deleteMsgList);
      let inboxMsgsArray;

      allMsgsArray = allMsgsArray.filter((msg) => {
        if(storageDeletedId.indexOf(`${msg.id} + ''`) > -1) {
          storageList.push(msg);
          return false;
        }
        return true;
      });

      localStorage.inboxMsgList = JSON.stringify(inboxMsgsArray);
      // localStorage[inboxMsgList] = JSON.stringify(inboxMsgsArray);
    }
  }
  else if (msgList.hasClass("draft")) {
    storageList = localStorage.draftMsgList;
  }
  else if (msgList.hasClass("starred")) {
    storageList = localStorage.starMsgList;
  }
  else {
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

$.getJSON("json/data.json", (data) => {
  localStorage.allMsgList = JSON.stringify(data);
});

let moveMessage = (storadge, msgId) => {
  if(localStorage[storadge]) {
    let currentArray = JSON.parse(localStorage.getItem(storadge));

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
  }
  else {
    localStorage.setItem(storadge, JSON.stringify([msgId]));
  }
};

$(".message-list").on("click", (e) => {
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
  else if (eTarget.hasClass("remove")) {
    currentStoredge = "deleteMsgList";
    moveMessage(currentStoredge, currentMsgId);
    currentMsg.remove();
  }
  else if(eTarget.hasClass("star") && !eTarget.hasClass("checked")) {
    currentStoredge = "starMsgList";
    eTarget.addClass("checked");
    moveMessage(currentStoredge, currentMsgId);
  }
});

$(".navigation-trigger-link").on("click", (e) => {
  e.preventDefault();

  $(".tabs").stop(true, true).slideToggle();
});

$("#main_checkbox").on("change", () => {
  let checkboxes = $(".message-checkbox"),
    mainCheckbox = $("#main_checkbox");

  checkboxes.prop("checked", mainCheckbox.is(":checked"));
});

$("#button_new").on("click", () => {

});
