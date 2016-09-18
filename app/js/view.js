// var View = {
//   render: (currentList) => {
//     storageList = localStorage[currentList];
//
//     $.each(JSON.parse(storageList), (index, item) => {
//     msgList.append(`
//       <li class='message-item' data-id='${item.id}'>
//         <div class='message'><input type='checkbox' class='message-checkbox'>
//           <div class='message-title'>${item.title}</div>
//           <div class='message-actions'>
//             <a href='#' title='open' class='message-link message-open-link open'>open</a>
//             <a href='#' title='delete' class='message-link remove'>remove</a>
//             <a href='#' title='like' class='message-link star'>like</a>
//           </div>
//         </div>
//         <div class='message-text hidden'>${item.text}</div>
//       </li>`);
//     });
//   }
// };
