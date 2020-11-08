'use strict';
const faker = require('faker');

const titlesAndSubtitles = [
  ["You never knew this about Superman", "The inside scoop on his greatest secret"],
  ["'War of the Worlds' redux", ""],
  ["Greatest alien short stories of all time","At least IMO"],
  ["Conan is dead","A barbarian's life and death"],
  ["Will George R. R. Martin ever finish writing his 'A Song of Ice and Fire' series?","The Game of Thrones needs to end!"],
  ["Greatest Batman paraphernalia","All the best tools of the Dark Knight"],
  ["The Wonders of Wonder Woman","Little known details of a great American hero"],
  ["J. R. R. Tolkien's Legacy","A retrospective"],
  ["Season 2 of 'Mandalorian' secrets","An insider's tell all"],
  ["New movie release: Mortal",""],
  ["'Upside Down Magic' on Disney Now",""],
  ["Interview with best selling author Terry Brooks","His long running Shannara series"],
  ["Fan Fiction: The Ransacking of Hobbiton",""],
  ["How to write speculative fiction","For aspiring fantasy and sci-fi authors"],
  ["Fictional worldbuilding","Maps, conlangs, cultures, and more"],
  ["Pirates of the Caribbean Six","Fresh news on an upcoming sequel"],
  ["The further adventures of the Green Lantern","Fan fic montage"],
  ["Marvel Cinematic Universe explored","Deeper than you thought possible"],
  ["The rising again of Wolverine","You just can't keep him down"],
  ["Black Widow's past","A fan fic take"],
  ["Rereading stories about Elric of Melniboné","A critical examination"],
  ["The Chronicles of Narnia in today's context","C. S. Lewis's philosphy as applicable today"],
  ["Fan Fiction: The Unbeliever Returns","Returning to 'The Land' of The Chronicles of Thomas Covenant"],
  ["Critique of the Harry Potter series","Taking on one of the most top selling of all time"],
  ["'Twilight' lit up!","Fan fic"],
  ["Going around 'Discworld'","A review of major people and places of Terry Pratchett's world"],
  ["Interview with author Christopher Paolini","The Inheritance Cycle series"],
  ["Star Wars fan fic list","Continually updated"],
  ["A new Shrek?",""],
  ["Wall-E is back!","Sequel is rumored"],
  ["Aliens, aliens, everywhere, aliens",""],
  ["Greatest Sci-fi movies of all time",""],
  ["Greatest fantasy books of 2019",""],
  ["Latest plans of Marvel and DC comics",""],
  ["UFO: A true story",""],
  ["Remake of the X-files?","Hmmm..."],
  ["New Book Release: The Once and Future Witches by Alix E. Harrow",""],
  ["New Movie Release: Proximity",""],
  ["What is speculative fiction?","A broad category for fantasy and sci-fi"],
  ["Book deals","Updated sales on spec fic books"],
  ["Julian May","Revisiting her 'Saga of Pliocene Exile' and 'Galactic Milieu Series'"],
  ["Design your own superhero","New website goes live"],
  ["Monsters are everywhere","True life stories of fictional narratives"],
  ["Roleplaying roundup","The best in the latest role-playing games"],
  ["The 'Warhammer Online' world","A look at the popular online game continued by fans"],
  ["'World of Warcraft'","It's history and popularity"],
  ["Advice for playing Star Wars: The Old Republic","An pro's tips"],
  ["Disney ruined Star Wars",""],
  ["Star Trek's long history","A look at the major events of the sci-fi universe"],
  ["App Academy as a surreal experience",""],
]

function getRandom(max) {
  return Math.floor(Math.random() * max) + 1;
}

module.exports = {
  up: (queryInterface, Sequelize) => {
      const stories = [];
      const number = titlesAndSubtitles.length; //50
      const users = 20;

      for(let i=0; i<number; i++) {
        const userId = getRandom(users);
        const published = `This ${i+1} story is totally gibberish from here ${faker.random.words(100 + getRandom(300))}`;
        const createdAt = faker.date.past(2);
        const updatedAt = faker.date.between(createdAt, faker.date.recent());

        stories.push(
          {
            title: titlesAndSubtitles[i][0],
            subtitle: titlesAndSubtitles[i][1],
            draft: '',
            published,
            publishAfter: null,
            imageLink: getRandom(20) < 19 ? `${faker.image.imageUrl()}/any?dummy=${i}` : '',
            userId,
            createdAt,
            updatedAt,
          }
        );
      }

      return queryInterface.bulkInsert('Stories', stories, {});

  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Stories', null, {});
  }
};
