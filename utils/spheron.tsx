import { upload } from "@spheron/browser-upload";

export async function getUploadToken(name: string) {
    try {
        const { hostname, port, protocol } = window.location;

        const res = await fetch(`api/initiate-upload`);
        const data = await res.json();

        if (!res.ok) {
            console.log(data.error);
        }

        const token = data.uploadToken;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="720"><rect width="100%" height="100%"/><svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" version="1.2" viewBox="-200 -50 1000 1000"><path fill="#FFFFFF" d="M264.5 190.5c0-13.8 11.2-25 25-25H568c13.8 0 25 11.2 25 25v490c0 13.8-11.2 25-25 25H289.5c-13.8 0-25-11.2-25-25z"/><path fill="#FFFFFF" d="M265 624c0-13.8 11.2-25 25-25h543c13.8 0 25 11.2 25 25v56.5c0 13.8-11.2 25-25 25H290c-13.8 0-25-11.2-25-25z"/></svg><text x="30" y="670" style="font: 60px sans-serif;fill:#fff">${name}</text></svg>`;
        const file = new File([svg], `${name}.svg`, { type: "image/svg+xml" });
        if (token) {
            const uploadResult = await upload([file], { token });
            return `${uploadResult.protocolLink}/${name}.svg`;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}