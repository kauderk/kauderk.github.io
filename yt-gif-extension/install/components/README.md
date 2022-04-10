# YT GIF Timestamp components

# **Get Started**

- `Shortcuts`
  - `yt-gif icon > YT GIF Timestmap > (bottom row) Shortcut` [toggle ON 🖼️](https://user-images.githubusercontent.com/65237382/162631765-e2a7e60a-5ac9-4251-b38e-e57faf82ae01.png)


- `Smartblocks`
  - Install Smartblocks > https://roamjs.com/extensions/smartblocks
  - `YT GIF smartblocks Installation`
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

# **HOW TO USE**
- yt-gif icon > YT GIF Timestmap > (top left corner, tutorial drop down menu) > 🎥 [Creation video tutorial](https://youtu.be/cXf-PB1Vae4)
- Place your cursor under a `{{[[yt-gif]]}}` block:
  - `Smartblocks`
    - Write `jj` or `xx` followd by `YTGIF start timestamp`
  - `Shortcuts`
    - `"Ctrl or cmd" + Alt + S` > outuputs {{start}} component
    - `"Ctrl or cmd" + Alt + D` > outputs {{end}} component
- ![image](https://user-images.githubusercontent.com/65237382/152702764-708a4644-7b5e-4d9a-b213-21beb611610f.png)
