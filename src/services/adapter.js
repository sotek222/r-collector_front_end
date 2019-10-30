class APICommunicator {
    constructor(endpoint = "http://localhost:3000/"){
        this.endpoint = endpoint;
        this.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }

    fetchRecords(){
        return fetch(this.endpoint + "records")
        .then(res => res.json())
    };

    postRecord(title, artist, genre, image) {
        return fetch(this.endpoint + "records", {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                title: title,
                artist: artist,
                genre: genre,
                image_url: image
            })
        }).then(resp => resp.json())
    };

    postUser(email) {
        return fetch(this.endpoint + "users", {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                email: email
            })
        })
        .then(resp => resp.json());
    };

    removeFromCollection(userId, recordId) {
      return fetch(this.endpoint + `collections/${recordId}/${userId}`, { 
          method: "DELETE"
         })
         .then(resp => resp.json())
    };

    postToCollection(userId, recordId) {
        return fetch(this.endpoint + "collections", {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                user_id: userId,
                record_id: recordId
            })
        });
    };

    getUser(userId){
        return fetch(this.endpoint + `/users/${userId}`)
        .then(resp => resp.json());
    };

};


export default APICommunicator

