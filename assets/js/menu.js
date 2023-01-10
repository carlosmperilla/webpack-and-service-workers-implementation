const links = document.querySelectorAll(".menu-screen a");
const menuScreen = document.getElementsByClassName("menu-screen")[0];

function scrollToElement(element) {
    window.scrollTo({
        'behavior' : 'smooth',
        'top' : element.offsetTop
    });
}

document.querySelector(".menu").addEventListener("click", () => {
    menuScreen.classList.add('active');
})

document.querySelector(".close").addEventListener("click", () => {
    menuScreen.classList.remove('active');
})

links.forEach(link => {
    link.addEventListener('click', (e)=>{
        menuScreen.classList.remove('active');
        let paths = link.href.split("/");
        const selector = paths[paths.length - 1];

        if (window.scrollTo) e.preventDefault();

        scrollToElement(document.querySelector(selector));

        return !!window.scrollTo;

    })
})