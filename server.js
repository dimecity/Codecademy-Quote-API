const express = require('express');
const morgan = require('morgan');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));

app.get('/api/quotes/random', (req, res, next) => {
  res.send({
    quote: getRandomElement(quotes)
  });
})

app.get('/api/quotes', (req, res, next) => {
  if (req.query.person === undefined) {
    res.send({
      quotes: quotes
    });
  }
  else {
      const quotesByPerson = quotes.filter(quote => quote.person === req.query.person);
      res.send({
        quotes: quotesByPerson});
    }
});

app.post('/api/quotes', (req, res) => {
  const newQuote = {
    quote: req.query.quote,
    person: req.query.person
  };
  if (newQuote.quote && newQuote.person) {
    quotes.push(newQuote);
    res.send({ quote: newQuote });
  } else {
    res.status(400).send();
  }
});

app.put('/api/quotes/:id', (req, res, next) => {
    const quote = quotes.find(quote => quote.id === req.params.id);
    if (quote) {
      const index = quotes.indexOf(quote);
      quote.quote = req.query.quote;
      quote.person = req.query.person;
      quotes.splice(index, 1, quote);
      res.send({"quote": quote});
    } else {
      res.status(404).send();
    }
});
  
app.delete('/api/quotes/:id', (req, res, next) => {
    const quote = quotes.find(quote => quote.id === req.params.id);
    if (quote) {
      const index = quotes.indexOf(quote);
      quotes.splice(index, 1);
      res.status(204).send();
    } else {
      res.status(404).send();
    }
});

app.listen(PORT, () => {
  console.log('Running server');
})