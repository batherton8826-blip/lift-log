# Gym app: setup

The app is at https://batherton8826-blip.github.io/lift-log/gym/

## One-time set-up (done by the person who owns the Google Sheet)

1. Open the **Gym** Google Sheet.
2. Choose **Extensions > Apps Script**, delete what's there and paste in `apps-script.gs`.
3. Put a private phrase between the quotes on the `var SECRET = "";` line.
4. Click **Deploy > New deployment**, choose **Web app**, set **Execute as: Me** and **Who has access: Anyone**, then **Deploy** and allow the permissions.
5. Copy the **Web app URL** (it ends in `/exec`).

## The one-tap set-up link

The link is the app address plus `#c=` and the web app URL and secret, encoded (base64url of `{"u":"<web app URL>","k":"<secret>"}`).
When it's opened, the app connects to the sheet automatically. It only does this on a phone that isn't already connected.
Anyone with the link can read and add to the sheet, so send it privately.

## On the phone

1. Open the set-up link in **Safari**.
2. Tap **Share**, then **Add to Home Screen**, then **Add**.
3. Open the **Gym** icon. The status line should say "Synced at ...".

## Good to know

- Entries save on the phone first and sync to the sheet when there's signal.
- The sheet gets four tabs: Log, Body, Plan and Setup. The phone's plan is the one that counts; edit it in the app.
- Removing an exercise keeps its history in Progress and in the Log tab.
- If the script changes, use **Deploy > Manage deployments**, edit, choose **New version** and Deploy. The URL stays the same.
