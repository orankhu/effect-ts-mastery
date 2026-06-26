#!/usr/bin/env sh

set -eu

repo_dir=".repos/effect"
repo_url="https://github.com/Effect-TS/effect-smol"
repo_branch="main"

if [ -d "$repo_dir/.git" ]; then
  if [ -n "$(git -C "$repo_dir" status --porcelain)" ]; then
    echo "$repo_dir has local changes; refusing to update." >&2
    exit 1
  fi

  git -C "$repo_dir" fetch origin "$repo_branch"
  git -C "$repo_dir" checkout "$repo_branch"
  git -C "$repo_dir" pull --ff-only origin "$repo_branch"
  exit 0
fi

mkdir -p ".repos"
git clone --branch "$repo_branch" "$repo_url" "$repo_dir"
