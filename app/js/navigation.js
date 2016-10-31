import MessagesList  from "./messages_list";

class Navigation {
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
    e.preventDefault();

    let currentLink = $(e.target);
    let url = currentLink.attr("href");

    currentLink.addClass("active").siblings().removeClass("active");
    this.clearMsgList();

    if (window.innerWidth <= 480) {
      this.toggleMobileNavigation(e);
    }

    if (url !== "/") {
      this.$msgList.toggleClass(`${this.$msgList.attr("class")} content_msg-list ${url.slice(1)}`);
    }
    else {
      this.$msgList.toggleClass(`${this.$msgList.attr("class")} content_msg-list inbox`);
    }
    new MessagesList(this.$wrapper).showActiveMsgList();
  }

  clearMsgList () {
    this.$msgList.html("");
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

export default Navigation;
