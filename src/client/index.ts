import { getRandomColor } from "../getrandomcolor";
import { Game } from "./game";
import { ServerTalker } from "./servertalker";
import { safeGetElementById } from "./util";

const instructionDiv = safeGetElementById("instructionMenu");
const instructionButton = safeGetElementById("instructions");
const settingsDiv = safeGetElementById("settingsMenu");
const settingsButton = safeGetElementById("settings");
const clearStorageButton = safeGetElementById("clearStorage");

const particleSlider = safeGetElementById("particles");
const particleAmount = safeGetElementById("particleAmount");

particleSlider.oninput = function() {
    particleAmount.innerHTML = (particleSlider as HTMLInputElement).value + "%";
}


safeGetElementById("gameDiv").style.display = "none";
instructionDiv.style.display = "none";
settingsDiv.style.display = "none";

const savedFields = [
    'name',
    'team',
    'color',
    'particles'
];
savedFields.forEach(id => {
    const field = safeGetElementById(id) as HTMLInputElement;
    const value = localStorage.getItem(id)
    if (value) {
        field.value = value
    }
});
particleAmount.innerHTML = (particleSlider as HTMLInputElement).value + "%";


safeGetElementById("start").onclick = async () => {
    savedFields.forEach(id => {
        const field = safeGetElementById(id) as HTMLInputElement;
        localStorage.setItem(id, field.value);
    });

    let name: string = (safeGetElementById("name") as HTMLInputElement).value;
    if (name === "") name = "Player";
    else if (name.split(" ").join("") === "") name = "Poop";

    const serverTalker = new ServerTalker({
        name,
        color: (safeGetElementById("color") as HTMLInputElement).value,
        team: parseInt((safeGetElementById("team") as HTMLInputElement).value),
    });
    const { id, info, config } = await serverTalker.serverTalkerReady;
    const game = new Game(info, config, id, serverTalker, parseInt((particleSlider as HTMLInputElement).value));
    game.start();
    safeGetElementById("end").onclick = () => {
        game.end();
    };
};
instructionButton.onclick = () => {
    if (instructionDiv.style.display === "none") {
        instructionDiv.style.display = "block";
        instructionButton.classList.add("selected");
    } else {
        instructionDiv.style.display = "none";
        instructionButton.classList.remove("selected");
    }
};

settingsButton.onclick = () => {
    if (settingsDiv.style.display != "none") {
        settingsDiv.style.display = "none";
        settingsButton.classList.remove("selected");
    } else {
        settingsDiv.style.display = "block";
        settingsButton.classList.add("selected");
    }
};

clearStorageButton.onclick = () => {
    localStorage.clear();
};