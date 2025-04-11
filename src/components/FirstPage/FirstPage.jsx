import React, { useState } from "react";
import photo1 from "../Images/parking-management-system.webp";
import photo2 from "../Images/parking.webp";
import photo3 from "../Images/smart-parking.webp";
import "./FirstPage.css";
import { Link } from "react-router-dom";

const images = [
    photo1,
    photo2,
    photo3
];

const heading = [
    "Smart Parking for Every Place",
    "Simplify Your Parking Experience",
    "Hassle-Free Parking Made Easy"
];

const para = [
    "Effortless parking management for offices, malls and residences.",
    "Monitor, manage, and secure parking with ease and reliablity",
    "Perfect for offices, malls, and gated community parking"
];

const FirstPage = () => {
    const [counter, setCounter] = useState(0); // State to track the current image and content

    const onClickPrev = () => {
        setCounter((prevCounter) => (prevCounter > 0 ? prevCounter - 1 : 0));
    };

    const onClickNext = () => {
        setCounter((prevCounter) => (prevCounter < images.length - 1 ? prevCounter + 1 : prevCounter));
    };

    return (
        <div className="mainContainer23">
            <img src={images[counter]} alt="parking" className="img1" />
            <h3 className="head">{heading[counter]}</h3>
            <p className="para">{para[counter]}</p>
            <div className="buttonContainer23">
                {counter === 0 && (
                    <button onClick={onClickNext} className="btn0">Next</button>
                )}
                {counter > 0 && counter < 2 && (
                    <>
                        <button onClick={onClickPrev} className="btn0">Prev</button>
                        <button onClick={onClickNext} className="btn0">Next</button>
                    </>
                )}
                {counter === 2 && (
                    <>
                        <button onClick={onClickPrev} className="btn0">Prev</button>
                        <Link to="/AboutUs"><button className="btn0">Start</button></Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default FirstPage;
