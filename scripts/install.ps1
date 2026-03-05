#Requires -RunAsAdministrator
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$skillsDir = Join-Path (Split-Path -Parent $scriptDir) "skills"
$targetDir = Join-Path $env:USERPROFILE ".claude\skills"

Write-Host "=== Zamba Skills Installer ===" -ForegroundColor Cyan
Write-Host "Source: $skillsDir"
Write-Host "Target: $targetDir"

# Create target directory if needed
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

# Symlink each skill
Get-ChildItem -Path $skillsDir -Directory | ForEach-Object {
    $skillName = $_.Name
    $target = Join-Path $targetDir $skillName

    if (Test-Path $target) {
        if ((Get-Item $target).Attributes -band [IO.FileAttributes]::ReparsePoint) {
            Write-Host "  ↻ $skillName (updating symlink)" -ForegroundColor Yellow
            Remove-Item $target -Force
        } else {
            Write-Host "  ⚠ $skillName (directory exists, skipping)" -ForegroundColor Red
            return
        }
    } else {
        Write-Host "  + $skillName" -ForegroundColor Green
    }

    New-Item -ItemType SymbolicLink -Path $target -Target $_.FullName | Out-Null
}

$count = (Get-ChildItem -Path $targetDir -Directory).Count
Write-Host ""
Write-Host "✓ Done. $count skills linked." -ForegroundColor Green
Write-Host "  Restart Claude Code to pick up changes."
