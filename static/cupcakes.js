"use strict";
console.log("working????");
const $CUPCAKES = $("#cupcakes-list");
const $CUPCAKES_FORM = $(".add-cupcake-form");

/** Get cupcakes from database and return data */
async function getCupcakes() {

  const response = await axios.get("/api/cupcakes");
  console.log("response: ", response);
  let data = response.data.cupcakes;
  console.log("data: ", data);
  //data will equal a list of object {cupcake1}, {cupcake2}...
  return data;
}

/** Display all cupcakes in cupcakes list */
async function displayCupcakes() {
  $CUPCAKES.empty();
  let data = await getCupcakes(); // name data variable better (is it cupcakes? array? etc)
  console.log(data);

  for (let cupcake of data) {
    const $cupcake = $(
      `<li>
         ${cupcake.id}
         (Flavor is: ${cupcake.flavor}, Size is: ${cupcake.size},
            Rating is: ${cupcake.rating})
            <img src="${cupcake.image}" alt="Cupcake Image" width=200px height=200px >
       </li>
      `);
    $CUPCAKES.append($cupcake);
  }
}

/** Add new cupcake to database and return data */
async function addCupcake() {
  let flavor = $("#flavor").val()
  let size = $("#size").val()
  let rating = $("#rating").val()
  if ($("#image").val()) {
    let image = $("#image").val()
    let response = await axios.post("/api/cupcakes", { flavor, size, rating, image });
    let data = response.data.cupcake;
    return data;
  }

  else {
    let response = await axios.post("/api/cupcakes", { flavor, size, rating });
    let data = response.data.cupcake;
    return data;
  }
}

/** Add new cupcake to cupcake list on HTML */
async function updateAddedCupcake(evt) {
  evt.preventDefault()
  let data = await addCupcake()
  const $cupcake = $(
    `<li>
       ${data.id}
       (Flavor is: ${data.flavor}, Size is: ${data.size},
          Rating is: ${data.rating})
          <img src="${data.image}" alt="Cupcake Image" width=200px height=200px >
     </li>
    `);
    // THIS IS THE SAME AS ABOVE, make a function for it! Want code to be as dry as possible
  $CUPCAKES.append($cupcake);
}

/** Listens to submission of new cupcake form and updates database and HTML */
$CUPCAKES_FORM.on("submit", updateAddedCupcake);

displayCupcakes();