import MessagesList from "./messages_list";

export default class AppHistory {
  constructor (ui) {
    this.$wrapper = ui;
    this.$nav = ui.find(".nav");
    this.$msgList = ui.find(".content_msg-list");
    this.initEvents();
  }

  initEvents () {
    this.$nav.on("click", this.saveHistory.bind(this));
    $(window).on("popstate", this.showContent.bind(this));
  }

  saveHistory (event) {
    let listName = $(event.target).data("list");

    history.pushState({"tab": listName}, null, `/${listName}`);
  }

  showContent (event) {
    if(event.originalEvent.state) {
      this.$msgList.toggleClass(`${this.$msgList.attr("class")} content_msg-list ${event.originalEvent.state.tab}`);
      new MessagesList(this.$wrapper).showActiveMsgList();
    }
  }
}
