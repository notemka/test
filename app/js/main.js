import Navigation from "./navigation";
import Messages from "./messages";
import MessagesList from "./messages_list";
import DeleteButton from "./delete_button";
import NewMessageForm from "./new_message_form";

(() => {
  let wrapper = $(".wrapper");

  new Navigation(wrapper);
  new Messages(wrapper);
  new MessagesList(wrapper);
  new DeleteButton(wrapper);
  new NewMessageForm(wrapper);
})();
