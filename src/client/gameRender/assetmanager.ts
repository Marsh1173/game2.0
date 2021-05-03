import { DoodadType } from "../../objects/terrain/doodads/doodad";
import { ServerTalker } from "../servertalker";

export type AbilityImageName = "swordBasicAttackIcon" | "nullLevel3" | "nullLevel6" | "nullLevel10";

export type ImageName = DoodadType | AbilityImageName;

//let img: HTMLImageElement = assetManager.images["lavafly"];

export const imageInformation: Record<ImageName, string> = {
    rockLarge: `http://${ServerTalker.hostName}/images/rockDoodad.png`,
    swordBasicAttackIcon: `http://${ServerTalker.hostName}/images/swordIcon.png`,
    nullLevel3: `http://${ServerTalker.hostName}/images/hammerIcon.png`,
    nullLevel6: `http://${ServerTalker.hostName}/images/daggersIcon.png`,
    nullLevel10: `http://${ServerTalker.hostName}/images/emailIcon.png`,
};

class AssetManager {
    public images: Record<ImageName, HTMLImageElement>;
    // public sounds: Record<string, HTMLImageElement>;

    constructor() {
        this.images = {} as Record<ImageName, HTMLImageElement>;
    }

    public async loadAllNecessaryImages() {
        await Promise.all(Object.keys(imageInformation).map((imageName) => this.addImage(imageName as ImageName, imageInformation[imageName as ImageName])));
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
