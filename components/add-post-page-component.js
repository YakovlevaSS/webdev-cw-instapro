import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {

  let imageUrl = "";

  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
    <div class="header-container"></div>
     <div class="form">
      <h3 class="form-title">Добавить пост</h3>
      <div class="form-inputs">
          <div class="upload-image-container"></div>
          <p>Опишите фотографию:</p>
          <textarea class="input textarea" rows="4"></textarea>
          
      <button class="button" id="add-button">Добавить</button>
    </div>
  `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    renderUploadImageComponent({
      element: appEl.querySelector(".upload-image-container"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    const textInput = appEl.querySelector(".textarea");

    document.getElementById("add-button").addEventListener("click", () => {
      if (!imageUrl) {
        alert("Выберите фото");
        return;
      }
      if (!textInput.value) {
        alert("Не заполнено описание фото")
        return;
      }
      onAddPostClick({
        description: textInput.value
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;"),
        imageUrl,
      });
    });
  };

  render();
}
