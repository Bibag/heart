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

//Add eventListener to heart button
const heartBtn = document.querySelector('.heart-like-button');
const viewUserId = heartBtn.id;
if (isLoggedIn) {
    if (viewUserId !== currentUser._id) {
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

