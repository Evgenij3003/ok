/*==========================================================================================================================================================================*/
/* Проверка устройства, на котором открыта страница */
const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows());
    }
};


function isIE() {
    let ua = navigator.userAgent;
    var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
    return is_ie;
}
if (isIE()) {
    document.querySelector("body").classList.add("ie");
}
if (isMobile.any()) {
    document.querySelector("body").classList.add("_touch");
}


function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
    if (support == true) {
        document.querySelector("body").classList.add("_webp");
    } else {
        document.querySelector("body").classList.add("_no-webp");
    }
});



/*==========================================================================================================================================================================*/
/* Глобальные константы и переменные */
const mediaQuery = 61.99875;
const mediaQueries = `(max-width: 61.99875em)`;
const matchMedia = window.matchMedia(mediaQueries);
let lockStatus = false;                                                             // Статус блокировки действий пользователя в body.



/*==========================================================================================================================================================================*/
/* Функции Анимации */
let _slideUp = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = `${target.offsetHeight}px`;
        target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.hidden = !showmore ? true : false;
            !showmore ? target.style.removeProperty("height") : null;
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            !showmore ? target.style.removeProperty("overflow") : null;
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
            document.dispatchEvent(new CustomEvent("slideUpDone", {
                detail: {
                    target: target
                }
            }));
        }, duration);
    }
}


let _slideDown = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        target.hidden = target.hidden ? false : null;
        showmore ? target.style.removeProperty("height") : null;
        let height = target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = height + "px";
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        window.setTimeout(() => {
            target.style.removeProperty("height");
            target.style.removeProperty("overflow");
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
            document.dispatchEvent(new CustomEvent("slideDownDone", {
                detail: {
                    target: target
                }
            }));
        }, duration);
    }
}


let _slideToggle = (target, duration = 500) => {
    if (target.hidden) {
        return _slideDown(target, duration);
    } else {
        return _slideUp(target, duration);
    }
}



window.onload = function () {	
    /*==========================================================================================================================================================================*/
    /* Menu Burger */
    if (document.querySelector(".main-header__icon")) {
        let delay = 500;
        let moveMenu = false;
        let menuBody = document.querySelector(".menu-header");
        let iconMenu = document.querySelector(".main-header__icon");
        iconMenu.addEventListener("click", function (e) {
            if (!moveMenu) {
                moveMenu = true;
                if (document.body.classList.contains("_lock")) {
                    bodyLockToggle(true, false, delay);
                    menuClose(menuBody, iconMenu);
                } else {
                    bodyLockToggle(false, false, delay);
                    menuOpen(menuBody, iconMenu);
                }
                setTimeout(() => {
                    moveMenu = false;
                }, delay);
            }
        });
    }


    function menuOpen(menuBody, iconMenu) {
        document.body.classList.add("_menu-open");
        menuBody.classList.add("_active");
        iconMenu.classList.add("_active");
    }


    function menuClose(menuBody, iconMenu) {
        document.body.classList.remove("_menu-open");
        menuBody.classList.remove("_active");
        iconMenu.classList.remove("_active");
    }



    /*==========================================================================================================================================================================*/
    /* Обработка события "клик" на документе */
	document.addEventListener("click", documentActions);									

	function documentActions(e) {																	
		const targetElement = e.target;
        const timeout = 300;

        // "Клик" по пункту меню-родителя в header:
        if (targetElement.getAttribute("data-parent-submenu") && ((window.innerWidth / 16) > mediaQuery)) {
            const targetSubmenu = targetElement.getAttribute("data-parent-submenu");
            if (!targetElement.classList.contains("_active")) {
                const openSubmenu = document.querySelector(".submenu._open");
                openSubmenu ? openSubmenu.classList.remove("_open") : null;
                document.querySelector(`.submenu[data-submenu="${targetSubmenu}"]`).classList.add("_open");
                setTimeout(() => {
                    document.body.classList.add("submenu-open");
                }, 200);
                const activeLinkSubmenu = document.querySelector("[data-parent-submenu]._active");
                activeLinkSubmenu ? activeLinkSubmenu.classList.remove("_active"): null;
                targetElement.classList.add("_active");
            } else {
                targetElement.classList.remove("_active");
                document.querySelector(".submenu._open").classList.remove("_open");
                setTimeout(() => {
                    document.body.classList.remove("submenu-open");
                }, timeout);
            }
        }

        // Закрытие submenu по "клику" не внутри него и не по пункту меню-родителя:
        if (!targetElement.closest(".catalog-menu") && !targetElement.getAttribute("data-parent-submenu") && ((window.innerWidth / 16) > mediaQuery)) {
            const openSubmenu = document.querySelector(".submenu._open");
            const activeMenuLink = document.querySelector("[data-parent-submenu]._active");
            openSubmenu ? openSubmenu.classList.remove("_open") : null;
            activeMenuLink ? activeMenuLink.classList.remove("_active") : null;
            setTimeout(() => {
                document.body.classList.remove("submenu-open");
            }, timeout);
        }

        // Выбор города в попапе "Поиск городов":
        if (targetElement.closest(".results-search__item")) {
            const selectedCity = targetElement.innerText;
            const activeCity = document.querySelector(".cities-search__button span");
            const activeCityPopup = document.querySelector(".popup-search-cities__title span");
            activeCity.innerText = selectedCity;
            activeCityPopup.innerText = selectedCity;
        }
        
        // Закрытие мобильного меню:
        if (document.body.classList.contains("_menu-open")) {
            if ((!targetElement.classList.contains("main-header__icon") && !targetElement.closest(".menu-header"))
                || targetElement.classList.contains("search-button")) {
                let delay = 500;
                let menuBody = document.querySelector(".menu-header");
                let iconMenu = document.querySelector(".main-header__icon");
                !targetElement.classList.contains("search-button") ? bodyLockToggle(true, false, delay): null;
                menuClose(menuBody, iconMenu);
            }
        }

        // "Клик" по иконке "телефоны" в header:
        if (targetElement.classList.contains("phones-header__button")) {
            if (!targetElement.classList.contains("_active")) {
                targetElement.classList.add("_active");
                document.querySelector(".phones-header__body").classList.add("_active");
            } else {
                targetElement.classList.remove("_active");
                document.querySelector(".phones-header__body").classList.remove("_active");
            }

        // Закрытие меню телефонов:
        } else if (!targetElement.classList.contains("phones-header__button") && !targetElement.closest(".phones-header__body")) {
            document.querySelector(".phones-header__button").classList.remove("_active");
            document.querySelector(".phones-header__body").classList.remove("_active");
        }
	};



    /*==========================================================================================================================================================================*/
    /* Плавная прокрутка к блоку */
    const menuLinks = document.querySelectorAll("[data-goto]");
    if (menuLinks) {
        menuLinks.forEach(elem => {
            elem.addEventListener("click", gotoBlock);
        });
    } 


    function gotoBlock(e) {
        const targetBlock = e.target.getAttribute("data-goto");
        const targetBlockElement = document.querySelector(targetBlock);
        removeActiveClasses(menuLinks, "_active");
        e.target.classList.add("_active");
        if (targetBlockElement) {
            // Закрытие открытого меню:
            document.documentElement.classList.contains("_menu-open") ? menuClose() : null;
            
            
            // Прокрутка:
            let headerBlockHeight = document.querySelector(".header").offsetHeight;
            window.scrollTo({
                top: headerBlockHeight 
                    ? (targetBlockElement.getBoundingClientRect().top + window.scrollY - headerBlockHeight)
                    : (targetBlockElement.getBoundingClientRect().top + window.scrollY),
                behavior: "smooth",
            });
            e.preventDefault();  
        } else {
            console.log(`[gotoBlock]: Такого блока нет на странице: ${targetBlock}`);
        }
    };



    /*==========================================================================================================================================================================*/
    /* Споллеры */
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            });	
            if (spollersRegular.length > 0) {
                initSpollers(spollersRegular);
            }
            const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
                return item.dataset.spollers.split(",")[0];
            });
    
    
            // Инициализация спойлеров с медиа-запросами:
            if (spollersMedia.length > 0) {
                const breakpointsArray = [];
                spollersMedia.forEach(item => {
                    const params = item.dataset.spollers;
                    const breakpoint = {};
                    const paramsArray = params.split(",");
                    breakpoint.value = paramsArray[0];
                    breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                    breakpoint.item = item;
                    breakpointsArray.push(breakpoint);
                });
    
    
                // Получение уникальных брейкпоинтов:
                let mediaQueries = breakpointsArray.map(function (item) {
                    return "(" + item.type + "-width: " + item.value + "em)," + item.value + "," + item.type;
                });
                mediaQueries = mediaQueries.filter(function (item, index, self) {
                    return self.indexOf(item) === index;
                });
    
    
                // Работа с брейкпоинтами:
                mediaQueries.forEach(breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const spollersArray = breakpointsArray.filter(function (item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) {
                            return true;
                        }
                    });
                    matchMedia.addListener(function () {
                        initSpollers(spollersArray, matchMedia);
                    });
                    initSpollers(spollersArray, matchMedia);
                });
            }
    
    
            // Инициализация спойлера:
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach(spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                });
            }
    
    
            // Работа с контентной частью:
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                const spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length > 0) {
                    spollerTitles.forEach(spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_active")) {
                                spollerTitle.nextElementSibling.hidden = true;
                            }
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    });
                }
            }
    
    
            // Управление спойлерами:
            function setSpollerAction(e) {
                const el = e.target;
                if (el.hasAttribute("data-spoller") || el.closest("[data-spoller]")) {
                    const spollerTitle = el.hasAttribute("data-spoller") ? el : el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller") ? true : false;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_active")) {
                            hideSpollersBody(spollersBlock);
                        }
                        spollerTitle.classList.toggle("_active");
                        _slideToggle(spollerTitle.nextElementSibling, 500);
                    }
                    e.preventDefault();
                }
            }
    
    
            // Скрытие контента "неактивных" спойлеров:
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._active");
                if (spollerActiveTitle) {
                    spollerActiveTitle.classList.remove("_active");
                    _slideUp(spollerActiveTitle.nextElementSibling, 500);
                }
            }
        }
    }
    spollers();



    /*==========================================================================================================================================================================*/
    /* Включение/выключение споллеров на определенных разрешениях */
    if (document.querySelector(".submenu")) {
        const spollersContents = document.querySelectorAll(".submenu");

        // Включение споллеров в меню на экранах менее 61.99875em:
        if ((window.innerWidth / 16) < mediaQuery) {
            onMenuSpollers(spollersContents);
        }

        // Включение/выключение споллеров в меню:
        matchMedia.addEventListener("change", function () {
            if (matchMedia.matches) {
                onMenuSpollers(spollersContents);
            } else {
                offMenuSpollers(spollersContents);
            }
        });
    }



    /*==========================================================================================================================================================================*/
    /* Включение/выключение споллеров в меню на определенных разрешениях */
    // Функция включения споллеров:
    function onMenuSpollers(spollersContents) { 
        spollersContents.forEach(spollerContent => {
            const spollerNumber = spollerContent.getAttribute("data-submenu");
            const spollerButton = document.querySelector(`.menu-header__link[data-parent-submenu="${spollerNumber}"]`);
            spollerContent.classList.remove("_open");
            spollerButton.setAttribute("data-spoller", "");
            spollerButton.parentElement.append(spollerContent);
            spollers();
        });
    }

    // Функция выключения споллеров:
    function offMenuSpollers(spollersContents) { 
        const spollersButtons = document.querySelectorAll(".menu-header__link[data-parent-submenu]");
        spollersContents.forEach((spollerContent, index) => {
            spollerContent.removeAttribute("hidden");
            spollersButtons[index].removeAttribute("data-spoller");
            spollersButtons[index].classList.remove("_active");
            document.querySelector(".catalog-menu").append(spollerContent);
        });
    }



    /*==================================================================================================================================================================*/
    /* Класс Popup */
    class Popup {
        constructor(options) {
            // Classes:
            this.popupClasses = {
                // Body:
                classBodyPopupActive: "open-popup",                                     // Класс body при открытом popup.
                // Buttons:
                attributeOpenButton: "data-popup",                                      // Атрибут кнопки, вызывающей popup.
                attributeVideo: "data-video",                                           // Атрибут кнопки для popup-video.
                attributePosterVideo: "data-poster",                                    // Атрибут для постера popup-video.
                attributeVideoYoutube: "data-youtube",                                  // Атрибут для кода видео youtube.
                // Elements:
                attributeFixedElements: "data-fixed",                                   // Атрибут для элементов с position:fixed.
                // Popup:
                classPopup: "_popup",                                                   // Попап.
                classPopupActive: "popup-open",                                         // Класс открытого popup. 
                classPopupBody: "_popup-body",                                          // Тело попапа.
                classPopupContent: "_popup-content",                                    // Контент попапа.  
                classPopupCloseButton: "_popup-close",                                  // Кнопка, закрывающая popup. 
                classPopupVideo: "popup-video__item",                                   // Класс элемента для вставки видео.                      
            }

            // Options:
            this.startOptions = {
                logging: true,                                                          // Вывод информационных сообщений в консоль.
                init: true,                                                             // Инициализация попапов.
                bodyLock: true,                                                         // Блокировка скролла.
                closeEsc: true,                                                         // Закрытие по нажатии на клавишу "Esc". 
                delay: 800,
                autoplayVideo: false,                                                   // Автовоспроизведение видео при открытии попапа.
                controlsVideo: true,                                                    // Стандартные элементы управления видео. 
                // Events:
                on: { 
                    beforeOpen: function () {},
                    afterOpen: function () {},
                    beforeClose: function () {},
                    afterClose: function () {},
                },
            }

            options ? this.popupOptions = {...this.startOptions, ...options} : this.popupOptions = this.startOptions;

            // Состояния:
            this.bodyLock = false;                                                      // Состояние блокировки скролла.
            this.isOpen = false;                                                        // Состояние попапа: открыт/закрыт.                                                   
            this.nextOpen = false;                                                      // Открытие следующего попапа и закрытие текущего.                                                   

            // Текущий открытый popup:
            this.openPopup = {
                selector: false,
                element: false,
            }

            // Предыдущий открытый popup:
            this.previousOpenPopup = {
                selector: false,
                element: false,
            }

            this.fixedElements = document.querySelectorAll(`[${this.popupClasses.attributeFixedElements}]`);
            this.popupOptions.init ? this.initPopup() : null;
        }


        /*=========================================================================*/
        /* Инициализация popup */
        initPopup() {
            const popupButtons = document.querySelectorAll("[data-popup]");
            if (popupButtons) {
                popupButtons.forEach(popupButton => {
                    popupButton.addEventListener("click", function (e) {
                        e.preventDefault();
                        this.getOpenPopup(e.target);
                    }.bind(this));
                });
            }
        }


        /*=========================================================================*/
        /* Обработчик событий, вызывающих открытие popup */
        getOpenPopup(targetElement) {
            this.popupButton = targetElement;
            const popupName = this.popupButton.getAttribute(this.popupClasses.attributeOpenButton);
            this.openPopup.selector = popupName;
            this.openPopup.element = document.querySelector(this.openPopup.selector);

            // Формирование контента попапа "calculate-popup" при его вызове:
            if (targetElement.classList.contains("action-calculate__button")) {
                const gatesWidth = targetElement.closest(".action-calculate__items").querySelector("input[name='gates-width']").value;
                const gatesHeight = targetElement.closest(".action-calculate__items").querySelector("input[name='gates-height']").value;
                const gatesCloth = targetElement.closest(".action-calculate__items").querySelector("select[name='cloth-gates']").value;
                const gatesColor = targetElement.closest(".action-calculate__items").querySelector("select[name='color-gates']").value;
                this.openPopup.element.querySelector("[data-gates-width] span").innerText = `${gatesWidth} м`;
                this.openPopup.element.querySelector("[data-gates-height] span").innerText = `${gatesHeight} м`;
                this.openPopup.element.querySelector("[data-gates-cloth] span").innerText = `${gatesCloth}`;
                this.openPopup.element.querySelector("[data-gates-color] span").innerText = `${gatesColor}`;
            }

            this.popupButton.hasAttribute(this.popupClasses.attributeVideo) ? this.popupVideo() : null;
            this.popupButton.hasAttribute(this.popupClasses.attributeVideoYoutube) ? this.popupYoutube() : null;

            // "Клик" на кнопку внутри формы: 
            if (targetElement.closest("._form")) {
                const form = targetElement.closest("._form");
                formValidate(form);
                if (!form.querySelector("._error")) {
                    this.openPopup.element ? this.popupOpen() : null;
                }
            } else {
                this.openPopup.element ? this.popupOpen() : null;
            }
        }


        /*=========================================================================*/
        // Формирование контента popup-video:
        popupVideo() {
            const pathToVideo = this.popupButton.getAttribute(this.popupClasses.attributeVideo);
            const autoplay = this.popupOptions.autoplayVideo ? "autoplay" : "";
            const controlsVideo = this.popupOptions.controlsVideo ? "controls" : null;
            const poster = this.popupButton.querySelector(`[${this.popupClasses.attributePosterVideo}]`).getAttribute("src");
            this.openPopup.element.querySelector(`.${this.popupClasses.classPopupVideo}`).innerHTML = `
                <video ${autoplay} ${controlsVideo} preload="auto" poster="${poster}">
                    <source type="video/mp4" src="${pathToVideo}">
                </video>`;
        }

        
        /*=========================================================================*/
        // Формирование контента popup-youtube:
        popupYoutube() {
            this.popupButton.querySelector("[data-play]") ? 
                this.popupButton.querySelector("[data-play]").classList.add("_hide")
                : null;
            const codeVideo = this.popupButton.getAttribute(this.popupClasses.attributeVideoYoutube);
            const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`
            const iframe = document.createElement("iframe");
            iframe.setAttribute("allowfullscreen", "");
            const autoplay = this.popupOptions.autoplayVideo ? "autoplay;" : "";
            iframe.setAttribute("allow", `autoplay; encrypted-media`);
            iframe.setAttribute("src", urlVideo);
            this.openPopup.element.querySelector(`.${this.popupClasses.classPopupVideo}`).appendChild(iframe);
        }


        /*=========================================================================*/
        /* Открытие popup */
        popupOpen() {
            if (!lockStatus) {
                // Присвоение значения состоянию "bodyLock" в зависимости от наличия класса "lock" у body: 
                this.bodyLock = document.body.classList.contains("_lock") ? true : false;

                // Если уже имеется открытый попап => ставим состояние "открытие следующего попапа" и закрываем текущий:
                if (this.isOpen) {
                    this.nextOpen = true;
                    this.popupClose();
                }
                
                // Если необходимо формировать контент попапа до его открытия: 
                // if (document.querySelector("._page-doctor")) formationPopupContent(); 

                // Если контент попапа формируется в зависимости от нажатого элемента:
                // popupName === "doctor-popup" ? createPopupContent(this.openPopup.element, this.openPopup.selector) : null;

                // Создание собственного события перед открытием попапа:
                this.popupOptions.on.beforeOpen(this);
                document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                    detail: {
                        popup: this
                    }
                }));

                // Присвоение открываемому попапу класса "popup-open" и атрибуту "aria-hidden" значения false:
                this.openPopup.element.classList.add(this.popupClasses.classPopupActive);
                this.openPopup.element.setAttribute("aria-hidden", "false");

                // Присвоение текущего попапа объекту последнего открытого popup:
                this.previousOpenPopup.selector = this.openPopup.selector;
                this.previousOpenPopup.element = this.openPopup.element;
                
                // Вызов функции обработки блокировки/разблокировки скролла, указание значения попапу "открыт" и присвоение body значения "блокирован":
                if (!document.body.classList.contains("_menu-open")) {
                    !this.nextOpen ? bodyLockToggle(this.bodyLock, this.fixedElements, this.popupOptions.delay) : null;
                }
                document.body.classList.add(this.popupClasses.classBodyPopupActive);
                this.isOpen = true;
                this.bodyLock = true;

                // Создание собственного события после открытия попапа:
                this.popupOptions.on.afterOpen(this);
                document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                    detail: {
                        popup: this
                    }
                }));

                // Если на странице имеется форма с обязательными полями => снимаем у всех полей класс "ошибка валидации": 
                if (document.querySelector("[data-required]")) {
                    let formBlockRequired = document.querySelectorAll("._block-input");
                    let formInputsRequired = document.querySelectorAll("[data-required]");
                    removeClassesName(formBlockRequired, "_error");						
                    removeClassesName(formInputsRequired, "_error");
                    removeClassesName(formBlockRequired, "_valid");						
                    removeClassesName(formInputsRequired, "_valid");	
                }

                // Запуск обработчика событий:
                this.popupEvents();
            }
        }


        /*=========================================================================*/
        /* Обработчик событий popup */
        popupEvents() {
            // "Клик" на области открытого попапа:
            this.openPopup.element.addEventListener("click", function (e) {
                // Если событие "клик" вызывается на области вне контента попапа или на кнопке "закрыть":
                if (e.target.classList.contains(`${this.popupClasses.classPopupCloseButton}`) || !e.target.closest(`.${this.popupClasses.classPopupContent}`)) {
                    e.preventDefault();
                    this.nextOpen = false;					
                    this.isOpen ? this.popupClose() : null; 
                }
            }.bind(this));

            // Закрытие по "клику" на клавишу "Esc":
            document.addEventListener("keydown", function (e) {
                if (this.popupOptions.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                    e.preventDefault();
                    this.nextOpen = false;
                    this.popupClose();
                }
            }.bind(this));
        }


        /*=========================================================================*/
        /* Закрытие popup */
        popupClose() {
            if (!this.isOpen || lockStatus) {
                return;
            }

            // Создание собственного события перед закрытием попапа:
            this.popupOptions.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));

            // Очистка контента popup video:
            if (this.openPopup.element.querySelector(`.${this.popupClasses.classPopupVideo}`)) {
                this.openPopup.element.querySelector(`.${this.popupClasses.classPopupVideo}`).innerHTML = "";
            }

            // Удаление у открытого попапа класса "popup-open" и присвоение атрибуту "aria-hidden" значения true:
            this.previousOpenPopup.element.classList.remove(this.popupClasses.classPopupActive);
            this.previousOpenPopup.element.setAttribute("aria-hidden", "true");

            // Вызов функции обработки блокировки/разблокировки скролла:
            if (!document.body.classList.contains("_menu-open")) {
                !this.nextOpen ? bodyLockToggle(this.bodyLock, this.fixedElements, this.popupOptions.delay): null;
            }

            // Присвоение body класса "open-popup" и состояниям "попап открыт" и блокировки скролла значения false:
            document.body.classList.remove(this.popupClasses.classBodyPopupActive);
            this.isOpen = false;
            this.bodyLock = false;

            // Создание собственного события после закрытия попапа:
            this.popupOptions.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));

            // Показ кнопки play при закрытии видео-попапа: 
            this.popupButton.querySelector("[data-play]") ? 
            this.popupButton.querySelector("[data-play]").classList.remove("_hide")
            : null;

            // Если попап имеет форму с обязательными полями => снимаем у всех полей класс "ошибка валидации":
            if (this.openPopup.element.querySelector("[data-required]")) {
                let formBlockRequired = document.querySelectorAll("._block-input");
                let formInputsRequired = document.querySelectorAll("[data-required]");
                removeClassesName(formBlockRequired, "_error");						
                removeClassesName(formInputsRequired, "_error");						
                removeClassesName(formBlockRequired, "_valid");						
                removeClassesName(formInputsRequired, "_valid");						
            } 
        }


        /*=========================================================================*/
        /* Вывод информационного сообщения */
        setLogging(message) {
            this.selectOptions.logging ? console.log(`[select]: ${message}`) : null;
        }
    }
    new Popup({});



    /*==================================================================================================================================================================*/
    /* Функции блокировки/разблокировки скролла */
    function bodyLockToggle(lock, fixedElements, delay = 500) {
        lock ? bodyUnlock(fixedElements, delay) : bodyLock(fixedElements, delay);
    }

    // Функция блокировки скролла при открытии элемента:
    function bodyLock(fixedElements, delay) {
        let body = document.querySelector("body");
        if (!lockStatus) {
            const scrollWidth = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            if (fixedElements) {
                fixedElements.forEach(fixedElement => {
                    fixedElement.style.marginRight = scrollWidth;
                });
            }
            body.style.paddingRight = scrollWidth;
            body.classList.add("_lock");
            lockStatus = true;
            setTimeout(function () {
                lockStatus = false;
            }, delay);
        }
    }


    // Функция разблокировки скролла при закрытии элемента:
    function bodyUnlock(fixedElements, delay) {
        let body = document.querySelector("body");
        if (!lockStatus) {
            setTimeout(() => {
                if (fixedElements) {
                    fixedElements.forEach(fixedElement => {
                        fixedElement.style.marginRight = "0px";
                    });
                }
                body.style.paddingRight = "0px";
                body.classList.remove("_lock");
            }, delay);
            lockStatus = true;
            setTimeout(function () {
                lockStatus = false;
            }, delay);
        }
    }


    // Блокировка скролла при открытии галереи:
    if (document.querySelector("[data-fslightbox]")) {
        let galleryItems = document.querySelectorAll("[data-fslightbox]");
        let body = document.querySelector("body");
        let scrollWidth = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
        galleryItems.forEach(galleryItem => {
            galleryItem.addEventListener("click", function(e) {
                body.style.marginRight = scrollWidth;
            });
        });
    }



    /*==========================================================================================================================================================================*/
    /* Удаление класса у массива переданных элементов */
    function removeClassesName(elements, className) {
        elements.forEach(elements => {
            elements.classList.remove(className);
        });		
    }



    /*==========================================================================================================================================================================*/
    /* Создание элемента на основе переданных параметров */
    function createSelect(nameAttribute) {
        let select = document.createElement("select");
        select.setAttribute("name", nameAttribute);
        select.setAttribute("class", nameAttribute);
        return select;
    }



    /*==========================================================================================================================================================================*/
    /* Slider Swiper */
    function bildSliders() {
        let sliders = document.querySelectorAll('[class*="__wrapper"]:not(.swiper-wrapper)');
        if (sliders) {
            sliders.forEach(slider => {
                slider.parentElement.classList.add("swiper");
                slider.classList.add("swiper-wrapper");
                for (const slide of slider.children) {
                    slide.classList.add("swiper-slide");
                }
            });
        }
    }
    bildSliders();


    function initSliders() {
        // Slider Reviews:
        if (document.querySelector(".slider-reviews")) {
            new Swiper(".slider-reviews", {
                observer: true,
                observeParents: true,
                watchOverflow: true,
                slidesPerView: 3,
                spaceBetween: 20,
                initialSlide: 0,
                speed: 800,
                keyboard: {
                    enabled: true,
                    onlyInViewport: true,
                    pageUpDown: true,
                },	
                navigation: {
                    nextEl: ".reviews .swiper-arrow_next",
                    prevEl: ".reviews .swiper-arrow_prev"
                },
                pagination: {
                    el: ".reviews__bullets",
                    type: "bullets",
                    clickable: true,
                },
                breakpoints: {
                    1200: {
                        slidesPerView: 3,
                    },
                    850: {
                        slidesPerView: 2,
                    },
                    320: {
                        slidesPerView: 1,
                    }
                },
            });
        }

        // Slider Articles:
        if (document.querySelector(".slider-articles")) {
            new Swiper(".slider-articles", {
                observer: true,
                observeParents: true,
                watchOverflow: true,
                slidesPerView: 3,
                spaceBetween: 20,
                initialSlide: 0,
                speed: 800,
                keyboard: {
                    enabled: true,                                        
                    onlyInViewport: true,							       
                    pageUpDown: true,
                },	
                navigation: {
                    nextEl: ".articles .swiper-arrow_next",
                    prevEl: ".articles .swiper-arrow_prev"
                },
                pagination: {
                    el: ".articles__bullets",
                    type: "bullets",
                    clickable: true,
                },
                breakpoints: {
                    1200: {
                        slidesPerView: 3,
                    },
                    600: {
                        slidesPerView: 2,
                    },
                    320: {
                        slidesPerView: 1,
                    }
                },
            });
        }

        // Slider Works:
        if (document.querySelector(".slider-works")) {
            new Swiper(".slider-works", {
                observer: true,
                observeParents: true,
                watchOverflow: true,
                slidesPerView: "auto",
                spaceBetween: 20,
                initialSlide: 0,
                speed: 800,
                keyboard: {
                    enabled: true,                                         
                    onlyInViewport: true,							        
                    pageUpDown: true,								        
                },	
                navigation: {
                    nextEl: ".works .swiper-arrow_next",
                    prevEl: ".works .swiper-arrow_prev"
                },
            });
        }

        // Slider Gallery:
        if (document.querySelector(".slider-gallery")) {
            new Swiper(".slider-gallery", {
                observer: true,
                observeParents: true,
                watchOverflow: true,
                slidesPerView: 3,
                spaceBetween: 20,
                initialSlide: 0,
                speed: 800,
                keyboard: {
                    enabled: true,                                         
                    onlyInViewport: true,								    
                    pageUpDown: true,
                },	
                navigation: {
                    nextEl: ".gallery .swiper-arrow_next",
                    prevEl: ".gallery .swiper-arrow_prev"
                },
                breakpoints: {
                    992: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 2,
                    },
                    320: {
                        slidesPerView: "auto",
                    }
                },
            });
        }

        // Slider Team:
        if (document.querySelector(".slider-team")) {
            new Swiper(".slider-team", {
                observer: true,
                observeParents: true,
                watchOverflow: true,
                slidesPerView: 4,
                spaceBetween: 20,
                initialSlide: 0,
                speed: 600,
                breakpoints: {
                    820: {
                        slidesPerView: 4,
                    },
                    320: {
                        slidesPerView: "auto",
                    }
                },
            });
        }

        // Slider Thanks Clients:
        if (document.querySelector(".slider-thanks-clients")) {
            new Swiper(".slider-thanks-clients", {
                observer: true,
                observeParents: true,
                watchOverflow: true,
                slidesPerView: 5,
                spaceBetween: 20,
                initialSlide: 0,
                speed: 600,
                breakpoints: {
                    1256: {
                        slidesPerView: 5,
                    },
                    320: {
                        slidesPerView: "auto",
                    }
                },
            });
        }

        // Slider Navigation:
        if (document.querySelector(".slider-navigation")) {
            new Swiper(".slider-navigation", {
                observer: true,
                observeParents: true,
                watchOverflow: true,
                slidesPerView: "auto",
                spaceBetween: 15,
                initialSlide: 0,
                speed: 600,
                navigation: {
                    nextEl: ".articles .swiper-arrow_next",
                    prevEl: ".articles .swiper-arrow_prev"
                },
                breakpoints: {
                    768: {
                        spaceBetween: 15,
                    },
                    320: {
                        spaceBetween: 10,
                    }
                },
            });
        }

        // Slider Video:
        if (document.querySelector(".slider-video")) {
            new Swiper(".slider-video", {
                observer: true,
                observeParents: true,
                watchOverflow: true,
                slidesPerView: 2,
                spaceBetween: 20,
                initialSlide: 0,
                speed: 800,
                navigation: {
                    nextEl: ".video-gallery .swiper-arrow_next",
                    prevEl: ".video-gallery .swiper-arrow_prev"
                },
                pagination: {
                    el: ".video-gallery__bullets",
                    type: "bullets",
                    clickable: true,
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    },
                    320: {
                        slidesPerView: 1,
                    }
                },
            });
            if (window.innerWidth > 47.99875) {
                let slidesVideo = document.querySelectorAll(".slide-video");
                slidesVideo.length > 2 ? document.querySelector(".video-gallery__slider-arrows").classList.add("_show") : null;
            }
        }

        
        // Slider Page Certificates:
        if (document.querySelector(".slider-certificates-page")) {
            new Swiper(".slider-certificates-page", {
                observer: true,
                observeParents: true,
                watchOverflow: true,
                slidesPerView: "auto",
                spaceBetween: 20,
                initialSlide: 0,
                speed: 600,
                navigation: {
                    nextEl: ".certificates-page .swiper-arrow_next",
                    prevEl: ".certificates-page .swiper-arrow_prev"
                },
                breakpoints: {
                    768: {
                        spaceBetween: 20,
                    },
                    320: {
                        spaceBetween: 10,
                    }
                },
            });
            if (window.innerWidth > 47.99875) {
                let slidesVideo = document.querySelectorAll(".slide-certificates-page");
                slidesVideo.length > 4 ? document.querySelector(".certificates-page__slider-arrows").classList.add("_show") : null;
            }
        }
    }
    initSliders();



    /*==========================================================================================================================================================================*/
    // Select */
    if (document.querySelector(".select_cloth")) {
        let selectCloth = document.querySelectorAll(".select_cloth");
        new Select(selectCloth, {
            selectLabel: true,
            selectLabelText: "Полотно",
            scroll: "200px",
        });
    }
    if (document.querySelector(".select_color")) {
        let selectColor = document.querySelectorAll(".select_color");
        new Select(selectColor, {
            selectLabel: true,
            selectLabelText: "Цвет",
            scroll: "300px",
        });
    }



    /*==========================================================================================================================================================================*/
    /* Динамический Адаптив */
    function dynamicAdapt(type) {
        this.type = type;
    }


    // Функция адаптива:
    dynamicAdapt.prototype.init = function () {
        const _this = this;		
        this.оbjects = [];																				// Массив объектов.
        this.daClassname = "_dynamic_adapt_";	
        this.nodes = document.querySelectorAll("[data-da]");											// Массив DOM-элементов.
        for (let i = 0; i < this.nodes.length; i++) {													// Наполнение оbjects объектами.
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
        this.arraySort(this.оbjects);
        this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {					// Массив уникальных медиа-запросов.
            return '(' + this.type + "-width: " + item.breakpoint + "em)," + item.breakpoint;
        }, this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        });
        for (let i = 0; i < this.mediaQueries.length; i++) {											// Навешивание слушателя на медиа-запрос и вызов обработчика 
            const media = this.mediaQueries[i];															// при первом запуске.
            const mediaSplit = String.prototype.split.call(media, ',');
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];			
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {			// Массив объектов с подходящим брейкпоинтом.
                return item.breakpoint === mediaBreakpoint;
            });
            matchMedia.addListener(function () {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            });
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };


    // Функция перемещения:
    dynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
        if (matchMedia.matches) {
            for (let i = 0; i < оbjects.length; i++) {
                const оbject = оbjects[i];
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            }
        } else {
            for (let i = 0; i < оbjects.length; i++) {
                const оbject = оbjects[i];
                if (оbject.element.classList.contains(this.daClassname)) {
                    this.moveBack(оbject.parent, оbject.element, оbject.index);
                }
            }
        }
    };


    // Функция перемещения:
    dynamicAdapt.prototype.moveTo = function (place, element, destination) {
        element.classList.add(this.daClassname);
        if (place === "last" || place >= destination.children.length) {
            destination.insertAdjacentElement("beforeend", element);
            return;
        }
        if (place === "first") {
            destination.insertAdjacentElement("afterbegin", element);
            return;
        }
        destination.children[place].insertAdjacentElement("beforebegin", element);
    }


    // Функция возврата:
    dynamicAdapt.prototype.moveBack = function (parent, element, index) {
        element.classList.remove(this.daClassname);
        if (parent.children[index] !== undefined) {
            parent.children[index].insertAdjacentElement("beforebegin", element);
        } else {
            parent.insertAdjacentElement("beforeend", element);
        }
    }


    // Функция получения индекса внутри родителя:
    dynamicAdapt.prototype.indexInParent = function (parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };


    // Функция сортировки массива по breakpoint и place по возрастанию для this.type = min по убыванию для this.type = max:
    dynamicAdapt.prototype.arraySort = function (arr) {
        if (this.type === "min") {
            Array.prototype.sort.call(arr, function (a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) {
                        return 0;
                    }
                    if (a.place === "first" || b.place === "last") {
                        return -1;
                    }	
                    if (a.place === "last" || b.place === "first") {
                        return 1;
                    }
                    return a.place - b.place;
                }	
                return a.breakpoint - b.breakpoint;
            });
        } else {
            Array.prototype.sort.call(arr, function (a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) {
                        return 0;
                    }	
                    if (a.place === "first" || b.place === "last") {
                        return 1;
                    }
                    if (a.place === "last" || b.place === "first") {
                        return -1;
                    }
                    return b.place - a.place;
                }	
                return b.breakpoint - a.breakpoint;
            });
            return;
        }
    };
    const da = new dynamicAdapt("max");
    da.init();



    /*==================================================================================================================================================================*/
    /* Tabs */
    function tabs() {
        const tabs = document.querySelectorAll("[data-tabs]");
        if (tabs.length > 0) {
            tabsInit(tabs); 
        }

        /*=========================================================================*/
        /* Инициализация табов */
        function tabsInit(tabs, tabsActiveHash) {
            tabs.forEach((tabsItem, index) => {
                const tabsTitles = Array.from(tabsItem.querySelector("[data-tabs-titles]").children);
                const tabsContents = Array.from(tabsItem.querySelector("[data-tabs-body]").children);
                tabsItem.classList.add("tab-init");
                tabsItem.setAttribute("data-tabs-index", index);
                const mediaQueryValue = tabsItem.getAttribute("data-tabs");

                // Обрабатываем заголовки и контент табов:
                tabsContents.forEach((tabsContent, index) => {
                    tabsContent.setAttribute("data-tabs-item", "");
                    index === 0 ? null : tabsContent.setAttribute("hidden", "");
                    if (tabsTitles[index]) {
                        const tabsTitle = tabsTitles[index];
                        tabsTitle.setAttribute("data-tabs-title", "");
                        // Если событие "клик" срабатывает на заголовке табов и НЕ в момент переключения табов => вызываем обработчик события "клик":
                        tabsTitle.addEventListener("click", function(e) {
                            !tabsItem.classList.contains("tab-change") ? tabsAction(e) : null;
                        });
                    }
                });

                // Если атрибут data-tabs не пустой (табы-споллеры) => обрабатываем данный блок табов:
                Number(mediaQueryValue) ? tabsMediaInit(tabsItem, tabsTitles, tabsContents, Number(mediaQueryValue)): null;
            });
        }


        /*=========================================================================*/
        /* Обработчик медиа-запроса для табов-споллеров */
        function tabsMediaInit(tabsItem, tabsTitles, tabsContents, mediaQueryValue) {
            const mediaQueryUnit = tabsItem.getAttribute("data-unit") ? tabsItem.getAttribute("data-unit"): "px";
            const mediaQueries = `(max-width: ${mediaQueryValue}${mediaQueryUnit})`;
            const matchMedia = window.matchMedia(mediaQueries);
            // Изменение состояния медиа-запроса (брейкпоинт):
            matchMedia.addEventListener("change", function () {
                changeTabSpoller(tabsItem, tabsTitles, tabsContents, matchMedia);
            });
            changeTabSpoller(tabsItem, tabsTitles, tabsContents, matchMedia);
        }


        /*=========================================================================*/
        /* Переключение табов в споллеры и обратно */
        function changeTabSpoller(tabsItem, tabsTitles, tabsContents, matchMedia) {
            tabsContents.forEach((tabsContent, index) => {
                if (matchMedia.matches) {
                    tabsContent.parentElement.append(tabsTitles[index]);
                    tabsContent.parentElement.append(tabsContent);
                    tabsItem.classList.add("tab-spoller");
                } else {
                    tabsItem.querySelector("[data-tabs-titles]").append(tabsTitles[index]);
                    tabsItem.classList.remove("tab-spoller");
                }
            });
        }

        
        /*=========================================================================*/
        /* Обработка события "клик" на заголовке */
        function tabsAction(e) {
            const targetElement = e.target;
            const tabsItem = e.target.closest("[data-tabs]");
            const tabTitle = targetElement.closest("[data-tabs-title]");
            const timeout = tabsItem.dataset.tabsAnimate ? tabsItem.dataset.tabsAnimate : 0;
            if (!tabTitle.classList.contains("tab-active")) {
                tabsItem.classList.add("tab-change");
                    setTimeout(() => {
                        tabsItem.classList.remove("tab-change");
                }, timeout);
                const tabActiveTitle = tabsItem.querySelector("[data-tabs-title].tab-active");
                tabActiveTitle ? tabActiveTitle.classList.remove("tab-active") : null;
                tabTitle.classList.add("tab-active");
                tabsChange(tabsItem, timeout);
            }
            e.preventDefault();
        }


        /*=========================================================================*/
        /* Переключение табов */
        function tabsChange(tabsItem, timeout) {
            const tabsTitles = Array.from(tabsItem.querySelector("[data-tabs-titles]").children);
            const tabsContents = Array.from(tabsItem.querySelector("[data-tabs-body]").children);
            if (tabsContents.length > 0) {
                tabsContents.forEach((tabsContent, index) => {
                    if (tabsTitles[index]) {
                        if (tabsTitles[index].classList.contains("tab-active")) {
                            timeout ? _slideDown(tabsContent, timeout): tabsContent.removeAttribute("hidden");
                        } else {
                            timeout ? _slideUp(tabsContent, timeout): tabsContent.setAttribute("hidden", "");
                        };
                    }
                })
            }
        }
    }
    tabs();



    /*==========================================================================================================================================================================*/
    /* Динамическая длина для input:number */
    if (document.querySelector(".action-calculate__input input[type='number']")) {
        const inputsNumber = document.querySelectorAll(".action-calculate__input input[type='number']");
        inputsNumber.forEach(inputNumber => {
            let inputValueLength = inputNumber.value.length;
            inputValueLength >= 8 ? inputNumber.style.width = `8ch` : inputNumber.style.width = `${inputValueLength}ch`;
            inputNumber.addEventListener("input", function() {
                inputNumber.value <= 0 ? inputNumber.value = 1: null;
                inputValueLength = inputNumber.value.length;
                inputValueLength >= 8 ? inputNumber.style.width = `8ch` : inputNumber.style.width = `${inputValueLength}ch`;
            })
        });
    }



    /*==========================================================================================================================================================================*/
    /* Showmore */
    if (document.querySelector("._page-promotions")) {
        let cards = document.querySelectorAll(".item-promotion");
        let showMoreButton = document.querySelector(".promotions__more");
        showMore(cards, showMoreButton, 8, 8);
    }


    // Функция "показать еще":
    function showMore(cards, showMoreButton, visibleCards, cardsOpen) {
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            i >= visibleCards ? card.style.display = "none" : null; 
        }
        showMoreButton.addEventListener("click", () => {
            visibleCards += cardsOpen;
            const columns = Array.from(cards);
            const visibleColumns = columns.slice(0, visibleCards);                           
            if (showMoreButton.closest(".services-catalog") || showMoreButton.closest(".diagnostics-catalog")) {
                visibleColumns.forEach(column => column.style.display = "grid");
            } else if (showMoreButton.closest(".promotions")) {
                visibleColumns.forEach(column => column.style.display = "flex");
                showMoreButton.closest(".promotions").querySelector(".promotions__items").style.marginBottom = "0";
            } else {
                visibleColumns.forEach(column => column.style.display = "block");
            } 
            if ((visibleColumns.length === cards.length) || (visibleColumns.length > cards.length)) {  
                if (showMoreButton.closest(".services-catalog") || showMoreButton.closest(".diagnostics-catalog")) {
                    showMoreButton.parentElement.style.display = "none";
                    if (showMoreButton.closest(".services-catalog")) {
                        showMoreButton.closest(".services-catalog").classList.add("_open-all");
                    }
                } else {
                    showMoreButton.style.display = "none";
                    if (showMoreButton.classList.contains("comprehensive-services__more") || showMoreButton.classList.contains("popular-services__more")) {
                        showMoreButton.parentElement.style.marginTop = "0";
                    }
                    if (showMoreButton.closest(".promotions")) {
                        showMoreButton.closest(".promotions").querySelector(".promotions__items").style.marginBottom = "0";
                    }
                }
            }
        });
    }


    // Страница "Рецензии":
    if (document.querySelector("._page-reviews")) {
        let cards = document.querySelectorAll(".column-reviews");
        let showMoreButton = document.querySelector(".reviews-page__all");
        let visibleCards;
        window.innerWidth / 16 > 78.5 ? visibleCards = 6: visibleCards = 4;
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            i >= visibleCards ? card.style.display = "none" : null; 
        }
        showMoreButton.addEventListener("click", function(e) {
            showHideMore(cards, showMoreButton, visibleCards, "block", "Скрыть отзывы");
        });
    }


    // Страница "Статья":
    if (document.querySelector("._page-article")) {
        let cards = document.querySelectorAll(".comments__item-block");
        let showMoreButton = document.querySelector(".comments__all");
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            i >= 4 ? card.style.display = "none" : null; 
        }
        showMoreButton.addEventListener("click", function(e) {
            showHideMore(cards, showMoreButton, 4, "grid", "Скрыть комментарии");
        });
    }


    // Функция "показать/скрыть":
    function showHideMore(cards, showMoreButton, visibleCards, displayProperty, textOpenButton) {
        if (!showMoreButton.classList.contains("_open")) {
            cards.forEach(card => {
                card.style.display = `${displayProperty}`;
            });
            showMoreButton.classList.add("_open");
            showMoreButton.innerText = `${textOpenButton}`;
        } else {
            cards.forEach((card, index) => {
                index + 1 <= visibleCards ? card.style.display = `${displayProperty}` : card.style.display = "none";
            });
            showMoreButton.classList.remove("_open");
            showMoreButton.innerText = "Показать ещё";
        }
    }


    // Info Showmore:
    if (document.querySelector(".info__text")) {
        const infoShowmoreButton = document.querySelector(".info__all");
        const infoText = document.querySelector(".info__text");
        const infoTextHeight = infoText.offsetHeight;
        const infoTextStyles = window.getComputedStyle(infoText);
        const infoTextFontSize = Number(infoTextStyles.fontSize.replace(/[a-zа-яё]/gi, ""));
        let lineHeightText;
        (window.innerWidth / 16) > 47.99875 ? lineHeightText = 1.6: lineHeightText = 1.5;
        if (infoTextHeight > ((infoTextFontSize * 8) * lineHeightText)) {
            infoText.style.height = `${(infoTextFontSize * 8) * lineHeightText}px`;
            infoShowmoreButton.style.display = "block";
            infoText.classList.add("_big");
            infoShowmoreButton.addEventListener("click", function(e) {
                if (!infoShowmoreButton.classList.contains("_hide")) {
                    infoShowmoreButton.innerText = "Свернуть текст";
                    infoText.style.height = "100%";
                } else {
                    infoShowmoreButton.innerText = "Показать ещё";
                    infoText.style.height = `${(infoTextFontSize * 8) * lineHeightText}px`;
                }
                infoShowmoreButton.classList.toggle("_hide");
                infoText.classList.toggle("_open");
            });
        }
    }



    /*==========================================================================================================================================================================*/
    /* Navigation on Page Articles */
    if (document.querySelector("._page-articles")) {
        let articlesButtons = document.querySelectorAll(".tabs-articles__title");
        articlesButtons.forEach(button => {
            button.addEventListener("click", function(e) {
                if (!this.classList.contains("_active")) {
                    document.querySelector(".tabs-articles__title._active") 
                        ? document.querySelector(".tabs-articles__title._active").classList.remove("_active"): null;
                    this.classList.add("_active");
                }
            });
        });
    }



    /*==========================================================================================================================================================================*/
    /* Изображение-заглушка в блоке "Наша команда" на странице About */
    if (document.querySelector(".slide-team__image")) {
        let teamImages = document.querySelectorAll(".slide-team__image");
        teamImages.forEach(image => {
            console.log(image);
            !image.querySelector("img") ? image.style.backgroundColor = "transparent" : null;
        });
    }
    


    /*==========================================================================================================================================================================*/
    /* Маска для телефона */
    if (document.querySelector("._tel")) {
        let phoneInputs = document.querySelectorAll("._tel");
    
        let getInputNumbersValue = function (input) {
            return input.value.replace(/\D/g, "");
        }
    
        function onPhonePaste(e) {
            let input = e.target;
            let inputNumbersValue = getInputNumbersValue(input);
            let pasted = e.clipboardData || window.clipboardData;
            if (pasted) {
                let pastedText = pasted.getData("Text");
                if (/\D/g.test(pastedText)) {
                    // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
                    // formatting will be in onPhoneInput handler
                    input.value = inputNumbersValue;
                    return;
                }
            }
        }

        function onPhoneInput(e) {
            let input = e.target;
            let inputNumbersValue = getInputNumbersValue(input);
            let selectionStart = input.selectionStart;
            console.log(input.selectionStart);
            let formattedInputValue = "";
            if (!inputNumbersValue) {
                return input.value = "";
            }

            if (input.value.length != selectionStart) {
                // Editing in the middle of input, not last symbol
                if (e.data && /\D/g.test(e.data)) {
                    // Attempt to input non-numeric symbol
                    input.value = inputNumbersValue;
                }
                return;
            }
    
            if (["7", "8"].indexOf(inputNumbersValue[0]) > -1) {
                let firstSymbols = (inputNumbersValue[0] == "8") ? "+8" : "+7";
                formattedInputValue = input.value = firstSymbols + " ";
                if (inputNumbersValue.length > 1) {
                    formattedInputValue += "(" + inputNumbersValue.substring(1, 4);
                }
                if (inputNumbersValue.length >= 5) {
                    formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
                }
                if (inputNumbersValue.length >= 8) {
                    formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
                }
                if (inputNumbersValue.length >= 10) {
                    formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
                }
            } else {
                formattedInputValue = "";
            }
            input.value = formattedInputValue;
        }

        function onPhoneKeyDown(e) {
            // Clear input after remove last symbol
            let inputValue = e.target.value.replace(/\D/g, "");
            if (e.keyCode == 8 && inputValue.length == 1) {
                e.target.value = "";
            }
        }

        for (let phoneInput of phoneInputs) {
            phoneInput.addEventListener("keydown", function(e) {
                onPhoneKeyDown(e);
            });
            phoneInput.addEventListener("input", function(e) {
                onPhoneInput(e);
            });
            phoneInput.addEventListener("paste", function(e) {
                onPhonePaste(e);
            });
        }
    }



    /*==========================================================================================================================================================================*/
    /* Фокус на input */
    if (document.querySelector("._input")) {
        let inputs = document.querySelectorAll("._input");
        inputs.forEach(input => {
            input.addEventListener("focus", function() {
                input.parentElement.classList.add("_focus");
            });
            input.addEventListener("blur", function() {
                input.parentElement.classList.remove("_focus");
            });
        });
    }



    /*==========================================================================================================================================================================*/
    /* Валидация Формы */
    let forms = document.querySelectorAll("._form");
    let form;
    for (let i = 0; i < forms.length; i++) {
        form = forms[i];
        form.addEventListener("submit", formSend);
    }  


    // Функция проверки и обработки результатов валидации формы:
    async function formSend(e) {
        e.preventDefault();
        let error = formValidate(form);
        let formData = new FormData(form);
        if (error === 0) {
            inputRemoveError();
            let response = await fetch("form.php", {
                method: "POST",
                body: formData
            });
            if (response.ok) {
                let result = await response.json();
                form.reset();
                document.querySelector(".popup-message").classList.add("_show");
                let buttonPopup = document.querySelector(".popup-message__button");
                buttonPopup.addEventListener("click", function (e) {
                    this.closest(".popup-message").classList.remove("_show");
                });
            } else {
                alert("Ошибка отправки");
            }
        } else {
            alert("Заполните обязательные поля");
        }
    }
                
                
    // Функция валидации формы:
    function formValidate(form) {
        let error = 0;
        let inputsRequired = form.querySelectorAll("[data-required]");
        for (let index = 0; index < inputsRequired.length; index++) {
            const input = inputsRequired[index];
            formRemoveError(input);
            if (input.classList.contains("_email")) {
                if (emailTest(input)) {
                    formAddError(input);
                    error++;
                }
            }
            if (input.classList.contains("_tel")) {
                if (input.value.length !== 18) {
                    formAddError(input);
                    error++;
                }
            } 
            if (input.value === "") {
                formAddError(input);
                error++;
            }
            if (input.getAttribute("type") === "checkbox" && input.checked === false) {
                formAddError(input);
                error++;
            }
        }
        return error;
    }
                
                
    // Функция добавления полю ввода и его родителю класса "_error" (ошибка):
    function formAddError(input) {
        input.classList.remove("_valid");
        input.parentElement.classList.remove("_valid");
        input.classList.add("_error");
        input.parentElement.classList.add("_error");
    }
            
                
    // Функция удаления у поля ввода и его родителя класса "_error" (ошибка):
    function formRemoveError(input) {
        input.classList.remove("_error");
        input.parentElement.classList.remove("_error");
        input.classList.add("_valid");
        input.parentElement.classList.add("_valid");
    }


    // Функция проверки email-адреса:
    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }



    /*==========================================================================================================================================================================*/
    /* Скрытие ссылок в блоке "Интересно" страницы "Подкатегория" */
    if (document.querySelector(".column-interesting__list")) {
        const interestingLists = document.querySelectorAll(".column-interesting__list");
        interestingLists.forEach(interestingList => {
            if (interestingList.children.length > 7) {
                const interestingListItems = interestingList.querySelectorAll(".column-interesting__item");
                interestingListItems.forEach((item, index) => {
                    index > 6 ? item.style.display = "none" : null;
                });
            } else {
                interestingList.closest(".column-interesting__body").querySelector(".column-interesting__link").style.display = "none";
            }
        });
    }



    /*==========================================================================================================================================================================*/
    /* Полифилы */
    (function () {
        if (!Element.prototype.closest) {
            Element.prototype.closest = function (css) {
                var node = this;
                while (node) {
                    if (node.matches(css)) return node;
                    else node = node.parentElement;
                }
                return null;
            };
        }
    })();


    (function () {
        if (!Element.prototype.matches) {
            Element.prototype.matches = Element.prototype.matchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector;
        }
    })();



    /*==========================================================================================================================================================================*/
    /* Yandex Карта */
    if (document.querySelector("#map")) {

        function yandexMap() {
            let maps = document.querySelectorAll("#map");
            maps.forEach(map => {
                init(map);
            });
        }

        function init(mapElem) {
            let center = [55.735263, 37.569173];
            let map = new ymaps.Map(mapElem, {
                center: center,
                zoom: 10
            });
            map.controls.remove("geolocationControl");                                  // Удаляем геолокацию.
            map.controls.remove("searchControl");                                       // Удаляем поиск.
            map.controls.remove("trafficControl");                                      // Удаляем контроль трафика.
            map.controls.remove("typeSelector");                                        // Удаляем тип.
            map.controls.remove("fullscreenControl");                                   // Удаляем кнопку перехода в полноэкранный режим.
            map.controls.remove("zoomControl");                                         // Удаляем контрол зуммирования.
            map.controls.remove("rulerControl");                                        // Удаляем контрол правил.
            map.behaviors.disable(["scrollZoom"]);                                      // Отключаем скролл карты (опционально).
        }
        ymaps.ready(yandexMap);
    }
}