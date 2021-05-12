import { getRandomColor } from "../getrandomcolor";
import { DaggersSpec, HammerSpec, SwordSpec } from "../objects/newActors/actor";
import { ClassType } from "../objects/newActors/serverActors/serverPlayer/serverPlayer";
import { Game } from "./game";
import { assetManager } from "./gameRender/assetmanager";
import { ServerTalker } from "./servertalker";
import { safeGetElementById } from "./util";
/*const particleSlider = safeGetElementById("particles");
const particleAmount = safeGetElementById("particleAmount");

particleSlider.oninput = function () {
    particleAmount.innerHTML = (particleSlider as HTMLInputElement).value + "%";
};*/

var classInfo = {
    sword: { level: 1, spec: 2 },
    daggers: { level: 3, spec: 4 },
    hammer: { level: 5, spec: 6 },
};

var classType: ClassType = "sword";
var team: number = 1;
safeGetElementById("teamMenu").onclick = () => toggleTeam();

var value: string | null = localStorage.getItem("name");
if (value) (safeGetElementById("name") as HTMLInputElement).value = value;
var value: string | null = localStorage.getItem("color");
if (value) (safeGetElementById("color") as HTMLInputElement).value = value;
var value: string | null = localStorage.getItem("team");
if (value && parseInt(value) === 2) toggleTeam();
var value: string | null = localStorage.getItem("classType");
if (value) {
    if (value === "daggers") changeClass("daggers");
    else if (value === "hammer") changeClass("hammer");
    else changeClass("sword");
}
updateClassLevels();

function updateClassLevels() {
    value = localStorage.getItem("swordLevel");
    if (value) classInfo.sword.level = parseInt(value);
    value = localStorage.getItem("swordSpec");
    if (value) classInfo.sword.spec = parseInt(value);
    value = localStorage.getItem("daggersLevel");
    if (value) classInfo.daggers.level = parseInt(value);
    value = localStorage.getItem("daggersSpec");
    if (value) classInfo.daggers.spec = parseInt(value);
    value = localStorage.getItem("hammerLevel");
    if (value) classInfo.hammer.level = parseInt(value);
    value = localStorage.getItem("hammerSpec");
    if (value) classInfo.hammer.spec = parseInt(value);

    safeGetElementById("swordClassLevel").innerHTML = String(classInfo.sword.level);
    safeGetElementById("daggersClassLevel").innerHTML = String(classInfo.daggers.level);
    safeGetElementById("hammerClassLevel").innerHTML = String(classInfo.hammer.level);
}

var ifImagesHaveBeenLoaded: boolean = false;
safeGetElementById("startGame").onmouseup = async () => {
    saveLocalData();

    var name: string = (safeGetElementById("name") as HTMLInputElement).value;
    if (name === "" || name.split(" ").join("") === "") name = "Player";

    let level: number, spec: number;
    switch (classType) {
        case "daggers":
            level = classInfo.daggers.level;
            spec = classInfo.daggers.spec;
            break;
        case "hammer":
            level = classInfo.hammer.level;
            spec = classInfo.hammer.spec;
            break;
        default:
            level = classInfo.sword.level;
            spec = classInfo.sword.spec;
    }

    await assetManager.loadAllNecessaryImages();
    const serverTalker = new ServerTalker({
        name,
        color: (safeGetElementById("color") as HTMLInputElement).value,
        team,
        class: classType,
        classLevel: level,
        classSpec: spec,
    });
    const { id, info, config } = await serverTalker.serverTalkerReady;
    const game = new Game(info, config, id, serverTalker, 50);
    game.start();
    //document.documentElement.requestFullscreen();
    hideMenuElements();
    safeGetElementById("end").onclick = async () => {
        game.end();
        showMenuElements();
        updateClassLevels();
        //document.exitFullscreen();
        return;
    };
};

var menuDiv: HTMLElement = safeGetElementById("menuDiv");
var optionsDiv: HTMLElement = safeGetElementById("optionsDiv");
var gameDiv: HTMLElement = safeGetElementById("gameDiv");
gameDiv.style.display = "none";

function hideMenuElements() {
    menuDiv.style.display = "none";
    optionsDiv.style.display = "none";
    gameDiv.style.display = "block";
}
function showMenuElements() {
    gameDiv.style.display = "none";
    menuDiv.style.display = "flex";
    optionsDiv.style.display = "flex";
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

var screenCover: HTMLElement = safeGetElementById("screenCover");

var settingsButtonToggled: boolean = false;
safeGetElementById("settingsButton").onclick = () => {
    if (settingsButtonToggled) {
        //hide settings
    } else {
        //show settings
    }
};

var commentDiv: HTMLElement = safeGetElementById("commentDiv");
var emailOption: HTMLElement = safeGetElementById("emailOption");

safeGetElementById("commentButton").onclick = () => {
    emailOption.classList.add("selected");
    commentDiv.style.display = "flex";
    screenCover.style.display = "block";

    screenCover.addEventListener("click", closeCommentDiv);

    function closeCommentDiv() {
        screenCover.removeEventListener("click", closeCommentDiv);

        commentDiv.style.display = "none";
        screenCover.style.display = "none";
        emailOption.classList.remove("selected");
    }
};

var informationDiv: HTMLElement = safeGetElementById("informationDiv");
var infoOption: HTMLElement = safeGetElementById("infoOption");
safeGetElementById("informationButton").onclick = () => {
    infoOption.classList.add("selected");
    informationDiv.style.display = "flex";
    screenCover.style.display = "block";

    screenCover.addEventListener("click", closeInfoDiv);

    function closeInfoDiv() {
        screenCover.removeEventListener("click", closeInfoDiv);

        informationDiv.style.display = "none";
        screenCover.style.display = "none";
        infoOption.classList.remove("selected");
    }
};
var tipsButtonToggled: boolean = false;
safeGetElementById("toggleTipsButton").onclick = () => {};
