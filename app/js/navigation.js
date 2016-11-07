import MessagesList  from "./messages_list";

export default class Navigation {
  constructor(ui) {
    this.$wrapper = ui;
    this.$nav = ui.find(".nav");
    this.$navigationTrigger = ui.find(".header-nav-trigger");
    this.$msgList = ui.find(".content_msg-list");

    this.initEvents();
  }

  initEvents () {
    $(window).on("resize", this.showNavigation.bind(this));
    this.$navigationTrigger.on("click", this.toggleMobileNavigation.bind(this));
    this.$nav.on("click", this.selectActiveNavLink.bind(this));
  }

  selectActiveNavLink (e) {
    let listName = $(e.target).data("list");

    e.preventDefault();

    if (window.innerWidth <= 480) {
      this.toggleMobileNavigation(e);
    }

    this.$msgList.toggleClass(`${this.$msgList.attr("class")} content_msg-list ${listName}`);
    new MessagesList(this.$wrapper).showActiveMsgList();
  }

  toggleMobileNavigation (e) {
    e.preventDefault();

    this.$nav.stop(true, true).slideToggle();
  }

  showNavigation () {
    if (window.innerWidth > 480) {
      this.$nav.removeAttr("style");
    }
  }
}
