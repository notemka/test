export default class StarButton {
  constructor(ui) {
    this.$msgList = ui.find(".content_msg-list");
    this.$buttonStar = ui.find("#button_star");

    this.initEvents();
  }

  initEvents () {
    this.$buttonStar.on("click", this.starCheckedMsgs.bind(this));
  }

  starCheckedMsgs (e) {
    e.preventDefault();

    let checkboxes = this.$msgList.find(".content_msg-checkbox");
    let checkedMsgIdArr = [];

    if (checkboxes.is(":checked")) {
      $.each(checkboxes, (index, checkbox) => {
        if ($(checkbox).is(":checked")) {
          let checkedItem = $(checkbox).closest(".content_msg-item");
          let checkedItemId = $(checkbox).closest(".content_msg-item").data("id");
          let starIcon = checkedItem.find("a.star");

          checkedMsgIdArr.push(checkedItemId);
        }
      });
      this.toggleStar(checkedMsgIdArr);
    }
  }

  toggleStar (checkedArr) {
    let starStorage = JSON.parse(localStorage.starMsgIdList);

    if (localStorage.starMsgIdList) {
      checkedArr.forEach((id) => {
        let msgStar = $(id).closest(".content_msg-item").find("a.star");

        if (msgStar.hasClass("checked")) {
          let newStarStorage = starStorage.filter((item) => {
            if (id === item) {
              return false;
            }
            return true;
          });
          localStorage.starMsgIdList = JSON.stringify(newStarStorage);
        }
        else {
          localStorage.starMsgIdList = JSON.stringify(starStorage.concat(checkedArr));
        }

        msgStar.toggleClass("checked");
      });
    }
    else {
      localStorage.setItem("starMsgIdList", JSON.stringify(checkedArr));
    }

    // msgStar.toggleClass("checked");
  }
}
