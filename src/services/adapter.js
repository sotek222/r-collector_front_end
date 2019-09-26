function postUser(email) {
    return fetch(userUrl, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email
        })
    })
        .then(resp => resp.json())
};

function removeFromCollection(collectionId) {
    return fetch(`${collectionUrl}/${collectionId}`, {
        method: "DELETE"
    })
};

function postToCollection(userId, recordId) {
    return fetch(collectionUrl, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: userId,
            record_id: recordId
        })
    })
};

function fetchRecords(url) {
    return fetch(url)
        .then(res => res.json())
};

function postRecord(title, artist, genre, image) {
    return fetch(recordsUrl, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            artist: artist,
            genre: genre,
            image_url: image
        })
    }).then(resp => resp.json())
};


const adapter = {
    postUser,
    removeFromCollection,
    postToCollection,
    fetchRecords,
    postRecord
};
