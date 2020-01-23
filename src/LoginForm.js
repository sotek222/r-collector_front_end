import APICommunicator from './services/Adapter';
const API = new APICommunicator();

class LoginForm {
  constructor(){
    this.div = document.createElement('div');
  }

  handleSubmit(input){
    return API.postUser(input);
  }

    render(){
      const loginHTML = `
        <h1 class="login-title">R-Collector</h1>
        <h3 class="login-text">Log-in</h3>
        <form>
          <input type="text" class="login-div" id="log-in" placeholder="Enter Email"/>
          <br/>
          <br/>
          <input disabled type="text" class="login-div" id="password" placeholder="Enter Password"/>
          <br/>
          <br/>
          <input type="submit" class="login-div" data-action="login" value="Log In" /><br>
        </form>`;



      this.div.setAttribute('class', 'landing');
      this.div.insertAdjacentHTML('beforeend', loginHTML);
      document.body.appendChild(this.div);
    }
  }

export default LoginForm;