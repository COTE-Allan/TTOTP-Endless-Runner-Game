let button_next_page = document.querySelector(".next_page_button");
let button_previous_page = document.querySelector(".previous_page_button");
let page = document.querySelector(".comic_page");
let image = document.querySelector(".comic_page img");
let page_number = 1;
let page_number_text = document.querySelector(".page_number");

page_number_text.textContent = page_number;
if (page_number == 1) {
  button_previous_page.classList.add("button_disabled");
}

button_next_page.addEventListener("click", (event) => {
  page_number++;
  if (page_number <= 5) {
    page.classList.add("animate__slideOutLeft");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(function () {
      page.classList.add("animate__slideInRight");
      page.classList.remove("animate__slideOutLeft");
      page_number_text.textContent = page_number;
      // Changer la page
      // img.setAttribute("src", "feed-orange.png");
      setTimeout(function () {
        page.classList.remove("animate__slideInRight");
      }, 1000);
    }, 1000);
  }
});

button_previous_page.addEventListener("click", (event) => {
  page_number--;
  if (page_number > 1) {
    page.classList.remove("animate_slideInRight");
    page.classList.add("animate__slideOutRight");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(function () {
      page.classList.add("animate__slideInLeft");
      page.classList.remove("animate__slideOutRight");
      page_number_text.textContent = page_number;
      // Changer la page
      // img.setAttribute("src", "feed-orange.png");
      setTimeout(function () {
        page.classList.remove("animate__slideInLeft");
      }, 1000);
    }, 1000);
  }
});
