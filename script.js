fetch('http://95.216.175.5/cohort0/users/me', {
    headers: {
        authorization: '77cc3d84-97a1-47d6-8548-cefc66c159d6'
    }
})
    /* Можно лучше:
    * В начале скрипта в словарь можно выделить токен и url с целью их переиспользования.
    * Например, const ApiEnum = {
    *   token: '',
    *   url: '' !url меняется постоянно, если только взять за постоянную величину 'http://95.216.175.5/cohort0/' и менять ее прибаляя + 'users/me'
    * }
    * */
    /* //
    * Да, вы все корректно поняли - в url можно вынести только постоянную часть, добавляя к ней необходимый путь.
    * */
    .then((res) => {if (res.ok) {
    return res.json();}
    })

    .then((result) => {
        // console.log(result);
        document.querySelector('.user-info__name').textContent = result.name;
        document.querySelector('.user-info__job').textContent = result.about;
        document.querySelector('.user-info__photo').style = `background-image: url(${result.avatar})`;
    })
    .catch((err) => {
        console.log('Ошибка. Запрос не выполнен');
    })

    /* Обратить внимание: !Думаю занятся этим на каникулах вместе с дополнительными заданиями
    *   1. Форматирование кода.
    *   2. Круто, что в цепочке промисов корректно выполняется заполнение информации. Однако, как "Можно лучше" хотелось бы отметить создание нового класса, например, User, конструктор которого
    *   и будет содержать GET запрос юзера. После чего, непосредственно при создании экземпляра класса будет выполняться гет запрос.
    *   3. Также, класс User будет содержать методы sendForm (Где патчем мы будем обновлять инфу, сейчас этот метод полностью описан внутри сабмита, что не является логичным) и updateUser.
    * */

let initialCards = [];
fetch('http://95.216.175.5/cohort0/cards', {
    headers: {
        authorization: '77cc3d84-97a1-47d6-8548-cefc66c159d6'
    }
})
    .then((res) => {if (res.ok) {
    return res.json();}
    })

    .then((result) => {
        initialCards = result;
        const dmEl = document.querySelector('.places-list');
        const cardList = new CardList(dmEl, initialCards);
        cardList.render();
    })
    .catch((err) => {
        console.log('Ошибка. Запрос не выполнен');
    })

/* Обратить внимание:
*   1. Форматирование кода.
*   2. Данный запрос, на мой взгляд, корректнее разместить внутри конструктора CardList и выполнять его при создании экземпляра класса. Сейчас запрос просто лежит в коде.
* */

// класс карточки
class Card {
    constructor(name, url) {
        this.name = name;
        this.url = url;
        this.element = null;
        this.likeBtnElement = null;
    };

    create() {
        // создаем карточку ввиде DOM элемента
        const cardElement = document.createElement('div');
        cardElement.classList.add('place-card');

        const imgElement = document.createElement('div');
        imgElement.classList.add('place-card__image');
        imgElement.style = `background-image: url(${this.url})`;

        const btnElement = document.createElement('button');
        btnElement.classList.add('place-card__delete-icon');
        imgElement.appendChild(btnElement);

        const titleElement = document.createElement('div');
        titleElement.classList.add('place-card__description');
        const titleH3Element = document.createElement('h3');
        titleH3Element.classList.add('place-card__name');
        titleH3Element.textContent = this.name;
        titleElement.appendChild(titleH3Element);
        const likeBtnElement = document.createElement('button');
        likeBtnElement.classList.add('place-card__like-icon');
        titleElement.appendChild(likeBtnElement);

        cardElement.appendChild(imgElement);
        cardElement.appendChild(titleElement);

        this.element = cardElement;
        this.likeBtnElement = likeBtnElement;

        btnElement.addEventListener('click', this.remove.bind(this));
        likeBtnElement.addEventListener('click', this.like.bind(this));

        /* настраиваем обработчик клика по изображения */
        imgElement.addEventListener('click', this.showImgPopUp.bind(this));

        return this.element;
    }

    like() {
        this.likeBtnElement.classList.toggle('place-card__like-icon_liked');
    }

    remove() {
        this.element.parentNode.removeChild(this.element);
    }


    showImgPopUp (event) {
      if (event.target.classList.contains('place-card__image')) {
        /* задаем картинку в попапе*/
        document.querySelector('.popup2__image').setAttribute('src', this.url);
        /* открываем попап */
        popupImg.open();
    }
    }
}

class CardList {
    constructor(domEl, arrCard) {
      this.domEl = domEl;
      this.arrCard = arrCard;
    };

    addCard(name, link) {
      const card = new Card(name, link);
      this.domEl.appendChild(card.create());
    }

    render() {
      this.arrCard.forEach(card => {
          this.addCard(card.name, card.link)
      });
    }
}

const dmEl = document.querySelector('.places-list');
const cardList = new CardList(dmEl, initialCards);
cardList.render();

class Popup {
    constructor(popupElement, openedClass) {
        this.popupElement = popupElement;
        this.openedClass = openedClass;
    }

    open() {
        this.popupElement.classList.add(this.openedClass)
    }

    close() {
        this.popupElement.classList.remove(this.openedClass)
    }
}

const popupAddCard = new Popup(document.querySelector('.popup'), 'popup_is-opened');
const popupEdit = new Popup(document.querySelector('.popup1'), 'popup1_is-opened');

// создаем экземпляр класса попап для попапа изображения
const popupImg = new Popup(document.querySelector('.popup2'), 'popup2_is-opened');

document.querySelector('.button').addEventListener('click', function (event) {
    popupAddCard.open();
})

document.querySelector('.button1').addEventListener('click', function (event) {
    popupEdit.open();
})

document.querySelector('.popup__close').addEventListener('click', function (event) {
    popupAddCard.close();
})

document.querySelector('.popup1__close').addEventListener('click', function (event) {
    popupEdit.close();
})

// настраиваем закрытие попапа изображения
document.querySelector('.popup2__close').addEventListener('click', function (event) {
    popupImg.close();
})

const form = document.forms.new
const form1 = document.forms.new1

/* Слушатели событий */
form.addEventListener('submit', function (event) {
    const fNew = document.forms.new
    const name = fNew.elements.name
    const link = fNew.elements.link

    if (name.value.length <= 0) {
        alert('Вы не ввели название!')
    } else {
        if (link.value.length <= 0) {
            alert('Вы не ввели ссылку на картинку!')
        } else {
            cardList.addCard(name.value, link.value);
            popupAddCard.close();
            form.reset();
        }
    }
    event.preventDefault()
})

form1.addEventListener('submit', function (event) {
    const name = form1.elements.name1
    const about = form1.elements.about

    if (name.value.length <= 0) {
        alert('Вы не ввели имя!')
    } else {
        if (about.value.length <= 0) {
            alert('Вы не ввели данные о себе!')
        } else {
            document.querySelector('.user-info__name').textContent = name.value
            document.querySelector('.user-info__job').textContent = about.value
            document.querySelector('.popup1__button').classList.remove('popup1__button__active')

            fetch('http://95.216.175.5/cohort0/users/me', {
                method: 'PATCH',
                headers: {
                    authorization: '77cc3d84-97a1-47d6-8548-cefc66c159d6',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name.value,
                    about: about.value
                })
            })
                .then((res) => {if (res.ok) {
                    return res.json();}
                })

                .then((result) => {
                    console.log(result);
                })

                .catch((err) => {
                    console.log('Ошибка. Запрос не выполнен');
                })
                .finally(() => {
                    popupEdit.close();
                });

            /* Обратить внимание:
            * Комментарии по сути такие же, как и к фетчам в начале кода. Они не привязаны логически к какой-либо сущности, а хотелось бы.
            * Данный фетч лучше соотнести к классу, сделав его методом updateInfo.
            * */
        }
    }
    event.preventDefault();
})

// активация кнопки в попапе новое место
form.addEventListener('input', function (event) {
    const name = form.elements.name
    const link = form.elements.link

    if ((name.value.length > 0) && (link.value.length > 0)) {
        document.querySelector('.popup__button').classList.add('popup__button__active')
    } else {
        document.querySelector('.popup__button').classList.remove('popup__button__active')
    }
})

function validaTor (elem1, elem2, elem3) {
  document.querySelector(elem1).setAttribute('style', 'display: flex')
  document.querySelector(elem1).innerHTML = elem2
  document.querySelector(elem3).setAttribute('disabled', 'true')
}

form1.addEventListener('input', function (event) {
    const name = form1.elements.name1
    const about = form1.elements.about

    document.querySelector('.error_name1').setAttribute('style', 'display: none')
    document.querySelector('.error_about').setAttribute('style', 'display: none')
    document.querySelector('.popup1__button').classList.remove('popup1__button__active')
    document.querySelector('.popup1__button').removeAttribute('disabled')

    if (name.value.length === 0) {
        validaTor('.error_name1', 'Это обязательное поле', '.popup1__button')
    }
    if (about.value.length === 0) {
        validaTor('.error_about', 'Это обязательное поле', '.popup1__button')
    }
    if ((name.value.length === 1) || (name.value.length > 30)) {
        validaTor('.error_name1', 'Должно быть от 2 до 30 символов', '.popup1__button')
    }
    if ((about.value.length === 1) || (about.value.length > 30)) {
        validaTor('.error_about', 'Должно быть от 2 до 30 символов', '.popup1__button')
    }
    if ((name.value.length > 1) && (about.value.length > 1)) {
        if ((name.value.length <= 30) && (about.value.length <= 30)) {
            document.querySelector('.popup1__button').classList.add('popup1__button__active')
            document.querySelector('.popup1__button').removeAttribute('disabled')
        } else {
            document.querySelector('.popup1__button').classList.remove('popup1__button__active')
            document.querySelector('.popup1__button').setAttribute('disabled', 'true')
        }
    }
})

form.addEventListener('input', function (event) {
    const name = form.elements.name
    const link = form.elements.link

    document.querySelector('.error_name').setAttribute('style', 'display: none')
    document.querySelector('.error_link').setAttribute('style', 'display: none')
    document.querySelector('.popup__button').classList.remove('popup__button__active')
    document.querySelector('.popup__button').removeAttribute('disabled')

    if (name.value.length === 0) {
        validaTor('.error_name', 'Это обязательное поле', '.popup__button')
    }
    if (link.value.length === 0) {
        validaTor('.error_link', 'Это обязательное поле', '.popup__button')
    }
    if ((name.value.length === 1) || (name.value.length > 30)) {
        validaTor('.error_name', 'Должно быть от 2 до 30 символов', '.popup__button')
    }
    if ((name.value.length > 1) && (link.value.length > 1)) {
        if ((name.value.length <= 30) && (link.value.length <= 30)) {
            document.querySelector('.popup__button').classList.add('popup__button__active')
            document.querySelector('.popup__button').removeAttribute('disabled')
        } else {
            document.querySelector('.popup__button').classList.remove('popup__button__active')
            document.querySelector('.popup__button').setAttribute('disabled', 'true')
        }
    }
    if (!(link.value.slice(0, 8) === 'https://') && !(link.value.slice(0, 7) === 'http://')) {
        document.querySelector('.error_link').setAttribute('style', 'display: flex')
        document.querySelector('.error_link').innerHTML = 'Здесь должна быть ссылка'
        document.querySelector('.popup__button').setAttribute('disabled', 'true')
        document.querySelector('.popup__button').classList.remove('popup__button__active')
    } else {
        document.querySelector('.popup__button').classList.add('popup__button__active')
        document.querySelector('.popup__button').removeAttribute('disabled')
    }
})

// Спринт 9

/* Резюме по работе:
* В целом, все исправления внесены. Фетчи "причесаны", не содержат лишней логики, а только обязательные и необходимые элементы.
* Теперь все корректно работает и работу можно принимать. Но, прежде чем я пожелаю удачи на следующих спринтах, хочется упомянуть следующие моменты:
*
*   1. Я получил фидбек о вашем желании еще поработать над оптимизацией структуры проекта и я хотел бы обратить ваше внимание на описание всех запросов внутри класса Api.
*   Также не забудьте про словарь для токена и url.
*   2. Я заметил в коде следующий фрагмент, который, к сожалению, не был замечен нами на предыдущих итерациях:
*       "imgElement.style = `background-image: url(${this.url})`;"
*       Данная запись не является корректной.
*       Т.к. style содержит в себе набор объектов (CSS-свойств). Корректной записью является imgElement.style.backgroundImage = `url('${some code here}')`
*   3. Многие функции содержат не используемые параметры, вот фрагменты данного кода:
*       form1.addEventListener('input', function (event)  - event не используется внутри функции.
*       form.addEventListener('input', function (event)
*       Почти все добавляемые обработчики событий содержать не используемый параметр event.
*       Также некоторые .catch() содержат не используемый параметр err
*
* Теперь я смело могу пожелать вам удачи в дальнейшем обучении!
* */


/* Резюме по работе:
* Получилось достаточно неплохо. Вы полностью реализовали обязательный функционал, он работает корректно. Отсутствуют ошибки в консоли.
* Понравилось:
*   1. В большинстве случаев в цепочке промисов есть .catch()
*   2. Почти все фетчи содержат цепочку с промисами - вы корректно работаете с асинхронным кодом и в промисах, в большинстве случаев, выполняете изменение DOM только после успешности операции.
*
* Что можно/необходимо улучшить:
*   1. Внутри фетчей избавиться от пустых блоков.+
*   2. При сабмите формы с информацией о пользователе - операции над DOM выполняются независимо от успешности обновления данных (Обязательное исправление).+
*   3. Все-таки, все три фетча достаточно беспорядочно лежат в коде. Наверное, стоит их либо соотнести с каким-то классом (Фетчи для информации о пользователи выделить в class User, а получение
*   карточек - в CardList. (В комментариях к коду я предложил именно такой способ). Либо создать отдельный класс, который работает с серверными запросами, например class Api. (Рекомендация)
*   4. Токен и url можно вынести в словарь+
*   5. Отсутствуют проверки ответа сервера. (Обязательное исправление)+
*
*   Полезная статья по промисам: https://medium.com/web-standards/%D0%BE%D0%B1%D0%B5%D1%89%D0%B0%D0%BD%D0%B8%D0%B5-%D0%B1%D1%83%D1%80%D0%B3%D0%B5%D1%80%D0%BD%D0%BE%D0%B9-%D0%B2%D0%B5%D1%87%D0%B5%D1%80%D0%B8%D0%BD%D0%BA%D0%B8-b0ed209809ab
* */
