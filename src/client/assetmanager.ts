import { ServerTalker } from "./servertalker";

export type abilityImageName = "chainsIcon" | "fireballIcon" | "meteorStrikeIcon" | "hammerIcon" |
                    "iceIcon" | "shieldslamIcon" | "shurikenIcon" | "staffIcon" | "stealthIcon" | "poisonedSwordIcon" | 
                    "axeIcon" | "bowIcon" | "fistIcon" | "blizzardIcon" | "healingAuraIcon" | "chargeIcon";

export type ImageName = "wizard-hat" | abilityImageName |
                    "fire" | "ice" | "shuriken" | "meteorstrike" | "arrow";
                    
const imageInformation: Record<ImageName, string> = {
    "wizard-hat": `http://${ServerTalker.hostName}/images/wizard-hat.png`,

    /*"axeBasic": `http://${ServerTalker.hostName}/images/weapons/axeBasic.png`,
    "axeHeavy": `http://${ServerTalker.hostName}/images/weapons/axeHeavy.png`,
    "axeSharp": `http://${ServerTalker.hostName}/images/weapons/axeSharp.png`,
    "axeSmall": `http://${ServerTalker.hostName}/images/weapons/axeSmall.png`,
    "bowBasic": `http://${ServerTalker.hostName}/images/weapons/bowBasic.png`,
    "bowCross": `http://${ServerTalker.hostName}/images/weapons/bowCross.png`,
    "bowFrost": `http://${ServerTalker.hostName}/images/weapons/bowFrost.png`,
    "bowLong": `http://${ServerTalker.hostName}/images/weapons/bowLong.png`,
    "daggerBasic": `http://${ServerTalker.hostName}/images/weapons/daggerBasic.png`,
    "daggerFire": `http://${ServerTalker.hostName}/images/weapons/daggerFire.png`,
    "daggerHeavy": `http://${ServerTalker.hostName}/images/weapons/daggerHeavy.png`,
    "daggerShaman": `http://${ServerTalker.hostName}/images/weapons/daggerShaman.png`,
    "daggerSharp": `http://${ServerTalker.hostName}/images/weapons/daggerSharp.png`,
    "fistWeaponBasic": `http://${ServerTalker.hostName}/images/weapons/fistWeaponBasic.png`,
    "fistWeaponHeavy": `http://${ServerTalker.hostName}/images/weapons/fistWeaponHeavy.png`,
    "fistWeaponSharp": `http://${ServerTalker.hostName}/images/weapons/fistWeaponSharp.png`,
    "hammerBasic": `http://${ServerTalker.hostName}/images/weapons/hammerBasic.png`,
    "hammerHeavy": `http://${ServerTalker.hostName}/images/weapons/hammerHeavy.png`,
    "hammerTemplar": `http://${ServerTalker.hostName}/images/weapons/hammerTemplar.png`,
    "mace": `http://${ServerTalker.hostName}/images/weapons/mace.png`,
    "spearBasic": `http://${ServerTalker.hostName}/images/weapons/spearBasic.png`,
    "spearFire": `http://${ServerTalker.hostName}/images/weapons/spearFire.png`,
    "staffArcane": `http://${ServerTalker.hostName}/images/weapons/staffArcane.png`,
    "staffBasic": `http://${ServerTalker.hostName}/images/weapons/staffBasic.png`,
    "staffFire": `http://${ServerTalker.hostName}/images/weapons/staffFire.png`,
    "staffHoly": `http://${ServerTalker.hostName}/images/weapons/staffHoly.png`,
    "staffIce": `http://${ServerTalker.hostName}/images/weapons/staffIce.png`,
    "staffNature": `http://${ServerTalker.hostName}/images/weapons/staffNature.png`,
    "staffPurple": `http://${ServerTalker.hostName}/images/weapons/staffPurple.png`,
    "staffShaman": `http://${ServerTalker.hostName}/images/weapons/staffShaman.png`,
    "swordBasic": `http://${ServerTalker.hostName}/images/weapons/swordBasic.png`,
    "swordDragon": `http://${ServerTalker.hostName}/images/weapons/swordDragon.png`,
    "swordSharp": `http://${ServerTalker.hostName}/images/weapons/swordSharp.png`,
    "swordSmall": `http://${ServerTalker.hostName}/images/weapons/swordSmall.png`,*/

    "fire": `http://${ServerTalker.hostName}/images/projectiles/fire.png`,
    "ice": `http://${ServerTalker.hostName}/images/projectiles/ice.png`,
    "shuriken": `http://${ServerTalker.hostName}/images/projectiles/shuriken.png`,
    "arrow": `http://${ServerTalker.hostName}/images/projectiles/arrowBasic.png`,

    "meteorstrike": `http://${ServerTalker.hostName}/images/targetedProjectiles/firestrike.png`,

    "chainsIcon": `http://${ServerTalker.hostName}/images/abilities/chainsIcon.png`,
    "fireballIcon": `http://${ServerTalker.hostName}/images/abilities/fireballIcon.png`,
    "meteorStrikeIcon": `http://${ServerTalker.hostName}/images/abilities/meteorStrikeIcon.png`,
    "hammerIcon": `http://${ServerTalker.hostName}/images/abilities/hammerIcon.png`,
    "iceIcon": `http://${ServerTalker.hostName}/images/abilities/iceIcon.png`,
    "shieldslamIcon": `http://${ServerTalker.hostName}/images/abilities/shieldslamIcon.png`,
    "shurikenIcon": `http://${ServerTalker.hostName}/images/abilities/shurikenIcon.png`,
    "staffIcon": `http://${ServerTalker.hostName}/images/abilities/staffIcon.png`,
    "stealthIcon": `http://${ServerTalker.hostName}/images/abilities/stealthIcon.png`,
    "poisonedSwordIcon": `http://${ServerTalker.hostName}/images/abilities/poisonedSwordIcon.png`,
    "bowIcon": `http://${ServerTalker.hostName}/images/abilities/bowIcon.png`,
    "axeIcon": `http://${ServerTalker.hostName}/images/abilities/axeIcon.png`,
    "fistIcon": `http://${ServerTalker.hostName}/images/abilities/fistIcon.png`,
    "blizzardIcon": `http://${ServerTalker.hostName}/images/abilities/blizzardIcon.png`,
    "healingAuraIcon": `http://${ServerTalker.hostName}/images/abilities/healingAuraIcon.png`,
    "chargeIcon": `http://${ServerTalker.hostName}/images/abilities/chargeIcon.png`,
};

class AssetManager {
    public images: Record<ImageName, HTMLImageElement>;
    // public sounds: Record<string, HTMLImageElement>;

    constructor() {
        this.images = {} as Record<ImageName, HTMLImageElement>;
        Object.keys(imageInformation).forEach((imageName) => {
            this.addImage(imageName as ImageName, imageInformation[imageName as ImageName]);
        });
    }
    public async addImage(name: ImageName, source: string) {
        return new Promise<void>((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", source, true);
            xhr.responseType = "blob";
            xhr.onload = () => {
                if (xhr.status === 200) {
                    let asset = new Image();
                    asset.onload = () => {
                        window.URL.revokeObjectURL(asset.src);
                    };
                    asset.src = window.URL.createObjectURL(xhr.response);
                    this.images[name] = asset;
                    resolve();
                } else {
                    reject(`Asset ${name} rejected with error code ${xhr.status}`);
                }
            };
            xhr.onerror = (error) => {
                reject(error);
            };
            xhr.send();
        });
    }
}

export const assetManager = new AssetManager();
