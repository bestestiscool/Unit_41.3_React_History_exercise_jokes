import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

const JokeList = ({ numJokesToGet = 5 }) => {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* retrieve jokes from API */
  useEffect(() => {
    const getJokes = async () => {
      try {
        let jokes = [];
        let seenJokes = new Set();

        while (jokes.length < numJokesToGet) {
          console.log("Fetching joke..."); // Log before the request
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          console.log("Joke fetched:", res.data); // Log after the request
          let { ...joke } = res.data;

          if (!seenJokes.has(joke.id)) {
            seenJokes.add(joke.id);
            jokes.push({ ...joke, votes: 0 });
          } else {
            console.log("duplicate found!");
          }
        }

        setJokes(jokes);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    getJokes();
  }, [numJokesToGet]); // Dependency array: re-fetch jokes if numJokesToGet changes

  /* empty joke list, set to loading state, and then call getJokes */
  const generateNewJokes = () => {
    setIsLoading(true);
    setJokes([]);
  };

  /* change vote for this id by delta (+1 or -1) */
  const vote = (id, delta) => {
    setJokes(jokes =>
      jokes.map(j =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      )
    );
  };

  /* render: either loading spinner or list of sorted jokes. */
  const sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  return (
    <div className="JokeList">
      <button
        className="JokeList-getmore"
        onClick={generateNewJokes}
      >
        Get New Jokes
      </button>

      {sortedJokes.map(j => (
        <Joke
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={vote}
        />
      ))}
    </div>
  );
};

export default JokeList;
