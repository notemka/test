import Navigation from "./navigation";
import MessagesList from "./messages_list";
import Messages from "./messages";
import NewMessageForm from "./new_message_form";
import StarButton from "./star_button";
import DeleteButton from "./delete_button";

(() => {
  let wrapper = $(".wrapper");

  new Navigation(wrapper);
  new MessagesList(wrapper);
  new Messages(wrapper);
  new NewMessageForm(wrapper);
  new StarButton(wrapper);
  new DeleteButton(wrapper);
})();
