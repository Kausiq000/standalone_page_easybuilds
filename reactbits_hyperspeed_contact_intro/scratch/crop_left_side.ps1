Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/LEFT SIDE.png"))

# Crop from x=800 to 1400, y=350 to 941
$cropX = 800
$cropY = 350
$cropW = 600
$cropH = 591

$crop = New-Object System.Drawing.Bitmap $cropW, $cropH
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $cropW, $cropH), (New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$crop.Save("scratch/left_side_desk.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()
$img.Dispose()
Write-Host "Saved scratch/left_side_desk.jpg successfully."
