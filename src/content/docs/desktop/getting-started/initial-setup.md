---
title: First Launch
description: Configure Glossarist Desktop with your concept data repository during first launch
---

# First Launch

During first launch, you configure Glossarist Desktop with your concept data repository.

Make sure you have an online internet connection before proceeding.

## Initial settings

On first launch, Glossarist will ask you to specify some necessary settings. After you fill all of them in, press "Save All" button below.

![The initial settings window](/images/desktop/initial-settings-window.png)

- **Repository URL:** this should be provided by registry manager who [set up the infrastructure](/docs/adopt/2-infrastructure/) for you.

::: info
Make sure that the URL is in the correct format. It should start with "https://".
:::

- **Git username:** this is the username of your Git account.
  - This would be the username you chose when creating your GitHub account.

- **Git author name:** specify your name. This is important, as it will show on edits you make.

- **Git author email:** specify your relevant work email. This is even more important, as it identifies your edits and change requests as yours.

After you save the settings, the initial settings window will close.

## Password

Before the app can access register data, it will ask for your password. Specify your Git password.

::: info GitHub note
Normally you would provide your GitHub password. If you have enabled **second-factor authentication** on GitHub, you will need to provide your Personal Access Token instead of your password. [Learn how to create this token.](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) When creating the token, enable _public_repo_ scope ("Access public repositories").
:::

The password will be stored using mechanism provided by your OS (e.g., Keychain on macOS) and not sent anywhere except Git server.

::: warning
On Ubuntu Linux, the app will ask for password on every launch. This is a known issue ([#129](https://github.com/glossarist/glossarist-desktop/issues/129)).
:::

## Initial synchronization

Once you have provided settings and password, the app will start downloading register data. This may take a minute. After this completes, the "Ready" message should appear. You can dismiss it.

![The ready screen](/images/desktop/ready-screen.png)

## Next

- [Read about the different modules](/docs/desktop/ui/modules/)
- [Learn how to make a change](/docs/desktop/tutorials/create-change-request)
