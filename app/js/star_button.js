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

    let checkboxes = this.$msgList.find(".content_msg-checkbox:checked");
    let unStarIdArr = [];
    let starIdArr = [];

    $.each(checkboxes, (index, checkbox) => {
      let checkedItem = $(checkbox).closest(".content_msg-item");
      let checkedItemId = checkedItem.data("id");
      let starIcon = checkedItem.find("a.star");

      starIcon.toggleClass("checked");

      if (starIcon.hasClass("checked")) {
        unStarIdArr.push(checkedItemId);

        if (this.$msgList.hasClass("starred")) {
          checkedItem.remove();
        }
      }
      else {
        starIdArr.push(checkedItemId);
      }
    });

    console.log(unStarIdArr.length);
    this.unStarMsg(unStarIdArr);

    if (starIdArr.length > 0) {
      this.starMsg(starIdArr);
    }
  }

  unStarMsg (idArr) {
    if (idArr.length > 0) {
      localStorage.starMsgIdList = JSON.stringify(JSON.parse(localStorage.starMsgIdList).concat(idArr));
    }
  }

  starMsg (idArr) {
    if (localStorage.starMsgIdList) {
      let starStorage = JSON.parse(localStorage.starMsgIdList);

      idArr.forEach((id) => {
        let newStarStorage = starStorage.filter((item) => {
          if (id === item) {
            return false;
          }
          return true;
        });
        localStorage.starMsgIdList = JSON.stringify(newStarStorage);
      });
    }
    else {
      localStorage.setItem("starMsgIdList", JSON.stringify(idArr));
    }
  }
}
