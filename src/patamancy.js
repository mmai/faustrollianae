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
  const nbChapters = book.books.length; 

  if (newpos + minSize <= 0 || nbChapters == 0) {
    return {
      quote: getQuote(size, book.content, position),
      chapter: [book.title]
    };
  }

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

  // console.log(chunk);

  //Try to get complete sentences of the chunk of text 
  let sentences = tokenizer.sentences(chunk, true);
  let removedFromStart = 0;
  let smallChunkLength = chunk.length - sentences[0].length;
  if (sentences.length > 1 && (smallChunkLength > minSize/2)) {
    //Remove first sentence (probably incomplete)
    removedFromStart = sentences[0].length;
    sentences = sentences.slice(1);
    smallChunkLength = smallChunkLength - sentences[sentences.length-1].length;
    
    if (sentences.length > 1 && (smallChunkLength > minSize/2) && (chunkStop < text.length)) {
      //Remove last sentence, in order to end on a complete sentence
      sentences = sentences.slice(0,-1);
    }
  }

  //Get the minimum number of sentences needed to attain the given size
  //We start with the sentence containing the position
  let beforeLength = position - chunkStart;
  let beforeSentences = [];
  let afterSentences = [];
  let quoteSentences = []; 
  for (let sentence of sentences){
    beforeLength += sentence.length;
    if (beforeLength < position) {
      beforeSentences.unshift(sentence);
    } else if (quoteSentences.length == 0) {
      quoteSentences.push(sentence);
    } else {
      afterSentences.push(sentence);
    }
  }

  // console.log(beforeSentences);
  // console.log(quoteSentences);
  // console.log(afterSentences);

  let quoteLength = 0;
  if (quoteSentences.length > 0){
    quoteLength = quoteSentences[0].length;
  }
  //We add the following sentences if necessary
  for (let sentence of afterSentences){
    if (quoteLength > minSize) break;
    quoteSentences.push(sentence);
    quoteLength += sentence.length;
  }

  //We add the previous sentences if necessary
  for (let sentence of beforeSentences){
    if (quoteLength > minSize) break;
    quoteSentences.unshift(sentence);
    quoteLength += sentence.length;
  }

  // console.log(quoteSentences);

  const quoteStart = chunk.indexOf(quoteSentences[0]);
  let lastSentence = quoteSentences.pop();
  while (lastSentence.length < 3) {
    lastSentence = quoteSentences.pop();
  }
  const quoteStop = removedFromStart + chunk.slice(removedFromStart).indexOf(lastSentence) + lastSentence.length;

  // console.log(quoteStart);
  // console.log(quoteStop);
  return cleanText(chunk.slice(quoteStart, quoteStop));
}

function cleanText(text){
  text = text.replace(/^»/, '');
  return text.trim();
}

// console.log(randomQuote({position:98657}));
