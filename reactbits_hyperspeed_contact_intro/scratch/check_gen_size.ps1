Add-Type -AssemblyName System.Drawing

$genPath = "C:\Users\Kausiq\.gemini\antigravity-ide\brain\70ef9b1b-1e4e-47c8-bbea-7c8eb325c88b\desk_no_laptop_1793092811654.jpg"
$genImg = [System.Drawing.Bitmap]::FromFile($genPath)
Write-Host "Generated image size: $($genImg.Width)x$($genImg.Height)"

$origCrop = [System.Drawing.Bitmap]::FromFile((Resolve-Path "scratch/laptop_full.jpg"))
Write-Host "Original crop size: $($origCrop.Width)x$($origCrop.Height)"

$genImg.Dispose()
$origCrop.Dispose()
