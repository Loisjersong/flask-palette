/*==================== SHOW MENU ====================*/
const navMenu = document.getElementById("nav-menu"),
    navToggle = document.getElementById("nav-toggle"),
    navClose = document.getElementById("nav-close");

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if (navToggle) {
    navToggle.addEventListener("click", () => {
        navMenu.classList.add("show-menu");
    });
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if (navClose) {
    navClose.addEventListener("click", () => {
        navMenu.classList.remove("show-menu");
    });
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll(".nav__link");

function linkAction() {
    const navMenu = document.getElementById("nav-menu");
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove("show-menu");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
    const header = document.getElementById("header");
    // When the scroll is greater than 100 viewport height, add the scroll-header class to the header tag
    if (this.scrollY >= 100) header.classList.add("scroll-header");
    else header.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

/*==================== SWIPER DISCOVER ====================*/
let swiper = new Swiper(".discover__container", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    loop: true,
    spaceBetween: 32,
    coverflowEffect: {
        rotate: 0,
    },
});

/*==================== SHOW SCROLL UP ====================*/
function scrollUp() {
    const scrollUp = document.getElementById("scroll-up");
    // When the scroll is higher than 200 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if (this.scrollY >= 200) scrollUp.classList.add("show-scroll");
    else scrollUp.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUp);

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute("id");

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document
                .querySelector(".nav__menu a[href*=" + sectionId + "]")
                .classList.add("active-link");
        } else {
            document
                .querySelector(".nav__menu a[href*=" + sectionId + "]")
                .classList.remove("active-link");
        }
    });
}
window.addEventListener("scroll", scrollActive);

/*==================== SCROLL REVEAL ANIMATION ====================*/
const sr = ScrollReveal({
    distance: "60px",
    duration: 2800,
    // reset: true,
});

sr.reveal(
    `.home__data, .home__social-link, .home__info,
           .about__container,
           .about__data, .tool__overlay,
           .about__card,
           .footer__data, .footer__rights`,
    {
        origin: "top",
        interval: 100,
    }
);

sr.reveal(
    `.about__data, 
           .contactus__description`,
    {
        origin: "left",
    }
);

sr.reveal(
    `.about__img-overlay, 
           .contactus__form`,
    {
        origin: "right",
        interval: 100,
    }
);

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "ri-sun-line";

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () =>
    document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
    themeButton.classList.contains(iconTheme) ? "ri-moon-line" : "ri-sun-line";

// We validate if the user previously chose a topic
if (selectedTheme) {
    // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
    document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
        darkTheme
    );
    themeButton.classList[selectedIcon === "ri-moon-line" ? "add" : "remove"](
        iconTheme
    );
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);
    // We save the theme and the current icon that the user chose
    localStorage.setItem("selected-theme", getCurrentTheme());
    localStorage.setItem("selected-icon", getCurrentIcon());
});



/*==================== COLOR PALETTE GENERATION ====================*/
        const form = document.querySelector("#colorForm");
        const originalPaletteDiv = document.querySelector("#originalPalette");
        const complementaryPaletteDiv = document.querySelector("#complementaryPalette");
        const brightnessPaletteDiv = document.querySelector("#brightnessPalette");

        form.addEventListener("submit", async(e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const response = await fetch("/", {
                method: "POST",
                body: formData
            });
            const data = await response.json();

            if (Array.isArray(data)) {
                displayPalette(data, originalPaletteDiv, "original");
            } else {
                console.error("Unexpected server response:", data);
            }
        });

        function displayPalette(colors, container, type) {
            container.innerHTML = ""; // Clear previous palette

            colors.forEach((color) => {
                const paletteContainer = document.createElement("div");
                paletteContainer.className = "palette";

                const swatch = createSwatch(color);
                const hexValue = createHexValue(color);

                paletteContainer.appendChild(swatch);
                paletteContainer.appendChild(hexValue);
                container.appendChild(paletteContainer);

                swatch.addEventListener("click", async() => {
                    switch (type) {
                        case "original":
                            const complementaryResponse = await fetch(
                                `/complementary?color=${color.join(",")}`
                            );
                            const complementaryData = await complementaryResponse.json();
                            displayPalette(
                                complementaryData,
                                complementaryPaletteDiv,
                                "complementary"
                            );
                            break;
                        case "complementary":
                            const brightnessResponse = await fetch(
                                `/brightness?color=${color.join(",")}`
                            );
                            const brightnessData = await brightnessResponse.json();
                            displayPalette(
                                brightnessData,
                                brightnessPaletteDiv,
                                "brightness"
                            );
                            break;
                        default:
                            break;
                    }
                });
            });
        }

        function createSwatch(color) {
            const swatch = document.createElement("div");
            swatch.className = "color-swatch";
            swatch.style.backgroundColor = `rgb(${color.join(",")})`;
            swatch.style.width = "50px";
            swatch.style.height = "50px";
            swatch.style.cursor = "pointer";
            return swatch;
        }

        function createHexValue(color) {
            const hexValue = document.createElement("div");
            hexValue.className = "hex-value";
            hexValue.textContent = rgbToHex(color[0], color[1], color[2]);
            return hexValue;
        }

        function rgbToHex(r, g, b) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }

        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        /*==================== WEBCAM LIVE FEED ====================*/
        const video = document.getElementById('video');

        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                video.srcObject = stream;
            })
            .catch((error) => {
                console.error('Error accessing webcam:', error);
            });

        /*==================== CAPTURE IMAGE ====================*/
        const captureButton = document.getElementById('captureButton');
        const canvas = document.getElementById('canvas');

        captureButton.addEventListener('click', () => {
            // Draw the video frame onto the canvas
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert the canvas image to a blob
            canvas.toBlob((blob) => {
                // Create a FormData object to send the blob data
                const formData = new FormData();
                formData.append('image', blob, 'image.jpg');

                // Send a POST request to the server with the image data
                fetch('/', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        // Display the generated color palette
                        displayPalette(data, originalPaletteDiv, "original");
                    })
                    .catch(error => console.error('Error:', error));
            });
        });