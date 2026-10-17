# Lift Log: setup

You get three files:

- `index.html`: the app. It works on its own and keeps entries on the phone.
- `apps-script.gs`: optional. It lets the app save to and read from a Google Sheet.
- `SETUP.md`: this guide.

## 1. Put the app online (needed for the iPhone home screen)

Upload `index.html` to any free static web host, for example Netlify Drop or GitHub Pages.
It gives you a normal web address.

## 2. Add it to the iPhone home screen

1. Open the web address in Safari.
2. Tap the Share button.
3. Tap **Add to Home Screen**, then **Add**.

It now opens full screen like an app. Entries are stored on that phone, so each person who adds it keeps their own log.

## 3. Optional: save to a Google Sheet

Do this once per person who wants their own sheet.

1. Create a new Google Sheet (or open the one you want to use).
2. Choose **Extensions > Apps Script**.
3. Delete the code that is there and paste in the contents of `apps-script.gs`.
4. Change `SECRET` near the top to your own private word or phrase. Keep it secret.
5. Choose **Deploy > New deployment**. Select **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Press **Deploy** and allow the permissions Google asks for.
7. Copy the **Web app URL**.
8. In the app, open **Settings** at the bottom. Paste the URL and your secret key, then tap **Save and sync**.

The script creates the Lifts, Body and Setup tabs if they are missing. If you already have a sheet with those tabs, it uses them.

## Good to know

- The secret key is the only thing stopping someone with the web app URL from reading or adding to that sheet. Use a long, private phrase and don't share the URL.
- If you change the script later, choose **Deploy > Manage deployments**, edit the deployment and set a new version. The web app URL stays the same.
- If the phone is offline when you save, the entry stays on the phone and syncs the next time the app can reach the sheet.
- Clearing Safari's website data removes entries stored only on the phone. Entries already synced stay in the sheet.
