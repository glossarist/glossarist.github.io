---
title: Installation
description: Download and install Glossarist Desktop for Windows, macOS, and Ubuntu Linux
---

# Installation

<ReleaseDownloader />

Distributions for Windows, macOS and Ubuntu Linux are currently available.

## Windows notes

We recommend using the portable version that does not require installation.

::: warning
Your OS may warn you about installing potentially dangerous software. The reason for that is lacking signature of Windows executables ([#95](https://github.com/glossarist/glossarist-desktop/issues/95)).
:::

## Ubuntu Linux notes

Install the downloaded snap by running the following command in console:

```sh
sudo snap install --dangerous glossarist-desktop-<version>.snap
```

::: info
`--dangerous` flag is required for the time being ([#130](https://github.com/glossarist/glossarist-desktop/issues/130)).
:::

## Next

- [First Launch](/docs/desktop/getting-started/initial-setup)
