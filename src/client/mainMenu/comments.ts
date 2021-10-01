import { safeGetElementById } from "../util";

export function initComments(screenCover: HTMLElement) {
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
}
