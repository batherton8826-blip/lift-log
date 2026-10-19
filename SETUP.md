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

## 4. Optional: daily steps from the iPhone Health app

A web app can't read Apple Health, so a Shortcut on the iPhone reads the day's steps and sends them to your Google Sheet. The app then shows "Today 5,234 steps" under Target steps. This needs the sheet connection from section 3, using the latest version of `apps-script.gs`.

Set up the Shortcut once. Menu names can differ slightly between iOS versions.

1. Open the **Shortcuts** app, tap **+**, and name it "Send steps".
2. Add **Find Health Samples**. Set the type to **Steps** and add a filter: **Start Date** is **Today**.
3. Add **Calculate Statistics** and choose **Sum**.
4. Add **Get Contents of URL**. Paste the web app URL. Tap the arrow to show more options, then set Method to **POST** and Request Body to **JSON**. Add three fields:
   - Text, `key`: your secret key
   - Text, `action`: `steps`
   - Number, `steps`: the result of Calculate Statistics
5. Tap the Shortcut to run it. Allow access to Health when asked. Reopen the app and the steps appear.

How often it updates:

- The app reads the sheet each time you open it, and again when you come back to it after a minute away. It shows the latest figure the Shortcut sent, with the time it was sent.
- The Shortcut only updates the figure when it runs. The most reliable way is to run it when the phone is in use: add it to the Home Screen (open the Shortcut, tap Share, then **Add to Home Screen**) and tap it whenever you want a fresh figure.
- You can also set an automation (Shortcuts, **Automation**, **+**) that runs it when you open an app such as Health, or at set times of day. iOS locks Health data while the phone is locked, so a run at a set time can fail if the phone hasn't been used. Turn on **Run Immediately** so it doesn't ask first.
- If the steps look too high because an iPhone and an Apple Watch both recorded them, add a Source filter to Find Health Samples so it counts only one of them.

## Good to know

- The secret key is the only thing stopping someone with the web app URL from reading or adding to that sheet. Use a long, private phrase and don't share the URL.
- If you change the script later, choose **Deploy > Manage deployments**, edit the deployment and set a new version. The web app URL stays the same.
- The Progress section in the app draws a line chart from every saved session: pick Body weight or a lift, then Weight, Total reps or Volume (weight times total reps). Drag a finger along the chart, or tap the arrow buttons, to see each session. "Show as table" lists the same figures.
- Celebrations appear at the top of the app, inside the app only (there are no phone notifications). A big banner with confetti shows for: every 5 kg lost since the starting weight; every time a logged weight goes under a new multiple of 10 kg (140, 130, 120 and so on), with a message that Brad is getting her a gift; every 3,500 kcal of running calorie deficit ("about a pound lost"); and a day with calories eaten within the calorie goal. A quieter banner shows for a day with calories eaten under maintenance. On each lift card, a green chip shows when the latest session had the heaviest weight or the most total reps so far.
- The Calorie deficit chart in Progress is a running total of calories under maintenance (the "Calories needed a day" setting). Only days under maintenance add to it; a day over maintenance adds nothing and does not subtract. Enter the day's total calories at the end of the day, because the app celebrates as soon as the figure you enter is under the goal.
- Each phone remembers which celebrations it has shown. When an entry from one phone reaches the other through the sheet, the other phone shows the celebration the next time it is opened. Entries already in the sheet when a phone first connects are not announced.
- The name in the gift message is the `GIFT_FROM` line near the top of the celebrations code in `index.html`.
- Chaz's sheet also has an Overview tab at the front with all-time figures (starting, current, lowest and highest weight, and first against latest session for each lift). It is built with formulas in that sheet, so the script does not create it and a new sheet will not have one.
- The Body tab's fourth column is how you feel, from 1 (Rough) to 5 (Great). Steps are now a daily target in Settings, not something you log.
- If the phone is offline when you save, the entry stays on the phone and syncs the next time the app can reach the sheet.
- Clearing Safari's website data removes entries stored only on the phone. Entries already synced stay in the sheet.
