import { getRandomColor } from "../getrandomcolor";
import { ClassType } from "../object/newActors/serverActors/serverPlayer/serverPlayer";
import { Game } from "./game";
import { ServerTalker } from "./servertalker";
import { safeGetElementById } from "./util";

/*const particleSlider = safeGetElementById("particles");
const particleAmount = safeGetElementById("particleAmount");

particleSlider.oninput = function () {
    particleAmount.innerHTML = (particleSlider as HTMLInputElement).value + "%";
};*/

safeGetElementById("gameDiv").style.display = "none";

var classType: ClassType = "sword";
var team: number = 1;
safeGetElementById("teamMenu").onclick = () => toggleTeam();

const savedFields = ["name", "team", "color", "classType" /*, "particles"*/];
savedFields.forEach((id, index) => {
    const value = localStorage.getItem(id);
    if (value) {
        switch (index) {
            case 0:
            case 2:
                (safeGetElementById(id) as HTMLInputElement).value = value;
                break;
            case 1:
                if (2 === parseInt(value)) {
                    toggleTeam();
                }
                break;
            case 3:
                if (value === "daggers") changeClass("daggers");
                else if (value === "hammer") changeClass("hammer");
                else changeClass("sword");
                break;
            default:
                throw new Error("too many saved fields");
        }
    }
});
//particleAmount.innerHTML = (particleSlider as HTMLInputElement).value + "%";

safeGetElementById("startGame").onmouseup = async () => {
    saveLocalData();

    let name: string = (safeGetElementById("name") as HTMLInputElement).value;
    if (name === "") name = "Player";
    else if (name.split(" ").join("") === "") name = "Poop";

    const serverTalker = new ServerTalker({
        name,
        color: (safeGetElementById("color") as HTMLInputElement).value,
        team,
        class: classType,
    });
    const { id, info, config } = await serverTalker.serverTalkerReady;
    const game = new Game(info, config, id, serverTalker, 50);
    game.start();
    //document.documentElement.requestFullscreen();
    hideMenuElements();
    safeGetElementById("end").onclick = async () => {
        game.end();
        showMenuElements();
        //document.exitFullscreen();
    };
};

function hideMenuElements() {
    safeGetElementById("menuDiv").style.display = "none";
    safeGetElementById("optionsDiv").style.display = "none";
    safeGetElementById("gameDiv").style.display = "block";
}
function showMenuElements() {
    safeGetElementById("gameDiv").style.display = "none";
    safeGetElementById("menuDiv").style.display = "block";
    safeGetElementById("optionsDiv").style.display = "flex";
}

function toggleTeam() {
    if (team === 1) {
        safeGetElementById("team1").classList.remove("selectedTeam");
        safeGetElementById("team2").classList.add("selectedTeam");
        team = 2;
    } else if (team === 2) {
        safeGetElementById("team1").classList.add("selectedTeam");
        safeGetElementById("team2").classList.remove("selectedTeam");
        team = 1;
    }
}

safeGetElementById("sword").onclick = () => changeClass("sword");
safeGetElementById("daggers").onclick = () => changeClass("daggers");
safeGetElementById("hammer").onclick = () => changeClass("hammer");
function changeClass(classArg: ClassType) {
    safeGetElementById("sword").classList.remove("selected");
    safeGetElementById("daggers").classList.remove("selected");
    safeGetElementById("hammer").classList.remove("selected");

    safeGetElementById(classArg).classList.add("selected");

    classType = classArg;
}

function saveLocalData() {
    let locallyStoredName: string = (safeGetElementById("name") as HTMLInputElement).value;
    localStorage.setItem("name", locallyStoredName);

    let locallyStoredTeam: number = team;
    localStorage.setItem("team", String(locallyStoredTeam));

    let locallyStoredColor: string = (safeGetElementById("color") as HTMLInputElement).value;
    localStorage.setItem("color", locallyStoredColor);

    /*let locallyStoredParticles: string = (safeGetElementById("id") as HTMLInputElement).value;
    localStorage.setItem("particles", field.value);*/

    let locallyStoredClass: string;
    if (classType === "sword") locallyStoredClass = "sword";
    else if (classType === "daggers") locallyStoredClass = "daggers";
    else if (classType === "hammer") locallyStoredClass = "hammer";
    else throw new Error("unknown class type input ${classType}");
    localStorage.setItem("classType", locallyStoredClass);
}

/*clearStorageButton.onclick = () => {
    localStorage.clear();
};*/
