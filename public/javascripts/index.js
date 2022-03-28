//Send Put request to server and update hearts count
const actOnUpHeart = (event) => {
    event.preventDefault();
    const userId = event.target.id;
    const action = 'upHeart';
    updateHeartStatus[action](userId);
    axios.put('/heart/' + userId, { action: action, socketId: socketId })
        .then(res => { })
        .catch(error => console.log('Request failed!', error))
};

//Create user list
const userList = document.querySelector('#user-list');
if (data.length) {
    for (let user of data) {
        const col = document.createElement('div');
        col.classList.add('col', 'my-3');

        const divCard = document.createElement('div');
        divCard.classList.add('card');
        divCard.style.width = '20rem';

        const img = document.createElement('img');
        img.src = `../images/${Math.floor(Math.random() * 14) + 1}.jpg`;
        img.classList.add('card-img-top');
        img.setAttribute('alt', 'avatar');
        divCard.appendChild(img);

        const divCardBody = document.createElement('div');
        divCardBody.classList.add('card-body');

        const a = document.createElement('a');
        a.setAttribute('href', `/users/${user._id}`);
        a.style.textDecoration = 'none';
        a.style.color = 'black';

        const h5 = document.createElement('h5');
        h5.classList.add('card-title');
        h5.textContent = user.username;
        a.appendChild(h5);
        divCardBody.appendChild(a);

        const heartBtn = document.createElement('div');
        heartBtn.classList.add('heart-like-button');
        heartBtn.id = user._id;
        if (isLoggedIn) {
            if (user._id !== currentUser._id) {
                heartBtn.addEventListener('click', (event) => {
                    actOnUpHeart(event);
                    heartBtn.classList.add("liked");
                    setTimeout(() => {
                        heartBtn.classList.remove("liked");
                    }, 100);
                });
            } else {
                heartBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                });
            }
        } else {
            heartBtn.addEventListener('click', (event) => {
                event.preventDefault();
            });
        }
        divCardBody.appendChild(heartBtn);

        const span = document.createElement('span');
        span.id = `hearts-count-${user._id}`;
        span.classList.add('hearts-count');
        span.textContent = user.hearts.hearts_count;
        divCardBody.appendChild(span);
        divCard.appendChild(divCardBody);
        col.appendChild(divCard);
        userList.appendChild(col);
    }
}