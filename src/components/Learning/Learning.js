import React, { Component } from 'react';
import UserContext from '../../contexts/UserContext';
import config from '../../config';
import TokenService from '../../services/token-service';
import { Input, Label } from '../Form/Form';
import Button from '../Button/Button';
import './Learning.css';


class Learning extends Component {
  //create state
  state = {
    error: null,
    // response: {},
    results: false
  };
  // add constructor
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }
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
        // console.log(response.wordCorrectCount);
        // console.log(response);

        //current total, total score, correct/incorrect count
        this.context.setNextWord(response);
        // this.context.setTotalScore(response.totalScore)
      })
      //catch error
      .catch(error => this.setState({ error: error }));
  }

  // submit form / guess fetch request
  submitForm(event) {
    event.preventDefault();
    if (this.state.results) {
      this.setState({ results: !this.state.results });
    }
    else {

      this.context.setCurrentWord(this.context.nextWord);
      this.context.setGuess(event.target.userinput.value);
      this.setState({ results: !this.state.results });
    }
    fetch(`${config.API_ENDPOINT}/language/guess`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${TokenService.getAuthToken()}`,
        },
        body: JSON.stringify({ guess: event.target.userinput.value })
      })
      .then(response => response.json())
      .then(response => {
        this.context.setNextWord(response);
        // this.setState({ response: response });
        document.getElementById('learn-guess-input').value = '';
      });
  }

  // feedback if correct/incorrect?? 
  //clearFeedback?? 
  // get response text 
  getResponse() {
    if (this.context.nextWord && typeof this.context.nextWord.isCorrect !== undefined) {
      if (this.context.nextWord.isCorrect) {
        console.log('Congrats');
        return 'You were correct! :D';
      }
      else {
        console.log('Incorrect!');
        return 'Good try, but not quite right :(';
      }
    }
  }

  //'the correct response was'
  getResponseFeedback() {
    // let translation = this.context.words && this.context.currentWord ? this.context.words.find(word => word.original === this.context.currentWord.nextWord) : null;
    console.log(this.context.guess);
    // console.log(translation)
    if (this.context.nextWord && typeof this.context.nextWord.isCorrect !== 'undefined') {
      // if (this.context.nextWord.isCorrect) {
      return `The correct translation for ${this.context.currentWord.nextWord} was ${this.context.nextWord.answer} and you chose ${this.context.guess}!`;
    }
  }
  // }

  //get button text - make button 'try another word' or 'submit your answer' 
  getButtonText() {
    if (this.state.results) {
      return 'Try another word!';
    } else return 'Submit your answer';
  }



  //generate current word so that there is a differentation between current and next?? 
  getCurrentWord() {
    if (this.state.results) {
      return this.context.currentWord.nextWord;
    }
    else {
      return this.context.nextWord ? this.context.nextWord.nextWord : null;
    }
  }


  //generate button?? - make the button move to the next word
  buttonMoveNext() {
    if (this.state.results) {
      return <button onClick={() => this.moveToNextWord}>{this.getButtonText}</button>;
    }
    else {
      return <button type='submit'>{this.getButtonText()}</button>;
    }
  }

  setRequired() {
    if (this.state.results) {
    return null
    } 
    else {
      return 'required'
    }
}
  //goto next



  render() {
    //display next word 
    //display current total score -- this.context.totalScore
    //display form with input input#learn-guess-input 
    //display correct & incorrect count for word -- this.context.correctCount? wordCorrectCount - from response
    //button 
    // console.log(this.context.nextWord);
    // console.log(this.context.totalScore);

    return (
      <div className='learning'>
        <main>
        <h3>Translate the word:</h3><span>{this.context.nextWord ? this.state.results ? this.context.currentWord.nextWord: this.context.nextWord.nextWord : null}</span>
          <form onSubmit={this.submitForm}>
            <Label htmlFor='learn-guess-input' className='learning-form-text'>
              What's the translation for this word?
          </Label>
            <Input className='text-box'
              id='learn-guess-input'
              name="userinput"
              type="text"
              required={this.state.results ? false : true}
            />
            <Button type='submit'>{this.getButtonText()}</Button>
          </form>
          <h2>{this.getResponse()}</h2>
          <div className='DisplayScore'>
            <p>Your total score is: {this.context.nextWord ? this.context.nextWord.totalScore : null}</p>
          </div>
          <p>You have answered this word correctly {this.context.nextWord ? this.context.nextWord.wordCorrectCount : null} times.</p>
          <p>You have answered this word incorrectly {this.context.nextWord ? this.context.nextWord.wordIncorrectCount : null} times.</p>
          <div className='DisplayFeedback'>
            <p>{this.getResponseFeedback()}</p>
          </div>
        </main>
      </div>
    );
  }
}



export default Learning;