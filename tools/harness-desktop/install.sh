#!/usr/bin/env bash
# Install the DeepSeek Harness desktop wrapper for the current user.
#
#   ./install.sh              install into $HOME/.local (honours PREFIX)
#   ./install.sh --uninstall  remove the launcher, icon and autostart entry
#
# The wrapper never lands inside the dsh checkout: it goes to PREFIX/bin and the
# launcher entry to the XDG data dir, so a checkout update cannot clobber it.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
[ -n "${PREFIX-}" ] || PREFIX="$HOME/.local"
[ -n "${XDG_DATA_HOME-}" ] || XDG_DATA_HOME="$HOME/.local/share"
[ -n "${XDG_CONFIG_HOME-}" ] || XDG_CONFIG_HOME="$HOME/.config"

BIN="$PREFIX/bin"
DATA="$XDG_DATA_HOME"
ICONS="$DATA/icons/hicolor/scalable/apps"
APPS="$DATA/applications"
AUTOSTART="$XDG_CONFIG_HOME/autostart"
APP_ID="dsh-harness"

refresh_menu() {
  if command -v update-desktop-database >/dev/null; then
    update-desktop-database "$APPS" >/dev/null 2>&1 || true
  fi
}

if [ "$#" -gt 0 ] && [ "$1" = "--uninstall" ]; then
  rm -f "$BIN/$APP_ID" "$ICONS/$APP_ID.svg" "$APPS/$APP_ID.desktop" "$AUTOSTART/$APP_ID.desktop"
  refresh_menu
  echo "removed $APP_ID: binary, icon, launcher entry and autostart entry"
  exit 0
fi

if ! command -v python3 >/dev/null; then
  echo "install.sh: python3 is required (the tray wrapper is a PySide6 script)" >&2
  exit 1
fi

install -d "$BIN" "$ICONS" "$APPS"
install -m 0755 "$HERE/dsh-harness" "$BIN/$APP_ID"
install -m 0644 "$HERE/harness-desktop.svg" "$ICONS/$APP_ID.svg"

cat > "$APPS/$APP_ID.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=DeepSeek Harness
GenericName=Coding agent
Comment=DeepSeek Harness coding agent (local host + Chrome app window)
Exec=$BIN/$APP_ID --app
Icon=$APP_ID
Terminal=false
Categories=Development;
Keywords=dsh;deepseek;harness;agent;ai;
StartupWMClass=dsh-harness
StartupNotify=true
EOF
chmod 0644 "$APPS/$APP_ID.desktop"
refresh_menu

echo "installed:"
echo "  $BIN/$APP_ID"
echo "  $ICONS/$APP_ID.svg"
echo "  $APPS/$APP_ID.desktop"
echo
echo "Launch \"DeepSeek Harness\" from your application menu, or run: $APP_ID --app"
echo "Set DSH_REPO if your dsh checkout is not at \$HOME/workspace/deepseek-harness."
