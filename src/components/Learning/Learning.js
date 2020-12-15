import React, { Component } from 'react';
import UserContext from '../../contexts/UserContext';
import config from '../../config';
import TokenService from '../../services/token-service';
import { Input, Label } from '../Form/Form';
import Button from '../Button/Button';


class Learning extends Component {
  //create state
  state = {
    error: null,
  };
  //use context
  static contextType = UserContext;


  //component did mount / fetch request
  componentDidMount() {
    //fetch request - GET /api/language/head
    return fetch(`${config.API_ENDPOINT}/language/head`,
      {
        //headers with authservice/token? 
        headers: {
          'authorization': `Bearer ${TokenService.getAuthToken()}`,
        }
      })
      .then(response => response.json())
      .then(response => {
        console.log(response.wordCorrectCount);
        console.log(response);
        // console.log(response.nextWord);
        // console.log(response.totalScore);

        // console.log(this.context)
        //current total, total score, correct/incorrect count
        this.context.setNextWord(response);
        // this.context.setTotalScore(response.totalScore)
        // this.context.setLanguage(response.language);
        // this.context.setWords(response.words);
      })
      //catch error
      .catch(error => this.setState({ error: error }));
  }




  render() {
    //display next word 
    //display current total score -- this.context.totalScore
    //display form with input input#learn-guess-input 
    //display correct & incorrect count for word -- this.context.correctCount? wordCorrectCount - from response
    //button 
    console.log(this.context.nextWord);
    return (
      <div className='learning'>
        <main>
          <form>
            <Label htmlFor='learn-guess-input' className='learning-form-text'>
              What's the translation for this word?
          </Label>
            <Input className='text-box'
              id='learn-guess-input'
              required
            />
            <Button type='submit'>Submit your answer</Button>
          </form>
          <h2>Translate the word:</h2><span>{this.context.nextWord ? this.context.nextWord.nextWord : null}</span>
          <p>Your total score is: {this.context.nextWord ? this.context.nextWord.totalScore : null}</p>
          <p>You have answered this word correctly {this.context.nextWord ? this.context.nextWord.wordCorrectCount : null} times.</p>
          <p>You have answered this word incorrectly {this.context.nextWord ? this.context.nextWord.wordIncorrectCount : null} times.</p>

        </main>
      </div>
    );
  }
}



export default Learning;