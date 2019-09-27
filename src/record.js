class Record {
  constructor({id, title, artist, genre, image_url}){
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.id = genre;
    this.id = image_url;

    Record.all.push(this);
  }
  
  render(){
    console.log("Record:", this);
  }
  
}

Record.all = [];