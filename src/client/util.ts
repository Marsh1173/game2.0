export function safeGetElementById(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (element) {
        return element;
    } else {
        throw new Error(`Element with id ${id} could not be gotten`);
    }
}

export function fillPatchNotesDiv(div: HTMLElement): void {
    for (let i1: number = 0; i1 < patchNotes.length; i1++) {
        div.appendChild(document.createElement("hr"));

        let date: HTMLElement = document.createElement("p");
        date.classList.add("patchDate");
        date.innerText = patchNotes[i1].dateTitle;
        if (patchNotes[i1].ifNew) {
            date.classList.add("newPatch");
            date.innerText += " - NEW";
        }
        div.appendChild(date);

        patchNotes[i1].additions.forEach((additionText) => {
            let additionElement: HTMLElement = document.createElement("p");
            additionElement.innerText = additionText;
            if (patchNotes[i1].ifNew) additionElement.classList.add("newPatch");
            div.appendChild(additionElement);
        });
    }
}

const patchNotes: { dateTitle: string; additions: string[]; ifNew: boolean }[] = [
    {
        dateTitle: "5-20-21 - Cooler Abilities / Polishing",
        additions: [
            "Redid Sword weapon and animations, hopefully for the better. Any feedback on how the abilities feel would be awesome.",
            "Added a website icon! Love it and cherish it!!",
            "The comment system had malfunctions, and I didn't receive any comments. Sorry! If you would resend any that you sent, I would be very grateful. I'll be watching closely to make sure there are no more errors. Shoutout to Jens who helped me find it.",
            "Added small visual treats to abilities with more to come.",
            "Even faster performance (time between pressing a button and the action happenning reduced by 50%) and a more player-centered viewpoint with better zooming/scaling with your screen.",
            "Fixed a small momentum bug to hopefully eliminate small discrepancies in players' positions between clients.",
            "Player boxes are slightly bigger (10%) with outlines for better visibility.",
        ],
        ifNew: true,
    },
    {
        dateTitle: "5-15-21 - Basic Ability Functionality",
        additions: [
            "ADDED PATCH NOTES.",
            "Added a basic weapon and animations!! More to come with the next patch!",
            "Vastly improved user interface and removed levels and experience for now.",
            "Added basic abilities for the sword class including Slash and Whirlwind, and more will come next patch for the remaining classes.",
            "MASSIVE rendering performance improvements, with up to 50% increased game engine speeds.",
            "New support for larger screens, removed 4k screen floor clipping (this one's for you, Mark and Kassi).",
            "Added small red player flashes for better hit visibility.",
            "Added basic particle functionality that's displayed when a player is healed.",
        ],
        ifNew: false,
    },
    {
        dateTitle: "5-5-21 - Hotfixes",
        additions: ["Small bug fixes for player health. Player's health was not updating correctly and sometimes overshooting their max health."],
        ifNew: false,
    },
    {
        dateTitle: "5-5-21 - User Interface and Healthbars",
        additions: [
            "Huge updates to user interface, and added a few early ability icons. Added a heal animation to the healthbars, and testing with left/right clicks.",
            "Improved the main actor canvas to reduce clipping and improve performance.",
        ],
        ifNew: false,
    },
    {
        dateTitle: "5-3-21 - Rough UI",
        additions: [
            "Added basic user interface with more to come. Adjusted controls to be more responsive, and added options to the main menu.",
            "Finishing touches on doodad collision detection and response forcing.",
        ],
        ifNew: false,
    },
    {
        dateTitle: "4-29-21 - Rock Doodads",
        additions: ["Added basic rock doodads, with more to come as the game progresses.", "Added and improved class icons."],
        ifNew: false,
    },
    {
        dateTitle: "4-27-21 - Game Makeover! New Main Menu",
        additions: [
            "Overhauled the object hierarchy in the code, resulting in faster processing and more potential to the game.",
            "Redid the main menu, with clearer buttons and a more appealing visual style.",
            "New and improved terrain system, featuring hills and realistic-er ground.",
            "Improved graphics and faster rendering for background and players.",
        ],
        ifNew: false,
    },
];
