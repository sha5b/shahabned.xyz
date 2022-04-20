import React from "react";
import { Link } from "gatsby";

const nextArray = ["🤏", "👈", "🤛", "💪", "🦵", "👋", "👌", "🖕", "✌"];
const previousArray = ["🤙", "👉", "👍", "🤜", "🤳", "🖕", "🤞", "🖖", "🤘"];
const homeArray = [
  "👺",
  "🤡",
  "💩",
  "💀",
  "😖",
  "😳",
  "🧐",
  "🤓",
  "🥳",
  "🤯",
  "🤥",
  "😙",
  "😃",
];

const nextIcon = nextArray[Math.floor(Math.random() * nextArray.length)];
const previousIcon =
  previousArray[Math.floor(Math.random() * previousArray.length)];
const homeIcon = homeArray[Math.floor(Math.random() * homeArray.length)];

const Footer = ({ next, previous }) => {
  return (
    <>
      <hr />
      <div className="footer">
        <div className="footer-navigation">
          <Link className="footer-navigation-item" to={previous}>
            {nextIcon}
          </Link>
          <Link className="footer-navigation-item" to="/">
            {homeIcon}
          </Link>
          <Link className="footer-navigation-item" to={next}>
            {previousIcon}
          </Link>
        </div>
      </div>
      <div className="footer-footnote">
        Shahab Nedaei 2022, All rights reserved. //{" "}
        <a href="home@shahabned.xyz" target="_blank">
          home@shahabned.xyz
        </a>{" "}
        //{" "}
        <a href="https://www.instagram.com/shahabned/" target="_blank">
          Instagram
        </a>
      </div>
    </>
  );
};

export default Footer;
