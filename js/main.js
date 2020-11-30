import dotenv from "dotenv";
dotenv.config();
import { isValidZip, showAlert } from "./validate";

const API_KEY = process.env.API_KEY;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const petForm = document.querySelector("#pet-form");
petForm.addEventListener("submit", fetchAnimals);

function fetchAnimals(e) {
  e.preventDefault();
  const animal = document.querySelector("#animal").value;
  const zip = document.querySelector("#zip").value;

  // Validate zip
  if (!isValidZip(zip)) {
    showAlert("Please enter a valid zip code", "danger");
    return;
  }
  fetch(
    `https://api.petfinder.com/v2/animals?key=${API_KEY}&location=${zip}&type=${animal}`,
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  )
    .then((res) => res.json())
    // .then((data) => console.log(data.animals))
    .then((data) => showAnimals(data.animals))
    .catch((err) => console.log(err));
}

//Show listings of pets
function showAnimals(pets) {
  const results = document.querySelector("#results");
  results.innerHTML = "";
  //Loop through pets
  pets.forEach((pet) => {
    //output to page
    // console.log(pet);
    const div = document.createElement("div");
    div.classList.add("card", "card-body", "mb-3");
    div.innerHTML = `
        <div class="row" >
        <div class="col-sm-6">
          <h4>${pet.name}(${pet.age})</h4>
          <p class="text-secondary">${pet.breeds.primary}</p>
          <p>${pet.contact.address.address1} ${pet.contact.address.city} ${
      pet.contact.address.state
    } ${pet.contact.address.postcode}</p>
          <ul class="list-group">
          <li class="list-group-item">Phone: ${pet.contact.phone}</li>
          ${
            pet.contact.email
              ? `<li class="list-group-item">Email: ${pet.contact.email}</li>`
              : ' '
          }
        <li class="list-group-item">Shelter ID:${pet.id}</li>
          </ul>
        </div>
        <div class="col-sm-6 text-center">
          <img class="img-fluid rounded-circle mt-2" src="${
            pet.photos[0].medium
          }">
        </div>
        </div>
        `;
    results.appendChild(div);
  });
}
