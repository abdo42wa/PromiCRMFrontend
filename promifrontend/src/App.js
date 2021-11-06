import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import HomeScreen from './Screens/HomeScreen';
import Header from './Components/Header';
import LoginScreen from './Screens/LoginScreen';

function App() {
  return (
    <Router >
      <Header />
      <Container>
        <div className="App">


          <Route path='/' component={HomeScreen} exact />
          <Route path='/login' component={LoginScreen} />

        </div>
      </Container>
    </Router >
  );
}

export default App;