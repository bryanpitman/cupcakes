"use strict";
console.log("working????");
const $CUPCAKES = $("#cupcakes-list");

async function getCupcakes() {

  const response = await axios.get("/api/cupcakes");
  console.log("response: ", response);
  let data = response.data.cupcakes;
  console.log("data: ", data);
  //data will equal a list of object {cupcake1}, {cupcake2}...
  return data;
}


async function displayCupcakes() {
  $CUPCAKES.empty();
  let data = await getCupcakes();
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

displayCupcakes();