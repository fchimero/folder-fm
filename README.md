# About
FolderFM is a album-first, local audio player. Just albums, no track listings, no search. All you need is a grid of covers.

# About the code
FolderFM built as a progressive web app, so you can install it locally. It was vibe coded with Claude, and it comes with no support, waranty, or guarantees. But maybe you'll like it!

# To get running
* Pull the repo
* Get a local server running in that directory with something like `python -m http.server 8000`
* Open localhost in a Chromium-based browser and you should see an “Install App" button.
* In the app, pick a directory to scan to act as your library.
* LISTEN TO YOUR MUSIC.

# Known Bugs
* Yes, I know albums with multiple artists on tracks will split into separate items on the grid.
* Yes, I know it rescans the directory on every launch.
* Yes, I know the empty state for the player when no directory is specified could be better.
