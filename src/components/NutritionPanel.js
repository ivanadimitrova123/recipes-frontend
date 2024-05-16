import React, { useEffect, useState } from "react";

const NutritionPanel = () => {
  const [randomCalories, setRandomCalories] = useState(0);
  const [randomFat, setRandomFat] = useState(0);
  const [randomProtein, setRandomProtein] = useState(0);
  const [randomCarboh, setRandomCarboh] = useState(0);
  const [randomChole, setRandomChole] = useState(0);

  useEffect(() => {
    const min = 200;
    const max = 1000;
    setRandomCalories((Math.random() * (max - min) + min).toFixed(2));

    const minFat = 20;
    const maxFat = 50;
    setRandomFat((Math.random() * (maxFat - minFat) + minFat).toFixed(2));

    const minProtein = 50;
    const maxProtein = 300;
    setRandomProtein(
      (Math.random() * (maxProtein - minProtein) + minProtein).toFixed(2)
    );

    const minCarboh = 20;
    const maxCarboh = 100;
    setRandomCarboh(
      (Math.random() * (maxCarboh - minCarboh) + minCarboh).toFixed(2)
    );

    const minChole = 30;
    const maxChole = 100;
    setRandomChole(
      (Math.random() * (maxChole - minChole) + minChole).toFixed(2)
    );
  }, []);

  return (
    <div className="nutrition">
      <h4>Nutrition Information</h4>

      <div className="item">
        <p>Calories</p>
        <span>{randomCalories} kcal</span>
      </div>

      <div className="item">
        <p>Total Fat</p>
        <span>{randomFat} g</span>
      </div>

      <div className="item">
        <p>Protein</p>
        <span>{randomProtein} g</span>
      </div>

      <div className="item">
        <p>Carbohydrate</p>
        <span>{randomCarboh} g</span>
      </div>

      <div className="item">
        <p>Cholesterol</p>
        <span>{randomChole} mg</span>
      </div>
      <p className="disclaimerText">This recipe is considured to be healty</p>
    </div>
  );
};

export default NutritionPanel;
