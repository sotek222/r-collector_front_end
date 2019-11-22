import "../../styles/card.css";
import { colorRandomizer } from '../services/utils';

class Record {
  constructor({id, title, artist, genre, image_url}, inCollection = false){
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.genre = genre;
    this.image_url = image_url;
    this.inCollection = inCollection;

    if(!Record.all.find(record => record.id === id)){
      Record.all.push(this);
    };
  };
  
  renderCard(container){ 
    const { id, title, artist, genre, image_url, inCollection } = this;
    const html = `
      <div class="flip-card-inner" data-record-card-id=${id}>
        <div class="flip-card-front">
          <img class="card-image" src=${image_url} alt="Album Art" data-user-id=${localStorage.userId}>
        </div>
        <div class="flip-card-back">
          <div>
            <h1 class="record-title">${title}</h1>
            <h2 class="record-artist">${artist}</h2>
            <h3 class="record-genre">${genre}</h3>
          </div>
          ${inCollection ? 
           `<button
            class="record-button play"
            data-action="play-record">
            ►
            </button>`
            : ""}
          <button 
            class="record-button" 
            data-record-id=${id} 
            data-action=${inCollection ? "remove-record" : "add-record"}>
            ${inCollection ? "Remove from Collection" : "Add to Collection"}
          </button>
        </div>
      </div>
     `;
     
    this.card = document.createElement('div');
    this.card.className = "flip-card";

    this.card.addEventListener('click', e => {

      if (this.card.classList.value.includes('flipped')){
        this.card.classList.remove('flipped');
      } else {
        this.card.classList.add('flipped');
        this.card.querySelector('.flip-card-back').style.background = `
        linear-gradient(-45deg, ${colorRandomizer()}, ${colorRandomizer()})`;
      };
    });

    this.card.insertAdjacentHTML('beforeend', html);
    container.insertAdjacentElement('beforeend', this.card);

  }
  
}

Record.all = [];

export default Record