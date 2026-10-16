# Baut dist\correct_mail_translate-<version>.xpi aus src\ (Windows PowerShell 5.1 / 7)
# Verwendet .NET direkt, weil Compress-Archive unter PowerShell 5.1 Backslashes
# in die ZIP-Pfade schreibt – solche .xpi-Dateien lehnt Thunderbird ab.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$src  = Join-Path $root 'src'
$manifest = Get-Content (Join-Path $src 'manifest.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$dist = Join-Path $root 'dist'
New-Item -ItemType Directory -Force -Path $dist | Out-Null
$out = Join-Path $dist ("correct_mail_translate-{0}.xpi" -f $manifest.version)
if (Test-Path $out) { Remove-Item $out }

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open($out, 'Create')
try {
    Get-ChildItem -Path $src -Recurse -File | ForEach-Object {
        $rel = $_.FullName.Substring($src.Length + 1).Replace('\', '/')
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel, 'Optimal') | Out-Null
    }
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, (Join-Path $root 'LICENSE'), 'LICENSE', 'Optimal') | Out-Null
}
finally {
    $zip.Dispose()
}
Write-Host "Erstellt: $out"
