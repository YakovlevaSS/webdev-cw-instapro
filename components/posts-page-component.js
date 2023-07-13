import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, userPosts, goToPage, deletePost } from "../index.js";
import { addLikeToPost, removeLikeToPost } from "../api.js";

import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale"


function showLikes(likes) {
  if (likes.length === 0) {
    return "0";
  }
  if (likes.length === 1) {
    return `${likes[0].name}`;
  }
  return `${likes[0].name} и ещё ${likes.length - 1}`;
}

function likePost(token, page, data) {
  const likeButtons = document.querySelectorAll(".like-button");

  for (const likeButton of likeButtons) {
    likeButton.addEventListener("click", () => {
      let id = likeButton.dataset.postId;

      if (likeButton.dataset.liked == "false") {
        addLikeToPost({
          id,
          token,
        })
          .then(() => {
            goToPage(page, data);
          })
          .catch((error) => {
            alert(error.message);
          });
      } else {
        removeLikeToPost({
          id,
          token,
        })
          .then(() => {
            goToPage(page, data);
          })
          .catch((error) => {
            alert(error.message);
          });
      }
    });
  }
}

function deletePostListener() {
  const deleteButtons = document.querySelectorAll(".delete-button");
  console.log(deleteButtons);
  
  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const id = deleteButton.dataset.id;
      deletePost(id);
    });
  }
}

export function renderPostsPageComponent({ appEl, token }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  let postsHtml = posts
    .map((post) => {
      return `
    <li class="post">
      <div class="post-header" data-user-id="${post.user.id}">
          <img src="${post.user.imageUrl}" class="post-header__user-image">
          <p class="post-header__user-name">${post.user.name}</p>
      </div>
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}">
      </div>
      <div class="post-likes">
        <button data-post-id="${post.id}" data-liked="${post.isLiked
        }" class="like-button">
        ${post.isLiked
          ? `<img src="./assets/images/like-active.svg">`
          : `<img src="./assets/images/like-not-active.svg">`
        }
          
        </button>
        <p class="post-likes-text">
          Нравится: <strong>${showLikes(post.likes)}</strong>
        </p>
      </div>
      <p class="post-text">
        <span class="user-name">${post.user.name}</span>
        ${post.description}
      </p>
      <p class="post-date">
      ${formatDistanceToNow(new Date(post.createdAt), { locale: ru })}
      </p>
      <button data-id=${post.id}  class="button delete-button">Удалить</button>
      </div>
      </div>
    </li>`;
    })
    .join("");
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts center">
                  ${postsHtml}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
      console.log(`рабоьтает переход на ${userEl.dataset.userId}`);
    });
  }
  const page = POSTS_PAGE;
  likePost(token, page, {});

  deletePostListener();
}

export function renderUserPostComponent({appEl, token}) {
  let userPostsHtml = userPosts
    .map((post) => {
      return `  
    <li class="post">
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}">
      </div>
      <div class="post-likes">
        <button data-post-id="${post.id}" data-liked="${post.isLiked
        }" class="like-button">
        ${post.isLiked
          ? `<img src="./assets/images/like-active.svg">`
          : `<img src="./assets/images/like-not-active.svg">`
        }
        </button>
        <p class="post-likes-text">
          Нравится: <strong>${showLikes(post.likes)}</strong>
        </p>
      </div>
      <p class="post-text">
        <span class="user-name">${post.user.name}</span>
        ${post.description}
      </p>
      <p class="post-date">
      ${formatDistanceToNow(new Date(post.createdAt), { locale: ru })}
      </p>
      <button data-id=${post.id}  class="button delete-button">Удалить</button>
      </div>
      </div>
      </li>`;
    })
    .join("");

  let userName = userPosts[0]?.user.name;
  let userImage = userPosts[0]?.user.imageUrl;
  const appHtml = `
                <div class="page-container">
                  <div class="header-container"></div>
                  </div>
                  <div class="posts-user-header">
                      <img src="${userImage}" class="posts-user-header__user-image">
                      <p class="posts-user-header__user-name">${userName}</p>
                  </div>
                  <ul class="posts posts-user">
                    ${userPostsHtml}
                  </ul>
                `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  const page = USER_POSTS_PAGE;
  let data = {
    userId: userPosts[0]?.user.id
  };
  
  likePost(token, page, data);
  deletePostListener()
}

