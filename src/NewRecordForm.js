import APICommunicator from './services/Adapter';
const API = new APICommunicator();

class NewRecordForm {

  handleClick(div){
    div.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.innerText === "Create Record") {
        const { title, artist, genre, image } =
          Array.from(document.querySelectorAll('[type="text"]')).reduce((acc, cv) => {
            acc[cv.name] = cv.value
            return acc;
          }, {});
        API.postRecord(title, artist, genre, image)
          .then(record => { renderRecord(record, recordsContainer) })
        document.querySelectorAll('[type="text"]')
          .forEach(input => input.value = "");
      }
      if (e.target.innerText === "Close") {
        document.querySelectorAll('[type="text"]')
          .forEach(input => input.value = "");
      }
    });
  }

  render(){
    const HTML = `
    <span>
      <button 
      id="modal-button"
      type="button"
      name="create"
      class="btn btn-primary"
      data-toggle="modal"
      data-target="#exampleModal">
      Add to our Library
      </button>
    </span>
    `;

    // inserts the button between flip records button and the logout button
    document.querySelector("[data-action='flip']").insertAdjacentHTML('beforebegin', HTML);
    const form = document.querySelector('.new-record-form');
    this.handleClick(form);
  }

}

export default NewRecordForm;