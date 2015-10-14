import tokenizer from 'sbd';

import faustroll from "./faustroll";

const minSize = 250;
const maxTextChunk = 1500;
const precision = 100000;

export function randomQuote ({size=minSize, position=randomQuoteId(), book=faustroll} = {}){
  const realPosition = Math.floor((position/precision) * (book.size - size) );
  let quote = quoteAt(size, book, realPosition);
  quote.position = position;
  return quote;
}

export function randomQuoteId(){
  return Math.ceil(precision*Math.random());
} 

function quoteAt(size, book, position){
  let newpos = position - book.content.length;

  if (newpos + minSize <= 0 ) {
    return {
      quote: getQuote(size, book.content, position),
      chapter: [book.title]
    };
  }

  const nbChapters = book.books.length; 
  let numChapter = 0;
  let redChapter = book;
  while (newpos + minSize > 0 && numChapter < nbChapters) {
    numChapter += 1;

    redChapter = book.books[numChapter - 1];
    position = newpos;
    newpos = position - redChapter.size;
  }

  let chapterQuote = quoteAt(size, book.books[numChapter - 1], position);
  chapterQuote.chapter.unshift(book.title);

  return chapterQuote;
}

function getQuote(size, text, position){
  //Take a chunk of text around the position
  const chunkStart = Math.max(0, position - (maxTextChunk / 2));
  const chunkStop = Math.min(text.length, chunkStart + maxTextChunk);
  const chunk = text.slice(chunkStart, chunkStop);

  //Try to get complete sentences of the chunk of text 
  let sentences = tokenizer.sentences(chunk, true);
  let smallChunkLength = chunk.length - sentences[0].length;
  let removedFromStart = 0;
  if (sentences.length > 1 && (smallChunkLength > minSize/2)) {
    //Remove first sentence (probably incomplete)
    removedFromStart = sentences[0].length;
    sentences = sentences.slice(1);
    smallChunkLength = smallChunkLength - sentences.slice(-1)[0].length;
    
    if (sentences.length > 1 && (smallChunkLength > minSize/2)) {
      //Remove last sentence, in order to end on a complete sentence
      sentences = sentences.slice(0,-1);
    }
  }

  //Get the minimum number of sentences needed to attain the given size
  let quoteLength = 0;
  let numSentence = 0;
  for (let sentence of sentences){
    quoteLength += sentence.length;
    numSentence += 1;
    if (quoteLength > minSize) break;
  }

  const quoteStart = chunk.indexOf(sentences[0]);
  const lastSentence = sentences[numSentence - 1]
  const quoteStop = removedFromStart + chunk.slice(removedFromStart).indexOf(lastSentence) + lastSentence.length;

  // console.log(sentences);
  // console.log(quoteStart);
  // console.log(quoteStop);

  return cleanText(chunk.slice(quoteStart, quoteStop));
}

function cleanText(text){
  text = text.replace(/^»/, '');
  return text.trim();
}

// console.log(randomQuote({position:56863}));
