const API_URL = "http://localhost:5000";


// =====================================================
// COMMON RESULT MESSAGE
// =====================================================

function showResult(message) {

    const result =
        document.getElementById("result");

    if (result) {
        result.innerText = message;
    }
}


// =====================================================
// CHECK API
// =====================================================

async function checkAPI() {

    try {

        const response =
            await fetch(`${API_URL}/`);

        const data =
            await response.json();

        showResult(
            data.message || "API is working."
        );

    } catch (error) {

        showResult(
            "Backend connection failed."
        );

        console.error(error);
    }
}


// =====================================================
// REGISTER
// =====================================================

async function registerUser() {

    const name =
        document
            .getElementById("registerName")
            .value
            .trim();

    const email =
        document
            .getElementById("registerEmail")
            .value
            .trim();

    const password =
        document
            .getElementById("registerPassword")
            .value;


    if (!name || !email || !password) {

        showResult(
            "Please fill all registration fields."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );


        const data =
            await response.json();


        showResult(
            data.message ||
            "Registration completed."
        );


    } catch (error) {

        showResult(
            "Registration failed."
        );

        console.error(error);
    }
}


// =====================================================
// LOGIN
// =====================================================

async function loginUser() {

    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim();

    const password =
        document
            .getElementById("loginPassword")
            .value;


    if (!email || !password) {

        showResult(
            "Please enter email and password."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


        const data =
            await response.json();


        if (
            response.ok &&
            data.token
        ) {

            localStorage.setItem(
                "token",
                data.token
            );


            showResult(
                "Login successful!"
            );


            await getDashboard();

        } else {

            showResult(
                data.message ||
                "Login failed."
            );
        }


    } catch (error) {

        showResult(
            "Login failed."
        );

        console.error(error);
    }
}


// =====================================================
// DASHBOARD
// =====================================================

async function getDashboard() {

    const token =
        localStorage.getItem("token");


    if (!token) {

        showResult(
            "Please login first."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/dashboard`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showResult(
                data.message ||
                "Unable to load dashboard."
            );

            return;
        }


        const dashboard =
            data.dashboard || {};


        const progress =
            dashboard.latestProgress;


        const recommendation =
            dashboard.latestRecommendation;


        // Dashboard counts

        document
            .getElementById("totalWorkouts")
            .innerText =
                dashboard.totalWorkouts || 0;


        document
            .getElementById("totalCalories")
            .innerText =
                dashboard.totalCaloriesBurned || 0;


        document
            .getElementById("totalFoods")
            .innerText =
                dashboard.totalFoods || 0;


        // =================================================
        // LATEST PROGRESS
        // =================================================

        if (progress) {

            document
                .getElementById("weight")
                .innerText =
                    progress.weight + " kg";


            document
                .getElementById("height")
                .innerText =
                    progress.height + " cm";


            const bmi =
                Number(progress.bmi);


            document
                .getElementById("bmi")
                .innerText =
                    bmi.toFixed(2);


            // =================================================
            // BMI CATEGORY
            // =================================================

            let category =
                "N/A";


            let bmiRecommendation =
                "No recommendation available.";


            if (bmi < 18.5) {

                category =
                    "Underweight";


                bmiRecommendation =
                    "Focus on balanced and nutritious meals with adequate protein and regular physical activity.";


            } else if (
                bmi >= 18.5 &&
                bmi < 25
            ) {

                category =
                    "Normal";


                bmiRecommendation =
                    "Your BMI is in the normal range. Continue maintaining balanced nutrition and regular physical activity.";


            } else if (
                bmi >= 25 &&
                bmi < 30
            ) {

                category =
                    "Overweight";


                bmiRecommendation =
                    "Focus on balanced meals, regular physical activity and healthy lifestyle habits.";


            } else {

                category =
                    "Obese";


                bmiRecommendation =
                    "Consider discussing your health goals with a qualified healthcare professional and maintain healthy lifestyle habits.";
            }


            document
                .getElementById("bmiCategory")
                .innerText =
                    category;


            document
                .getElementById("bmiRecommendation")
                .innerText =
                    bmiRecommendation;


        } else {

            document
                .getElementById("weight")
                .innerText =
                    "N/A";


            document
                .getElementById("height")
                .innerText =
                    "N/A";


            document
                .getElementById("bmi")
                .innerText =
                    "N/A";


            document
                .getElementById("bmiCategory")
                .innerText =
                    "N/A";


            document
                .getElementById("bmiRecommendation")
                .innerText =
                    "No progress available.";
        }


        // =================================================
        // AI RECOMMENDATION
        // =================================================

        document
            .getElementById("recommendation")
            .innerText =
                recommendation
                    ? recommendation.recommendation
                    : "No recommendation available.";


        showResult(
            "Dashboard loaded successfully!"
        );


    } catch (error) {

        showResult(
            "Dashboard connection failed."
        );

        console.error(error);
    }
}


// =====================================================
// BMI AUTOMATIC CALCULATION
// =====================================================

function calculateBMI() {

    const weight =
        Number(
            document
                .getElementById("progressWeight")
                .value
        );


    const height =
        Number(
            document
                .getElementById("progressHeight")
                .value
        );


    const bmiInput =
        document
            .getElementById("progressBMI");


    if (
        weight <= 0 ||
        height <= 0
    ) {

        bmiInput.value = "";

        return;
    }


    const heightInMeter =
        height / 100;


    const bmi =
        weight /
        (heightInMeter * heightInMeter);


    bmiInput.value =
        bmi.toFixed(2);
}


// =====================================================
// ADD PROGRESS
// =====================================================

async function addProgress() {

    const token =
        localStorage.getItem("token");


    if (!token) {

        showResult(
            "Please login first."
        );

        return;
    }


    const weight =
        document
            .getElementById("progressWeight")
            .value;


    const height =
        document
            .getElementById("progressHeight")
            .value;


    const bmi =
        document
            .getElementById("progressBMI")
            .value;


    const date =
        document
            .getElementById("progressDate")
            .value;


    if (
        weight === "" ||
        height === "" ||
        bmi === "" ||
        date === ""
    ) {

        showResult(
            "Please enter weight, height and date."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/progress/add`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        weight:
                            Number(weight),

                        height:
                            Number(height),

                        bmi:
                            Number(bmi),

                        date:
                            date
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showResult(
                data.message ||
                "Progress could not be added."
            );

            return;
        }


        showResult(
            data.message ||
            "Progress added successfully!"
        );


        document
            .getElementById("progressWeight")
            .value = "";


        document
            .getElementById("progressHeight")
            .value = "";


        document
            .getElementById("progressBMI")
            .value = "";


        document
            .getElementById("progressDate")
            .value = "";


        await getProgress();

        await getDashboard();


    } catch (error) {

        showResult(
            "Progress connection failed."
        );

        console.error(error);
    }
}


// =====================================================
// GET PROGRESS
// =====================================================

async function getProgress() {

    const token =
        localStorage.getItem("token");


    if (!token) {

        showResult(
            "Please login first."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/progress`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showResult(
                data.message ||
                "Unable to fetch progress."
            );

            return;
        }


        displayProgress(
            data.progress || []
        );


        showResult(
            "Progress fetched successfully!"
        );


    } catch (error) {

        showResult(
            "Progress fetch failed."
        );

        console.error(error);
    }
}


// =====================================================
// DISPLAY PROGRESS
// =====================================================

function displayProgress(progress) {

    const progressList =
        document.getElementById(
            "progressList"
        );


    if (
        !progress ||
        progress.length === 0
    ) {

        progressList.innerHTML =
            "<p>No progress records found.</p>";

        return;
    }


    progressList.innerHTML = "";


    progress.forEach(
        (item) => {

            const progressItem =
                document.createElement(
                    "div"
                );


            progressItem.className =
                "card";


            progressItem.style.marginTop =
                "15px";


            progressItem.innerHTML = `

                <h3>
                    📊 Progress
                </h3>

                <p>
                    <strong>
                        Weight:
                    </strong>
                    ${item.weight} kg
                </p>

                <p>
                    <strong>
                        Height:
                    </strong>
                    ${item.height} cm
                </p>

                <p>
                    <strong>
                        BMI:
                    </strong>
                    ${item.bmi}
                </p>

                <p>
                    <strong>
                        Date:
                    </strong>
                    ${
                        item.date
                        ? new Date(item.date)
                            .toLocaleDateString()
                        : "N/A"
                    }
                </p>

                <button
                    onclick="editProgress('${item._id}')"
                >
                    ✏️ Edit
                </button>

                <button
                    onclick="deleteProgress('${item._id}')"
                >
                    🗑️ Delete
                </button>
            `;


            progressList.appendChild(
                progressItem
            );
        }
    );
}


// =====================================================
// EDIT PROGRESS
// =====================================================

async function editProgress(id) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        showResult(
            "Please login first."
        );

        return;
    }


    const weight =
        prompt(
            "Enter weight (kg):"
        );


    if (weight === null)
        return;


    const height =
        prompt(
            "Enter height (cm):"
        );


    if (height === null)
        return;


    const date =
        prompt(
            "Enter date (YYYY-MM-DD):"
        );


    if (!date)
        return;


    const calculatedHeight =
        Number(height) / 100;


    const bmi =
        Number(weight) /
        (
            calculatedHeight *
            calculatedHeight
        );


    try {

        const response =
            await fetch(
                `${API_URL}/api/progress/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        weight:
                            Number(weight),

                        height:
                            Number(height),

                        bmi:
                            Number(bmi.toFixed(2)),

                        date:
                            date
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showResult(
                data.message ||
                "Progress update failed."
            );

            return;
        }


        showResult(
            data.message ||
            "Progress updated successfully!"
        );


        await getProgress();

        await getDashboard();


    } catch (error) {

        showResult(
            "Progress update failed."
        );

        console.error(error);
    }
}


// =====================================================
// DELETE PROGRESS
// =====================================================

async function deleteProgress(id) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        showResult(
            "Please login first."
        );

        return;
    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this progress?"
        );


    if (!confirmDelete)
        return;


    try {

        const response =
            await fetch(
                `${API_URL}/api/progress/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showResult(
                data.message ||
                "Progress delete failed."
            );

            return;
        }


        showResult(
            data.message ||
            "Progress deleted successfully!"
        );


        await getProgress();

        await getDashboard();


    } catch (error) {

        showResult(
            "Progress delete failed."
        );

        console.error(error);
    }
}


// =====================================================
// ADD WORKOUT
// =====================================================

async function addWorkout() {

    const token =
        localStorage.getItem("token");


    if (!token) {

        showResult(
            "Please login first."
        );

        return;
    }


    const workoutName =
        document
            .getElementById("workoutName")
            .value
            .trim();


    const category =
        document
            .getElementById("workoutCategory")
            .value
            .trim();


    const duration =
        document
            .getElementById("workoutDuration")
            .value;


    const caloriesBurned =
        document
            .getElementById("workoutCalories")
            .value;


    const workoutDate =
        document
            .getElementById("workoutDate")
            .value;


    if (
        !workoutName ||
        !category ||
        duration === "" ||
        caloriesBurned === "" ||
        !workoutDate
    ) {

        showResult(
            "Please fill all workout details."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/workouts/add`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        workoutName,

                        category,

                        duration:
                            Number(duration),

                        caloriesBurned:
                            Number(caloriesBurned),

                        workoutDate
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showResult(
                data.message ||
                "Workout could not be added."
            );

            return;
        }


        showResult(
            data.message ||
            "Workout added successfully!"
        );


        document
            .getElementById("workoutName")
            .value = "";


        document
            .getElementById("workoutCategory")
            .value = "";


        document
            .getElementById("workoutDuration")
            .value = "";


        document
            .getElementById("workoutCalories")
            .value = "";


        document
            .getElementById("workoutDate")
            .value = "";


        await getWorkouts();

        await getDashboard();


    } catch (error) {

        showResult(
            "Workout connection failed."
        );

        console.error(error);
    }
}


// =====================================================
// GET WORKOUTS
// =====================================================

async function getWorkouts() {

    const token =
        localStorage.getItem("token");


    if (!token) {

        showResult(
            "Please login first."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/workouts`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showResult(
                data.message ||
                "Unable to fetch workouts."
            );

            return;
        }


        displayWorkouts(
            data.workouts || []
        );


        showResult(
            "Workouts fetched successfully!"
        );


    } catch (error) {

        showResult(
            "Workout fetch failed."
        );

        console.error(error);
    }
}


// =====================================================
// DISPLAY WORKOUTS
// =====================================================

function displayWorkouts(workouts) {

    const workoutList =
        document.getElementById(
            "workoutList"
        );


    if (
        !workouts ||
        workouts.length === 0
    ) {

        workoutList.innerHTML =
            "<p>No workouts found.</p>";

        return;
    }


    workoutList.innerHTML = "";


    workouts.forEach(
        (workout) => {

            const workoutItem =
                document.createElement(
                    "div"
                );


            workoutItem.className =
                "card";


            workoutItem.style.marginTop =
                "15px";


            workoutItem.innerHTML = `

                <h3>
                    ${workout.workoutName || "Workout"}
                </h3>

                <p>
                    <strong>
                        Category:
                    </strong>
                    ${workout.category || "N/A"}
                </p>

                <p>
                    <strong>
                        Duration:
                    </strong>
                    ${workout.duration || 0}
                    minutes
                </p>

                <p>
                    <strong>
                        Calories:
                    </strong>
                    ${workout.caloriesBurned || 0}
                </p>

                <p>
                    <strong>
                        Date:
                    </strong>
                    ${
                        workout.workoutDate
                        ? new Date(
                            workout.workoutDate
                        ).toLocaleDateString()
                        : "N/A"
                    }
                </p>

                <button
                    onclick="editWorkout('${workout._id}')"
                >
                    ✏️ Edit
                </button>

                <button
                    onclick="deleteWorkout('${workout._id}')"
                >
                    🗑️ Delete
                </button>
            `;


            workoutList.appendChild(
                workoutItem
            );
        }
    );
}


// =====================================================
// SEARCH WORKOUTS
// =====================================================

async function searchWorkouts() {

    const token =
        localStorage.getItem("token");


    if (!token) {

        showResult(
            "Please login first."
        );

        return;
    }


    const searchText =
        document
            .getElementById("searchWorkout")
            .value
            .trim();


    if (!searchText) {

        await getWorkouts();

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/workouts/search?name=${encodeURIComponent(searchText)}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showResult(
                data.message ||
                "Workout search failed."
            );

            return;
        }


        displayWorkouts(
            data.workouts || []
        );


        showResult(
            "Workout search successful!"
        );


    } catch (error) {

        showResult(
            "Workout search failed."
        );

        console.error(error);
    }
}


// =====================================================
// EDIT WORKOUT
// =====================================================

async function editWorkout(id) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        showResult(
            "Please login first."
        );

        return;
    }


    const workoutName =
        prompt(
            "Enter workout name:"
        );


    if (!workoutName)
        return;


    const category =
        prompt(
            "Enter category:"
        );


    if (!category)
        return;


    const duration =
        prompt(
            "Enter duration in minutes:"
        );


    if (!duration)
        return;


    const caloriesBurned =
        prompt(
            "Enter calories burned:"
        );


    if (!caloriesBurned)
        return;


    const workoutDate =
        prompt(
            "Enter workout date (YYYY-MM-DD):"
        );


    if (!workoutDate)
        return;


    try {

        const response =
            await fetch(
                `${API_URL}/api/workouts/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        workoutName,

                        category,

                        duration:
                            Number(duration),

                        caloriesBurned:
                            Number(caloriesBurned),

                        workoutDate
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showResult(
                data.message ||
                "Workout update failed."
            );

            return;
        }


        showResult(
            data.message ||
            "Workout updated successfully!"
        );


        await getWorkouts();

        await getDashboard();


    } catch (error) {

        showResult(
            "Workout update failed."
        );

        console.error(error);
    }
}


// =====================================================
// DELETE WORKOUT
// =====================================================

async function deleteWorkout(id) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        showResult(
            "Please login first."
        );

        return;
    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this workout?"
        );


    if (!confirmDelete)
        return;


    try {

        const response =
            await fetch(
                `${API_URL}/api/workouts/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showResult(
                data.message ||
                "Workout delete failed."
            );

            return;
        }


        showResult(
            data.message ||
            "Workout deleted successfully!"
        );


        await getWorkouts();

        await getDashboard();


    } catch (error) {

        showResult(
            "Workout delete failed."
        );

        console.error(error);
    }
}


// =====================================================
// ADD FOOD
// =====================================================

async function addFood() {

    const foodName =
        document
            .getElementById("foodName")
            .value
            .trim();


    const calories =
        document
            .getElementById("foodCalories")
            .value;


    const protein =
        document
            .getElementById("foodProtein")
            .value;


    const carbohydrates =
        document
            .getElementById("foodCarbohydrates")
            .value;


    const fats =
        document
            .getElementById("foodFats")
            .value;


    const servingSize =
        document
            .getElementById("foodServingSize")
            .value
            .trim();


    if (
        !foodName ||
        calories === "" ||
        protein === "" ||
        carbohydrates === "" ||
        fats === "" ||
        !servingSize
    ) {

        showResult(
            "Please fill all food details."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/foods/add`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name:
                            foodName,

                        calories:
                            Number(calories),

                        protein:
                            Number(protein),

                        carbohydrates:
                            Number(carbohydrates),

                        fats:
                            Number(fats),

                        servingSize
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showResult(
                data.message ||
                "Food could not be added."
            );

            return;
        }


        showResult(
            data.message ||
            "Food added successfully!"
        );


        document
            .getElementById("foodName")
            .value = "";


        document
            .getElementById("foodCalories")
            .value = "";


        document
            .getElementById("foodProtein")
            .value = "";


        document
            .getElementById("foodCarbohydrates")
            .value = "";


        document
            .getElementById("foodFats")
            .value = "";


        document
            .getElementById("foodServingSize")
            .value = "";


        await getFoods();

        await getDashboard();


    } catch (error) {

        showResult(
            "Food connection failed."
        );

        console.error(error);
    }
}


// =====================================================
// GET FOODS
// =====================================================

async function getFoods() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/foods`
            );


        const data =
            await response.json();


        if (!response.ok) {

            showResult(
                data.message ||
                "Unable to fetch foods."
            );

            return;
        }


        displayFoods(
            data.foods || []
        );


        showResult(
            "Foods fetched successfully!"
        );


    } catch (error) {

        showResult(
            "Food fetch failed."
        );

        console.error(error);
    }
}


// =====================================================
// DISPLAY FOODS
// =====================================================

function displayFoods(foods) {

    const foodList =
        document.getElementById(
            "foodList"
        );


    if (
        !foods ||
        foods.length === 0
    ) {

        foodList.innerHTML =
            "<p>No foods found.</p>";

        return;
    }


    foodList.innerHTML = "";


    foods.forEach(
        (food) => {

            const foodItem =
                document.createElement(
                    "div"
                );


            foodItem.className =
                "card";


            foodItem.style.marginTop =
                "15px";


            foodItem.innerHTML = `

                <h3>
                    🍎 ${food.name}
                </h3>

                <p>
                    <strong>
                        Calories:
                    </strong>
                    ${food.calories}
                </p>

                <p>
                    <strong>
                        Protein:
                    </strong>
                    ${food.protein} g
                </p>

                <p>
                    <strong>
                        Carbohydrates:
                    </strong>
                    ${food.carbohydrates} g
                </p>

                <p>
                    <strong>
                        Fats:
                    </strong>
                    ${food.fats} g
                </p>

                <p>
                    <strong>
                        Serving Size:
                    </strong>
                    ${food.servingSize}
                </p>

                <button
                    onclick="editFood('${food._id}')"
                >
                    ✏️ Edit
                </button>

                <button
                    onclick="deleteFood('${food._id}')"
                >
                    🗑️ Delete
                </button>
            `;


            foodList.appendChild(
                foodItem
            );
        }
    );
}


// =====================================================
// SEARCH FOODS
// =====================================================

async function searchFoods() {

    const searchText =
        document
            .getElementById("searchFood")
            .value
            .trim();


    if (!searchText) {

        await getFoods();

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/foods/search?name=${encodeURIComponent(searchText)}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            showResult(
                data.message ||
                "Food search failed."
            );

            return;
        }


        displayFoods(
            data.foods || []
        );


        showResult(
            "Food search successful!"
        );


    } catch (error) {

        showResult(
            "Food search failed."
        );

        console.error(error);
    }
}


// =====================================================
// EDIT FOOD
// =====================================================

async function editFood(id) {

    const name =
        prompt(
            "Enter food name:"
        );


    if (!name)
        return;


    const calories =
        prompt(
            "Enter calories:"
        );


    if (calories === null)
        return;


    const protein =
        prompt(
            "Enter protein (g):"
        );


    if (protein === null)
        return;


    const carbohydrates =
        prompt(
            "Enter carbohydrates (g):"
        );


    if (carbohydrates === null)
        return;


    const fats =
        prompt(
            "Enter fats (g):"
        );


    if (fats === null)
        return;


    const servingSize =
        prompt(
            "Enter serving size:"
        );


    if (!servingSize)
        return;


    try {

        const response =
            await fetch(
                `${API_URL}/api/foods/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name,

                        calories:
                            Number(calories),

                        protein:
                            Number(protein),

                        carbohydrates:
                            Number(carbohydrates),

                        fats:
                            Number(fats),

                        servingSize
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showResult(
                data.message ||
                "Food update failed."
            );

            return;
        }


        showResult(
            data.message ||
            "Food updated successfully!"
        );


        await getFoods();


    } catch (error) {

        showResult(
            "Food update failed."
        );

        console.error(error);
    }
}


// =====================================================
// DELETE FOOD
// =====================================================

async function deleteFood(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this food?"
        );


    if (!confirmDelete)
        return;


    try {

        const response =
            await fetch(
                `${API_URL}/api/foods/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showResult(
                data.message ||
                "Food delete failed."
            );

            return;
        }


        showResult(
            data.message ||
            "Food deleted successfully!"
        );


        await getFoods();

        await getDashboard();


    } catch (error) {

        showResult(
            "Food delete failed."
        );

        console.error(error);
    }
}


// =====================================================
// AUTOMATIC BMI EVENT
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const weightInput =
            document.getElementById(
                "progressWeight"
            );


        const heightInput =
            document.getElementById(
                "progressHeight"
            );


        if (weightInput) {

            weightInput.addEventListener(
                "input",
                calculateBMI
            );
        }


        if (heightInput) {

            heightInput.addEventListener(
                "input",
                calculateBMI
            );
        }

    }
);