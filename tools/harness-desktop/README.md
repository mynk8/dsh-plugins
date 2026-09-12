# harness-desktop

A small desktop wrapper for a local [DeepSeek Harness](https://github.com/deepseek-harness)
checkout. It owns the lifecycle of `dsh web` and hands the window to Chrome.

It is deliberately **not** a bundled runtime. An Electron/Tauri shell would add
150–180 MB (Electron) or route rendering through WebKitGTK (Tauri/Wails), which is
where GPU acceleration breaks on NVIDIA + Wayland — the exact combination this was
built on. Instead the window is a Chrome app window, so it renders on Chromium's GPU
stack, and the only thing this project adds is lifecycle management.

## What you get

- A **tray icon** that supervises the host: start on demand, restart, view the log,
  stop on quit. Green dot when the host answers, pink when it does not.
- **Start at login** as a toggle in the tray menu (writes an XDG autostart entry).
- A **launcher entry** in your application menu that starts the host if needed, opens
  the app window, and makes sure a tray is running.
- If you have installed the harness as a **Chrome PWA**, the wrapper launches that
  instead of a plain app window (`gtk-launch` on the installed PWA entry).

## Requirements

| | |
| --- | --- |
| Host | Linux with a system tray (built and verified on KDE Plasma, Wayland) |
| Python | 3.10+ with **PySide6** and QtWebEngine-free basics: only `QtSvg`, `QtWidgets`, `QtGui`, `QtCore` are used |
| Browser | `google-chrome-stable` (or set `DSH_BROWSER`); falls back to `xdg-open` |
| Checkout | A dsh checkout with `apps/cli/src/bin.ts`, plus `node` on PATH |

## Install

```bash
./install.sh
DSH_REPO=~/src/deepseek-harness dsh-harness --status
```

`PREFIX` overrides the install root (default `~/.local`). `./install.sh --uninstall`
removes the binary, icon, launcher entry and autostart entry.

## Usage

```bash
dsh-harness              # run the tray (starts the host if it is down)
dsh-harness --app        # ensure host, open the window, ensure a tray
dsh-harness --status     # print host state
dsh-harness --start | --stop | --restart
```

| Variable | Default | Meaning |
| --- | --- | --- |
| `DSH_REPO` | `~/workspace/deepseek-harness` | the dsh checkout to run |
| `DSH_WEB_PORT` | `3080` | port the host serves and the window opens |
| `DSH_BROWSER` | `google-chrome-stable` | browser used for the app window |
| `DSH_NODE` | first `node` on PATH | node binary |
| `DSH_ICON` | the checkout's `favicon.svg` | tray/launcher icon (bundled fallback shipped) |

## Two rules worth knowing

- **The tray only stops a host it started.** A host launched from your own terminal is
  left alone, and the menu says so, because the wrapper cannot know what else depends
  on it.
- **The window survives the launcher.** The host and browser are started in their own
  sessions, so quitting the tray does not close the window, and closing the window does
  not stop the host. "Quit and stop host" stops a tray-owned host.

## Licence

MIT.
