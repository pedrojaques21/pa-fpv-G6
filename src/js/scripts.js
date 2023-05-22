const lightTypeInput = document.getElementById("lightType");
const positionXInput = document.getElementById("positionX");
const positionYInput = document.getElementById("positionY");
const positionZInput = document.getElementById("positionZ");
lightTypeSelect.addEventListener("change", function () {
    const selectedValue = lightTypeInput.options[lightTypeInput.selectedIndex].value;

  if (selectedValue === "ambient") {
    console.log(selectedValue);
    positionXInput.disabled = true;
    positionYInput.disabled = true;
    positionZInput.disabled = true;
  } else {
    positionXInput.disabled = false;
    positionYInput.disabled = false;
    positionZInput.disabled = false;
  }
});
