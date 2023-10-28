let axios = require('axios');

function harperGetMessages(room) {
    const dbUrl = process.env.HARPERDB_URL;
    const dbPw = process.env.HARPERDB_PW;
    if(!dbUrl || !dbPw) {
        console.log('No password or URL found') ;
        return null;
    }

    let data = JSON.stringify({
        operation : 'sql',
        sql : `SELECT FROM real_time_chat.messages WHERE room = '${room}' LIMIT 100`,
    });

    let config = {
        method : 'post',
        url : dbUrl,
        headers: {
            'Content-Type' : 'application/json',
            Authorization : dbPw,
        },
        data : data,
    };

    return new Promise((resolve, reject) => {
        axios(config)
            .then(function (response) {
                resolve(JSON.stringify(response.data));
            })
            .catch(function (error) {
                reject(error.response.data);
            });
    });
}

module.exports = harperGetMessages;