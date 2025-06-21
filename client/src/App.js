import './App.css';
import "./pie.css"
import FriendChart from './FriendChart';


function App() {
  return (
    <div className="App">
       <h2 style={{fontFamily:"Sans-serif",color:'white'}}>Steam Friends Forever </h2>
      <input
  className='idInput'
  type="text"
  id="steamID"
  name="steamID"
  required
  minlength="17"
  maxlength="17"
  size="20" />
  <button>Submit</button>
      <FriendChart/>
    </div>
  );
}

export default App;
