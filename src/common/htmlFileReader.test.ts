import axios, { AxiosResponse } from "axios";
import HtmlFileReader from "./htmlFileReader";
import { AssetService } from "../services/assetService";

describe("Html File Reader", () => {
    it("Resolves promise after successfully reading file", async () => {
        const expectedText = "test file contents";
        const blob = new Blob([expectedText], { type: "text/plain" });
        const file = new File([blob], "test.txt");

        const actualText = await HtmlFileReader.readAsText(file);
        expect(actualText).toEqual(expectedText);
    });

    it("Throws error with null file value", () => {
        expect(() => HtmlFileReader.readAsText(null)).toThrowError();
    });

    it("Loads attributes for HTML 5 video", async () => {
        const expected = {
            width: 1920,
            height: 1080,
            duration: 1000,
        };

        document.createElement = jest.fn(() => {
            const element: any = {
                videoWidth: expected.width,
                videoHeight: expected.height,
                duration: expected.duration,
                onloadedmetadata: jest.fn(),
            };

            setImmediate(() => {
                element.onloadedmetadata();
            });

            return element;
        });

        const videoAsset = AssetService.createAssetFromFilePath("https://server.com/video.mp4");
        const result = await HtmlFileReader.readAssetAttributes(videoAsset);

        expect(result.width).toEqual(expected.width);
        expect(result.height).toEqual(expected.height);
        expect(result.duration).toEqual(expected.duration);
    });

    it("Loads attributes for an image asset", async () => {
        const expected = {
            width: 1920,
            height: 1080,
        };

        document.createElement = jest.fn(() => {
            const element: any = {
                naturalWidth: expected.width,
                naturalHeight: expected.height,
                onload: jest.fn(),
            };

            setImmediate(() => {
                element.onload();
            });

            return element;
        });

        const imageAsset = AssetService.createAssetFromFilePath("https://server.com/image.jpg");
        const result = await HtmlFileReader.readAssetAttributes(imageAsset);

        expect(result.width).toEqual(expected.width);
        expect(result.height).toEqual(expected.height);
    });

    describe("Download asset binaries", () => {
        it("Downloads a blob from the asset path", async () => {
            const asset = AssetService.createAssetFromFilePath("https://server.com/image.jpg");
            axios.get = jest.fn((url, config) => {
                return Promise.resolve<AxiosResponse>({
                    config,
                    headers: null,
                    status: 200,
                    statusText: "OK",
                    data: new Blob(["Some binary data"]),
                });
            });

            const result = await HtmlFileReader.getAssetBlob(asset);
            expect(result).not.toBeNull();
            expect(result).toBeInstanceOf(Blob);
            expect(axios.get).toBeCalledWith(asset.path, { responseType: "blob" });
        });

        it("Rejects the promise when request receives non 200 result", async () => {
            const asset = AssetService.createAssetFromFilePath("https://server.com/image.jpg");
            axios.get = jest.fn((url, config) => {
                return Promise.resolve<AxiosResponse>({
                    config,
                    headers: null,
                    status: 404,
                    statusText: "Not Found",
                    data: null,
                });
            });

            await expect(HtmlFileReader.getAssetBlob(asset)).rejects.not.toBeNull();
            expect(axios.get).toBeCalledWith(asset.path, { responseType: "blob" });
        });
    });
});
