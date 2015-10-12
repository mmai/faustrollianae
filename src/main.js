/** @jsx hJSX */

//Design imports
require('exports?componentHandler!material-design-lite/material.js').upgradeDom();
require("../node_modules/material-design-lite/material.min.css");
require("./scss/main.scss")

import {run, Rx} from '@cycle/core';
import {makeDOMDriver, hJSX, h} from '@cycle/dom';
import {makeClientDriver} from 'cycle-director';

import {randomQuoteId, randomQuote} from './patamancy'; 

let routes = [
  { url: "/loc/:quoteId", on: (quoteId) => viewQuote(modelQuote(quoteId)), name: 'Quote' },
  { url: '/', on: () => viewHome(), name: 'Home' }
];

let viewHome = () => {
  return  (
    <div className="quotebox-start mdl-card mdl-shadow--2dp">
      <div class="mdl-card__title">
            Interrogez les mots du clinamen
      </div>
      <div className="mdl-card__supporting-text mdl-">
            <em>La Pataphysique est la science</em><br/>
      </div>
      <div className="gidouille-start mdl-card__actions">
        <button className="mdl-button mdl-js-button mdl-button--fab">
          <i className="icon material-icons">help</i>
        </button>
      </div>
    </div>
  )
}

let modelQuote = (quoteId) => randomQuote({position:quoteId});
let viewQuote = (quote) => {
  return (
    <div className="quotebox mdl-card mdl-shadow--2dp">
      <div className="mdl-card__supporting-text">
          <p className="quotebox-quote">{quote.quote}</p>
      </div>
      <div className="gidouille">
        <button className="mdl-button mdl-js-button mdl-button--fab">
          <i className="icon material-icons">refresh</i>
        </button>
      </div>
      <div className="mdl-card__supporting-text">
        <div className="infos-text">
          Alfred Jarry<br/>
          <i>{quote.chapter.join('\n')}</i>
          <br/>Emplacement {quote.position}
        </div>
      </div>
    </div>
      )
};

function render(output){
  return (
    <div id="maincontainer">
    <div className="centered">
      {output}
    </div>
    </div>
    );
}

function intent(DOM) {
  return DOM.select('button').events('click');
}

function model(actions){
  return actions.map( ev => randomQuoteId()).startWith(0);
}

function view(state$, output){
  return state$.map((state) => {
      if (state > 0) {
        window.location.hash = `#/loc/${state}`;
      }
      return render(output);
    });
}

function main({DOM, Router}) {
  let route$ = Rx.Observable.from(routes);
  let state$ = model(intent(DOM));

  let view$ = Router.map(
    (output) => view(state$, output)
  );

  return {
    DOM: view$,
    Router: route$
  }
}

let drivers = {
  DOM: makeDOMDriver('#app'),
  Router: makeClientDriver({
    html5history: false,
    notfound: () => { return "Page not found" }
  })
};

run(main, drivers);
