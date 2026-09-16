$ErrorActionPreference = 'Stop'

$requiredFiles = @('index.html', 'styles.css', 'app.js')
foreach ($requiredFile in $requiredFiles) {
    $requiredPath = Join-Path -Path $PSScriptRoot -ChildPath $requiredFile
    if (-not (Test-Path -LiteralPath $requiredPath -PathType Leaf)) {
        throw "Required application file is missing: $requiredFile"
    }
}

$indexPath = Join-Path -Path $PSScriptRoot -ChildPath 'index.html'
Start-Process -FilePath $indexPath

