Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/FRONT VIEW.png"))

# Crop from x=100 to 650, y=350 to 941
$cropX = 100
$cropY = 350
$cropW = 550
$cropH = 591

$crop = New-Object System.Drawing.Bitmap $cropW, $cropH
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $cropW, $cropH), (New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$crop.Save("scratch/laptop_full.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()
$img.Dispose()
Write-Host "Saved scratch/laptop_full.jpg successfully."
