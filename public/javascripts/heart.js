//Update hearts count
const updateHeartStatus = {
    upHeart: (userId) => {
        try {
            document.querySelector('#hearts-count-' + userId).textContent++;
        } catch (error) {
            //Don't  need to do anything here
        }
    }
};

//Enable log to console
// Pusher.logToConsole = true;

const pusher = new Pusher(
    "ba48d462fcd30233a98a",
    {
        cluster: "ap1",
    }
);

var socketId = null;

// retrieve the socket ID on successful connection
pusher.connection.bind('connected', () => {
    socketId = pusher.connection.socket_id;
});

const channel = pusher.subscribe('upHeart-events');
channel.bind('upHeartAction', (data) => {
    // log message data to console - for debugging purposes
    // console.log(data);
    const action = data.action;
    updateHeartStatus[action](data.userId);
});

//Add eventListener to all heart buttons except the one for current logged in user
const heartButtons = document.querySelectorAll('.heart-like-button-other-user');
if (heartButtons.length) {
    for (let heartButton of heartButtons) {
        heartButton.addEventListener('click', (event) => {
            event.preventDefault();
            heartButton.classList.add("liked");
            setTimeout(() => {
                heartButton.classList.remove("liked");
            }, 100);
            const userId = event.target.id;
            const action = event.target.dataset.action.trim();
            updateHeartStatus[action](userId);
            axios.put('/heart/' + userId, { action: action, socketId: socketId })
                .then(res => { })
                .catch(error => console.log('Request failed!', error))
        });
    }
}