# YT GIF Timestamp components

- #42SmartBlock YTGIF start timestamp
- #42SmartBlock YTGIF end timestamp

### Installation
- Download the Json Roam file
  - From here > https://raw.githubusercontent.com/kauderk/kauderk.github.io/main/yt-gif-extension/install/components/smartblocks-yt-gif-timestamp-components.json
  - right click > SAVE AS (.json)
- Open Roam, on top right corner, click on *Share, export and more* **· · ·**
- Click on **Import Files**
- Browse to the file on your machine and click **Open**
- You might be warned with *"This page already exists -- Importing to that page will add new text to the bottom of the page"*. That's ok.
- Click **Import 1 Files**

### Once Imported
It should resemble something like this:
![image](https://user-images.githubusercontent.com/65237382/155751711-033b095f-29bf-4711-8a41-0edc4b5bf810.png)

- 
    ``` 
    #SmartBlock YTGIF start timestamp 
    ```
    -   ``` 
        const obj = await window.YTGIF?.getTimestampObj?.("start");
        const select = UI?.timestamps?.tm_workflow_grab?.value;
        return obj?.[select]?.fmt ?? '';
        ```
- 
    ``` 
    #SmartBlock YTGIF end timestamp 
    ```
    -   ``` 
        const obj = await window.YTGIF?.getTimestampObj?.("end");
        const select = UI?.timestamps?.tm_workflow_grab?.value;
        return obj?.[select]?.fmt ?? '';
        ```



---


# **Workflow**
1. Both the `shortcuts` and the `smartblocks` need to be enabled by the user:
  - Simulate Roam Timestamps > shortcuts
  - Simulate Roam Timestamps > smartblocks
2. Both the `shortcuts` and the `smartblocks` will output what you desire if you cast them under a `{{[[yt-gif]: }}` component block.
  - ![image](https://user-images.githubusercontent.com/65237382/152702764-708a4644-7b5e-4d9a-b213-21beb611610f.png)
