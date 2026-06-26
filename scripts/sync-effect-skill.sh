#!/usr/bin/env sh

set -eu

repo_url="${EFFECT_SKILLS_REPO:-https://github.com/Effect-TS/skills.git}"
repo_ref="${EFFECT_SKILLS_REF:-main}"
tmp_dir="${TMPDIR:-/tmp}/effect-ts-skills-sync-$$"

cleanup() {
  rm -rf "$tmp_dir"
}
trap cleanup EXIT INT TERM

git clone --depth 1 --branch "$repo_ref" "$repo_url" "$tmp_dir"

rm -rf "skills/effect-ts"
mkdir -p "skills"
cp -R "$tmp_dir/skills/effect-ts" "skills/effect-ts"

commit="$(git -C "$tmp_dir" rev-parse HEAD)"
updated_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

cat > "skills/effect-ts/UPSTREAM.md" <<EOF
# Upstream

- Repository: https://github.com/Effect-TS/skills
- Skill path: \`skills/effect-ts\`
- Commit: \`$commit\`
- Updated at: \`$updated_at\`

Refresh this vendored skill with:

\`\`\`sh
npm run skills:sync
\`\`\`

Set \`EFFECT_SKILLS_REF\` to sync a branch, tag, or commit other than \`main\`.
EOF
