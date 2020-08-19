import React from 'react';
import ReactDOM from 'react-dom';
import TypeIt from 'typeit-react';
import file from './assets/files/Sai.pdf';
import frame00 from './assets/images/favicon/frame_00.png';
import frame10 from './assets/images/favicon/frame_10.png';

import './index.css';

const App = () => {
  const faviconImages = [frame10, frame00];

  let imageCounter = 0;

  setInterval(() => {
    if (window.document.querySelector("link[rel='icon']") !== null) {
      window.document.querySelector("link[rel='icon']").remove();
    }
    const newLink = window.document.createElement('link');
    newLink.type = 'image/png';
    newLink.rel = 'icon';
    newLink.href = faviconImages[imageCounter];

    window.document.querySelector('head').appendChild(newLink);

    if (imageCounter === faviconImages.length - 1) {
      imageCounter = 0;
    } else {
      imageCounter += 1;
    }
  }, 500);

  return (
    <React.StrictMode>
      <div className="App">
        <div className="background" />
        <div className="wrapper">
          <div className="info-wrapper">
            <div className="name">Sai</div>
            <div className="name-white">Dhruv</div>
            <a
              className="link github"
              href="https://github.com/saidhruv"
              rel="noopener noreferrer"
              target="_blank"
            >
              github
            </a>
            <a
              className="link linkedin"
              href="https://www.linkedin.com/in/sai-dhruv/"
              rel="noopener noreferrer"
              target="_blank"
            >
              linkedin
            </a>
            <a
              className="link facebook"
              href="https://www.facebook.com/sai.dhruv/"
              rel="noopener noreferrer"
              target="_blank"
            >
              facebook
            </a>
            <a
              className="link twitter"
              href="https://twitter.com/sai_dhruv"
              rel="noopener noreferrer"
              target="_blank"
            >
              twitter
            </a>
            <a
              className="link mail"
              href="mailto:sai_dhruv@hotmail.com?subject=Hi!%20%3CInsert%20Your%20Name%20Here%3E%20wants%20to%20contact%20you.&body=Hi%20Sai%2C%0D%0A%0D%0AMy%20name%20is%20%3CInsert%20Your%20Name%20Here%3E.%20I'm%20contacting%20you%20on%20behalf%20of%20%3CInsert%20Your%20Organisation's%20Name%20Here%3E.%20I%20would%20like%20to%20get%20in%20touch%20with%20you%20because%20%3CYour%20Message%20Here%3E.%0D%0A%0D%0A%3CYour%20Name%20Here%3E%0D%0A%3CYour%20Contact%20Details%20Here%3E"
            >
              contact me
            </a>
            <a className="link download" download href={file}>
              download
            </a>
          </div>
          <TypeIt
            className="console"
            getBeforeInit={(instance) => {
              instance
                .type('What are you running after?')
                .pause(2000)
                .break()
                .type(' Success?')
                .pause(1000)
                .delete(9)
                .type(' Cars?')
                .pause(900)
                .delete(6)
                .type(' Excellence?')
                .pause(2000)
                .delete(11)
                .type(' Peace?')
                .pause(3000)
                .delete(7)
                .type(' Moon?')
                .pause(700)
                .delete(6)
                .type(' Family?')
                .pause(1000)
                .delete(8)
                .type(' Cricket?')
                .pause(500)
                .delete(9)
                .type(' Wife?')
                .pause(3000)
                .delete(6)
                .type(' Emotions?')
                .pause(500)
                .delete(10)
                .type(' Life?')
                .pause(800)
                .delete(6)
                .type(' Love?')
                .pause(1000)
                .delete(6)
                .type(' Hobbies?')
                .pause(900)
                .delete(9)
                .type(' Gardening?')
                .pause(1000)
                .delete(11)
                .type(' Stress?')
                .pause(500)
                .delete(8)
                .type(' Travel?')
                .pause(3000)
                .delete(8)
                .type(' Memories?')
                .pause(2000)
                .delete(10)
                .type(' Stars?')
                .pause(1500)
                .delete(7)
                .type(' Music?')
                .pause(700)
                .delete(7)
                .type(' God?')
                .pause(1500)
                .delete(5)
                .type(' Nirvana?')
                .pause(600)
                .delete(9)
                .type(' Pleasure?')
                .pause(3000)
                .delete(10)
                .type(' War?')
                .pause(1200)
                .delete(5)
                .type(' Toys?')
                .pause(700)
                .delete(6)
                .type(' Career?')
                .pause(1200);
              return instance;
            }}
            options={{
              cursorChar: '▐',
              loop: true,
            }}
          />
        </div>
      </div>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
