Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path "public/assets/FRONT VIEW.png"))

# Crop bounds covering the entire laptop with comfortable margin on all sides:
# Left: x=60 (comfortably left of laptop screen left edge at x=85)
# Right: x=720 (comfortably right of laptop base right edge at x=435, including mug and notepad)
# Top: y=340 (comfortably above laptop screen top edge at x=460)
# Bottom: y=940 (to bottom of desk)
$cropX = 60
$cropY = 340
$cropW = 660
$cropH = 600

$crop = New-Object System.Drawing.Bitmap $cropW, $cropH
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $cropW, $cropH), (New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$crop.Save("scratch/laptop_full_bounds.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()
$img.Dispose()
Write-Host "Saved scratch/laptop_full_bounds.jpg successfully."
