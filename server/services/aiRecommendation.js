const generateRecommendation = ({
  weight,
  height,
  bmi,
  workoutCount,
  totalCaloriesBurned
}) => {
  const recommendations = [];

  // BMI-based recommendation
  if (bmi < 18.5) {
    recommendations.push(
      "Focus on balanced nutrition and adequate calorie intake."
    );
  } else if (bmi >= 18.5 && bmi < 25) {
    recommendations.push(
      "Your BMI is in the normal range. Maintain a balanced diet and regular exercise."
    );
  } else if (bmi >= 25 && bmi < 30) {
    recommendations.push(
      "Focus on regular physical activity and a balanced calorie-controlled diet."
    );
  } else {
    recommendations.push(
      "Consider regular exercise and a balanced nutrition plan."
    );
  }

  // Workout-based recommendation
  if (workoutCount === 0) {
    recommendations.push(
      "Start with simple workouts and gradually build a consistent routine."
    );
  } else if (workoutCount < 3) {
    recommendations.push(
      "Try to maintain a more consistent workout schedule during the week."
    );
  } else {
    recommendations.push(
      "Keep maintaining your regular workout routine."
    );
  }

  // Calories-based recommendation
  if (totalCaloriesBurned < 500) {
    recommendations.push(
      "Gradually increase your physical activity according to your fitness level."
    );
  } else {
    recommendations.push(
      "Good activity level. Continue maintaining your exercise routine."
    );
  }

  return recommendations.join(" ");
};

module.exports = {
  generateRecommendation
};