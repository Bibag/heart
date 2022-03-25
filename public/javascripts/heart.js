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