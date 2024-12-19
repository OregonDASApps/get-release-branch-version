# get-release-branch-version
Gets the version number of a release branch such as release/1.2.3
This action gets the version number of a release branch. It will output the 
- major
- minor
- patch - sets to 0 if not present
- manifest safe version string. 
- version string

The manifest safe version string is the version number with leading zeros. This is useful for the manifest file in a release branch.



This action should only be run on release branches. Here is a suggested usage with a check:

```yaml
name: Get release branch
on: 
  push:
    branches:
      - 'release/**'
  pull_request:
    branches:
      - 'release/**'
  workflow_dispatch:
  create:

jobs:
  get-release:
    name: Get the release branch version number
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1
      - uses: snsinahub-org/get-release-branch-version@v3.0.0
        id: branchVersion
      - name: Dump the version info
        run: | 
          echo "major: $MAJOR minor: $MINOR patch: $PATCH manifestSafeVersionString: $MANIFEST_SAFE_VERSION_STRING versionString: $VERSION_STRING"
          echo "<table>" >> $GITHUB_STEP_SUMMARY
          echo "<tr><th>Key</th><th>Value</th></tr>" >> $GITHUB_STEP_SUMMARY
          echo "<tr><td>Major</td><td>$MAJOR</td></tr>" >> $GITHUB_STEP_SUMMARY
          echo "<tr><td>Minor</td><td>$MINOR</td></tr>" >> $GITHUB_STEP_SUMMARY
          echo "<tr><td>Patch</td><td>$PATCH</td></tr>" >> $GITHUB_STEP_SUMMARY
          echo "<tr><td>Manifest Safe Version String</td><td>$MANIFEST_SAFE_VERSION_STRING</td></tr>" >> $GITHUB_STEP_SUMMARY
          echo "<tr><td>Version String</td><td>$VERSION_STRING</td></tr>" >> $GITHUB_STEP_SUMMARY
          echo "</table>" >> $GITHUB_STEP_SUMMARY
        env:
          MAJOR: ${{ steps.branchVersion.outputs.major }}
          MINOR: ${{ steps.branchVersion.outputs.minor }}
          PATCH: ${{ steps.branchVersion.outputs.patch }}
          MANIFEST_SAFE_VERSION_STRING: ${{ steps.branchVersion.outputs.manifestSafeVersionString }}
          VERSION_STRING: ${{ steps.branchVersion.outputs.versionString }}

```

Obviously replace the **Dump step** with something more useful for your process.

It will output the version number of the release branch:

Ex: Creating a **release/1.2.3** branch would output:

| output                    | value    |
|--------------------------:|---------:|
|                    major  |        1 |
|                    minor  |        2 |
|                    patch  |        3 |
| manifestSafeVersionString | 01.02.03 |
| versionString             |     1.2.3|


## Note

This action is a clone of the [valadas/get-branch-version](https://github.com/valadas/get-release-branch-version) action. This action introduces a new output and is upgraded the node version to 20.

