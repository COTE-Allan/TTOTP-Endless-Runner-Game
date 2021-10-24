let button_change_page = document.querySelector(".next_page_button");
let page = document.querySelector(".comic_page");
let image = document.querySelector(".comic_page img");

button_change_page.addEventListener('click', event => {
    page.classList.remove("animate__slideInRight");
    page.classList.add("animate__slideOutLeft");
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(function(){
        page.classList.add("animate__slideInRight");
        page.classList.remove("animate__slideOutLeft");
        // Changer la page
        // img.setAttribute("src", "feed-orange.png");

        }, 1000);
});