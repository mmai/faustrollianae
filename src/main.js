/** @jsx hJSX */

//Design imports
// require('exports?componentHandler!material-design-lite/material.js').upgradeDom();
// require("../node_modules/material-design-lite/material.min.css");
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
      <h3 class="mdl-card__title">
            Sortes Faustrollianae
      </h3>
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
    <div>
      <h3>
        <div>Sortes Faustrollianae</div>
      </h3>

      <div className="quotebox mdl-card mdl-shadow--2dp">
      <div className="faustroll-container">
        <button className="mdl-button mdl-button--fab mdl-js-button mdl-js-ripple-effect">
          <i className="icon material-icons">refresh</i>
        </button>
      </div>
      <div className="mdl-card__supporting-text" id="faustroll-position">{quote.position/1000}% </div>
        <div className="mdl-card__supporting-text">
            <p className="quotebox-quote">{quote.quote}</p>
        </div>
        <div className="mdl-card__supporting-text">
          <div className="infos-text">
            Alfred Jarry<br/>
            <i>{quote.chapter.join('\n')}</i>
          </div>
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
  return {
    reloadClick$: DOM.select('button').events('click'),
    sliderSelect$: DOM.select('input').events('change')
  };
}

function model({reloadClick$, sliderSelect$}){
  return Rx.Observable.merge(
    reloadClick$.map(  ev => randomQuoteId()),
    sliderSelect$.map( ev => ev.target.value)     
    // sliderSelect$.map( ev => randomQuote(ev.target.value))     
  ).startWith(0);
}

function view(state$, output){
  return state$.map((state) => {
      if (state > 0) {
        window.location.hash = `#/loc/${state}`;//XXX This is a side effect. Should be sent to Router ?
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
