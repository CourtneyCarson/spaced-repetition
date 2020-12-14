import React, { Component } from 'react';
import UserContext from '../../contexts/UserContext';
import config from '../../config';
import TokenService from '../../services/token-service';

// correct answer count 
//incorrect answer count 
//start practicing button 
// original word 

function ListOfWords(props) {
  return (
    <li>
      <p>{props.word.original}</p>
      <div>
        <span>correct answer count: {props.word.correct_count}</span> 
        <span>incorrect answer count: {props.word.incorrect_count}</span>
      </div>
    </li>
  );
}


class Dashboard extends Component {
  //create state
  state = {
    error: null,
    // loading: true,
  };
  //use context 
  static contextType = UserContext;

  //componenet did mount
  //fetch /language 
  //headers with authtservice/token
  //then this.context.setlang setwords setstate loading:false
  //catch error

  componentDidMount() {
    return fetch(`${config.API_ENDPOINT}/language`,
      {
        headers: {
          'authorization': `Bearer ${TokenService.getAuthToken()}`,
        }
      })
      .then(response => response.json())
      .then(response => {
        console.log(response)
        // console.log(this.context)
        this.context.setLanguage(response.language);
        this.context.setWords(response.words);
        // this.setState({ loading: false });
      })
      .catch(error => this.setState({ error: error }));
  }

  //function to get list of words??? 
  // loop/foreach???? 
  generateWordList(words) {
    // set empty array
    let result = [];
    // foreach with param // with word, key 
    words.forEach((word, key) => {
      //push to array
      result.push(<ListOfWords key={key} word={word} />);
    });
    // return {result}
    return <p>{result}</p>;
  }



  render() {
    console.log(this.context)
    return (
      //set a new const with context.language if/else statement
      <div>
        <p>{this.context.language ? this.context.language.name : null}</p>
        <button>start button</button>
        <p>Words to Practice: </p>
        <div>
          {this.context.words ? this.generateWordList(this.context.words) : null}
        </div>
      </div>
    );
  }
}




export default Dashboard;
